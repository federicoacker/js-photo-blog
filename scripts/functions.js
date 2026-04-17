// @ts-check
'use strict'

// La nostra funzione che lancia il fetch
function fetchImages() {
    fetch(API_URL)
        .then(response => response.json())                          // Quando risolvi la promessa, allora lancia .json sull'oggetto 
                                                                    // che hai ricevuto e restituisci il json parsato come oggetto (che è quello che fa .json())
        .then(parsedJson => generateList(parsedJson))               // una volta che hai risolto la promessa, e ottenuto l'oggetto 
                                                                    // (che in questo caso è un array di oggetti), 
                                                                    // chiama la funzione generateList
        .catch(responseError => generateError(responseError))       // Se invece ricevi un errore, chiama la generateError
}

/** 
 * @param {{ id: number, title: string, date: string, url: string }[]} jsonObject
*/
// Funzione che genera la lista di polaroid (riceve il nostro oggetto che gli viene dato dal then, come vediamo, è un array di oggetti)
function generateList(jsonObject) {
    setTimeout(() => {                                                              // setTimeout di 5 secondi, messo solo per poter testare gli skeleton loaders di Bulma
        const htmlStringArray = jsonObject.map(object => createPolaroid(object));   // Altrimenti, crea un'array di stringhe html usando la map function 
                                                                                    // sull'array che hai ricevuto dal then
                                                                                    // Per ogni oggetto dell'Array chiami la createPolaroid, 
                                                                                    // dandogli l'oggetto; la stringa che ricevi la metti nell'array
        const htmlString = htmlStringArray.join("");                                // Una volta finito, converti l'array in una grossa stringa
        if (dom.polaroidWallEl) {                                                   // E se il polaroidWall esiste come elemento
            dom.polaroidWallEl.innerHTML = htmlString;                              // Setti il suo innerHTML alla grossa stringa che hai generato
        }
    }, 5 * 1000);

}

/**
 * @param {{ id: number, title: string, date: string, url: string }} polaroidObject
 */

// Funzione che crea la singola polaroid, usa la card di template che ho creato in html e un'oggetto dell'array che gli viene dato poi dalla generateList per creare la stringaHTML
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
 * @param {{message: string, stack: string}} responseError
 */
// Funzione che genera gli errori, riceve l'errore che gli viene dato dalla catch
function generateError(responseError){
    if(dom.errorMessage){                                       // Se esiste l'htmlElement errorMessage nel dom
        const p = dom.errorMessage.querySelector("p");          // Allora seleziona il p al suo interno
        if(p){                                                  // Se il p esiste
            p.textContent = responseError.stack;                // Setta il textContent alla proprietà stack del responseError 
                                                                // (Questo ho visto com'era fatto, facendo console.dir(responseError) nel catch prima)
            dom.errorMessage.classList.remove("d-none");        // Rimuovi la classe d-none dall'errorMessage
        }
    }
}

// Handler per il bottone che chiude l'errorMessage
function removeErrorBtnHandler(){
    if(dom.errorMessage){                                       // Se esiste l'errorMessage come elemento
        dom.errorMessage.classList.add("d-none");               // Aggiungi d-none alla sua classList
    }
}