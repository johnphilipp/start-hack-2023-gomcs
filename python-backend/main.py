import io
import re
import zipfile

import time

import requests
from cachetools import cached, TTLCache
from fastapi import FastAPI, Request, UploadFile, File
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from pymongo.errors import PyMongoError
import json
import mongo_queries
import co2_api
from fastapi.middleware.cors import CORSMiddleware
import openai

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mongo_client = MongoClient("mongodb://root:8nP7s0a@localhost:27017/")
mongo_db = mongo_client["gomcs"]


class ActivitySegment:
    def __init__(self, activity_type: str, distance: int, confidence: str, start_time: str, end_time: str):
        self.activity_type = activity_type
        self.distance = distance
        self.confidence = confidence
        self.start_time = start_time
        self.end_time = end_time


class Timeline:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.activity_segments = []

    def add_activity_segment(self, activity_segment: ActivitySegment):
        self.activity_segments.append(activity_segment)


@app.get("/stats/{userid}")
async def aggregate_by_activity_type(userid: str, start_time=None, end_time=None) -> JSONResponse:
    try:
        distances_by_activity_type = mongo_queries.get_cached_plain_stats(userid, start_time, end_time)
        print(distances_by_activity_type)
        if len(distances_by_activity_type) == 0:
            return JSONResponse(status_code=204, content=None)

        return JSONResponse(content=distances_by_activity_type)
    except PyMongoError:
        return JSONResponse(status_code=500, content=None)


@cached(cache=TTLCache(maxsize=18096, ttl=600))
def get_activities(userid: str):
    distances_by_activity_type = mongo_queries.get_distance_by_year(userid)

    for year in distances_by_activity_type:
        current_year = distances_by_activity_type[year]
        if "IN_PASSENGER_VEHICLE" in current_year:
            car = current_year["IN_PASSENGER_VEHICLE"]["distance"]

            if "IN_VEHICLE" in current_year:
                car = car + current_year["IN_VEHICLE"]["distance"]

            total = co2_api.estimate_car_emissions(car)

            if "MOTORCYCLING" in current_year:
                total = total + co2_api.estimate_motorcycle_emissions(current_year["MOTORCYCLING"]["distance"])

            current_year["IN_PASSENGER_VEHICLE"]["co2"] = total

        if "IN_TRAIN" in current_year:
            total = current_year["IN_TRAIN"]["distance"]
            if "IN_SUBWAY" in current_year:
                total = total + current_year["IN_SUBWAY"]["distance"]
            if "IN_TRAM" in current_year:
                total = total + current_year["IN_TRAM"]["distance"]

            current_year["IN_TRAIN"]["co2"] = co2_api.estimate_train_emissions(total)

        if "IN_FERRY" in current_year:
            current_year["IN_FERRY"]["co2"] = co2_api.estimate_ferry_emissions(
                current_year["IN_FERRY"]["distance"])

        if "FLYING" in current_year:
            current_year["FLYING"]["co2"] = co2_api.estimate_plane_emissions(current_year["FLYING"]["distance"])

        if "WALKING" in current_year:
            current_year["WALKING"]["co2"] = 0

        if "ON_BICYCLE" in current_year:
            current_year["ON_BICYCLE"]["co2"] = 0

        if "IN_BUS" in current_year:
            current_year["IN_BUS"]["co2"] = 0

        used_fields = ["IN_PASSENGER_VEHICLE", "IN_TRAIN", "IN_FERRY", "FLYING", "WALKING", "ON_BICYCLE", "IN_BUS"]
        for i in current_year.copy():
            if i not in used_fields:
                del current_year[i]
        distances_by_activity_type[year] = current_year
    timer = time.time()
    result = []
    for year, activities in distances_by_activity_type.items():
        year_doc = {"year": year}

        activity_list = []
        for activity_type, values in activities.items():
            item = {
                "activity_type": activity_type,
                "distance": values["distance"],
                "co2": values["co2"]
            }
            activity_list.append(item)
        year_doc["activities"] = activity_list
        result.append(year_doc)
    print(time.time() - timer)

    return result


@app.get("/stats/all/{userid}")
async def aggregate_by_activity_type(userid: str) -> JSONResponse:
    try:
        res = get_activities(userid)
        if len(res) == 0:
            return JSONResponse(status_code=204, content=None)
        return JSONResponse(content=res)
    except PyMongoError:
        return JSONResponse(status_code=500, content=None)


@app.get("/stats/byMonth/{userid}")
async def aggregate_by_activity_type(userid: str) -> JSONResponse:
    result = mongo_queries.get_distance_by_month(userid)

    return JSONResponse(content=result)


@app.get("/stats/byYear/{userid}")
async def aggregate_by_activity_type(userid: str) -> JSONResponse:
    result = mongo_queries.get_distance_by_year(userid)
    return JSONResponse(content=result)


@app.delete("/{userid}")
async def delete_all_data(userid: str) -> JSONResponse:
    mongo_queries.delete_data(userid)
    return JSONResponse(content={"message": "Data deleted"})


@app.get("/stats/byWeekDay/{userid}")
async def aggregate_by_activity_type(userid: str) -> JSONResponse:
    result = mongo_queries.get_distance_by_weekday(userid)

    return JSONResponse(content=result)


@app.get("/loadTimeline/{user_id}")
async def get_timeline(user_id: str) -> JSONResponse:
    timeline = mongo_queries.get_cached_data(user_id)

    if not timeline:
        return JSONResponse(status_code=204, content=None)

    return JSONResponse(content=timeline)


@app.get("/short_drives/{user_id}")
async def get_short_drives(user_id: str) -> JSONResponse:
    short_drives = mongo_queries.get_drives_below_threshold(user_id, 10000)

    if not short_drives:
        return JSONResponse(status_code=204, content=None)

    return JSONResponse(content=short_drives)


@app.post("/upload_zip/{user_id}")
async def upload_zipfile(user_id: str, file: UploadFile = File(...)):
    # Read the uploaded file into memory
    content = await file.read()

    mongo_queries.delete_data(user_id)
    # Unpack the ZIP file into memory
    with zipfile.ZipFile(io.BytesIO(content)) as zip:
        # Iterate over all files in the archive
        for filename in zip.namelist():
            # Check if the file is a JSON file matching the pattern
            print(filename)
            # filename should start end with .json
            if filename.endswith(".json"):
                # Extract the JSON file from the archive and read its contents
                with zip.open(filename) as json_file:
                    json_str = json_file.read().decode("utf-8")
                    # Print the contents of the JSON file
                    print(json_str[:100])
                    mongo_queries.store_data(user_id, json_str)

    return {"message": "ZIP file uploaded and unpacked successfully."}


@app.post("/uploadJsonTimeline")
async def add_timeline(request: Request) -> JSONResponse:
    try:
        json_data = await request.json()
        user_id = json_data["userId"]
        timeline_json = json_data["timeline"]

        mongo_queries.store_data(user_id, timeline_json)

        return JSONResponse(status_code=201, content="Timeline added successfully!")
    except ValueError:
        return JSONResponse(status_code=400, content="Invalid JSON format!")
    except PyMongoError:
        return JSONResponse(status_code=500, content="Failed to add timeline!")


@app.get("/gpt/{userid}")
async def query_the_oracle(userid: str) -> JSONResponse:
    result = get_activities(userid)

    gpt_query = "I will provide you now with my distace travelled for each transportation type for each year and " \
                "provide the co2 emissions for each transportation type:"

    for i in result:
        gpt_query += f"Year: {i['year']} \n"
        for j in i['activities']:
            gpt_query += f" transportation: {j['activity_type']} distance: {j['distance']} emission {j['co2']} kg co2 \n"

    gpt_query += "Give me feedback for my carbon footprint over the provided time and how i can improve it."

    openai.api_key = "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"
    openai.organization = "org-L3fQsKkOZ6wNTOogCpUpvrNZ"
    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer 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'
    }

    # Set the request data as a JSON object
    data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": gpt_query}],
    }

    # Send a POST request to the API endpoint
    response = requests.post(url, headers=headers, data=json.dumps(data))
    response_data = response.json()
    print(response_data)

    return response_data['choices'][0]['message']['content']


@app.get("/")
async def root():
    return {"message": "Hello, World!"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
