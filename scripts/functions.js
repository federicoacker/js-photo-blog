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
        .then(parsedJson => generateObjects(parsedJson))            // una volta che hai risolto la promessa, e ottenuto l'oggetto 
                                                                    // (che in questo caso è un array di oggetti), 
                                                                    // chiama la funzione generateObjects
        .catch(responseError => generateError(responseError))       // Se invece ricevi un errore, chiama la generateError
}

/**
 *
 * @param {{id: number, index: number, imageURL:string, title:string, date:string}} polaroidObject
 */
// Funzione che si occupa di creare la singola Polaroid (Riceve un polaroidObject)
function createPolaroid(polaroidObject) {
    if (dom.polaroidTemplateEl) {                                                        // Controlliamo che esista il nostro templatePolaroid
        const newPolaroid = document.importNode(dom.polaroidTemplateEl.content, true);   // Creiamo una nuova polaroid, partendo dal template, facendone un clone ricorsivo praticamente
        /** @type {?HTMLElement} */                                                      // A questo punto:
        const polaroidCard = newPolaroid.querySelector(".polaroid-container");           // Seleziono il container più esterno dentro la nuova polaroid
        const imageEl = newPolaroid.querySelector("img");                                // Seleziono l'immagine dentro la nuova polaroid
        const titleEl = newPolaroid.querySelector("h2");                                 // Seleziono l'h2 dentro la nuova polaroid
        const dateEl = newPolaroid.querySelector("p");                                   // Seleziono il p dentro la nuova polaroid

        if (imageEl && titleEl && dateEl && polaroidCard && polaroidObject) {            // Se esistono tutti, ed esiste il polaroidObject che la funzione ha ricevuto
            imageEl.src = polaroidObject.imageURL;                                       // Settiamo la source dell'immagine nella nuova polaroid a imageUrl dell'oggetto ricevuto
            titleEl.textContent = polaroidObject.title;                                  // Settiamo il titolo nella nuova polaroid a title dell'oggetto ricevuto
            dateEl.textContent = polaroidObject.date;                                    // Settiamo la data nella nuova polaroid a date dell'oggetto ricevuto
            polaroidCard.dataset.index = polaroidObject.index.toString();                // Settiamo il data-attribute index al container della nuova polaroid
            polaroidCard.dataset.id = polaroidObject.id.toString();                      // Settiamo il data-attribute id al container della nuova polaroid
            polaroidCard.dataset.target = "modal";                                       // Settiamo il data-attribute target a "modal" che sarà il modale del nostro carosello
        }

        if (dom.polaroidWallEl) {                                                        // Poi se esiste il polaroidWallEl
            dom.polaroidWallEl.appendChild(newPolaroid);                                 // Aggiungo la nostra nuova Polaroid al wall
        }
    }
}

/** 
 * @param {{ id: number, title: string, date: string, url: string }[]} jsonObject
*/
// Funzione che genera un array di oggetti polaroid (riceve il nostro oggetto che gli viene dato dal then, come vediamo, è un array di oggetti)
function generateObjects(jsonObject) {
    setTimeout(() => {                                                              // Set Timeout solo per simulare lentezza e vedere gli skeleton-loader
        polaroidObjects = jsonObject.map(elem => {                                  // Prendiamo il nostro array di oggetty e mappiamolo in un array di oggetti diversi con le proprietà che voglio io e assegnamolo a polaroidObjects
            const polaroidObject = {                                                // In particolare mi interessa avere una proprietà che rappresenti la posizione che questo oggetto ha nell'array
                id: elem.id,                                                        // Quindi id resta uguale
                index: jsonObject.indexOf(elem),                                    // Per l'indice andiamo a vedere che indice aveva nell'array originale
                imageURL: elem.url,                                                 // Url resta uguale
                title: elem.title,                                                  // Titolo resta uguale
                date: elem.date                                                     // Date resta uguale
            }
            return polaroidObject;                                                  // Restituiamo il nostro nuovo polaroidObject (che verrà messo da map dentro un array che poi sarà assegnato a polaroidObjects)
        });
        if (dom.polaroidWallEl) {                                                   // Poi, se esiste il polaroid Wall
            dom.polaroidWallEl.innerHTML = "";                                      // Lo puliamo da tutti i nostri placeholder
        }
        polaroidObjects.forEach(polaroidObject => createPolaroid(polaroidObject));  // E poi semplicemente, iteriamo nell'array polaroidObjects 
                                                                                    // creando una nuova Polaroid che verrà aggiunta alla lista dei children
    }, 5 * 1000);

}

/**
 * @param {{message: string, stack: string}} responseError
 */
// Funzione che genera gli errori, riceve l'errore che gli viene dato dalla catch
function generateError(responseError) {
    if (dom.errorMessage) {                                     // Se esiste l'htmlElement errorMessage nel dom
        const p = dom.errorMessage.querySelector("p");          // Allora seleziona il p al suo interno
        if (p) {                                                // Se il p esiste
            p.textContent = responseError.stack;                // Setta il textContent alla proprietà stack del responseError 
                                                                // (Questo ho visto com'era fatto, facendo console.dir(responseError) nel catch prima)
            dom.errorMessage.classList.remove("d-none");        // Rimuovi la classe d-none dall'errorMessage
        }
    }
}

// Handler per il bottone che chiude l'errorMessage
function removeErrorBtnHandler() {
    if (dom.errorMessage) {                                     // Se esiste l'errorMessage come elemento
        dom.errorMessage.classList.add("d-none");               // Aggiungi d-none alla sua classList
    }
}

/**
 * @type {EventListener}
 * @param {{target:?HTMLElement}} event;
 */
// Funzione per l'apertura del modale per il carosello (è un po' più complessa rispetto a quella del modale per l'aggiunta immagini perché questa sfrutta bubbling degli eventi)
function openModal(event) {
    /**
     * @type {HTMLImageElement | HTMLElement | null}
     */
    const target = event.target;                                                                // Innanzitutto recuperiamo l'event target che ha scatenato l'evento
    if (dom.html && dom.modalEl && target instanceof HTMLImageElement) {                        // Poi controlliamo che esistano gli elementi che andremo a modificare 
                                                                                                // e che il target fosse stato proprio una immagine
        const polaroidCard = target.closest(".polaroid-container");                             // A questo punto selezioniamo il polaroid-container padre più vicino
        if (polaroidCard instanceof HTMLElement && polaroidCard.dataset.target === "modal") {   // Se esso è un HTMLElement e ha come data-target "modal"
            dom.modalEl.classList.add("is-active");                                             // Allora aggiungiamo la classe "is-active" al modal che lo rende visibile
            dom.html.classList.add("modal-open");                                               // E aggiungiamo la classe modal-open al tag html che mi blocca lo scrolling
            generateModal(polaroidCard);                                                        // E andiamo a generare il modale, passandogli polaroidCard come oggetto
        }
    }
}

/**
 * @param {?HTMLElement} polaroidElement;
 */
// Funzione che genera il Modale con il carosello (Di fatto sceglie l'immagine da mostrare e aggiorna il carouselIndex per sapere su che immagine ci troviamo)
function generateModal(polaroidElement) {
    if (dom.modalEl && polaroidElement) {                                                               // Controlliamo che esista il nostro modale
                                                                                                        // e il polaroidElement che ci è stato passato
        const modalImage = dom.modalEl.querySelector("img");                                            // Andiamo a recuperarci l'immagine dentro al modale 
        const targetImage = polaroidElement.querySelector("img");                                       // Andiamo a recuperarci l'immagine del polaroidElement
        const index = polaroidElement.dataset.index;                                                    // Andiamo a recuperarci l'indice che questo polaroidElement ha salvato
                                                                                                        // Che sarebbe l'indice dell'oggetto corrispondente nell'array polaroidObjects
        if (modalImage && targetImage instanceof HTMLImageElement && typeof (index) === "string") {     // Se questi elementi esistono e targetImage è un HTMLImageElement e index 
                                                                                                        // è una stringa
            carouselIndex = parseInt(index);                                                            // Allora aggiorna carouselIndex all'index corrente
            modalImage.src = targetImage.src;                                                           // E aggiorna la src dell'immagine del modale in modo che sia la stessa
                                                                                                        // dell'immagine all'interno di polaroidElement (che poi sarebbe quella cliccata)
        }
    }
}

/**
 * @type {EventListener}
 * @param {{target:?HTMLElement}} event;
 */

// Funzione che gestisce tutti i bottoni del carosello (quindi next, prev e close)
function carouselBtnHandler(event) {
    const target = event.target?.closest("button");                 // Andiamo a selezionare come target, il closest button a ciò che ha scatenato l'evento di click
    if (dom.modalEl && target) {                                    // Se il target esiste e il modalEl esiste
        if (target.classList.contains("carousel-prev")) {           // Controlliamo la classlist del target, se contiene carousel-prev
            carouselPrev();                                         // Chiamiamo la funzione che ci fa andare indietro nel carosello
        }
        else if (target.classList.contains("carousel-next")) {      // Altrimenti se contiene carousel-next
            carouselNext();                                         // Chiamiamo la funzione che ci fa andare avanti nel carosello
        }
        else if (target.classList.contains("modal-close")) {        // Altrimenti se contiene modal-close
            closeModal();                                           // Chiamiamo la funzione che chiude tutti i modali
        }
    }
}

// Funzione che ci fa andare avanti nel carosello
function carouselNext() {   
    if (!dom.modalEl) {                                             // Innanzitutto se non esiste il modale nel dom, ritorna
        return;
    }
    carouselIndex++;                                                // Incrementa il carouselIndex
    if (carouselIndex >= polaroidObjects.length) {                  // Se va oltre il lastIndex di polaroidObjects
        carouselIndex = 0;                                          // Resettalo a 0
    }
    const modalImage = dom.modalEl.querySelector("img");            // Recupera il tag immagine dentro al mio modale
    if (modalImage) {                                               // Se esiste
        modalImage.src = polaroidObjects[carouselIndex].imageURL;   // Settagli la src andando a recuperare l'imageURL dell'oggetto polaroidObjects[carouselIndex]
    }
}

// Funzione che ci fa andare indietro nel carosello
function carouselPrev() {
    if (!dom.modalEl) {                                             // Innanzitutto se non esiste il modale nel dom, ritorna
        return;
    }
    carouselIndex--;                                                // Decrementa il carouselIndex
    if (carouselIndex < 0) {                                        // Se esso è inferiore a 0
        carouselIndex = polaroidObjects.length - 1;                 // Resettalo al last index di polaroidObjects
    }
    const modalImage = dom.modalEl.querySelector("img");            // Recupera il tag immagine dentro al mio modale
    if (modalImage) {                                               // Se esiste
        modalImage.src = polaroidObjects[carouselIndex].imageURL;   // Settagli la src andando a recuperare l'imageURL dell'oggeto polaroidObjects[carouselIndex]
    }
}

// Funzione che chiude tutti i modali
function closeModal() {                                                                                                    
    const allModalEls = document.querySelectorAll(".modal");                                // Seleziona tutti gli elementi con classe "modal"
    if (dom.html) {                                                                         // Controlla che esista dom.html
        dom.html.classList.remove("modal-open");                                            // Rimuovigli il tag modal-open (in modo da riabilitare lo scroll)
    }
    allModalEls.forEach(modalElement => { modalElement.classList.remove("is-active"); });   // Poi per ognuno degli elemnti con classe modal rimuovigli la classe "is-active"
}

// Funzione che apre il modale che gestisce l'aggiunta di immagini nuove
function addImageBtnHandler() {
    if (dom.formModal && dom.html) {                // Se esiste il formModal ed esiste dom.html
        dom.formModal.classList.add("is-active");   // Aggiungi is-active a formModal in modo che si apra
        dom.html.classList.add("modal-open");       // Aggiungi modal-open ad html in modo da bloccare lo scroll 
    }
}

// Funzione handler per il "change" del file input (serve in pratica a fare il preview dell'immagine)
function imageUploadInputChangeHandler() {              
    if (dom.polaroidFormEl && dom.imageUploadInputEl instanceof HTMLInputElement) { // Innanzitutto, controlliamo che esista polaroidFormEl e che imageUploadInputEl sia un
                                                                                    // HTMLInputElement
        const thumbnailEl = dom.polaroidFormEl.querySelector("img");                // Poi selezioniamo il tag immagine che diventerà la nostra thumbnail image
        if (thumbnailEl instanceof HTMLImageElement) {                              // Se esso è un HTMLImageElement
            thumbnailEl.classList.remove("is-skeleton");                            // Allora gli togliamo is-skeleton per disabilitare la grafica di skeleton-loader
            const filesArray = dom.imageUploadInputEl.files;                        // Poi recuperiamo l'array di file che provengono da questo inputElement
                                                                                    // In realtà sono abbastanza sicuro che sia 1 solo file sempre nell'array perché non ho messo
                                                                                    // L'attributo "multiple" al tag input di tipo file
            if (filesArray && filesArray.length === 1) {                            // Se l'array esiste e ha lunghezza 1
                uploadedImageUrl = URL.createObjectURL(filesArray[0]);              // Creami l'url per l'immagine uploadata e assegnalo alla variabile globale uploadedImageUrl
                thumbnailEl.src = uploadedImageUrl;                                 // Settami la src della preview thumbnail a questo url che è stato creato        
            }
            else {                                                                  // Altrimenti
                return;                                                             // Esci dalla funzione
            }
        }
    }
}

/**
 * @type {EventListener}
 * @param {Event} event;
 */

// Funzione che fa l'handling del submit della form per aggiungere nuove immagini
function submitPolaroidFormHandler(event) {
    event.preventDefault();                                                                                 // Innanzitutto, preventDefault per togliere il refresh della pagina
    if (!dom.titleInputEl || !dom.dateInputEl || !dom.imageUploadInputEl || !dom.polaroidFormEl) {          // Poi controlliamo che tutti gli elementi che mi servono esistano
        return;                                                                                             // Se anche solo uno di loro non esiste, mi fai il return
    }
    const [titleSuccess, titleValue] = isValid(dom.titleInputEl.value);                                     // Poi validiamo che l'input del titolo non sia una stringa vuota 
                                                                                                            // o di soli spazi
    const [dateSuccess, dateValue] = isValid(dom.dateInputEl.value);                                        // Idem per la data
    const [imageURLSuccess, imageURLValue] = isValid(uploadedImageUrl);                                     // Idem per l'imageURL (che abbiamo settato nell'handler del "change")
    if (!titleSuccess || !dateSuccess || !imageURLSuccess) {                                                // Se anche una sola di queste validazioni fallisce
        return;                                                                                             // Finiamo la funzione
    }

    if(titleValue && dateValue && imageURLValue){                                                       // Controlliamo che esistano tutti i valori recuperati dal validate 
                                                                                                        // perché jsDoc sennò fa i capricci
        const convertedDateValue = getDate(dateValue);                                                  // A questo punto chiamo la funzione getDate sulla mia string dateValue 
                                                                                                        // Lei mi restituisce un oggetto di tipo Date
        const formattedDateValue = convertedDateValue.toLocaleDateString("it-IT").replaceAll("/", "-"); // Io lo riconverto in stringa localizzata IT e rimpiazzo i separatori / con -
        const newPolaroid = {                                                                           // Creo un nuovo oggetto newPolaroid
            id: (polaroidObjects[polaroidObjects.length - 1].id + 1),                                   // Il cui id sarà uguale all'id dell'ultimo oggetto polaroid in polaroidObjects + 1
            index: polaroidObjects.length,                                                              // L'indice sarà proprio la lunghezza attuale di polaroidObjects
            imageURL: imageURLValue,                                                                    // L'imageURL sarà quello recuperato dal "change" handler e salvato nella variabile globale
            title: titleValue,                                                                          // Il titolo è recuperato dall'input
            date: formattedDateValue                                                                    // E la data sarà sempre quella recuperata dall'input ma formattata
        }
        polaroidObjects.push(newPolaroid);                                                              // Aggiungo questa nuova polaroid all'array polaroidObjects
        createPolaroid(newPolaroid);                                                                    // E chiamo createPolaroid che me la creerà come HTMLElement e la aggiungerà al wall
        dom.titleInputEl.value = "";                                                                    // Resetto la field del titolo
        dom.dateInputEl.value = "";                                                                     // Resetto la field della data
        dom.imageUploadInputEl.value = "";                                                              // Resetto la scritta affianco al tasto scegli file
        const previewImage = dom.polaroidFormEl.querySelector("img");                                   // Seleziono la previewImage
        if(previewImage){                                                                               // Se essa esiste
            previewImage.src = placeholderImageURL;                                                     // Resetto la sua src all'immagine placeholder iniziale
        }
        closeModal();                                                                                   // Chiudo tutti i modali per uscire dalla schermata per aggiungere immagini
    }

    
}

/**
 * @param {string} string
 * @return {[boolean,?string]}
 */
// Funzione che valida le stringhe
function isValid(string) {                                                                      
    const sanifiedString = string.trim();                                               // Mi crea una prima stringa sanificata togliendo gli spazi
    return ((sanifiedString === "") ? [false, null] : [true, sanifiedString]);          // Se la stringa sacrificata è vuota allora restituisce [false, null] altrimenti [true, stringaSanificata]
}

/**
 * @param {string} dateString
 */
// Funzione che crea il mio oggetto Date partendo da una stringa
function getDate(dateString){
    return new Date(dateString);       // Semplicemente sfrutta il costruttore dell'oggetto Date, perché tanto la stringa è recuperata da un input di type = date quindi non mi
                                       // Devo preoccupare di stare a fare strane sanificazioni di formato o cose simili
}