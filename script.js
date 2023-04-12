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
                console.log(data);

                this.date = this.currentDate();
                this.temp = data['main']['temp'];
                this.high_temp = data['main']['temp_max'];
                this.low_temp = data['main']['temp_min'];
                this.sky_conditions = data['weather'][0]['description'];
                this.humidity = data['main']['humidity'];
                this.pressure = data['main']['pressure'];

                console.log(data['main']['temp'])

            })
            .catch(err => "there was an issue fetching the weather")
    },
    methods: {
        currentDate: function () {
            const current = new Date();
            const date = `${current.getMonth() + 1}/${current.getDate()}/${current.getFullYear()}`;
            return date;
        }
    }
});

const vm = app.mount("#app");