from cachetools import cached, TTLCache
from pymongo import MongoClient
from typing import Dict

from main import ActivitySegment

mongo_client = MongoClient("mongodb://root:8nP7s0a@localhost:27017/")
mongo_db = mongo_client["gomcs"]


@cached(cache=TTLCache(maxsize=400096, ttl=600))
def get_cached_plain_stats(user_id: str):
    aggregation_pipeline = [
        {"$group": {"_id": "$activityType", "totalDistance": {"$sum": "$distance"}}}
    ]
    mongo_stats_collection = mongo_db[user_id]

    results = mongo_stats_collection.aggregate(aggregation_pipeline)

    print(results)
    distances_by_activity_type: Dict[str, int] = {}
    for doc in results:
        print(doc)
        activity_type = doc["_id"]
        total_distance = doc["totalDistance"]
        distances_by_activity_type[activity_type] = total_distance

    return distances_by_activity_type


def get_cached_data(user_id: str):
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

    return timeline
