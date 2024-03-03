export class api
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