const myUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const myOl = document.querySelector('.cart__items');

function salvar() {
  localStorage.setItem('cars', myOl.innerHTML);
}

function pegar() {
  const valorProduto = localStorage.getItem('cars'); 
  myOl.innerHTML = valorProduto;
}

function cartItemClickListener(event) {
  event.target.remove();
}

document.querySelector('.empty-cart')
  .addEventListener('click', () => {
  const cartItens = document.querySelectorAll('.cart__item');
  cartItens.forEach((item) => {
    item.remove();
  });
});

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const segundaFetch = async (event) => {
  const id = event.target.parentElement.firstChild.innerText;
  const resolve = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const objetoRetornado = await resolve.json();
  const listaOrdenada = document.querySelector('.cart__items');
  const itemCriado = createCartItemElement(objetoRetornado);

  listaOrdenada.appendChild(itemCriado);
  salvar();
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', segundaFetch);

  return section;
}
// // FUNÇÃO PARA TRATAR O OBJETO
const newObject = (objetoRetornado) => {
  const sectionItems = document.querySelector('.items');

  const arrayObjetos = objetoRetornado.results;
  arrayObjetos.forEach((produto) => {
    const novoObjetoProduto = {
      sku: produto.id,
      name: produto.title,
      image: produto.thumbnail,
      salePrice: produto.prices,
    };
    return sectionItems.appendChild(createProductItemElement(novoObjetoProduto));
  });
};

const fetchApi = async () => {
  const resposta = await fetch(`${myUrl}computador`);
  const objetoRetornado = await resposta.json();
  newObject(objetoRetornado);
  const element = document.querySelector('.loading');
  element.remove();
};

window.onload = () => {
  fetchApi();
  pegar();
};