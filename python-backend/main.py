from typing import Dict
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pymongo import MongoClient, ReturnDocument
from pymongo.collection import Collection
from pymongo.errors import PyMongoError
import json

app = FastAPI()
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
async def aggregate_by_activity_type(userid: str) -> JSONResponse:
    try:
        aggregation_pipeline = [
            {"$group": {"_id": "$activityType", "totalDistance": {"$sum": "$distance"}}}
        ]
        mongo_stats_collection = mongo_db[userid]

        results = mongo_stats_collection.aggregate(aggregation_pipeline)

        print(results)

        distances_by_activity_type: Dict[str, int] = {}
        for doc in results:
            print(doc)
            activity_type = doc["_id"]
            total_distance = doc["totalDistance"]
            distances_by_activity_type[activity_type] = total_distance

        return JSONResponse(content=distances_by_activity_type)
    except PyMongoError:
        return JSONResponse(status_code=500, content=None)


@app.post("/uploadJsonTimeline")
async def add_timeline(request: Request) -> JSONResponse:
    try:
        json_data = await request.json()
        user_id = json_data["userId"]
        timeline_json = json_data["timeline"]

        timeline = Timeline(user_id)

        mongo_timeline_collection = mongo_db[user_id]

        # loop through timeline objects, identify activitySegment and add to timeline
        timeline_json = json.loads(timeline_json)
        timeline_objects = timeline_json["timelineObjects"]
        for timeline_object in timeline_objects:
            # check if current object is an activitySegment
            if "activitySegment" in timeline_object:
                # get activitySegment object
                activity_segment = timeline_object["activitySegment"]
                # get activity type
                activity_type = activity_segment["activityType"]
                # get distance
                distance = activity_segment["distance"]
                # get confidence
                confidence = activity_segment["confidence"]
                # get start time
                duration = activity_segment["duration"]
                start_time = duration["startTimestamp"]
                # get end time
                end_time = duration["endTimestamp"]
                # create activitySegment object
                activity_segment_object = ActivitySegment(activity_type, distance, confidence, start_time, end_time)
                # add activity segment to timeline
                timeline.add_activity_segment(activity_segment_object)

                mongo_timeline_collection.insert_one(activity_segment_object.__dict__)

        return JSONResponse(status_code=201, content="Timeline added successfully!")
    except ValueError:
        return JSONResponse(status_code=400, content="Invalid JSON format!")
    except PyMongoError:
        return JSONResponse(status_code=500, content="Failed to add timeline!")


@app.get("/loadTimeline/{user_id}")
async def get_timeline(user_id: str) -> JSONResponse:
    mongo_timeline_collection = mongo_db[user_id]

    timeline = []
    for doc in mongo_timeline_collection.find():
        activity_type = doc["activityType"]
        distance = doc["distance"]
        confidence = doc["confidence"]
        start_time = doc["startTime"]
        end_time = doc["endTime"]
        activity_segment = ActivitySegment(activity_type, distance, confidence, start_time, end_time)
        timeline.append(activity_segment.__dict__)

    if not timeline:
        return JSONResponse(status_code=204, content=None)

    return JSONResponse(content=timeline)



@app.get("/")
async def root():
    return {"message": "Hello, World!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
