// @ts-check
'use strict'

const dom = {
    polaroidWallEl: document.querySelector(".polaroid-wall"),
    errorMessage: document.querySelector("#errorMessage"),
    removeErrorBtn: document.querySelector(".delete")
};
const API_URL = "https://lanciweb.github.io/demo/api/pictures/";

function fetchImages() {
    fetch(API_URL)
        .then(response => response.json())
        .then(json => generateList(json))
        .catch(responseError => generateError(responseError))
}

/**
 * @param {{ id: number, title: string, date: string, url: string }} polaroidObject
 */
function createPolaroid(polaroidObject) {
    return `
    <div class="column is-12-mobile is-6-tablet is-4-desktop is-ultrawide polaroid-wrapper ">
        <div class="polaroid d-flex flex-column" data-id="${polaroidObject.id}">
            <figure class="polaroid-image-wrapper">
                <img id="img-${polaroidObject.id}" src="${polaroidObject.url}" alt="${polaroidObject.title}" class="polaroid-image">
            </figure>
            <h2 class="sometype-mono">${polaroidObject.title}</h2>
            <p class="sometype-mono">${polaroidObject.date}</p>
        </div>
    </div>
    `;
}

/** 
 * @param {{ id: number, title: string, date: string, url: string }[]} jsonObject
*/
function generateList(jsonObject) {
    setTimeout(() => {
        const htmlStringArray = jsonObject.map(object => createPolaroid(object));
        const htmlString = htmlStringArray.join("");
        if (dom.polaroidWallEl) {
            dom.polaroidWallEl.innerHTML = htmlString;
        }
    }, 5 * 1000);

}

/**
 * @param {{message: string, stack: string}} responseError
 */
function generateError(responseError){
    if(dom.errorMessage){
        const p = dom.errorMessage.querySelector("p");
        if(p){
            p.textContent = responseError.stack;
        }
        dom.errorMessage.classList.remove("d-none");
    }
}

function removeErrorBtnHandler(){
    if(dom.errorMessage){
        dom.errorMessage.classList.add("d-none");
    }
}

document.addEventListener("DOMContentLoaded", fetchImages);
if(dom.removeErrorBtn){
    dom.removeErrorBtn.addEventListener("click", removeErrorBtnHandler);
}