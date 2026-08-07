import json

from config import JSON_FILE, SQL_FILE
from generator import Generator

g = Generator(SQL_FILE)
activities = g.loadForMapping()
with open(JSON_FILE, "w") as f:
    json.dump(activities, f, indent=0)
print(f"Written {len(activities)} activities to {JSON_FILE}")
