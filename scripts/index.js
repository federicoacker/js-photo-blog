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
    html: document.querySelector("html"),
    addImageBtn: document.querySelector("#add-image-btn"),
    polaroidFormEl: document.querySelector(".polaroid-form"),
    closeFormBtn: document.querySelector("#close-form-btn"),
    formModal: document.querySelector("#form-modal"),
    /**
     * @type {?HTMLInputElement}
     */
    imageUploadInputEl: document.querySelector("#image-upload-input"),
    /**
     * @type {?HTMLInputElement}
     */
    titleInputEl: document.querySelector("#title-input"),
    /**
     * @type {?HTMLInputElement}
     */
    dateInputEl: document.querySelector("#date-input")
};
const API_URL = "https://lanciweb.github.io/demo/api/pictures/";

document.addEventListener("DOMContentLoaded", fetchImages);
if(dom.removeErrorBtn){
    dom.removeErrorBtn.addEventListener("click", removeErrorBtnHandler);
}
document.addEventListener("click", openModal);

if(dom.modalEl){
    dom.modalEl.addEventListener("click", carouselBtnHandler);
}

if(dom.closeFormBtn){
    dom.closeFormBtn.addEventListener("click", closeModal);
}

if(dom.addImageBtn){
    dom.addImageBtn.addEventListener("click", addImageBtnHandler);
}

if(dom.imageUploadInputEl){
    dom.imageUploadInputEl.addEventListener("change", imageUploadInputChangeHandler);
}

if(dom.polaroidFormEl){
    dom.polaroidFormEl.addEventListener("submit", submitPolaroidFormHandler);
}