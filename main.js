import { api } from './api.js';
import { dom } from './dom.js';
import { addToCart, getCartItemCount, getCart, updateCartQuantity, clearCart } from './carrinho.js';

// variavel global que vai receber o json da api
let allCafes = [];

// funnções auxiliares

function updateCartBadge() {
    const cartCount = getCartItemCount(); // pegando a quantidade de itens no carrinho
    const cartBadgeElement = document.getElementById('cart-item-count'); // procura elemento que mostra numero do carrinho
    if (cartBadgeElement) cartBadgeElement.textContent = cartCount; // se existir atualiza
}

function renderCart() {
    const cartBody = document.getElementById('cart-body-content'); // itens carrinho
    const cartFooter = document.getElementById('cart-footer-content'); // finalizar compra
    const cart = getCart();

    cartBody.innerHTML = ''; // limpando pois pode conter html de um render passado
    cartFooter.innerHTML = '';

    if (cart.length === 0) {
        cartBody.innerHTML = '<p>Seu carrinho está vazio.</p>';
        return;
    }

    let total = 0; // somando valor dos produtos

    cart.forEach(cartItem => {
        const cafe = allCafes.find(c => c.id === cartItem.id);
        if (!cafe) return;

        const subtotal = cafe.price * cartItem.quantity; // preço * quantidade
        total += subtotal;

        const itemElement = document.createElement('div'); // cada item vai ter esse html
        itemElement.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-3');

        // retornar assim é muito mais simples
        itemElement.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${cafe.image}" alt="${cafe.title}"
                    style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
                <div>
                    <h6 class="mb-0">${cafe.title}</h6>
                    <small>${cafe.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</small>
                </div>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-secondary" data-id-remove="${cafe.id}">-</button>
                <span class="mx-2">${cartItem.quantity}</span>
                <button class="btn btn-sm btn-outline-secondary" data-id-add="${cafe.id}">+</button>
            </div>
        `;

        cartBody.appendChild(itemElement);
    });

    cartFooter.innerHTML = `
        <h5 class="d-flex justify-content-between">
            <span>Total:</span>
            <span>${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </h5>
        <button class="btn btn-success w-100 mt-2" id="btn-checkout">Finalizar Compra</button>
    `;
}

// finalização da compra usando um modal

// conteudo do modal formulario
function renderCheckoutModal() {
    const modalBody = document.getElementById('checkout-body-content');

    const cart = getCart();

    modalBody.innerHTML = '';

    // se o carrinho estiver vazio
    if (cart.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'Seu carrinho está vazio.';
        modalBody.appendChild(p);
        return;
    }

    let subtotal = 0;

    const row = document.createElement('div');
    row.className = 'row';

    // coluna do formulário
    const colForm = document.createElement('div');
    colForm.className = 'col-md-7';

    const h4Form = document.createElement('h4');
    h4Form.textContent = 'Informações de Entrega';

    const form = document.createElement('form');
    form.id = 'checkout-form';
    form.noValidate = true; // desabilita validação nativa para usar o bootstrap

    // campo endereço
    const address = document.createElement('div');
    address.className = 'mb-3';

    const labelAddress = document.createElement('label');
    labelAddress.className = 'form-label';
    labelAddress.setAttribute('for', 'address');
    labelAddress.textContent = 'Endereço de Entrega';

    const inputAddress = document.createElement('input');
    inputAddress.type = 'text';
    inputAddress.className = 'form-control';
    inputAddress.id = 'address';
    inputAddress.placeholder = 'Rua, Número, Bairro...';
    inputAddress.required = true;

    const feedbackAddress = document.createElement('div');
    feedbackAddress.className = 'invalid-feedback';
    feedbackAddress.textContent = 'Por favor, insira seu endereço.';

    address.appendChild(labelAddress);
    address.appendChild(inputAddress);
    address.appendChild(feedbackAddress);

    // campo pagamento
    const payment = document.createElement('div');
    payment.className = 'mb-3';

    const labelPayment = document.createElement('label');
    labelPayment.className = 'form-label';
    labelPayment.setAttribute('for', 'payment');
    labelPayment.textContent = 'Método de Pagamento';

    const selectPayment = document.createElement('select');
    selectPayment.className = 'form-select';
    selectPayment.id = 'payment';
    selectPayment.required = true;

    // select
    const optionsData = [
        { val: '', text: 'Selecione...' },
        { val: 'cartao', text: 'Cartão' },
        { val: 'pix', text: 'Pix' },
        { val: 'boleto', text: 'Boleto' }
    ];

    optionsData.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.val;
        option.textContent = opt.text;
        selectPayment.appendChild(option);
    });

    const feedbackPayment = document.createElement('div');
    feedbackPayment.className = 'invalid-feedback';
    feedbackPayment.textContent = 'selecione um método de pagamento.';

    payment.appendChild(labelPayment);
    payment.appendChild(selectPayment);
    payment.appendChild(feedbackPayment);

    // monta o formulário
    form.appendChild(address);
    form.appendChild(payment);
    colForm.appendChild(h4Form);
    colForm.appendChild(form);


    // resumo
    const colSummary = document.createElement('div');
    colSummary.className = 'col-md-5';

    const h4Summary = document.createElement('h4');
    h4Summary.textContent = 'Resumo do Pedido';

    const ul = document.createElement('ul');
    ul.className = 'list-group mb-3';

    // loop para criar os itens da lista
    cart.forEach(cartItem => {
        const cafe = allCafes.find(c => c.id === cartItem.id);
        if (cafe) {
            const itemTotal = cafe.price * cartItem.quantity;
            subtotal += itemTotal;

            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';

            // texto do item
            const itemText = document.createTextNode(`${cafe.title} (x${cartItem.quantity})`);

            // preço do item
            const spanPrice = document.createElement('span');
            spanPrice.textContent = itemTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            li.appendChild(itemText);
            li.appendChild(spanPrice);
            ul.appendChild(li);
        }
    });

    // item do total (geral)
    const liTotal = document.createElement('li');
    liTotal.className = 'list-group-item d-flex justify-content-between list-group-item-dark';

    const strongLabel = document.createElement('strong');
    strongLabel.textContent = 'Total';

    const strongValue = document.createElement('strong');
    strongValue.textContent = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    liTotal.appendChild(strongLabel);
    liTotal.appendChild(strongValue);
    ul.appendChild(liTotal);

    colSummary.appendChild(h4Summary);
    colSummary.appendChild(ul);

    // parte final
    row.appendChild(colForm);
    row.appendChild(colSummary);
    modalBody.appendChild(row);
}

async function main() {
    const cafes = await api();

    //allCafes = cafes;

    allCafes = cafes.map(c => ({ ...c, id: Number(c.id) })); //conertendo pra number pois o id da api ta como string

    console.log(allCafes);

    const root = document.getElementById('root'); // la do html

    if (cafes.length === 0) {
        root.innerHTML = `<p class="text-center text-danger">Falha ao carregar os cafés.</p>`;
        return;
    }

    root.innerHTML = '';

    const nav = document.createElement('nav');
    nav.classList.add('navbar', 'navbar-light', 'bg-body-secondary', 'fixed-top');

    const navContainer = document.createElement('div');
    navContainer.classList.add('container', 'd-flex', 'justify-content-between', 'align-items-center');

    const headerTitle = document.createElement('span');
    headerTitle.className = 'navbar-brand mb-0 h1';
    headerTitle.textContent = 'Cafezinhos Quentinhos';

    const cartButton = document.createElement('button');
    cartButton.type = 'button';
    cartButton.classList.add('btn', 'btn-primary');
    cartButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cart"
        viewBox="0 0 16 16">
        <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .485.379L2.89 6H14.5a.5.5 0 0 1 .49.598l-1.5
            7A.5.5 0 0 1 13 14H4a.5.5 0 0 1-.49-.402L1.61 2H.5a.5.5 0 0 1-.5-.5zm3.14 5l1.25
            6h7.22l1.25-6H3.14zM5.5 16a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 0a1.5 1.5 0
            1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
    </svg>
    <span class="ms-1">Carrinho</span>
`;

    cartButton.dataset.bsToggle = 'offcanvas';
    cartButton.dataset.bsTarget = '#cart-offcanvas';

    const cartBadge = document.createElement('span');
    cartBadge.classList.add('badge', 'bg-danger', 'ms-1');
    cartBadge.id = 'cart-item-count';

    const mainElement = document.createElement('main');
    mainElement.classList.add('container', 'mt-5', 'pt-4', 'mb-4');

    const row = document.createElement('div');
    row.className = 'row';

    const cartOffcanvas = document.createElement('div');
    cartOffcanvas.classList.add('offcanvas', 'offcanvas-end');
    cartOffcanvas.tabIndex = -1;
    cartOffcanvas.id = 'cart-offcanvas';
    cartOffcanvas.setAttribute('aria-labelledby', 'cart-offcanvas-label');

    const offcanvasHeader = document.createElement('div');
    offcanvasHeader.className = 'offcanvas-header';
    const offcanvasTitle = document.createElement('h5');
    offcanvasTitle.className = 'offcanvas-title';
    offcanvasTitle.id = 'cart-offcanvas-label';
    offcanvasTitle.textContent = 'Meu Carrinho';
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.dataset.bsDismiss = 'offcanvas';
    closeButton.setAttribute('aria-label', 'Close');
    offcanvasHeader.append(offcanvasTitle, closeButton);

    const offcanvasBody = document.createElement('div');
    offcanvasBody.className = 'offcanvas-body';
    offcanvasBody.id = 'cart-body-content';
    offcanvasBody.innerHTML = '<p>Seu carrinho está vazio.</p>';

    const offcanvasFooter = document.createElement('div');
    offcanvasFooter.className = 'offcanvas-footer p-3 border-top';
    offcanvasFooter.id = 'cart-footer-content';

    cartOffcanvas.append(offcanvasHeader, offcanvasBody, offcanvasFooter);

    const checkoutModal = document.createElement('div');
    checkoutModal.classList.add('modal', 'fade');
    checkoutModal.id = 'checkout-modal';
    checkoutModal.tabIndex = -1;
    checkoutModal.setAttribute('aria-labelledby', 'checkout-modal-label');
    checkoutModal.setAttribute('aria-hidden', 'true');

    const modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog', 'modal-lg');
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    const modalTitle = document.createElement('h5');
    modalTitle.className = 'modal-title';
    modalTitle.id = 'checkout-modal-label';
    modalTitle.textContent = 'Finalizar Compra';
    const modalCloseButton = document.createElement('button');
    modalCloseButton.type = 'button';
    modalCloseButton.className = 'btn-close';
    modalCloseButton.dataset.bsDismiss = 'modal';
    modalCloseButton.setAttribute('aria-label', 'Close');
    modalHeader.append(modalTitle, modalCloseButton);

    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.id = 'checkout-body-content';

    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    const closeFooterButton = document.createElement('button');
    closeFooterButton.type = 'button';
    closeFooterButton.className = 'btn btn-secondary';
    closeFooterButton.dataset.bsDismiss = 'modal';
    closeFooterButton.textContent = 'Cancelar';
    const finalizeButton = document.createElement('button');
    finalizeButton.type = 'button';
    finalizeButton.className = 'btn btn-success';
    finalizeButton.id = 'btn-finalize-order';
    finalizeButton.textContent = 'Finalizar';
    modalFooter.append(closeFooterButton, finalizeButton);

    modalContent.append(modalHeader, modalBody, modalFooter);
    modalDialog.append(modalContent);
    checkoutModal.append(modalDialog);

    cafes.forEach(cafe => row.appendChild(dom(cafe))); // para cada cafe chama dom(cafe) para gerar o card

    cartButton.append(cartBadge);
    navContainer.append(headerTitle, cartButton);
    nav.append(navContainer);
    mainElement.append(row);
    root.append(nav, mainElement, cartOffcanvas, checkoutModal);

    // eventos

    updateCartBadge();

    mainElement.addEventListener('click', e => {
        if (e.target.dataset.id) {
            addToCart(e.target.dataset.id);
            updateCartBadge();
        }
    });

    cartOffcanvas.addEventListener('show.bs.offcanvas', renderCart); // sad bar

    cartOffcanvas.addEventListener('click', e => {
        const target = e.target;
        const cart = getCart();

        if (target.dataset.idAdd) {
            addToCart(target.dataset.idAdd);
            renderCart();
            updateCartBadge();
        }

        if (target.dataset.idRemove) {
            const id = target.dataset.idRemove;
            const item = cart.find(i => i.id === parseInt(id));
            if (item) {
                updateCartQuantity(id, item.quantity - 1);
                renderCart();
                updateCartBadge();
            }
        }

        if (target.id === 'btn-checkout') {
            const offcanvasInstance = bootstrap.Offcanvas.getInstance(cartOffcanvas);
            offcanvasInstance.hide();
            const modalInstance = new bootstrap.Modal(checkoutModal);
            modalInstance.show();
        }
    });

    checkoutModal.addEventListener('show.bs.modal', renderCheckoutModal);

    checkoutModal.addEventListener('click', e => {
        if (e.target.id === 'btn-finalize-order') {
            const address = document.getElementById('address');
            const payment = document.getElementById('payment');

            let isValid = true;
            address.classList.remove('is-invalid');
            payment.classList.remove('is-invalid');

            if (address.value.trim() === '') {
                address.classList.add('is-invalid');
                isValid = false;
            }
            if (payment.value === '') {
                payment.classList.add('is-invalid');
                isValid = false;
            }

            if (isValid) {
                clearCart();
                updateCartBadge();
                const modalInstance = bootstrap.Modal.getInstance(checkoutModal);
                modalInstance.hide();
                alert('compra finalizada !');
                renderCart();
            }
        }
    });
}

main();
