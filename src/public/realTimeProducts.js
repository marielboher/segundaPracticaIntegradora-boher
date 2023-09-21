const socket = io();
socket.on("initial_products", function (products) {
    products.forEach(product => {
        displayProduct(product);
    });
});

function displayProduct(newProduct) {
    var productElement = document.createElement("li");
    productElement.id = "product-" + newProduct._id;
    productElement.className = "product";

    var imageElement = document.createElement("img");
    imageElement.src = newProduct.thumbnails;
    imageElement.alt = newProduct.title;
    productElement.appendChild(imageElement);

    var textElement = document.createElement("span");
    textElement.textContent =
    "Producto: " +
    newProduct.title +
    " - Stock: " +
    newProduct.stock +
    " - Descripción: " +
    newProduct.description;
    productElement.appendChild(textElement);

    document.getElementById("productList").appendChild(productElement);
}

socket.on("product_created", function (newProduct) {
  console.log("Nuevo producto:", newProduct);

  var productElement = document.createElement("li");
  productElement.id = "product-" + newProduct._id;
  productElement.className = "product";

  var imageElement = document.createElement("img");
  imageElement.src = newProduct.thumbnails;
  imageElement.alt = newProduct.title;
  productElement.appendChild(imageElement);

  var textElement = document.createElement("span");
  textElement.textContent =
    "Producto: " +
    newProduct.title +
    " - Stock: " +
    newProduct.stock +
    " - Descripción: " +
    newProduct.description;
  productElement.appendChild(textElement);

  document.getElementById("productList").appendChild(productElement);
});

socket.on("product_deleted", function (data) {
  console.log("Producto eliminado:", data._id);

  var productElement = document.getElementById("product-" + data._id);

  if (productElement) {
    console.log("Producto encontrado en el DOM:", productElement);

    productElement.remove();

    productElement = document.getElementById("product-" + data._id);
    if (!productElement) {
      console.log("Producto eliminado exitosamente del DOM.");
    } else {
      console.log("Error: El producto no se eliminó del DOM.");
    }
  } else {
    console.log("Error: Producto no encontrado en el DOM.");
  }
});
