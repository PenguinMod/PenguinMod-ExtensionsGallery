let lat = 0;
let lon = 0;
let userLocated = false;

const nominatimEndpoint = 'https://nominatim.openstreetmap.org/reverse';

// Weather API Docs: https://open-meteo.com/en/docs/

const weatherCodes = [
  // ww = 00-49: No precipitation at the station at the time of observation
  "Cloud development not observed or not observable",
  "Clouds generally dissolving or becoming less developed",
  "State of sky on the whole unchanged",
  "Clouds generally forming or developing",
  "Visibility reduced by smoke",
  "Haze",
  "Widespread dust in suspension",
  "Dust or sand raised by wind",
  "Well developed dust whirl(s) or sand whirl(s)",
  "Duststorm or sandstorm within sight",
  "Mist",
  "Patches of shallow fog or ice fog",
  "More or less continuous fog or ice fog",
  "Lightning visible, no thunder heard",
  "Precipitation within sight, not reaching the ground",
  "Precipitation within sight, reaching the ground or sea, distant",
  "Precipitation within sight, reaching the ground or sea, near",
  "Thunderstorm, no precipitation",
  "Squalls",
  "Funnel cloud (tornado cloud or water-spout)",
  // ww = 20-29: Precipitation, fog, ice fog or thunderstorm during the preceding hour
  "Drizzle (not freezing) or snow grains",
  "Rain (not freezing)",
  "Snow",
  "Rain and snow or ice pellets",
  "Freezing drizzle or freezing rain",
  "Shower(s) of rain",
  "Shower(s) of snow, or rain and snow",
  "Shower(s) of hail, or rain and hail",
  "Fog or ice fog",
  "Thunderstorm (with or without precipitation)",
  // ww = 30-39: Duststorm, sandstorm, drifting or blowing snow
  "Slight or moderate duststorm or sandstorm, decreased",
  "Slight or moderate duststorm or sandstorm, no change",
  "Slight or moderate duststorm or sandstorm, begun or increased",
  "Severe duststorm or sandstorm, decreased",
  "Severe duststorm or sandstorm, no change",
  "Severe duststorm or sandstorm, begun or increased",
  "Slight or moderate blowing snow, low",
  "Heavy drifting snow",
  "Slight or moderate blowing snow, high",
  "Heavy drifting snow",
  // ww = 40-49: Fog or ice fog at the time of observation
  "Fog or ice fog at a distance, extending above observer",
  "Fog or ice fog in patches",
  "Fog or ice fog, sky visible, thinner",
  "Fog or ice fog, sky invisible",
  "Fog or ice fog, sky visible, no change",
  "Fog or ice fog, sky invisible",
  "Fog or ice fog, sky visible, thicker",
  "Fog or ice fog, sky invisible",
  "Fog depositing rime, sky visible",
  "Fog depositing rime, sky invisible",
  // ww = 50-99: Precipitation at the station at the time of observation
  // ww = 50-59: Drizzle
  "Drizzle, not freezing, intermittent slight",
  "Drizzle, not freezing, continuous",
  "Drizzle, not freezing, intermittent moderate",
  "Drizzle, not freezing, intermittent heavy",
  "Drizzle, freezing, slight",
  "Drizzle, freezing, moderate or heavy",
  "Drizzle and rain, slight",
  "Drizzle and rain, moderate or heavy",
  // ww = 60-69: Rain
  "Rain, not freezing, intermittent slight",
  "Rain, not freezing, continuous",
  "Rain, not freezing, intermittent moderate",
  "Rain, not freezing, intermittent heavy",
  "Rain, freezing, slight",
  "Rain, freezing, moderate or heavy",
  "Rain or drizzle and snow, slight",
  "Rain or drizzle and snow, moderate or heavy",
  // ww = 70-79: Solid precipitation not in showers
  "Intermittent fall of snowflakes, slight",
  "Continuous fall of snowflakes",
  "Intermittent fall of snowflakes, moderate",
  "Intermittent fall of snowflakes, heavy",
  "Diamond dust (with or without fog)",
  "Snow grains (with or without fog)",
  "Isolated star-like snow crystals (with or without fog)",
  "Ice pellets",
  // ww = 80-99: Showery precipitation, or precipitation with current or recent thunderstorm
  "Rain shower(s), slight",
  "Rain shower(s), moderate or heavy",
  "Rain shower(s), violent",
  "Shower(s) of rain and snow mixed, slight",
  "Shower(s) of rain and snow mixed, moderate or heavy",
  "Snow shower(s), slight",
  "Snow shower(s), moderate or heavy",
  "Shower(s) of snow pellets or small hail, slight",
  "Shower(s) of snow pellets or small hail, moderate or heavy",
  "Shower(s) of hail, slight",
  "Shower(s) of hail, moderate or heavy",
  "Slight rain, thunderstorm during preceding hour",
  "Moderate or heavy rain",
  "Slight snow, or rain and snow mixed or hail",
  "Moderate or heavy snow, or rain and snow mixed or hail",
  "Thunderstorm, slight or moderate, without hail",
  "Thunderstorm, slight or moderate, with hail",
  "Thunderstorm, heavy, without hail",
  "Thunderstorm combined with duststorm or sandstorm",
  "Thunderstorm, heavy, with hail"
];

let metric = false;
let resultjson = {};
let locationdata = {};

class TurboWeather {
  getInfo() {
    return {
      id: 'turboweather',
      name: 'TurboWeather',
      color1: "#e0bb4a",
      color2: "#b5973c",
      color3: "#8a732d",
      blocks: [
        {
          opcode: 'rubydevs',
          text: 'Made by Ruby Devs',
          blockType: Scratch.BlockType.LABEL,
        },
        {
          opcode: 'usercoords',
          text: 'get coordinates of user',
          blockType: Scratch.BlockType.COMMAND,
        },
        {
          opcode: 'measurementsystemget',
          text: 'get selected measurement system',
          blockType: Scratch.BlockType.REPORTER,
        },
        {
          opcode: 'setcoords',
          text: 'set current coordinates to [LAT] and [LON]',
          blockType: Scratch.BlockType.COMMAND,
          arguments: {
            LAT: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0
            },
            LON: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0
            }
          }
        },
        {
          opcode: 'resultusercoords',
          text: 'get user coordinates successful?',
          blockType: Scratch.BlockType.BOOLEAN,
        },
        {
          opcode: 'measurementsystemset',
          text: 'set measurement system to [SYSTEM]',
          blockType: Scratch.BlockType.COMMAND,
          arguments: {
            SYSTEM: {
              type: Scratch.ArgumentType.STRING,
              menu: 'MEASUREMENTSYSTEM',
            }
          }
        },
        '---',
        {
          opcode: 'fetch',
          text: 'get the weather data',
          blockType: Scratch.BlockType.COMMAND,
        },
        {
          opcode: 'fetchedjson',
          text: 'get the fetched weather JSON',
          blockType: Scratch.BlockType.REPORTER,
        },
        '---',
        {
          opcode: 'getjsonkey',
          text: 'get key [KEY] out of [JSON]',
          blockType: Scratch.BlockType.REPORTER,
          arguments: {
            KEY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'hourly.temperature_2m',
            },
            JSON: {
              type: Scratch.ArgumentType.STRING,
              menu: 'JSON',
            }
          }
        },
        {
          opcode: 'getkeylength',
          text: 'get length of key [KEY] out of [JSON]',
          blockType: Scratch.BlockType.REPORTER,
          arguments: {
            KEY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'hourly.temperature_2m',
            },
            JSON: {
              type: Scratch.ArgumentType.STRING,
              menu: 'JSON',
            }
          }
        },
        {
          opcode: 'getarrayitem',
          text: 'get item number [ITEM] out of array [ARR]',
          blockType: Scratch.BlockType.REPORTER,
          arguments: {
            ITEM: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
            ARR: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["Apple", "Banana", "Peach", "Grapes", "Pineapple", "Orange", "Strawberry"]',
            }
          }
        },
        {
          opcode: 'getweathercode',
          text: 'weather description of weather code [CODE]',
          blockType: Scratch.BlockType.REPORTER,
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            }
          }
        },
        '---',
        {
          opcode: 'getlocation',
          text: 'get location from coordinates',
          blockType: Scratch.BlockType.COMMAND,
        },
        {
          opcode: 'fetchedlocationjson',
          text: 'get the fetched location JSON',
          blockType: Scratch.BlockType.REPORTER,
        },
        {
          opcode: 'getDayAndTime',
          text: 'get day and time for timezone [TIMEZONE]',
          blockType: Scratch.BlockType.REPORTER,
          arguments: {
            TIMEZONE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'America/New_York',
            },
          },
        },
      ],
      menus: {
        MEASUREMENTSYSTEM: {
          acceptReporters: false,
          items: ['metric', 'imperial']
        },
        JSON: {
          acceptReporters: false,
          items: ['weather data', 'location data']
        }
      }
    };
  }

  async usercoords() {
      userLocated = false;

      if ('geolocation' in navigator) {
        try {
          const canGeolocate = await Scratch.canGeolocate();

          if (canGeolocate) {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            lat = position.coords.latitude;
            lon = position.coords.longitude;

            userLocated = true;
          }
        } catch (error) {
          throw new Error("Failed to get user's coordinates.");
          userLocated = false;
        }
      } else {
        throw new Error("Geolocation is not available in this browser.");
        userLocated = false;
      }
    }


  resultusercoords() {
    return userLocated
  }

  measurementsystemget() {
    if (metric) {
      return "metric"
    } else {
      return "imperial"
    }
  }

  measurementsystemset(args) {
    metric = args.SYSTEM == 'metric'
  }

  setcoords(args) {
    lat = args.LAT;
    lon = args.LON;
  }

  async fetch() {
    var url = "";
    if (metric) {
      url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,is_day,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto&forecast_days=14";
    } else {
      url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,is_day,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto&forecast_days=14";
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Check if latitude and longitude keys exist in the result
      if ('latitude' in data && 'longitude' in data) {
        // Delete latitude and longitude keys
        delete data.latitude;
        delete data.longitude;
      }

      resultjson = data;
    } catch (error) {
      console.error(error);
      result = { error: 'Uh oh! Something went wrong.' };
    }
  }

  fetchedjson() {
    return JSON.stringify(resultjson, null, 2);
  }

  getjsonkey(args) {
    const keys = args.KEY.split('.');
    let value;

    if (args.JSON == 'weather data') {
      value = resultjson;
    } else {
      value = locationdata;
    }

    for (const key of keys) {
      if (value && key in value) {
        value = value[key];
      } else {
        return "undefined";
      }

      // Check if the current value is a string and not the last key
      if (typeof value === 'string' && keys.indexOf(key) < keys.length - 1) {
        return value;
      }
    }

    return JSON.stringify(value);
  }

  getarrayitem(args) {
    let arr = JSON.parse(args.ARR);
    if (args.ITEM < 0) {
      return "undefined";
    }

    if (args.ITEM < arr.length) {
      return arr[args.ITEM];
    } else {
      return "undefined";
    }
  }

  getweathercode(args) {
    return weatherCodes[args.CODE];
  }

  getkeylength(args) {
    const keys = args.KEY.split('.');
    let value;

    if (args.JSON === 'weather data') {
      value = resultjson;
    } else {
      value = locationdata;
    }

    for (const key of keys) {
      if (value && key in value) {
        value = value[key];
      } else {
        return 0; // Return 0 for undefined or non-existent keys
      }
    }

    if (Array.isArray(value)) {
      return value.length;
    } else {
      return 0; // Return 0 for non-array keys
    }
  }

  async getlocation() {
    try {
      const url = `${nominatimEndpoint}?format=json&lat=${lat}&lon=${lon}`;

      const response = await fetch(url);
      const data = await response.json();

      let result = {
        "country": data.address.country || "Unknown",
        "country_code": data.address.country_code || "Unknown",
      };

      // Store the location in a variable (adjust the variable name as needed)
      locationdata = result;
    } catch (error) {
      console.error(error);
      return "Failed to get location from coordinates.";
    }
  }

  fetchedlocationjson() {
    return JSON.stringify(locationdata, null, 2);
  }

  async getDayAndTime(args) {
    try {
      const timestamp = Date.now(); // Get current timestamp in milliseconds
      const timezone = args.TIMEZONE;

      const options = {
        timeZone: timezone,
        month: 'long',    // Get full month name
        day: 'numeric',    // Get day number
        year: 'numeric',   // Get year
        weekday: 'long',   // Get full weekday name
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      };

      const formattedTime = new Date(timestamp).toLocaleString('en-US', options);
      return formattedTime;
    } catch (error) {
      console.error(error);
      return "Failed to get day and time for the specified timezone.";
    }
  }
}

Scratch.extensions.register(new TurboWeather());
