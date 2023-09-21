import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import { socketServer } from "../../app.js";

const productsRouter = Router();
const PM = new ProductManager();

productsRouter.get("/", async (req, res) => {
  try {
    let queryObj = {};
    if (req.query.query) {
      try {
        queryObj = JSON.parse(req.query.query);
      } catch (err) {
        console.error("Error parsing JSON:", err);
        return res
          .status(400)
          .send({ status: "error", message: "Invalid query format." });
      }
    }
    const params = {
      ...req.query,
      query: JSON.parse(req.query.query || "{}"),
    };

    const products = await PM.getProducts(params);
    res.send(products);
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", message: "Error fetching products." });
    console.log(error);
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    console.log("Product ID:", pid);
    const product = await PM.getProductById(pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send({ status: "error", message: "Product not found." });
    }
  } catch (error) {
    console.error("Error fetching product by id:", error);
    res
      .status(500)
      .send({ status: "error", message: "Error fetching product by id." });
  }
});

productsRouter.post("/", async (req, res) => {
  let { title, description, code, price, status, stock, category, thumbnails } =
    req.body;
  console.log("Received thumbnails:", thumbnails);

  if (!title) {
    res
      .status(400)
      .send({ status: "error", message: "Error! No se cargó el campo Title!" });
    return false;
  }

  if (!description) {
    res.status(400).send({
      status: "error",
      message: "Error! No se cargó el campo Description!",
    });
    return false;
  }

  if (!code) {
    res
      .status(400)
      .send({ status: "error", message: "Error! No se cargó el campo Code!" });
    return false;
  }

  if (!price) {
    res
      .status(400)
      .send({ status: "error", message: "Error! No se cargó el campo Price!" });
    return false;
  }

  status = !status && true;

  if (!stock) {
    res
      .status(400)
      .send({ status: "error", message: "Error! No se cargó el campo Stock!" });
    return false;
  }

  if (!category) {
    res.status(400).send({
      status: "error",
      message: "Error! No se cargó el campo Category!",
    });
    return false;
  }

  if (!thumbnails) {
    res.status(400).send({
      status: "error",
      message: "Error! No se cargó el campo Thumbnails!",
    });
    return false;
  }
  try {
    const wasAdded = await PM.addProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });

    if (wasAdded && wasAdded._id) {
      res.send({
        status: "ok",
        message: "El Producto se agregó correctamente!",
      });
      socketServer.emit("product_created", {
        _id: wasAdded._id,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      });
    } else {
      res.status(500).send({
        status: "error",
        message: "Error! No se pudo agregar el Producto!",
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", message: "Internal server error." });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  let { title, description, code, price, status, stock, category, thumbnails } =
    req.body;

  try {
    const pid = req.params.pid;
    const wasUpdated = await PM.updateProduct(pid, {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });
    if (wasUpdated) {
      res.send({
        status: "ok",
        message: "El Producto se actualizó correctamente!",
      });
      socketServer.emit("product_updated");
    } else {
      res.status(500).send({
        status: "error",
        message: "Error! No se pudo actualizar el Producto!",
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", message: "Internal server error." });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  let pid = req.params.pid;

  const wasDeleted = await PM.deleteProduct(pid);

  if (wasDeleted) {
    res.send({
      status: "ok",
      message: "El Producto se eliminó correctamente!",
    });
    socketServer.emit("product_deleted", { _id: pid });
  } else {
    res.status(500).send({
      status: "error",
      message: "Error! No se pudo eliminar el Producto!",
    });
  }
});

export default productsRouter;
