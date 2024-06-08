document.addEventListener("DOMContentLoaded", () => {
  const orderSummaryElement = document.getElementById("order-summary");
  const totalPriceElement = document.getElementById("total-price");
  const placeOrderBtn = document.getElementById("place-order-btn");

  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let totalPrecio = 0;

  carrito.forEach((producto, index) => {
    const itemElement = document.createElement("div");
    itemElement.className = "order-item";
    itemElement.innerHTML = `<p>${index + 1}. ${producto.nombre} - $${
      producto.precio
    }</p>`;
    orderSummaryElement.appendChild(itemElement);
    totalPrecio += producto.precio;
  });

  totalPriceElement.innerText = `Total: $${totalPrecio}`;

  placeOrderBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (validateForms()) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Pedido realizado con éxito",
        showConfirmButton: false,
        timer: 3500,
      });

      localStorage.removeItem("carrito");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 5000);
    }
  });
});

function validateForms() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const cardNumber = document.getElementById("card-number").value.trim();
  const cardName = document.getElementById("card-name").value.trim();
  const expiryDate = document.getElementById("expiry-date").value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  if (!name || !validateName(name)) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor, ingresa un nombre válido.",
    });
    return false;
  }

  if (!email || !validateEmail(email)) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor, ingresa un correo electrónico válido.",
    });
    return false;
  }

  if (!address) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor, ingresa una dirección válida.",
    });
    return false;
  }

  if (!phone || !validatePhone(phone)) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor, ingresa un número de teléfono válido.",
    });
    return false;
  }

  if (!cardNumber || !validateCardNumber(cardNumber)) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor, ingresa un número de tarjeta válido.",
    });
    return false;
  }

  if (!cardName) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor, ingresa el nombre en la tarjeta.",
    });
    return false;
  }

  if (!expiryDate || !validateExpiryDate(expiryDate)) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor, ingresa una fecha de expiración válida.",
    });
    return false;
  }

  if (!cvv || !validateCVV(cvv)) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor, ingresa un CVV válido.",
    });
    return false;
  }

  return true;
}

function validateName(name) {
  const regex = /^[A-Za-z\s]{2,}$/;
  return regex.test(name);
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePhone(phone) {
  const regex = /^\d{7,15}$/;
  return regex.test(phone);
}

function validateCardNumber(cardNumber) {
  const regex = /^\d{16}$/;
  return regex.test(cardNumber);
}

function validateExpiryDate(expiryDate) {
  const [year, month] = expiryDate.split("-").map(Number);
  const expiry = new Date(year, month);
  const now = new Date();
  return expiry > now;
}

function validateCVV(cvv) {
  const regex = /^\d{3,4}$/;
  return regex.test(cvv);
}
