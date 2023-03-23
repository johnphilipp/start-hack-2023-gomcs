import requests
from cachetools import cached, TTLCache

climatiq_url = "https://beta3.api.climatiq.io/estimate"
climatiq_bearer = "TOKEN"


def estimate_emissions(distance: int, activity_type: str):
    headers = {
        "Authorization": "Bearer " + climatiq_bearer
    }
    data = {
        "emission_factor": {
            "activity_id": activity_type
        },
        "parameters": {
            "passengers": 1,
            "distance": distance,
            "distance_unit": "m"
        }
    }

    response = requests.post(climatiq_url, headers=headers, json=data)
    json_response = response.json()
    del json_response["emission_factor"]
    return json_response


@cached(cache=TTLCache(maxsize=4096, ttl=600))
def estimate_car_emissions(distance: int):
    activity = "passenger_vehicle-vehicle_type_black_cab-fuel_source_na-distance_na-engine_size_na"
    return estimate_emissions(distance, activity)


@cached(cache=TTLCache(maxsize=4096, ttl=600))
def estimate_train_emissions(distance: int):
    activity = "passenger_train-route_type_commuter_rail-fuel_source_na"
    return estimate_emissions(distance, activity)


@cached(cache=TTLCache(maxsize=4096, ttl=600))
def estimate_ferry_emissions(distance: int):
    activity = "passenger_ferry-route_type_car_passenger-fuel_source_na"
    return estimate_emissions(distance, activity)


@cached(cache=TTLCache(maxsize=4096, ttl=600))
def estimate_plane_emissions(distance: int):
    activity = "passenger_flight-route_type_domestic-aircraft_type_jet-distance_na-class_na-rf_included"
    return estimate_emissions(distance, activity)
