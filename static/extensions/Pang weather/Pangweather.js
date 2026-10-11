(function (Scratch) {
    'use strict';

    const FREE_API_KEY = '472f7d0a3a591c6a56db62abd90d3fb2';

    const ICON = 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#42B8FF"/>
                    <stop offset="100%" stop-color="#0875E8"/>
                </linearGradient>
                <linearGradient id="sun" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#FFF27A"/>
                    <stop offset="100%" stop-color="#FFB928"/>
                </linearGradient>
            </defs>
            <rect width="128" height="128" rx="29" fill="url(#bg)"/>
            <g stroke="#FFE36B" stroke-width="5" stroke-linecap="round">
                <path d="M65 18v9 M42 25l5 8 M89 25l-5 8 M31 46h9 M91 46h8"/>
            </g>
            <circle cx="65" cy="47" r="24" fill="url(#sun)"/>
            <path d="M30 79 C20 79 15 72 17 63 C19 54 27 50 36 52 C40 38 52 32 65 37 C75 40 80 48 81 56 C94 52 105 60 106 71 C107 81 99 88 88 88 H31Z" fill="#FFFFFF"/>
            <path d="M43 94 C43 94 35 106 35 111 A8 8 0 0 0 51 111 C51 106 43 94 43 94Z" fill="#6DE2FF"/>
            <path d="M70 95 C70 95 62 107 62 112 A8 8 0 0 0 78 112 C78 107 70 95 70 95Z" fill="#6DE2FF"/>
            <path d="M92 94 C92 94 84 106 84 111 A8 8 0 0 0 100 111 C100 106 92 94 92 94Z" fill="#6DE2FF"/>
        </svg>
    `);

    class PangWeather {
        constructor() {
            this._apiKey = FREE_API_KEY;
            this._city = '';
            this._temperature = '';
            this._description = '';
            this._humidity = '';
            this._windSpeed = '';
            this._pressure = '';
            this._country = '';
            this._loaded = false;
            this._error = '';
        }

        getInfo() {
            return {
                id: 'pangweather',
                name: 'PangWeather',
                color1: '#0797F2',
                color2: '#0876D1',
                color3: '#055AA8',
                menuIconURI: ICON,
                blockIconURI: ICON,

                blocks: [
                    {
                        opcode: 'setAPIKey',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set API key to [KEY]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: FREE_API_KEY
                            }
                        }
                    },
                    {
                        opcode: 'freeAPIKey',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Free API key'
                    },
                    {
                        opcode: 'getWeather',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'get weather for city [CITY]',
                        arguments: {
                            CITY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Hanoi'
                            }
                        }
                    },
                    {
                        opcode: 'refreshWeather',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'refresh weather'
                    },
                    {
                        opcode: 'temperature',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'temperature (°C)'
                    },
                    {
                        opcode: 'description',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'weather description'
                    },
                    {
                        opcode: 'humidity',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'humidity (%)'
                    },
                    {
                        opcode: 'windSpeed',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'wind speed (m/s)'
                    },
                    {
                        opcode: 'pressure',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'air pressure (hPa)'
                    },
                    {
                        opcode: 'currentCity',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'current city'
                    },
                    {
                        opcode: 'country',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'country code'
                    },
                    {
                        opcode: 'weatherError',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'weather error'
                    },
                    {
                        opcode: 'dataLoaded',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'weather data loaded?'
                    }
                ]
            };
        }

        setAPIKey(args) {
            this._apiKey = String(args.KEY || '').trim();
            this._error = '';

            if (!this._apiKey) {
                this._error = 'API key is missing.';
                this._loaded = false;
            }
        }

        freeAPIKey() {
            this._apiKey = FREE_API_KEY;
            return FREE_API_KEY;
        }

        async getWeather(args) {
            this._city = String(args.CITY || '').trim();

            if (!this._apiKey) {
                this._error = 'API key is missing.';
                this._loaded = false;
                return;
            }

            if (!this._city) {
                this._error = 'Please enter a city name.';
                this._loaded = false;
                return;
            }

            await this._fetchWeather();
        }

        async refreshWeather() {
            if (!this._city) {
                this._error = 'Please select a city first.';
                return;
            }

            await this._fetchWeather();
        }

        async _fetchWeather() {
            this._loaded = false;
            this._error = '';

            const url =
                'https://api.openweathermap.org/data/2.5/weather' +
                '?q=' + encodeURIComponent(this._city) +
                '&appid=' + encodeURIComponent(this._apiKey) +
                '&units=metric&lang=en';

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data && data.message
                            ? data.message
                            : 'HTTP error ' + response.status
                    );
                }

                if (!data.main || !data.weather || !data.weather.length) {
                    throw new Error('Weather data is incomplete.');
                }

                this._temperature = data.main.temp;
                this._description = data.weather[0].description || '';
                this._humidity = data.main.humidity;
                this._pressure = data.main.pressure;
                this._windSpeed = data.wind ? (data.wind.speed || 0) : 0;
                this._city = data.name || this._city;
                this._country = data.sys ? (data.sys.country || '') : '';
                this._loaded = true;
                this._error = '';

            } catch (error) {
                this._loaded = false;
                this._error = error && error.message
                    ? error.message
                    : 'Unable to retrieve weather data.';
            }
        }

        temperature() {
            return this._loaded ? this._temperature : '';
        }

        description() {
            return this._loaded ? this._description : '';
        }

        humidity() {
            return this._loaded ? this._humidity : '';
        }

        windSpeed() {
            return this._loaded ? this._windSpeed : '';
        }

        pressure() {
            return this._loaded ? this._pressure : '';
        }

        currentCity() {
            return this._city;
        }

        country() {
            return this._loaded ? this._country : '';
        }

        weatherError() {
            return this._error;
        }

        dataLoaded() {
            return this._loaded;
        }
    }

    Scratch.extensions.register(new PangWeather());
})(Scratch);