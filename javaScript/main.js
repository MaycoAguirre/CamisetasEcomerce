const container = document.getElementById("container");
const carritoElement = document.getElementById("carrito");
const mostrarCarritoBtn = document.getElementById("mostrar-carrito");
const ocultarCarritoBtn = document.getElementById("ocultar-carrito");
const searchInput = document.getElementById("search-input");
const buscarBtn = document.getElementById("buscar");
const finalizarCompraBtn = document.getElementById("finalizar-compra");

const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productos = [];

const alertNoStock = () => {
  Swal.fire({
    title: "No hay Stock",
    html: "No tenemos este producto en este momento",
    timer: 3000,
    timerProgressBar: true,
    icon: "error",
  });
};

const alertExito = () => {
  Swal.fire({
    position: "Center",
    icon: "success",
    title: "Producto agregado al carrito",
    showConfirmButton: false,
    timer: 800,
  });
};

class ProductCard {
  constructor(product) {
    this.product = product;
    this.element = this.createCardElement();
  }

  createCardElement() {
    const card = document.createElement("div");
    card.className = this.product.stock ? "card" : "no-card";

    const title = document.createElement("p");
    title.innerText = this.product.nombre;
    title.className = "title";

    const image = document.createElement("img");
    image.src = this.product.imagen;
    image.alt = this.product.alt;
    image.className = "img";

    const price = document.createElement("p");
    price.innerText = `$${this.product.precio}`;
    price.className = "price";

    const addButton = document.createElement("button");
    addButton.innerText = this.product.stock ? "Agregar" : "Sin Stock";
    addButton.className = "btn-add";

    addButton.addEventListener("click", () => {
      if (this.product.stock) {
        this.addToCart();
        alertExito();
      } else {
        alertNoStock();
      }
    });

    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(price);
    card.appendChild(addButton);

    return card;
  }

  addToCart() {
    carrito.push(this.product);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  }
}

function displayProducts(data) {
  container.innerHTML = "";
  data.forEach((product) => {
    const productCard = new ProductCard(product);
    container.appendChild(productCard.element);
  });
}

function cargarProductosDesdeJSON() {
  fetch("javaScript/productos.json")
    .then((response) => response.json())
    .then((data) => {
      productos = data;
      displayProducts(data);
    })
    .catch((error) => console.error("Error cargando productos:", error));
}

function mostrarCarrito() {
  carritoElement.innerHTML = "";
  let totalPrecio = 0;

  carrito.forEach((producto, index) => {
    const itemCarrito = document.createElement("div");
    itemCarrito.className = "item-carrito";
    itemCarrito.innerHTML = `
      <p>${index + 1}. ${producto.nombre} - $${producto.precio}</p>
      <button onclick="quitarDelCarrito(${index})">Quitar</button>
    `;
    carritoElement.appendChild(itemCarrito);
    totalPrecio += producto.precio;
  });

  const total = document.createElement("p");
  total.className = "total";
  total.innerText = `Total del precio de todos los productos en el carrito: $${totalPrecio}`;
  carritoElement.appendChild(total);

  actualizarEstadoCarrito();
}

function actualizarEstadoCarrito() {
  const tieneProductos = carrito.length > 0;
  mostrarCarritoBtn.style.display = tieneProductos ? "none" : "block";
  ocultarCarritoBtn.style.display = tieneProductos ? "block" : "none";
  carritoElement.style.display = tieneProductos ? "block" : "none";
  finalizarCompraBtn.style.display = tieneProductos ? "block" : "none";
}

function quitarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

function actualizarProductos(filteredProducts) {
  container.innerHTML = "";
  filteredProducts.forEach((producto) => {
    const productCard = new ProductCard(producto);
    container.appendChild(productCard.element);
  });
}

function filtrarProductos() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filteredProducts = productos.filter((producto) => {
    const nombre = producto.nombre.toLowerCase();
    const nombreCoincide = nombre.includes(searchTerm);

    const precioMinimo = parseFloat(
      document.getElementById("min-price")?.value || 0
    );
    const precioMaximo = parseFloat(
      document.getElementById("max-price")?.value || Infinity
    );
    const precioCoincide =
      producto.precio >= precioMinimo && producto.precio <= precioMaximo;

    const stockCoincide = document.getElementById("stock-filter")?.checked
      ? producto.stock
      : true;

    return nombreCoincide && precioCoincide && stockCoincide;
  });

  actualizarProductos(filteredProducts);
}

function finalizarCompra() {
  window.location.href = "/finalizarCompra.html";
}

searchInput.addEventListener("input", filtrarProductos);
buscarBtn.addEventListener("click", filtrarProductos);

mostrarCarritoBtn.addEventListener("click", () => {
  actualizarEstadoCarrito();
  mostrarCarrito();
});

ocultarCarritoBtn.addEventListener("click", () => {
  mostrarCarritoBtn.style.display = "block";
  ocultarCarritoBtn.style.display = "none";
  carritoElement.style.display = "none";
});

finalizarCompraBtn.addEventListener("click", finalizarCompra);

cargarProductosDesdeJSON();
