import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:4444'
});

// Ne vax ki her hansi request bas verir hemise yoxlayir  eger localStoragede nese varsa  bu məlumatı birləşdirir.
// Ve biz her login olmus userle daxil oldugumuzda headerse baxdigimizda ayrica Authorizationin icinde bize token qaytardigini goreceyik
instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token');

    return config;
})

export default instance