// @ts-check
'use strict'

const API_URL = "https://lanciweb.github.io/demo/api/pictures/";

fetch(API_URL)
    .then(response => response.json())
    .then(json => generateList(json))
    .catch(responseError => console.error(responseError.Error))
    .finally(() => {console.log("Finished fetching, here's your data, or your error:")});


/**
 * @param {{ id: number, title: string, date: string, url: string }} polaroidObject
 */
function createPolaroid(polaroidObject) {
    return `
    <div class="column is-12-mobile is-6-tablet is-4-desktop is-2-ultrawide polaroid-wrapper">
        <div class="polaroid d-flex flex-column" data-id="${polaroidObject.id}">
            <figure class="polaroid-image-wrapper">
                <img src="${polaroidObject.url}" alt="${polaroidObject.title}" class="polaroid-image">
            </figure>
            <h3 class="sometype-mono">${polaroidObject.title}</h3>
            <p class="sometype-mono">${polaroidObject.date}</p>
        </div>
    </div>
    `;
}

/** 
 * @param {{ id: number, title: string, date: string, url: string }[]} jsonObject
*/
function generateList(jsonObject){
    const htmlStringArray = jsonObject.map(object => createPolaroid(object));
    
}