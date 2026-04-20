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
const API_URL = "https://lanciweb.github.io/demo/api/pictures/";

document.addEventListener("DOMContentLoaded", fetchImages);
if(dom.removeErrorBtn){
    dom.removeErrorBtn.addEventListener("click", removeErrorBtnHandler);
}
document.addEventListener("click", openModal);
if(dom.modalCloseBtnEl){
    dom.modalCloseBtnEl.addEventListener("click", closeModal);
}

if(dom.modalNextBtnEl && dom.modalPrevBtnEl){
    dom.modalNextBtnEl.addEventListener("click", carouselNextBtnHandler);
    dom.modalPrevBtnEl.addEventListener("click", carouselPrevBtnHandler);
}
