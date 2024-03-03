const path = require('path');

module.exports = {
	mode: 'development', // production - reduces more the compilation	
	entry: './app/resources/js/index.js',
	output: {
		filename: 'script.js',
		path: path.resolve(__dirname, 'app/public/js'),
		library: 'PokeLib',
		libraryTarget: 'var'
	},
	devtool: false
};
