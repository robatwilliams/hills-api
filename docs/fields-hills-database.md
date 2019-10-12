# Fields from The Database of British and Irish Hills

This is the primary data source. Note that the API also exposes fields from other data sources.

More information about each field can be found here: http://hills-database.co.uk/database_notes.html#fields

## Key

### Inclusion

- ✅ Included
- ❌ Not currently included
- 🚫 Not to be included

### Type

- 📌 Coordinate
- 🔗 External reference
- ➡ Hill reference
- ℹ️ Information (other)
- 🌍 Location
- 📏 Measurement
- 📝 Metadata (data about the data)

## Fields

| Name                   | Type  | Included |
| ---------------------- | ----- | -------- |
| Number                 | ℹ️    | ✅       |
| Name                   | ℹ️    | ✅       |
| Parent (SMC)           | ➡     | ❌       |
| Parent name (SMC)      | -     | 🚫       |
| Section                | 🔗    | ❌       |
| Region                 | 🌍    | ❌       |
| Area                   | 🌍    | ❌       |
| Island                 | 🌍    | ❌       |
| Topo Section           | 🌍 🔗 | ❌       |
| County                 | 🌍    | ❌       |
| Classification         | ℹ️    | ❌       |
| Map 1:50k<sup>1</sup>  | 🔗    | ✅       |
| Map 1:25k<sup>1</sup>  | 🔗    | ✅       |
| Metres                 | 📏    | ✅       |
| Feet                   | 📏    | ✅       |
| Grid ref               | 📌    | ❌       |
| Grid ref 10            | 📌    | ❌       |
| Drop                   | 📏    | ❌       |
| Col grid ref           | 📌    | ❌       |
| Col height             | 📏    | ❌       |
| Feature                | ℹ️    | ❌       |
| Observations           | ℹ️    | ❌       |
| Survey                 | 📝    | ❌       |
| Climbed                | -     | 🚫       |
| Country                | 🌍    | ✅       |
| County Top             | 🌍    | ❌       |
| Revision               | 📝    | ❌       |
| Comments               | 📝    | ❌       |
| Streetmap/OSiViewer    | 🔗    | ❌       |
| Geograph/MountainViews | 🔗    | ❌       |
| Hill-bagging           | 🔗    | ❌       |
| Xcoord                 | 📌    | ❌       |
| Ycoord                 | 📌    | ❌       |
| Latitude               | 📌    | ❌       |
| Longitude              | 📌    | ❌       |
| GridrefXY              | 📌    | ❌       |
| \_Section              | 🔗    | ❌       |
| Parent (Ma)            | ➡     | ❌       |
| Parent name (Ma)       | -     | 🚫       |
| MVNumber               | 🔗    | ❌       |

"Parent name" fields are not included; the information is conveniently accessible on the parent hill itself by querying the parent relation. "Climbed" is also not included; it's an empty field for users to mark completion.

<sup>1</sup> Not including location-on-map information, e.g. "OL39N"
