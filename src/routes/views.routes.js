import express from "express";
import ProductManager from "../dao/ProductManager.js";
import CartManager from "../dao/cartManager.js";

const checkSession = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

const checkAlreadyLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    console.log("Usuario ya autenticado, redirigiendo a /profile");
    res.redirect("/profile");
  } else {
    console.log("Usuario no autenticado, procediendo...");
    next();
  }
};

const router = express.Router();
const PM = new ProductManager();
const CM = new CartManager();

router.get("/", checkSession, async (req, res) => {
  const products = await PM.getProducts(req.query);
  res.render("home", { products });
});

router.get("/products", checkSession, async (req, res) => {
  const products = await PM.getProducts(req.query);
  const user = req.session.user;
  res.render("products", { products, user });
});

router.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  const product = await PM.getProductById(pid);
  if (product) {
    res.render("productDetail", { product });
  } else {
    res.status(404).send({ status: "error", message: "Product not found." });
  }
});

router.get("/carts/:cid", async (req, res) => {
  const cid = req.params.cid;
  const cart = await CM.getCart(cid);

  if (cart) {
    console.log(JSON.stringify(cart, null, 4));
    res.render("cart", { products: cart.products });
  } else {
    res.status(400).send({
      status: "error",
      message: "Error! No se encuentra el ID de Carrito!",
    });
  }
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

router.get("/chat", (req, res) => {
  res.render("chat");
});

router.get("/login", checkAlreadyLoggedIn, (req, res) => {
  res.render("login");
});

router.get("/register", checkAlreadyLoggedIn, (req, res) => {
  res.render("register");
});

router.get("/profile", checkSession, (req, res) => {
  const userData = req.user;
  res.render("profile", { user: userData });
});

router.get("/restore", async (req, res) => {
  res.render("restore");
});

router.get("/faillogin", (req, res) => {
  res.status(401).json({
    status: "error",
    message: "Login failed. Invalid username or password.",
  });
});

router.get("/failregister", async (req, res) => {
  res.send({
    status: "Error",
    message: "Error! No se pudo registar el Usuario!",
  });
});
export default router;
