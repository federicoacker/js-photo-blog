// @ts-check
'use strict'

/**
 * @type {number};
 */
let carouselIndex = 0;
/**
 * @type {{id:number,index:number, imageURL:string, title:string, date:string}[]}
 */
let polaroidObjects = [];

/**
 * @type {string}
 */
let uploadedImageUrl = "";

/**
 * @type {string}
 */
const placeholderImageURL = "https://placehold.co/600";

// La nostra funzione che lancia il fetch
function fetchImages() {
    fetch(API_URL)
        .then(response => response.json())                          // Quando risolvi la promessa, allora lancia .json sull'oggetto 
        // che hai ricevuto e restituisci il json parsato come oggetto (che è quello che fa .json())
        .then(parsedJson => generateObjects(parsedJson))               // una volta che hai risolto la promessa, e ottenuto l'oggetto 
        // (che in questo caso è un array di oggetti), 
        // chiama la funzione generateList
        .catch(responseError => generateError(responseError))       // Se invece ricevi un errore, chiama la generateError
}

/**
 *
 * @param {{id: number, index: number, imageURL:string, title:string, date:string}} polaroidObject
 */
function createPolaroid(polaroidObject) {
    if (dom.polaroidTemplateEl) {
        const newPolaroid = document.importNode(dom.polaroidTemplateEl.content, true);
        /** @type {?HTMLElement} */
        const polaroidCard = newPolaroid.querySelector(".polaroid-container");
        const imageEl = newPolaroid.querySelector("img");
        const titleEl = newPolaroid.querySelector("h2");
        const dateEl = newPolaroid.querySelector("p");

        if (imageEl && titleEl && dateEl && polaroidCard && polaroidObject) {
            imageEl.src = polaroidObject.imageURL;
            titleEl.textContent = polaroidObject.title;
            dateEl.textContent = polaroidObject.date;
            polaroidCard.dataset.index = polaroidObject.index.toString();
            polaroidCard.dataset.id = polaroidObject.id.toString();
            polaroidCard.dataset.target = "modal";
        }

        if (dom.polaroidWallEl) {
            dom.polaroidWallEl.appendChild(newPolaroid);
        }
    }
}

/** 
 * @param {{ id: number, title: string, date: string, url: string }[]} jsonObject
*/
// Funzione che genera la lista di polaroid (riceve il nostro oggetto che gli viene dato dal then, come vediamo, è un array di oggetti)
function generateObjects(jsonObject) {
    setTimeout(() => {
        polaroidObjects = jsonObject.map(elem => {
            const polaroidObject = {
                id: elem.id,
                index: jsonObject.indexOf(elem),
                imageURL: elem.url,
                title: elem.title,
                date: elem.date
            }
            return polaroidObject;
        });
        if (dom.polaroidWallEl) {
            dom.polaroidWallEl.innerHTML = "";
        }
        polaroidObjects.forEach(polaroidObject => createPolaroid(polaroidObject));
    }, 5 * 1000);

}

/**
 * @param {{ id: number, title: string, date: string, url: string }} polaroidObject
 */



/**
 * @param {{message: string, stack: string}} responseError
 */
// Funzione che genera gli errori, riceve l'errore che gli viene dato dalla catch
function generateError(responseError) {
    if (dom.errorMessage) {                                       // Se esiste l'htmlElement errorMessage nel dom
        const p = dom.errorMessage.querySelector("p");          // Allora seleziona il p al suo interno
        if (p) {                                                  // Se il p esiste
            p.textContent = responseError.stack;                // Setta il textContent alla proprietà stack del responseError 
            // (Questo ho visto com'era fatto, facendo console.dir(responseError) nel catch prima)
            dom.errorMessage.classList.remove("d-none");        // Rimuovi la classe d-none dall'errorMessage
        }
    }
}

// Handler per il bottone che chiude l'errorMessage
function removeErrorBtnHandler() {
    if (dom.errorMessage) {                                       // Se esiste l'errorMessage come elemento
        dom.errorMessage.classList.add("d-none");               // Aggiungi d-none alla sua classList
    }
}

/**
 * @type {EventListener}
 * @param {{target:?HTMLElement}} event;
 */
function openModal(event) {
    /**
     * @type {HTMLImageElement | HTMLElement | null}
     */
    const target = event.target;
    if (dom.html && dom.modalEl && target instanceof HTMLImageElement) {
        const polaroidCard = target.closest(".polaroid-container");
        if (polaroidCard instanceof HTMLElement && polaroidCard.dataset.target === "modal") {
            dom.modalEl.classList.add("is-active");
            dom.html.classList.add("modal-open");
            generateModal(polaroidCard);
        }
    }
}

/**
 * @param {?HTMLElement} polaroidElement;
 */
function generateModal(polaroidElement) {
    if (dom.modalEl && polaroidElement) {
        const modalImage = dom.modalEl.querySelector("img");
        const targetImage = polaroidElement.querySelector("img");
        const index = polaroidElement.dataset.index;

        if (modalImage && targetImage instanceof HTMLImageElement && typeof (index) === "string") {
            carouselIndex = parseInt(index);
            modalImage.src = targetImage.src;
        }
    }
}

/**
 * @type {EventListener}
 * @param {{target:?HTMLElement}} event;
 */
function carouselBtnHandler(event) {
    const target = event.target?.closest("button");
    if (dom.modalEl && target && target.tagName === "BUTTON") {
        if (target.classList.contains("carousel-prev")) {
            carouselPrev();
        }
        else if (target.classList.contains("carousel-next")) {
            carouselNext();
        }
        else if (target.classList.contains("modal-close")) {
            closeModal();
        }
    }
}

function carouselNext() {
    if (!dom.modalEl) {
        return;
    }
    carouselIndex++;
    if (carouselIndex >= polaroidObjects.length) {
        carouselIndex = 0;
    }
    const modalImage = dom.modalEl.querySelector("img");
    if (modalImage) {
        modalImage.src = polaroidObjects[carouselIndex].imageURL;
    }
}
function carouselPrev() {
    if (!dom.modalEl) {
        return;
    }
    carouselIndex--;
    if (carouselIndex < 0) {
        carouselIndex = polaroidObjects.length - 1;
    }
    const modalImage = dom.modalEl.querySelector("img");
    if (modalImage) {
        modalImage.src = polaroidObjects[carouselIndex].imageURL;
    }
}
function closeModal() {
    const allModalEls = document.querySelectorAll(".modal");
    if (dom.html) {
        dom.html.classList.remove("modal-open");
    }
    allModalEls.forEach(modalElement => { modalElement.classList.remove("is-active"); });
}

function addImageBtnHandler() {
    if (dom.formModal) {
        dom.formModal.classList.add("is-active");
    }
}

function imageUploadInputChangeHandler() {
    if (dom.polaroidFormEl && dom.imageUploadInputEl instanceof HTMLInputElement) {
        const thumbnailEl = dom.polaroidFormEl.querySelector("img");
        if (thumbnailEl instanceof HTMLImageElement) {
            thumbnailEl.classList.remove("is-skeleton");
            const filesArray = dom.imageUploadInputEl.files;
            console.log(filesArray);
            if (filesArray && filesArray.length === 1) {
                uploadedImageUrl = URL.createObjectURL(filesArray[0]);
                thumbnailEl.src = uploadedImageUrl;
            }
            else {
                return;
            }
        }
    }
}

/**
 * @type {EventListener}
 * @param {Event} event;
 */
function submitPolaroidFormHandler(event) {
    event.preventDefault();
    // Validate texts
    if (!dom.titleInputEl || !dom.dateInputEl || !dom.imageUploadInputEl || !dom.polaroidFormEl) {
        return;
    }
    const [titleSuccess, titleValue] = isValid(dom.titleInputEl.value);
    const [dateSuccess, dateValue] = isValid(dom.dateInputEl.value);
    const [imageURLSuccess, imageURLValue] = isValid(uploadedImageUrl);
    if (!titleSuccess || !dateSuccess || !imageURLSuccess) {
        return;
    }

    if(titleValue && dateValue && imageURLValue){
        const convertedDateValue = getDate(dateValue);
        const formattedDateValue = convertedDateValue.toLocaleDateString("it-IT").replaceAll("/", "-");
        const newPolaroid = {
            id: (polaroidObjects[polaroidObjects.length - 1].id + 1),
            index: polaroidObjects.length,
            imageURL: imageURLValue,
            title: titleValue,
            date: formattedDateValue
        }
        polaroidObjects.push(newPolaroid);
        createPolaroid(newPolaroid);
        dom.titleInputEl.value = "";
        dom.dateInputEl.value = "";
        dom.imageUploadInputEl.value = "";
        const previewImage = dom.polaroidFormEl.querySelector("img");
        if(previewImage){
            previewImage.src = placeholderImageURL;
        }
        closeModal();
    }

    
}

/**
 * @param {string} string
 * @return {[boolean,?string]}
 */
function isValid(string) {
    const sanifiedString = string.trim();
    return ((sanifiedString === "") ? [false, null] : [true, sanifiedString]);
}

/**
 * @param {string} dateString
 */
function getDate(dateString){
    return new Date(dateString);
}