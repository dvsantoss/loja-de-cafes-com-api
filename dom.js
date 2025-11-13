export function dom(cafe) {

    const ingredientesLista = cafe.ingredients;
    const precoFormatado = cafe.price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })

    //  criando elementos atraves do dom

    // coluna
    const col = document.createElement('div');
    col.classList.add('col-lg-4', 'col-md-6', 'mb-4');

    // card
    const card = document.createElement('div');
    card.classList.add('card', 'h-100');

    // imagem
    const img = document.createElement('img');
    img.src = cafe.image;
    img.className = 'card-img-top';
    img.alt = cafe.title;

    // corpo do card
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    // titulo
    const title = document.createElement('h5');
    title.className = 'card-title';
    title.textContent = cafe.title;

    // descrição
    const description = document.createElement('p');
    description.className = 'card-text';
    description.textContent = cafe.description;

    // ingredientes
    const ingredientsP = document.createElement('p');
    ingredientsP.className = 'card-text';

    // para o negrito em ingredientes
    const strong = document.createElement('strong');
    strong.textContent = 'Ingredientes: ';

    // O texto dos ingredientes em si
    const ingredientsText = document.createTextNode(ingredientesLista);
    ingredientsP.appendChild(strong);
    ingredientsP.appendChild(ingredientsText);

    // preço
    const price = document.createElement('p');
    price.classList.add('card-text', 'fw-bold', 'fs-5');
    price.textContent = precoFormatado;

    // footer do card
    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer';

    // botão
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary', 'w-100');
    button.textContent = 'Adicionar ao Carrinho';

    // forma de adicionar atributos
    button.dataset.id = cafe.id;

    // montando a árvore appendChild (um elemento dentro do outro)
    // aninhando os elementos

    // monta o card-body
    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(ingredientsP);
    cardBody.appendChild(price);

    // monta o card-footer
    cardFooter.appendChild(button);

    // monta o card
    card.appendChild(img);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    // monta a coluna
    col.appendChild(card);

    // retorna o elemento da coluna, pronto para ser adicionado na div class="row"
    return col;

}
;