*This extension has a section in the [PenguinMod Privacy Policy](https://penguinmod.com/privacy) under "Editor extensions"*

## Early documentation.

# Introduction
This extension is intended for retrieving weather data all around the globe. For security purposes, we don't provide data that could potentially be used to doxx or expose a user's location online.
We remove the latitude and longitude from all results, as well as some other JSON keys that could result in the user getting doxxed.

We also will not, ever, make blocks that reveal the coordinates you selected. This would be a huge security no-no.

We will not remove these limitations because do you really want to expose the data of anyone who clicks the flag on your project? Don't be like that, dude.
Anyways, it's really recommended you know how JSON works and kinda familiarize yourself with it. It will be a key part of this process.

# Privacy Policy
No one from the Ruby Developers team stores or keeps your location data in any way.
However, be warned that the services we use for data fetching and Ruby Developers are not in the same field.
All services are third-party, and as such, we don't control what they do with your data, as we aren't related to them.
If you have doubts about the security of your data or are worried about your privacy, we invite you to read these pages of the following services we retrieve our data from:
- [OpenMeteo (weather data) - Terms of Service](https://open-meteo.com/en/terms)
- [OpenStreetMap (location data) - Privacy Policy](https://osmfoundation.org/wiki/Privacy_Policy)

# Blocks
These are all the blocks in TurboWeather:
```scratch
get coordinates of user:: #e0bb4a

(get selected measuring system:: #e0bb4a)

set coordinates to (0) and (0):: #e0bb4a

<get user coordinates successful?:: #e0bb4a>

set measuring system to [metric v]:: #e0bb4a

get the weather data:: #e0bb4a

(get the fetched weather JSON:: #e0bb4a)

get key [hourly.temperature_2m] out of [weather v] data:: #e0bb4a

get length of key [hourly.temperature_2m] out of [weather v] data:: #e0bb4a

get item number (0) out of array ["Apple", "Banana", "Peach", "Grapes", "Pineapple", "Orange", "Strawberry"]:: #e0bb4a

(get weather description of weather code (0):: #e0bb4a)

get location from coordinates:: #e0bb4a

(get the fetched location JSON:: #e0bb4a)

(get day and time for timezone [America/New_York]:: #e0bb4a)
```
All of these may seem too advanced, but don't worry. Getting used to these is really easy and fast. Just keep reading!

# Block Explanations
TurboWeather provides various blocks to interact with weather and location data. Here's a simplified explanation for each block:

1. **Get Coordinates of User:** Retrieves the user's coordinates using browser geolocation.
2. **Get Selected Measuring System:** Returns the currently selected measuring system (metric or imperial).
3. **Set Coordinates to [Number] and [Number]:** Manually sets the latitude and longitude coordinates.
4. **Get User Coordinates Successful?:** Checks if the user's coordinates were successfully obtained.
5. **Set Measuring System to [Metric or Imperial]:** Sets the measuring system to either metric or imperial.
6. **Get Weather Data:** Fetches weather data from OpenMeteo using the current coordinates.
7. **Get the Fetched Weather JSON:** Returns the JSON data obtained from the weather data retrieval.
8. **Get Key [Key] out of [Weather/Location] Data:** Retrieves a specific value from the weather or location data using a key.
9. **Get Length of Key [Key] out of [Weather/Location] Data:** Returns the total length of a JSON key.
10. **Get Item Number [Number] out of Array [Array]:** Retrieves an item from an array.
11. **Get Weather Description of Weather Code [Code]:** Gets the description of a weather code.
12. **Get Location from Coordinates:** Retrieves location data from OpenStreetMap's Nominatim API using the current coordinates.
13. **Get the Fetched Location JSON:** Returns the JSON data obtained from the location data retrieval.
14. **Get Day and Time for Timezone [Timezone]:** Returns formatted date and time information for the specified timezone.

# Examples
## Get current weather data:
```scratch
when green flag clicked
get coordinates of user:: #e0bb4a
if <get user coordinates successful?:: #e0bb4a> then
get the weather data:: #e0bb4a
if <not <(get the fetched weather JSON:: #e0bb4a) = [{}]>> then
say (join (join [It's] (get key [current.temperature_2m] out of [weather v] data:: #e0bb4a) )  [°C outside right now!]
end
end
```
## Get your timezone:
```scratch
when green flag clicked
get coordinates of user:: #e0bb4a
if <get user coordinates successful?:: #e0bb4a> then
get the weather data:: #e0bb4a
if <not <(get the fetched weather JSON:: #e0bb4a) = [{}]>> then
say (join [In your timezone, it's ] (get day and time for timezone (get key [timezone] out of [location v] data:: #e0bb4a):: #e0bb4a)
end
end
```
