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
// let finalResult;
// let description;

inputBrowser.addEventListener('input', (e) => {
	userQuery = e.target.value;
	console.log(userQuery);
});

buttonForm.addEventListener('click', (e) => {
	e.preventDefault();
	if (userQuery !== undefined && userQuery !== '') {
		console.log(userQuery);
		showResults();
	}
});

function showResults() {
	fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${userQuery}`)
		.then((response) => response.json())
		.then((json) => {
			let results = json.results;
			// results.forEach((result) => {
			// 	console.log(result.title);
			// });
			let title;
			let link;
			let image;
			let price;
			let installmentsAmount;
			let finalResult;
			for (let i = 0; i < results.length; i++) {
				finalResult = results[0];
				title = finalResult.title;
				link = finalResult.permalink;
				image = finalResult.thumbnail;
				price = finalResult.price;
				installmentsAmount = `En ${finalResult.installments.quantity} cuotas de $${finalResult.installments.amount}`;
			}
			console.log(finalResult);
			console.log(title, link, image, price, installmentsAmount);
		});
	// await fetch(`https://api.mercadolibre.com/items/${finalResult.id}/description`)
	// 	.then((response) => response.json())
	// 	.then((json) => {
	// 		description = json.plain_text;
	//         console.log(description);
	// 	});
}

// fetch(`https://api.mercadolibre.com/items/MLA902183360/description`)
// 	.then((response) => response.json())
// 	.then((json) => {
// 		console.log(json.plain_text);
// 	});
