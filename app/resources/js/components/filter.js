export class filter
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