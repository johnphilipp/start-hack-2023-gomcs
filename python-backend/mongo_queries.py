import json

from cachetools import cached, TTLCache
from pymongo import MongoClient
from typing import Dict

from main import ActivitySegment
from main import Timeline

mongo_client = MongoClient("mongodb://root:8nP7s0a@localhost:27017/")
mongo_db = mongo_client["gomcs"]


@cached(cache=TTLCache(maxsize=400096, ttl=600))
def get_cached_plain_stats(user_id: str, start_time=None, end_time=None):
    aggregation_pipeline = [
        {
            "$group": {
                "_id": "$activity_type",
                "totalDistance": {"$sum": "$distance"}
            }
        }
    ]

    if start_time and end_time is not None:
        aggregation_pipeline[0]["$match"] = {"startTime": {"$gte": start_time, "$lte": end_time}}

    mongo_stats_collection = mongo_db[user_id]
    print(aggregation_pipeline)
    results = mongo_stats_collection.aggregate(aggregation_pipeline)

    print(results)
    distances_by_activity_type: Dict[str, int] = {}
    for doc in results:
        print(doc)
        activity_type = doc["_id"]
        total_distance = doc["totalDistance"]
        distances_by_activity_type[activity_type] = total_distance

    return distances_by_activity_type


def get_drives_below_threshold(user_id: str, threshold: int):
    mongo_timeline_collection = mongo_db[user_id]

    results = mongo_timeline_collection.find({"activity_type": "IN_PASSENGER_VEHICLE", "distance": {"$lt": threshold}})

    drives_below_threshold = []
    for doc in results:
        activity_type = doc["activity_type"]
        distance = doc["distance"]
        confidence = doc["confidence"]
        start_time = doc["start_time"]
        end_time = doc["end_time"]
        activity_segment = ActivitySegment(activity_type, distance, confidence, start_time, end_time)
        drives_below_threshold.append(activity_segment.__dict__)

    return drives_below_threshold

def get_distance_by_month(user_id: str):
    mongo_timeline_collection = mongo_db[user_id]
    # convert start_time to datetime object, then extract month, then group by month and activity_type and sum distance
    aggregation_pipeline = [
        { "$project": { 
            "month": { "$month": { "$toDate": "$start_time" }},
            "distance": "$distance",
            "activity_type": "$activity_type"
        }},
        { "$group": { 
            "_id": { "month": "$month", "activity_type": "$activity_type" },
            "totalDistance": { "$sum": "$distance" }
        }}
    ]

    results = mongo_timeline_collection.aggregate(aggregation_pipeline)
    
    trends_by_month = []
    for doc in results:
        # create dict
        month = doc["_id"]["month"]
        activity_type = doc["_id"]["activity_type"]
        total_distance = doc["totalDistance"]
        trends_by_month.append({"month": month, "activity_type": activity_type, "totalDistance": total_distance})
    return trends_by_month

def get_distance_by_year(user_id: str):
    mongo_timeline_collection = mongo_db[user_id]
    # convert start_time to datetime object, then extract year, then group by year and activity_type and sum distance
    aggregation_pipeline = [
        { "$project": { 
            "year": { "$year": { "$toDate": "$start_time" }},
            "distance": "$distance",
            "activity_type": "$activity_type"
        }},
        { "$group": { 
            "_id": { "year": "$year", "activity_type": "$activity_type" },
            "totalDistance": { "$sum": "$distance" }
        }}
    ]

    results = mongo_timeline_collection.aggregate(aggregation_pipeline)
    
    trends_by_year = {}
    for doc in results:

        print(doc)
        year = doc["_id"]["year"]
        if year not in trends_by_year:
            trends_by_year[year] = {}
            activities = []
        else:
            activities = trends_by_year[year]

        entry = {"distance": doc["totalDistance"], "co2": 20}

        trends_by_year[year][doc["_id"]["activity_type"]] = entry

    return trends_by_year

def get_distance_by_weekday(user_id: str):
    mongo_timeline_collection = mongo_db[user_id]
    # convert start_time to datetime object, then extract weekday, then group by weekday and activity_type and sum distance
    aggregation_pipeline = [
        { "$project": { 
            "weekday": { "$dayOfWeek": { "$toDate": "$start_time" }},
            "distance": "$distance",
            "activity_type": "$activity_type"
        }},
        { "$group": { 
            "_id": { "weekday": "$weekday", "activity_type": "$activity_type" },
            "totalDistance": { "$sum": "$distance" }
        }}
    ]

    results = mongo_timeline_collection.aggregate(aggregation_pipeline)
    
    trends_by_weekday = []
    for doc in results:
        # create dict
        weekday = doc["_id"]["weekday"]
        activity_type = doc["_id"]["activity_type"]
        total_distance = doc["totalDistance"]
        trends_by_weekday.append({"weekday": weekday, "activity_type": activity_type, "totalDistance": total_distance})
    return trends_by_weekday


def get_cached_data(user_id: str):
    mongo_timeline_collection = mongo_db[user_id]

    timeline = []
    for doc in mongo_timeline_collection.find():
        activity_type = doc["activity_type"]
        distance = doc["distance"]
        confidence = doc["confidence"]
        start_time = doc["start_time"]
        end_time = doc["end_time"]
        activity_segment = ActivitySegment(activity_type, distance, confidence, start_time, end_time)
        timeline.append(activity_segment.__dict__)

    return timeline

def store_data(user_id: str, json_data):
    timeline = Timeline(user_id)
    mongo_timeline_collection = mongo_db[user_id]

    # loop through timeline objects, identify activitySegment and add to timeline
    timeline_json = json.loads(json_data)
    try:
        timeline_objects = timeline_json["timelineObjects"]
        for timeline_object in timeline_objects:
            # check if current object is an activitySegment
            try:
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
            except KeyError:
                pass
    except KeyError:
        pass


def delete_data(user_id: str):
    mongo_timeline_collection = mongo_db[user_id]
    mongo_timeline_collection.drop()



