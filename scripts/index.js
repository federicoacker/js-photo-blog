// @ts-check
'use strict'

const dom = {
    polaroidWallEl: document.querySelector(".polaroid-wall"),
    errorMessage: document.querySelector("#errorMessage"),
    removeErrorBtn: document.querySelector(".delete"),
    modalEl: document.querySelector("#modal"),
    modalCloseBtnEl: document.querySelector(".modal-close")
};
const API_URL = "https://lanciweb.github.io/demo/api/pictures/";

document.addEventListener("DOMContentLoaded", fetchImages);
if(dom.removeErrorBtn){
    dom.removeErrorBtn.addEventListener("click", removeErrorBtnHandler);
}
document.addEventListener("click", openModal);