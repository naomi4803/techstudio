
const services = {
	website: { name: 'A website that feels like you', price: 450, note: 'Website design & build · starting at' },
	automation: { name: 'Make busywork disappear', price: 180, note: 'Workflow automation · starting at' },
	coaching: { name: 'One-on-one, on your terms', price: 85, note: '60-minute tech session' },
	review: { name: 'Fresh eyes on your tech idea', price: 120, note: 'Tech review · starting at' },
};

const cart = new Map();
const panel = document.querySelector('#cart-panel');
const backdrop = document.querySelector('#cart-backdrop');
const cartCount = document.querySelector('#cart-count');
const cartTitleCount = document.querySelector('#cart-title-count');
const cartItems = document.querySelector('#cart-items');
const cartFooter = document.querySelector('#cart-footer');
const checkoutButton = document.querySelector('#checkout-button');

function openCart() {
	panel.classList.add('open');
	panel.setAttribute('aria-hidden', 'false');
	backdrop.hidden = false;
	document.body.classList.add('cart-open');
	requestAnimationFrame(() => backdrop.classList.add('visible'));
	document.querySelector('#close-cart').focus();
}

function closeCart() {
	panel.classList.remove('open');
	panel.setAttribute('aria-hidden', 'true');
	backdrop.classList.remove('visible');
	document.body.classList.remove('cart-open');
	window.setTimeout(() => { backdrop.hidden = true; }, 250);
	document.querySelector('#open-cart').focus();
}

function updateCart() {
	const count = cart.size;
	cartCount.textContent = count;
	cartTitleCount.textContent = `(${count})`;
	cartFooter.hidden = count === 0;

	if (!count) {
		cartItems.innerHTML = '<div class="empty-cart"><span>✳</span><h3>Your bag is taking a breather.</h3><p>Add a service to start a conversation about what you need.</p><button class="button button-dark" id="browse-services" type="button">Browse services</button></div>';
		document.querySelector('#browse-services').addEventListener('click', () => {
			closeCart();
			document.querySelector('#services').scrollIntoView({ behavior: 'smooth' });
		});
		return;
	}

	cartItems.innerHTML = [...cart.entries()].map(([id, quantity]) => {
		const service = services[id];
		return `<article class="cart-item"><div><h3>${service.name}</h3><p>${service.note}</p></div><div class="cart-item-price"><span>$${service.price}</span><button class="remove-item" type="button" data-remove="${id}" aria-label="Remove ${service.name}">×</button></div></article>`;
	}).join('');

	cartItems.querySelectorAll('[data-remove]').forEach((button) => {
		button.addEventListener('click', () => {
			cart.delete(button.dataset.remove);
			updateCart();
		});
	});

	const message = [...cart.keys()].map((id) => `• ${services[id].name}`).join('%0A');
	checkoutButton.href = `mailto:hello@example.com?subject=Let's%20talk%20tech&body=Hi!%20I'm%20interested%20in:%0A${message}%0A%0ALet's%20talk%20about%20the%20details.`;
}

document.querySelectorAll('[data-service]').forEach((button) => {
	button.addEventListener('click', () => {
		const id = button.dataset.service;
		cart.set(id, 1);
		updateCart();
		openCart();
	});
});

document.querySelector('#open-cart').addEventListener('click', openCart);
document.querySelector('#close-cart').addEventListener('click', closeCart);
backdrop.addEventListener('click', closeCart);
document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && panel.classList.contains('open')) closeCart();
});

updateCart();
