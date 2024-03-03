export class product
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