var PokeLib;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/resources/js/components/api.js":
/*!********************************************!*\
  !*** ./app/resources/js/components/api.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   api: () => (/* binding */ api)
/* harmony export */ });
class api
{
    constructor() {
        this.apiBaseUrl = 'https://pokeapi.co/api/v2';
        this.allPokemons = [];
        this.offset = 0;
        this.hideLoadMore = false;
        this.textFilter = false;
        this.typeListFilter = {};
        this.colorListFilter = {};
        this.genderFilter = false;
    }

    fetchPokemons = async function(limit = 20) {

        let self = this;

        try {

            // in case of not having pokemons, lets get them
            if(!self.allPokemons.length){
                const response = await fetch(`${self.apiBaseUrl}/pokedex/national`);
                if (!response.ok) {
                    throw new Error('Failed to fetch pokemons');
                }
                const data = await response.json();

                // Store all Pokemon data in memory and also order them by the entry_number
                self.allPokemons = data.pokemon_entries.sort((a, b) => parseInt(a.entry_number) - parseInt(b.entry_number));
            }

            // lets prepare the response
            let responseList = []
            if(self.allPokemons){

                let remainingPokemons = self.allPokemons;

                // Filter by text
                if(self.textFilter){
                    remainingPokemons = remainingPokemons.filter(pokemon => {
                        // Check if the Pokemon name or ID matches the search term
                        return pokemon.pokemon_species.name.toLowerCase().includes(self.textFilter.toLowerCase()) ||
                            pokemon.entry_number.toString() === self.textFilter.trim();
                    });
                }

                // Filter by selected types
                if (Object.keys(self.typeListFilter).length) {
                    try {
                        // Fetch positble pokémons names considering type filter
                        const pokemonNames = await self.fetchPokemonNamesByTypes();

                        // In case of not haveing this pokemon we will remove it
                        remainingPokemons = remainingPokemons.filter(pokemon => pokemonNames.includes(pokemon.pokemon_species.name));

                    } catch (error) {
                        console.error('Error fetching Pokemon names filtering by type:', error);
                    }
                }

                // Filter by selected colors
                if (Object.keys(self.colorListFilter).length) {
                    try {
                        // Fetch positble pokémons names considering type filter
                        const pokemonNames = await self.fetchPokemonNamesByColors();

                        // In case of not haveing this pokemon we will remove it
                        remainingPokemons = remainingPokemons.filter(pokemon => pokemonNames.includes(pokemon.pokemon_species.name));

                    } catch (error) {
                        console.error('Error fetching Pokemon names filtering by type:', error);
                    }
                } 

                // Filter by selected gender
                if (self.genderFilter) {
                    try {
                        // Fetch positble pokémons names considering type filter
                        const pokemonNames = await self.fetchPokemonNamesByGender();

                        // In case of not haveing this pokemon we will remove it
                        remainingPokemons = remainingPokemons.filter(pokemon => pokemonNames.includes(pokemon.pokemon_species.name));

                    } catch (error) {
                        console.error('Error fetching Pokemon names filtering by type:', error);
                    }
                }        

                // Sorting by entry_number and returning the required elements
                responseList = remainingPokemons.slice(self.offset, self.offset + limit);

                // save the new offset
                self.offset += responseList.length;

                // determine if we have to hide the button
                if(self.offset >= remainingPokemons.length){
                    self.hideLoadMore = true;
                }else{
                    self.hideLoadMore = false;
                }
            }

            return responseList;

        } catch (error) {
            console.error('Error fetching pokemons:', error);
            throw error;
        }
    }

    fetchPokemonDetails = async function (url) {

        let self = this;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch pokemon details');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching pokemon details:', error);
            throw error;
        }
    }

    setTextfilterPokemons = async function (text) {
        
        let self = this;

        self.textFilter = (text) ? text: false;
        self.offset = 0;
    }

    setTypefilterPokemons = async function (typeList) {
        
        let self = this;

        self.typeListFilter = (Object.keys(typeList).length) ? typeList: false;
        self.offset = 0;
    }

    setColorfilterPokemons = async function (colorList) {
        
        let self = this;

        self.colorListFilter = (Object.keys(colorList).length) ? colorList: false;
        self.offset = 0;
    }

    setGenderfilterPokemons = async function (gender) {
        
        let self = this;

        self.genderFilter = (gender) ? gender: false;
        self.offset = 0;
    }

    fetchPokemonNamesByTypes = async function () {
        
        let self = this;

        let pokemonSpeciesNames = [];

        for(let key in self.typeListFilter){
            const url = self.typeListFilter[key];

            try {
                // Fetch data from the provided URL
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();

                // Extract Pokemon species names
                pokemonSpeciesNames = pokemonSpeciesNames.concat(data.pokemon.map(pokemon => pokemon.pokemon.name));

            } catch (error) {
                console.error('Error fetching Pokemon species names:', error);
                throw error;
            }            
        }

        return pokemonSpeciesNames;
    }

    fetchPokemonNamesByColors = async function () {
        
        let self = this;

        let pokemonSpeciesNames = [];

        for(let key in self.colorListFilter){
            const url = self.colorListFilter[key];

            try {
                // Fetch data from the provided URL
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();

                // Extract Pokemon species names
                pokemonSpeciesNames = pokemonSpeciesNames.concat(data.pokemon_species.map(pokemon => pokemon.name));

            } catch (error) {
                console.error('Error fetching Pokemon species names:', error);
                throw error;
            }            
        }

        return pokemonSpeciesNames;
    }

    fetchPokemonNamesByGender = async function () {
        
        let self = this;
        
        const url = self.genderFilter;

        try {
            // Fetch data from the provided URL
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            // Extract Pokemon species names
            return data.pokemon_species_details.map(pokemon => pokemon.pokemon_species.name);

        } catch (error) {
            console.error('Error fetching Pokemon species names:', error);
            throw error;
        }
    }
}

/***/ }),

/***/ "./app/resources/js/components/documentReady.js":
/*!******************************************************!*\
  !*** ./app/resources/js/components/documentReady.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   documentReady: () => (/* binding */ documentReady)
/* harmony export */ });
class documentReady
{
	constructor() {
		
		let self = this;

		// generate the necessary variables
		self.apiObj = false;
		self.productObj = false;
		self.searchObj = false;
		self.filterObj = false;
		self.loadMore = false;
		self.cleanBtn = false;

		// Initialize the app when the document is ready
		document.addEventListener('DOMContentLoaded', self.initializeApp.bind(event, self), false)
	}

	// Call this function when the document is ready
	initializeApp = async function (self, event) {

		try {
			// initialize the objects
			self.apiObj = new PokeLib.api;
			self.productObj = new PokeLib.product;

	        // Handle the load more click
			self.loadMore = document.querySelector('.product-container .load-more');
			self.loadMore.addEventListener('click', self.showProducts.bind(event, self), false);

			// show first 20 prodicts
			await self.showProducts(self, event);

			// show filters
			self.filterObj = new PokeLib.filter(self.apiObj, self.productObj, self.loadMore);
			self.filterObj.populateFilters();		

	        // Handle the clean btn click
			self.cleanBtn = document.querySelector('aside.filters .clean-btn');
			self.cleanBtn.addEventListener('click', self.filterObj.cleanFilters.bind(event, self.filterObj), false);

			// initialize the searhcer
			self.searchObj = new PokeLib.search(self.apiObj, self.productObj, self.loadMore);

		} catch (error) {
			console.error('Error initializing app:', error);
		}
	}

	// first time or show more has been clicked
	showProducts = async function (self, event) {
		
		try {
			// Fetch initial data when the app loads
			const pokemons = await self.apiObj.fetchPokemons();

			// once we have pokemons, lets show them
			if(pokemons.length){
				self.productObj.renderPokemonList(pokemons);
			}

			// hide the load more btn
			if(self.apiObj.hideLoadMore){
				self.loadMore.classList.add('d-none');
			}else{
				self.loadMore.classList.remove('d-none');
			}
		} catch (error) {
			console.error('Error showing products:', error);
		}
	}
}

/***/ }),

/***/ "./app/resources/js/components/filter.js":
/*!***********************************************!*\
  !*** ./app/resources/js/components/filter.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   filter: () => (/* binding */ filter)
/* harmony export */ });
class filter
{
    constructor(apiObj, productObj, loadMore) {
        this.apiObj = apiObj;
        this.productObj = productObj;
        this.loadMore = loadMore;
        this.allTypes = [];
        this.allColors = [];
        this.allGenders = [];
        this.apiBaseUrl = 'https://pokeapi.co/api/v2';
        this.selectorType = document.querySelector('aside.filters #type .accordion-body > .row');
        this.selectorGender = document.querySelector('aside.filters #gender .accordion-body > .row');
        this.selectorColor = document.querySelector('aside.filters #color .accordion-body > .row');
        this.cleanBtn = document.querySelector('aside.filters .clean-btn');
        this.selectedTypes = {};
        this.selectedColors = {};
        this.selectedGender = false;
    }

    // Function to fetch types from the API
    fetchTypes = async function () {

        let self = this;

        try {
            const response = await fetch(`${self.apiBaseUrl}/type`);
            if (!response.ok) {
                throw new Error('Failed to fetch types');
            }

            const data = await response.json();

            return await data.results;

        } catch (error) {
            console.error('Error fetching types:', error);
            throw error;
        }
    }

    // Function to fetch colors from the API
    fetchColors = async function () {

        let self = this;

        try {
            const response = await fetch(`${self.apiBaseUrl}/pokemon-color`);
            if (!response.ok) {
                throw new Error('Failed to fetch colors');
            }

            const data = await response.json();

            return await data.results;

        } catch (error) {
            console.error('Error fetching colors:', error);
            throw error;
        }
    }

    // Function to fetch genders from the API
    fetchGenders = async function () {

        let self = this;

        try {
            const response = await fetch(`${self.apiBaseUrl}/gender`);
            if (!response.ok) {
                throw new Error('Failed to fetch genders');
            }

            const data = await response.json();

            return await data.results;

        } catch (error) {
            console.error('Error fetching genders:', error);
            throw error;
        }
    }

    // Function to populate filter options with fetched data
    populateFilters = async function () {

        let self = this;

        try {
            // Fetch types, colors, and genders from the API
            self.allTypes = await self.fetchTypes();
            self.allColors = await self.fetchColors();
            self.allGenders = await self.fetchGenders();

            // Populate filter options with fetched data
            self.generateTypeFilter(self.allTypes);
            self.generateColorFilter(self.allColors);
            self.generateGenderFilter(self.allGenders);


        } catch (error) {
            console.error('Error populating filters:', error);
        }
    }

    // Function to generate the type filter
    generateTypeFilter = function (items) {
        let self = this;

        // sort them by name
        items.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        items.forEach(item => {
            const filterItem = self.generateFilterTypeItem(item.name);
            self.selectorType.appendChild(filterItem);
        });
    }

    // Function to generate the type filter items
    generateFilterTypeItem = function (name) {

        let self = this;

        const col = document.createElement('div');
        col.classList.add('col-md-6');

        const filterItem = document.createElement('div');
        filterItem.classList.add('form-check', 'd-flex', 'align-items-center');

        const input = document.createElement('input');
        input.classList.add('form-check-input', 'me-2');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('id', name);
        input.setAttribute('value', name);
        input.addEventListener('input', async(e) => {

            if(e.target.checked){
                if(typeof self.selectedTypes[e.target.value] === 'undefined'){
                    const found = self.allTypes.find(type => type.name === e.target.value);
                    if(found){
                        self.selectedTypes[e.target.value] = found.url;
                    }
                }
            }else{
                // Remove the value from selectedTypes if unchecked
                if(typeof self.selectedTypes[e.target.value] !== 'undefined'){
                    delete self.selectedTypes[e.target.value];
                }
            }

            // update the selected types in the list
            self.apiObj.setTypefilterPokemons(self.selectedTypes);
            
            // update the pokemon list
            await self.updatePokemonList();
        });

        const label = document.createElement('label');
        label.classList.add('form-check-label', 'd-flex', 'align-items-center');
        label.setAttribute('for', name);

        const nameLabel = document.createElement('span');
        nameLabel.classList.add('text-capitalize');
        nameLabel.textContent = name;

        label.appendChild(nameLabel);

        filterItem.appendChild(input);
        filterItem.appendChild(label);

        col.appendChild(filterItem);

        return col;
    }

    // Function to generate the color filter
    generateColorFilter = function (items) {

        let self = this; 

        // sort them by name
        items.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        items.forEach(item => {
            const filterItem = self.generateFilterColorItem(item.name);
            self.selectorColor.appendChild(filterItem);
        });
    }

    // Function to generate the color filter items
    generateFilterColorItem = function (name) {

        let self = this; 

        const col = document.createElement('div');
        col.classList.add('col-md-6');

        const filterItem = document.createElement('div');
        filterItem.classList.add('form-check', 'form-check-color', 'position-relative', 'd-flex', 'align-items-center');

        const input = document.createElement('input');
        input.classList.add('form-check-input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('id', name);
        input.setAttribute('value', name);
        input.addEventListener('input', async(e) => {

            if(e.target.checked){
                if(typeof self.selectedColors[e.target.value] === 'undefined'){
                    const found = self.allColors.find(type => type.name === e.target.value);
                    if(found){
                        self.selectedColors[e.target.value] = found.url;
                    }
                }
            }else{
                // Remove the value from selectedColors if unchecked
                if(typeof self.selectedColors[e.target.value] !== 'undefined'){
                    delete self.selectedColors[e.target.value];
                }
            }

            // update the selected types in the list
            self.apiObj.setColorfilterPokemons(self.selectedColors);
            
            // update the pokemon list
            await self.updatePokemonList();
        });

        const colorDiv = document.createElement('div');
        colorDiv.classList.add('color-element', 'rounded-1', 'shadow');
        colorDiv.style.backgroundColor = name;
        colorDiv.addEventListener('click', () => {
            // Create and dispatch a click event for the input element
            input.checked = !input.checked;

            const clickEvent = new Event('input');
            input.dispatchEvent(clickEvent);
        });

        const label = document.createElement('label');
        label.classList.add('form-check-label', 'ms-2', 'text-capitalize');
        label.setAttribute('for', name);

        const nameLabel = document.createElement('span');
        nameLabel.classList.add('text-capitalize');
        nameLabel.textContent = name;

        label.appendChild(nameLabel);

        filterItem.appendChild(input);
        filterItem.appendChild(colorDiv);
        filterItem.appendChild(label);

        col.appendChild(filterItem);

        return col;
    }

    // Function to generate the gender filter
    generateGenderFilter = function (items) {

        let self = this; 

        // sort them by name
        items.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        items.forEach(item => {
            const filterItem = self.generateFilterGenderItem(item.name);
            self.selectorGender.appendChild(filterItem);
        });
    }

    // Function to generate the gender filter items
    generateFilterGenderItem = function (name) {

        let self = this;

        const col = document.createElement('div');
        col.classList.add('col-12');

        const filterItem = document.createElement('div');
        filterItem.classList.add('form-check');

        const input = document.createElement('input');
        input.classList.add('form-check-input', 'form-check-label', 'd-flex');
        input.setAttribute('type', 'radio');
        input.setAttribute('id', name);
        input.setAttribute('value', name);
        input.setAttribute('name', 'filter_gender');
        input.addEventListener('input', async(e) => {

            if(e.target.checked){
                self.selectedGender = self.allGenders.find(type => type.name === e.target.value);
            }

            // update the selected types in the list
            self.apiObj.setGenderfilterPokemons(self.selectedGender.url);
            
            // update the pokemon list
            await self.updatePokemonList();
        });

        const label = document.createElement('label');
        label.classList.add('align-items-center', 'ms-2');
        label.setAttribute('for', name);

        const nameLabel = document.createElement('span');
        nameLabel.classList.add('text-capitalize');
        nameLabel.textContent = name;

        label.appendChild(nameLabel);

        filterItem.appendChild(input);
        filterItem.appendChild(label);

        col.appendChild(filterItem);

        return col;
    }

    updatePokemonList = async function(){

        let self = this;

        let newPokemons = await self.apiObj.fetchPokemons();

        // clean the product list
        self.productObj.cleanProductsList();

        // add again the filtered data
        self.productObj.renderPokemonList(newPokemons);

        // hide the load more btn
        if(self.apiObj.hideLoadMore){
            self.loadMore.classList.add('d-none');
        }else{
            self.loadMore.classList.remove('d-none');
        }
    }

    cleanFilters = async function (self, event) {
        
        // clean the object
        
        // update the selected filters to nothing
        self.apiObj.setTypefilterPokemons({});
        self.apiObj.setColorfilterPokemons({});
        self.apiObj.setGenderfilterPokemons(false);

        // clean the UI
        self.selectorType.querySelectorAll('input').forEach(item => {
            item.checked = false;
        });
        self.selectorColor.querySelectorAll('input').forEach(item => {
            item.checked = false;
        });
        const genderInput = self.selectorGender.querySelector('input:checked');
        if(genderInput){
            genderInput.checked = false;
        }


        await self.updatePokemonList();
    }
}

/***/ }),

/***/ "./app/resources/js/components/product.js":
/*!************************************************!*\
  !*** ./app/resources/js/components/product.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   product: () => (/* binding */ product)
/* harmony export */ });
class product
{
    constructor() {
        this.selector = document.querySelector('.product-container .product-list');
    }

    // Function to render a single Pokemon item
    renderPokemonProduct = function (pokemon) {

        let self = this;

        // Create a list item element
        const productContainer = document.createElement('div');
        productContainer.classList.add('col');

        // Create a list item element
        const product = document.createElement('div');
        product.classList.add('card', 'bg-light', 'shadow', 'rounded-4');
        product.setAttribute('data-entry-number', pokemon.entry_number);
        product.addEventListener('click', self.openProductDetails.bind(event, self), false);
        productContainer.appendChild(product);

        // Create an image element for the Pokemon
        const img = document.createElement('img');
        img.classList.add('card-img-top');
        img.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.entry_number.toString().padStart(3, '0')}.png`;
        img.alt = pokemon.pokemon_species.name;
        product.appendChild(img);

        // Create the card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'text-center', 'pt-2', 'pb-3');
        product.appendChild(cardBody);

        // Create a h5 element for the Pokemon name
        const nameH5 = document.createElement('h5');
        nameH5.classList.add('h3', 'mb-0');
        nameH5.textContent = pokemon.pokemon_species.name;
        cardBody.appendChild(nameH5);

        // Append the product to the product list
        this.selector.appendChild(productContainer);
    }

    // Function to render the list of Pokemon products
    renderPokemonList = function (pokemons) {

        let self = this;

        // Render each Pokemon in the list
        if(pokemons.length){
            pokemons.forEach(pokemon => {
                self.renderPokemonProduct(pokemon);
            });
        }else{

            // Create the card body
            const infoText = document.createElement('div');
            infoText.classList.add('col-12');
            infoText.textContent = 'No items found...';

            this.selector.appendChild(infoText);
        }
    }

    // Clean the list
    cleanProductsList = function () {
        this.selector.innerHTML = '';
    }

    // Cpen pokemon details
    openProductDetails = async function (self, event) {

        const modal = self.createDetailModal();

        // Append modal to the body
        document.body.appendChild(modal);

        // Open the Bootstrap modal
        const myModal = new bootstrap.Modal(modal);
        myModal.show();

        // Add event listener for modal close event
        myModal._element.addEventListener('hidden.bs.modal', () => {
            // Remove the product details DOM element
            const productDetails = document.querySelector(`modal`);
            productDetails.remove();
        });
    }

    createDetailModal = function () {

        let self = this;

        // Create modal element
        const modal = document.createElement('div');
        modal.classList.add('modal', 'fade');
        modal.id = 'productModal';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-labelledby', 'productModalLabel');
        modal.setAttribute('aria-hidden', 'true');

        // Create modal dialog
        const modalDialog = document.createElement('div');
        modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        modalDialog.appendChild(modalContent);
        modal.appendChild(modalDialog);

        // Create modal header
        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');
        modalContent.appendChild(modalHeader);
        const modalTitle = document.createElement('h5');
        modalTitle.classList.add('modal-title');
        modalTitle.textContent = 'Product Details';
        modalHeader.appendChild(modalTitle);
        const closeButton = document.createElement('button');
        closeButton.classList.add('btn-close');
        closeButton.setAttribute('type', 'button');
        closeButton.setAttribute('data-bs-dismiss', 'modal');
        closeButton.setAttribute('aria-label', 'Close');
        modalHeader.appendChild(closeButton);

        // Create modal body
        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');
        modalBody.innerText = 'Here we would have the product details';
        modalContent.appendChild(modalBody);

        // Create modal footer
        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');
        modalContent.appendChild(modalFooter);
        const closeButtonFooter = document.createElement('button');
        closeButtonFooter.classList.add('btn', 'btn-secondary');
        closeButtonFooter.setAttribute('type', 'button');
        closeButtonFooter.setAttribute('data-bs-dismiss', 'modal');
        closeButtonFooter.textContent = 'Close';
        modalFooter.appendChild(closeButtonFooter);        

        return modal;
    }
}

/***/ }),

/***/ "./app/resources/js/components/search.js":
/*!***********************************************!*\
  !*** ./app/resources/js/components/search.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   search: () => (/* binding */ search)
/* harmony export */ });
class search
{
    constructor(apiObj, productObj, loadMore) {
        this.selector = document.querySelector('header .searcher input');
        this.btnSelector = document.querySelector('header .searcher button');
        this.apiObj = apiObj;
        this.productObj = productObj;
        this.loadMore = loadMore;

        // add the input searcher listener
        this.setInputSearcherListener();
    }

    setInputSearcherListener()
    {
        let self = this;
            
        let intervalTime = 800;
        let typingTimer;            
        self.selector.addEventListener('input', (e) => {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(async function(){

                // add the condition to the filter
                self.apiObj.setTextfilterPokemons(e.target.value);
                let newPokemons = await self.apiObj.fetchPokemons();

                // clean the product list
                self.productObj.cleanProductsList();

                // add again the filtered data
                self.productObj.renderPokemonList(newPokemons);

                // hide the load more btn
                if(self.apiObj.hideLoadMore){
                    self.loadMore.classList.add('d-none');
                }else{
                    self.loadMore.classList.remove('d-none');
                }

            }, intervalTime);
        });

        // handel the clean results
        self.btnSelector.addEventListener('click', (e) => {

            e.preventDefault();
            
            // set the empty value            
            self.selector.value = '';

            // Dispatch an input event programmatically
            const inputEvent = new Event('input', { bubbles: true });
            self.selector.dispatchEvent(inputEvent);
        });
    }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************************!*\
  !*** ./app/resources/js/index.js ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   api: () => (/* reexport safe */ _components_api_js__WEBPACK_IMPORTED_MODULE_0__.api),
/* harmony export */   filter: () => (/* reexport safe */ _components_filter_js__WEBPACK_IMPORTED_MODULE_3__.filter),
/* harmony export */   product: () => (/* reexport safe */ _components_product_js__WEBPACK_IMPORTED_MODULE_1__.product),
/* harmony export */   search: () => (/* reexport safe */ _components_search_js__WEBPACK_IMPORTED_MODULE_2__.search)
/* harmony export */ });
/* harmony import */ var _components_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/api.js */ "./app/resources/js/components/api.js");
/* harmony import */ var _components_product_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/product.js */ "./app/resources/js/components/product.js");
/* harmony import */ var _components_search_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/search.js */ "./app/resources/js/components/search.js");
/* harmony import */ var _components_filter_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/filter.js */ "./app/resources/js/components/filter.js");
/* harmony import */ var _components_documentReady_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/documentReady.js */ "./app/resources/js/components/documentReady.js");







// fire the app
const app = new _components_documentReady_js__WEBPACK_IMPORTED_MODULE_4__.documentReady();

// we have to export the classes in order to be accessible from the view

})();

PokeLib = __webpack_exports__;
/******/ })()
;