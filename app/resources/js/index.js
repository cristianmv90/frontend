
import { api } from './components/api.js';
import { product } from './components/product.js';
import { search } from './components/search.js';
import { filter } from './components/filter.js';
import { documentReady } from './components/documentReady.js';

// fire the app
const app = new documentReady();

// we have to export the classes in order to be accessible from the view
export {
	api,
	product,
	search,
	filter,
};