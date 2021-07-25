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

let finalResult; /* Search final result */
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
    productInstallments.innerText = '';
	if (userQuery !== undefined && userQuery !== '') {
		console.log(userQuery);
		showResults();
	}
	inputBrowser.value = '';
});

async function showResults() {
	await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${userQuery}`)
		.then((response) => response.json())
		.then((json) => {
			let results = json.results;
			// results.forEach((result) => {
			// 	console.log(result.title);
			// });
			for (let i = 0; i < results.length; i++) {
				finalResult = results[0];
				title = finalResult.title;
				link = finalResult.permalink;
				image = finalResult.thumbnail;
				price = finalResult.price;
				if (finalResult.installments !== null) {
					installmentsAmount = `En ${finalResult.installments.quantity} cuotas de $${finalResult.installments.amount}`;
					productInstallments.innerText = `${installmentsAmount}`;
				}
			}
			console.log(finalResult);
			console.log(title, link, image, price, installmentsAmount);
		});
	await fetch(`https://api.mercadolibre.com/items/${finalResult.id}/description`)
		.then((response) => response.json())
		.then((json) => {
			description = json.plain_text;
			console.log(description);
		});
	drawTheBestProduct();
}

function drawTheBestProduct() {
	productInformation.style.display = 'block';
	productImageLink.href = `${link}`;
	productImage.src = `${image}`;
	productTitle.innerText = `${title}`;
	productPrice.innerText = `$${price}`;
	productDescriptionParagraph.innerText = `${description}`;
}
