const API_URL = "https://lanciweb.github.io/demo/api/pictures/";

fetch(API_URL)
.then(response => response.json())
.then(json => console.log(json))
.catch(responseError => console.error(response.Error))
.finally(console.log("Finished fetching, here's your data, or your error:"));