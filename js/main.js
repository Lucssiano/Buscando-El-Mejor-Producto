// --- A way to simplify the selectors to avoid writing them every time i need it --- //
function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}
// ------------------------------------- //

const browserForm = $('.search-form'); /* Form */
const buttonForm = $('.find-product');
let inputBrowser = $('.browser-input');
let userQuery; /* What the user types */

const productInformation = $('.product__information');
const productImageLink = $('.product__image');
const productImage = $('.product__image img');
const productTitle = $('.product__title');
const productPrice = $('.product__price');
const productInstallments = $('.product__installments');
const productDescriptionParagraph = $('.product__description-paragraph');

let description; /* Description of the product */
let title; /* Title of the product */
let link; /* Link of the product */
let image; /* Image of the product */
let price; /* Price of the product */
let installmentsAmount; /* Installments of the product  */

inputBrowser.addEventListener('input', (e) => {
	userQuery = e.target.value;
	console.log(userQuery);
});

buttonForm.addEventListener('click', (e) => {
	e.preventDefault();
	if (userQuery !== undefined && userQuery !== '') {
		showResults();
	}
	inputBrowser.value = '';
});

let prices = []; /* All the product's prices founded */
let bestPrice; /* The best price of the product's prices founded */
let results; /* Products coincidences with the user query */
let bestProductByPrice; /* The cheapest product */

async function showResults() {
	await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${userQuery}`)
		.then((response) => response.json())
		.then((json) => {
			results = json.results;
			if (results.length === 0) {
				alert('No se han encontrado resultados');
				productInformation.style.display = 'none';
				return false;
			}
			for (const result of results) {
				prices.push(result.price);
			}
			prices.sort((a, b) => {
				return a - b;
			});
			for (let i = 0; i < results.length; i++) {
				bestPrice = results[i].price;
				if (bestPrice === prices[0]) {
					bestProductByPrice = results[i];
					title = bestProductByPrice.title;
					link = bestProductByPrice.permalink;
					image = bestProductByPrice.thumbnail;
					price = bestProductByPrice.price;
				}
			}
		})
		.catch((error) => console.error(error));

	await fetch(`https://api.mercadolibre.com/items/${bestProductByPrice.id}/description`)
		.then((response) => response.json())
		.then((json) => {
			if (results.length === 0) { /* Ver alguna manera para no poner esto otra vez y tirar directamente un error que no ejecute más el código (?) */
				return false;
			}
			description = json.plain_text;
			description !== '' ? (description = json.plain_text) : (description = 'El vendedor no colocó ninguna descripción');
			drawTheBestProduct();
		})
		.catch((error) => console.error(error));
}

function drawTheBestProduct() {
	productInformation.style.display = 'block';
	productImageLink.href = `${link}`;
	productImage.src = `${image}`;
	productTitle.innerText = `${title}`;
	productPrice.innerText = `$${price}`;
	if (bestProductByPrice.installments !== null) {
		installmentsAmount = `En ${bestProductByPrice.installments.quantity} cuotas de $${bestProductByPrice.installments.amount}`;
		productInstallments.innerText = `${installmentsAmount}`;
	}
	productDescriptionParagraph.innerText = `${description}`;
	prices = [];
}

// Se eligió el mejor producto dependiendo si era el más barato

// function noCoincidencesFunction() {
// 	productInformation.style.display = 'none';
// 	title = '';
// 	link = '';
// 	image = '';
// 	price = '';
// 	installmentsAmount = '';
// 	description = '';
// 	productImageLink.href = `${link}`;
// 	productImage.src = `${image}`;
// 	productTitle.innerText = `${title}`;
// 	productPrice.innerText = `$${price}`;
// 	productInstallments.innerText = `${installmentsAmount}`;
// 	console.log(title, link, image, price, installmentsAmount, description);
// }

