// chave para salvar os dados no localStorage
const CART_KEY = 'coffeeShopCart';

// lendo o carrinho salvo e retornando array de itens ou vazio caso esteja
export function getCart() {
    const cartString = localStorage.getItem(CART_KEY);
    if (!cartString) return [];
    return JSON.parse(cartString);
}

// salva o array do carrinho no localStorage.
function saveCart(cart) {
    // JSON.stringify() para converter o array em TEXTO antes de salvar
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// adiciona um item ao carrinho ou incrementa sua quantidade.
export function addToCart(productId) {

    // pega o carrinho atual
    const cart = getCart();

    // converte o ID para número pq o dataset.id veio como string
    const idNum = parseInt(productId);

    // procura se o item ja existe no carrinho
    const existingItem = cart.find(item => item.id === idNum);

    if (existingItem) {
        // se existe aumenta a quantidade
        existingItem.quantity += 1;
    } else {
        // se não existe adiciona
        cart.push({ id: idNum, quantity: 1 });
    }

    // salva o carrinho atualizado de volta no localStorage
    saveCart(cart);
}

// pegando a quantidade de itens no carrinho
export function getCartItemCount() {
    const cart = getCart();

    // soma a quantity de cada item no carrinho
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);

    return totalCount;
}

// atualiza a quantidade de um item no carrinho
export function updateCartQuantity(productId, newQuantity) {
    const cart = getCart();
    const idNum = parseInt(productId);

    // se a quantidade for 0 ou menor, remove o item
    if (newQuantity <= 0) {
        // filter cria um novo array com todos os itens, exceto o item com o id que queremos remover
        const newCart = cart.filter(item => item.id !== idNum);
        saveCart(newCart);
    } else {
        // encontra o item e atualiza a quantidade
        const itemInCart = cart.find(item => item.id === idNum);
        if (itemInCart) {
            itemInCart.quantity = newQuantity;
            saveCart(cart);
        }
    }
}

// removendo item por completo do carrinho
export function removeFromCart(productId) {
    const cart = getCart();
    const idNum = parseInt(productId);

    // filtra o item para fora do carrinho
    const newCart = cart.filter(item => item.id !== idNum);
    saveCart(newCart);
}

export function clearCart() {
    // remove o item do localStorage
    localStorage.removeItem(CART_KEY);
}