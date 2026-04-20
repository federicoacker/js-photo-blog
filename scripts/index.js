// @ts-check
'use strict'

const dom = {
    /**
     * @type {?HTMLTemplateElement}
     */
    polaroidTemplateEl: document.querySelector("#polaroid-template"),
    polaroidWallEl: document.querySelector(".polaroid-wall"),
    errorMessage: document.querySelector("#errorMessage"),
    removeErrorBtn: document.querySelector(".delete"),
    modalEl: document.querySelector("#modal"),
    modalCloseBtnEl: document.querySelector(".modal-close"),
    modalNextBtnEl: document.querySelector("#carousel-next"),
    modalPrevBtnEl: document.querySelector("#carousel-prev"),
    html: document.querySelector("html")
};
const API_URL = "https://lanciweb.githubsd.io/demo/api/pictures/";

document.addEventListener("DOMContentLoaded", fetchImages);
if(dom.removeErrorBtn){
    dom.removeErrorBtn.addEventListener("click", removeErrorBtnHandler);
}
document.addEventListener("click", openModal);

if(dom.modalEl){
    dom.modalEl.addEventListener("click", carouselBtnHandler);
}

