// @ts-check
'use strict'

/**
 * @type {number};
 */
let carouselIndex = 0;
let polaroidObjects = [];

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
    if(dom.polaroidTemplateEl){
        const newPolaroid = document.importNode(dom.polaroidTemplateEl.content, true);
        const imageEl = newPolaroid.querySelector("img");
        const titleEl = newPolaroid.querySelector("h2");
        const dateEl = newPolaroid.querySelector("p");
    
        if(imageEl && titleEl && dateEl && polaroidObject){
            imageEl.src = polaroidObject.imageURL;
            titleEl.textContent = polaroidObject.title;
            dateEl.textContent = polaroidObject.date;
            imageEl.dataset.index = polaroidObject.index.toString();
            imageEl.dataset.id = polaroidObject.id.toString();
        }
    
        if(dom.polaroidWallEl){
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
        if(dom.polaroidWallEl){
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
    if (dom.html && dom.modalEl && target && target.dataset.target === "modal" && target instanceof HTMLImageElement && target.dataset.id) { // Aggiunto questa condizione target instanceof HTMLImageElement per rendere felice jsdoc che si lamentava che non era certo che target fosse un HTMLImageElement
        carouselIndex = parseInt(target.dataset.id) - 1;
        dom.modalEl.classList.add("is-active");
        dom.html.classList.add("modal-open");
        generateModal(target);
    }
}

function closeModal() {
    const allModalEls = document.querySelectorAll(".modal");
    if (dom.html) {
        dom.html.classList.remove("modal-open");
    }
    allModalEls.forEach(modalElement => { modalElement.classList.remove("is-active"); });
}

/**
 * @param {HTMLImageElement | null} imageElement;
 */
function generateModal(imageElement) {
    if (dom.modalEl && imageElement) {
        const modalImage = dom.modalEl.querySelector("img");
        if (modalImage) {
            modalImage.src = imageElement.src;
        }
    }
}

function carouselNextBtnHandler() {
    if (dom.modalEl) {
        const modalImage = dom.modalEl.querySelector("img");
        let childToSelect;
        let imageToSelect;
        let srcIWant;
        carouselIndex++;
        if (dom.polaroidWallEl && carouselIndex >= dom.polaroidWallEl.children.length) {
            carouselIndex = 0;
        }
        if (dom.polaroidWallEl) {
            childToSelect = dom.polaroidWallEl.children[carouselIndex];
            if (childToSelect) {
                imageToSelect = childToSelect.querySelector("img");
                if (imageToSelect) {
                    srcIWant = imageToSelect.src;
                }
            }
        }
        if (modalImage && srcIWant) {
            modalImage.src = srcIWant;
        }
    }
}
function carouselPrevBtnHandler() {
    if (dom.modalEl) {
        const modalImage = dom.modalEl.querySelector("img");
        let childToSelect;
        let imageToSelect;
        let srcIWant;
        carouselIndex--;
        if (dom.polaroidWallEl && carouselIndex < 0) {
            carouselIndex = dom.polaroidWallEl.children.length - 1;
        }
        if (dom.polaroidWallEl) {
            childToSelect = dom.polaroidWallEl.children[carouselIndex];
            if (childToSelect) {
                imageToSelect = childToSelect.querySelector("img");
                if (imageToSelect) {
                    srcIWant = imageToSelect.src;
                }
            }
        }
        if (modalImage && srcIWant) {
            modalImage.src = srcIWant;
        }
    }
}