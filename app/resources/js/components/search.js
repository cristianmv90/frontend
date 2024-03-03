export class search
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