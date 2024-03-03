export class documentReady
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