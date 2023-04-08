const app = Vue.createApp({
    data() {
        return {
            title: "This is a silly title!",
            desc: "This is a silly paragraph!",
        };
    }
});

const vm = app.mount("#app");