import io
import re
import zipfile
from fastapi import FastAPI, Request, UploadFile, File
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from pymongo.errors import PyMongoError
import json
import mongo_queries
import co2_api
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/stats/co2/{userid}")
async def aggregate_by_activity_type(userid: str) -> JSONResponse:
    try:
        distances_by_activity_type = mongo_queries.get_cached_plain_stats(userid)
        if len(distances_by_activity_type) == 0:
            return JSONResponse(status_code=204, content=None)

        estimations = {}

        if "IN_PASSENGER_VEHICLE" in distances_by_activity_type:
            car = distances_by_activity_type["IN_PASSENGER_VEHICLE"]

            if "IN_VEHICLE" in distances_by_activity_type:
                car = car + distances_by_activity_type["IN_VEHICLE"]

            total = co2_api.estimate_car_emissions(car)

            if "MOTORCYCLING" in distances_by_activity_type:
                total = mongo_queries.merge_co2_documents(total, co2_api.estimate_motorcycle_emissions(distances_by_activity_type["MOTORCYCLING"]))

            estimations["car"] = total

        if "IN_TRAIN" in distances_by_activity_type:
            total = distances_by_activity_type["IN_TRAIN"]
            total = total + distances_by_activity_type["IN_SUBWAY"]
            total = total + distances_by_activity_type["IN_TRAM"]

            estimations["train"] = co2_api.estimate_train_emissions(total)

        if "IN_FERRY" in distances_by_activity_type:
            estimations["ferry"] = co2_api.estimate_ferry_emissions(distances_by_activity_type["IN_FERRY"])

        if "FLYING" in distances_by_activity_type:
            estimations["plane"] = co2_api.estimate_plane_emissions(distances_by_activity_type["FLYING"])

        if "FLYING" in distances_by_activity_type:
            estimations["plane"] = co2_api.estimate_plane_emissions(distances_by_activity_type["FLYING"])

        if "WALKING" in distances_by_activity_type:
            estimations["foot"] = 0

        if "ON_BICYCLE" in distances_by_activity_type:
            estimations["bike"] = 0

        if "IN_BUS" in distances_by_activity_type:
            estimations["bike"] = 0

        return JSONResponse(content=estimations)
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


@app.get("/")
async def root():
    return {"message": "Hello, World!"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
