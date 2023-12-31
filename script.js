const app = Vue.createApp({
    data() {
        return {
            // location
            latitude: undefined,
            longitude: undefined,
            city: undefined,
            region: undefined,
            country: undefined,

            // weather
            date: undefined,
            time: undefined,
            temp: undefined,
            high_temp: undefined,
            low_temp: undefined,
            sky_conditions: undefined,
            humidity: undefined,
            pressure: undefined,

            // status
            likely_counter: 0,
            unlikely_counter: 0,
            neutral_counter: 0,

            // 5-day forecast
            forecasts: {
                list: undefined,
                forecast_likelihood: undefined,
            }
        }
    },
    mounted() {
        // fetch ip location
        fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=64dbfbfd9c2f4767acbae0b784c582ba')
            .then((response) => response.json())
            .then((data) => {
                var fetch_lat = data['latitude'];
                var fetch_long = data['longitude'];
                var fetch_city = data['city'];
                var fetch_region = data['region'];
                var fetch_country = data['country'];

                // update latitude and longitude
                this.latitude = fetch_lat;
                this.longitude = fetch_long;
                this.city = fetch_city;
                this.region = fetch_region;
                this.country = fetch_country;

                // promise chaining, fetch weather for current location
                return (fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${fetch_lat}&lon=${fetch_long}&units=imperial&appid=eacc4caf4a0f7015fb01d673d7e9361b`))
            })
            .then((response) => response.json())
            .then((data) => {

                this.date = this.currentDate();
                this.time = this.currentTime();
                this.temp = data['main']['temp'];
                this.high_temp = data['main']['temp_max'];
                this.low_temp = data['main']['temp_min'];
                this.sky_conditions = data['weather'][0]['description'];
                this.humidity = data['main']['humidity'];
                this.pressure = data['main']['pressure'];

                return (fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${this.latitude}&lon=${this.longitude}&units=imperial&appid=eacc4caf4a0f7015fb01d673d7e9361b`))
            })
            .then((response) => response.json())
            .then((data) => {
                this.forecasts.list = data.list;
                this.forecasts.forecast_likelihood = new Array(this.forecasts.list.length);
                for (let i = 0; i < this.forecasts.forecast_likelihood.length; i++) {
                    this.forecasts.forecast_likelihood[i] = "neutral";
                    this.updateCounter();
                }
            })
            .catch(err => "there was an issue fetching the weather")
    },
    methods: {
        currentDate: function () {
            const current = new Date();
            const date = `${current.getMonth() + 1}/${current.getDate()}/${current.getFullYear()}`;
            return date;
        },

        currentTime: function (timestamp) {
            const current = new Date();
            var am_pm;
            var hours = current.getHours();
            if (hours > 12) {
                hours = hours - 12;
                am_pm = "PM";
            } else {
                am_pm = "AM";
            }
            const time = `${hours}:${current.getMinutes()}:${current.getSeconds()} ${am_pm}`;
            return time;
        },

        utc_to_local_time: function (timestamp) {
            var date = new Date(timestamp * 1000);
            var hours = date.getHours();
            if (hours > 12) {
                hours = hours - 12;
                var am_pm = "PM";
            } else {
                var am_pm = "AM";
                if (hours == 12) {
                    am_pm = "PM";
                }
                if (hours == 0) {
                    hours = 12;
                }
            }
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            return hours + ":" + minutes.substring(-2) + ":" + seconds.substring(-2) + " " + am_pm;
        },

        utc_to_local_date: function (timestamp) {
            var date = new Date(timestamp * 1000);
            return date.toLocaleDateString("en-US");
        },

        toggle(ev) {

            let idx = ev.currentTarget.getAttribute('data-index');

            if (this.forecasts.forecast_likelihood[idx] == "neutral"){
                this.forecasts.forecast_likelihood[idx] = "unlikely";
            } else if (this.forecasts.forecast_likelihood[idx] == "unlikely") {
                this.forecasts.forecast_likelihood[idx] = "likely";
            } else {
                this.forecasts.forecast_likelihood[idx] = "neutral";
            }
            this.updateCounter();
        },

        likelihood: function (index) {
            return this.forecasts.forecast_likelihood[index];
        },

        updateCounter: function() {
            this.unlikely_counter = 0;
            this.neutral_counter = 0;
            this.likely_counter = 0;
            for (let i = 0; i < this.forecasts.forecast_likelihood.length; i++) {
                if (this.forecasts.forecast_likelihood[i] == "unlikely"){
                    this.unlikely_counter++;
                } else if (this.forecasts.forecast_likelihood[i] == "likely") {
                    this.likely_counter++;
                } else if (this.forecasts.forecast_likelihood[i] == "neutral") {
                    this.neutral_counter++;
                }
            }
        }
    },

});

const vm = app.mount("#app");