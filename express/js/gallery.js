/* Jewelry card default values */
const FALLBACK_NAME = "Missing name"
const FALLBACK_CIRCUMFERENCE = "?"
const FALLBACK_CIRCUMFERENCE_UNITS = "cm"
const FALLBACK_DESCRIPTION = "Missing description"
const FALLBACK_CORD = "thread"
const FALLBACK_HIDDEN = false
const FALLBACK_IMAGE = "missing-image.jpg"
const FALLBACK_PRICE = 0
const FALLBACK_PRICE_DELIMITER = "$"
const FALLBACK_PRICE_UNITS = "USD"
const FALLBACK_PRIORITY = 100

/* Art card HTML template */
const ART_CARD_HTML = 
'<div class="card mb-3" style="min-height: 400px; max-width: 500px;">\
    <div class="ms-1">\
        <div class="my-1">\
            <img src="img/[[image]]" class="img-fluid rounded gallery-img pe-1" alt="[[description]]" data-bs-toggle="tooltip" data-bs-placement="auto" data-bs-html="true" title="<img class=\'img-thumbnail\' src=\'img/[[image_blowup]]\'  alt=\'[[description]]\'>">\
        </div>\
        <div class="">\
            <div class="card-body">\
                <h5 class="card-title mb-0 mt-auto text-wrap">[[name]]<span class="fw-light text-muted">&nbsp;&nbsp;&copy; Sky J</span></h5>\
                <p class="card-text fst-italic mt-2">[[description]]</p>\
            </div>\
        </div>\
    </div>\
</div>'

/* Jewelry card pill HTML template */
const CARD_HTML_PRICE_PILL = `<span class="badge rounded-pill bg-primary" data-bs-toggle="tooltip" data-bs-placement="auto" title="Available for [[price_delimiter]][[price]], not including shipping">[[price_delimiter]][[price]]</span>`
const CARD_HTML_NOT_FOR_SALE_PILL = `<span class="badge rounded-pill bg-secondary" data-bs-toggle="tooltip" data-bs-placement="auto" title="Not for sale / Out of stock">N/A</span>`

/* Jewelry card HTML template */
const JEWELRY_CARD_HTML = 
'<div class="card mb-3" style="max-width: 600px;">\
    <div class="row g-0 ms-1">\
        <div class="col-md my-1">\
            <img src="img/[[image]]" class="img-fluid rounded gallery-img pe-1" alt="[[description]]" data-bs-toggle="tooltip" data-bs-placement="auto" data-bs-html="true" title="<img class=\'img-thumbnail\' src=\'img/[[image_blowup]]\'  alt=\'[[description]]\'>">\
        </div>\
        <div class="col-md-6">\
            <div class="card-body">\
                <div class="d-flex justify-content-between">\
                    <h5 class="card-title mb-0 mt-auto text-wrap">[[name]]</h5>\
                    <h3 class="m-0 p-0">\
                        [[price_pill]]\
                    </h3>\
                </div>\
                <p class="card-text mt-2">[[description]]</p>\
                <p class="card-text mb-0"><small class="text-secondary">Size: [[circumference_cm]] cm ([[circumference_in]] inches) <sup class="badge rounded-pill bg-info font-monospace text-dark" data-bs-toggle="tooltip" data-bs-placement="right" title="Circumference not including clasp(s)">?</sup></small></p>\
                <p class="card-text mb-0"><small class="text-secondary text-capitalize">Cord: [[cord]]</small></p>\
            </div>\
        </div>\
    </div>\
</div>'

/* List of Art cards */
let artCards = []
/* List of Jewelry cards */
let jewelryCards = []

/* Base Card class */
class Card {
    constructor(json) {
        this.name = json.name || FALLBACK_NAME
        this.description = json.description || FALLBACK_DESCRIPTION
        this.hidden = json.hidden || FALLBACK_HIDDEN
        this.image = json.image || FALLBACK_IMAGE
        this.image_blowup = json.image_blowup || json.image || FALLBACK_IMAGE
        this.priority = json.priority || FALLBACK_PRIORITY
    }
}

/* Art card with any custom attributes */
class ArtCard extends Card {
    constructor(json) {
        super(json)
    }
}

/* Jewelry card with any custom attributes */
class JewelryCard extends Card {
    constructor(json) {
        super(json)
        this.circumference_cm = json.circumference || FALLBACK_CIRCUMFERENCE
        this.circumference_in = !isNaN(json.circumference) ? (json.circumference / 2.54).toFixed(1) : FALLBACK_CIRCUMFERENCE
        this.cord = json.cord || FALLBACK_CORD
        this.price = json.price || FALLBACK_PRICE
        this.for_sale = json.price != null
        this.price_delimiter = json.price_delimiter || FALLBACK_PRICE_DELIMITER
        this.price_units = json.price_units || FALLBACK_PRICE_UNITS
    }
}

/* Iterates nodes and creates Bootstrap tooltips for tooltip elements */
let enableTooltips = function() { 
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

/* Constructs an element based on the given card and appends a sibling element to the given node */
let injectArtCard = function(node, card) {
    let siblingHtml = ART_CARD_HTML.slice(0, ART_CARD_HTML.length)
        .replaceAll('[[name]]', card.name)
        .replaceAll('[[description]]', card.description)
        .replaceAll('[[image]]', card.image)
        .replaceAll('[[image_blowup]]', card.image_blowup)
    node.insertAdjacentHTML('afterend', siblingHtml)
}

/* Constructs an element based on the given card and appends a sibling element to the given node */
let injectJewelryCard = function(node, card) {
    let siblingHtml = JEWELRY_CARD_HTML.slice(0, JEWELRY_CARD_HTML.length)
        .replace('[[price_pill]]', card.for_sale ? CARD_HTML_PRICE_PILL : CARD_HTML_NOT_FOR_SALE_PILL)
        .replaceAll('[[name]]', card.name)
        .replaceAll('[[circumference_cm]]', card.circumference_cm)
        .replaceAll('[[circumference_in]]', card.circumference_in)
        .replaceAll('[[cord]]', card.cord)
        .replaceAll('[[description]]', card.description)
        .replaceAll('[[image]]', card.image)
        .replaceAll('[[image_blowup]]', card.image_blowup)
        .replaceAll('[[price]]', card.price)
        .replaceAll('[[price_delimiter]]', card.price_delimiter)
        .replaceAll('[[price_units]]', card.price_units)
    node.insertAdjacentHTML('afterend', siblingHtml)
}

let loadArt = function(json) {
    artCards = []
    for(let i = 0, n = json.length; i < n; i++) {
        artCards.push(new ArtCard(json[i]))
    }
    // Sort cards by name, priority, and sale status
    artCards.sort((a, b) => 1000 * (a.name - b.name) + (a.priority - b.priority))
    // Sort cards by priority
    //cards.sort((a, b) => a.priority - b.priority)
    // Sort cards by for_sale attribute
    //cards.sort((a, b) => b.for_sale - a.for_sale)
    
    // Inject cards into HTML
    for(let i = 0, n = artCards.length; i < n; i++) {
        // skip hidden cards
        if(artCards[i].hidden) {
            continue
        }
        // locate card container
        let container = document.querySelector('#art-card-container>*:last-child')
        if(null == container) {
            console.warn('Failed to load art container node to append siblings')
            break
        }
        // inject HTML into container
        injectArtCard(container, artCards[i])
    }
    console.log('Loaded ' + artCards.length + ' art cards')
}

/* Contructs JewelryCard objects from JSON, sorts them, and injects them into HTML */
let loadJewelry = function(json) {
    jewelryCards = []
    for(let i = 0, n = json.length; i < n; i++) {
        jewelryCards.push(new JewelryCard(json[i]))
    }
    // Sort cards by name, priority, and sale status
    jewelryCards.sort((a, b) => (a.name - b.name))
    jewelryCards.sort((a, b) => a.priority - b.priority)
    jewelryCards.sort((a, b) => b.for_sale - a.for_sale)
    
    // Inject cards into HTML
    for(let i = 0, n = jewelryCards.length; i < n; i++) {
        // skip hidden cards
        if(jewelryCards[i].hidden) {
            continue
        }
        // locate card container
        let container = document.querySelector('#jewelry-card-container>*:last-child')
        if(null == container) {
            console.warn('Failed to load jewelry container node to append siblings')
            break
        }
        // inject HTML into container
        injectJewelryCard(container, jewelryCards[i])
    }
    console.log('Loaded ' + jewelryCards.length + ' jewelry cards')
}

/* Loads all gallery elements from JSON */
let loadGallery = function (json) {
    console.log('Loading gallery from JSON...')
    // load art cards from JSON
    if(json.hasOwnProperty('art')) {
        loadArt(json.art)
    }
    // load jewelry cards from JSON
    if(json.hasOwnProperty('jewelry')) {
        loadJewelry(json.jewelry)
    }
    // enable tooltips
    enableTooltips()
    
}

/* Fetch JSON data and load when the window loads */
window.addEventListener('load', 
    fetch('files/gallery.json')
        .then((response) => response.json())
        .then((json) => loadGallery(json)), 
    false)