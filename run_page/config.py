import os
from collections import namedtuple

# getting content root directory
current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)

OUTPUT_DIR = os.path.join(parent, "activities")
PNG_FOLDER = os.path.join(parent, "PNG_OUT")
SQL_FILE = os.path.join(parent, "run_page", "data.db")
JSON_FILE = os.path.join(parent, "src", "static", "activities.json")

# TODO: Move into nike_sync NRC THINGS


BASE_TIMEZONE = "Asia/Shanghai"
UTC_TIMEZONE = "UTC"

start_point = namedtuple("start_point", "lat lon")
run_map = namedtuple("polyline", "summary_polyline")

# add more type here
TYPE_DICT = {
    "running": "Run",
    "RUN": "Run",
    "Run": "Run",
    "track_running": "Run",
    "trail_running": "Trail Run",
    "cycling": "Ride",
    "CYCLING": "Ride",
    "Ride": "Ride",
    "EBikeRide": "Ride",
    "E-Bike": "Ride",
    "road_biking": "Ride",
    "Road Bike": "Ride",
    "Mountain Bike": "Ride",
    "VirtualRide": "VirtualRide",
    "indoor_cycling": "Indoor Ride",
    "Indoor Bike ": "Indoor Ride",
    "walking": "Walk",
    "Walk": "Walk",
    "hiking": "Hike",
    "Hike": "Hike",
    "Swim": "Swim",
    "swimming": "Swim",
    "Pool Swim": "Swim",
    "Open Water": "Swim",
    "rowing": "Rowing",
    "RoadTrip": "RoadTrip",
    "flight": "Flight",
    "kayaking": "Kayaking",
    "Snowboard": "Snowboard",
    "resort_skiing_snowboarding_ws": "Ski",  # garmin
    "AlpineSki": "Ski",  # strava
    "Ski": "Ski",
    "BackcountrySki": "BackcountrySki",
}

MAPPING_TYPE = [
    "Hike",
    "Walk",
    "Ride",
    "VirtualRide",
    "Rowing",
    "Run",
    "Trail Run",
    "Swim",
    "RoadTrip",
    "Kayaking",
    "Snowboard",
    "Ski",
    "BackcountrySki",
]

