import requests
from cachetools import cached, TTLCache

climatiq_url = "https://beta3.api.climatiq.io/estimate"
climatiq_bearer = "MT5A3N0GGV4WQRMS2TYMGCWYRC2C"


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

    print(json_response)
    if "emission_factor" in json_response:
        del json_response["emission_factor"]

    print(json_response)
    return json_response["co2e"]


@cached(cache=TTLCache(maxsize=4096, ttl=600))
def estimate_car_emissions(distance: int):
    activity = "passenger_vehicle-vehicle_type_black_cab-fuel_source_na-distance_na-engine_size_na"
    return estimate_emissions(distance, activity)



@cached(cache=TTLCache(maxsize=4096, ttl=600))
def estimate_motorcycle_emissions(distance: int):
    print(distance)
    activity = "passenger_vehicle-vehicle_type_black_cab-fuel_source_na-distance_na-engine_size_na"

    estimate = estimate_emissions(distance, activity)
    print(estimate)
    return estimate_emissions(distance, activity)


@cached(cache=TTLCache(maxsize=4096, ttl=600))
def estimate_train_emissions(distance: int):
    activity = "passenger_vehicle-vehicle_type_bus-fuel_source_na-distance_na-engine_size_na"
    return estimate_emissions(distance, activity)


@cached(cache=TTLCache(maxsize=4096, ttl=600))
def estimate_ferry_emissions(distance: int):
    activity = "passenger_ferry-route_type_car_passenger-fuel_source_na"
    return estimate_emissions(distance, activity)


@cached(cache=TTLCache(maxsize=4096, ttl=600))
def estimate_bus_emissions(distance: int):
    activity = "passenger_vehicle-vehicle_type_bus-fuel_source_na-distance_na-engine_size_na"
    return estimate_emissions(distance, activity)


@cached(cache=TTLCache(maxsize=4096, ttl=600))
def estimate_plane_emissions(distance: int):
    activity = "passenger_flight-route_type_domestic-aircraft_type_jet-distance_na-class_na-rf_included"
    return estimate_emissions(distance, activity)
