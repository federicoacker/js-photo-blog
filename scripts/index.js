// @ts-check
'use strict'

const dom = {
    polaroidWallEl: document.querySelector(".polaroid-wall"),
    errorMessage: document.querySelector("#errorMessage"),
    removeErrorBtn: document.querySelector(".delete")
};
const API_URL = "https://lanciweb.github.io/demo/api/pictures/";

document.addEventListener("DOMContentLoaded", fetchImages);
if(dom.removeErrorBtn){
    dom.removeErrorBtn.addEventListener("click", removeErrorBtnHandler);
}