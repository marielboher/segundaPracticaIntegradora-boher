import express from "express";
import UserManager from "../dao/UserManager.js";
import passport from "passport";
import { createHash, passportCall, authorization } from "../../utils.js";
import { isValidPassword } from "../../utils.js";
import jwt from "jsonwebtoken";
import { userModel } from "../dao/models/user.models.js";
const PRIVATE_KEY = "S3CR3T0";

const router = express.Router();
const UM = new UserManager();

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),

  async (req, res) => {
    if (!req.user) {
      return res.status(401).send({
        status: "Error",
        message: "Usuario y Contraseña incorrectos!",
      });
    }
    const { email, password } = req.body;

    let token = jwt.sign(
      { email: email, password: password, role: "user" },
      PRIVATE_KEY,
      { expiresIn: "24h" }
    );
    res.cookie("coderCookieToken", token, {
      maxAge: 3600 * 1000,
      httpOnly: true,
    });

    console.log("token", token);

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
    };
    return res.status(200).json({ status: "success", redirect: "/products" });
}
);



router.post("/register", (req, res, next) => {
  passport.authenticate("register", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "Error interno del servidor." });
    }

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Registro fallido. El usuario ya puede existir.",
      });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res
          .status(500)
          .json({ status: "error", message: "Error interno del servidor." });
      }
      return res.status(200).json({ status: "success", redirect: "/login" });
    });
  })(req, res, next);
});

router.get("/restore", async (req, res) => {
  let { user, pass } = req.query;
  pass = createHash(pass);
  const passwordRestored = await UM.restorePassword(user, pass);

  if (passwordRestored) {
    res.send({
      status: "OK",
      message: "La contraseña se ha actualizado correctamente!",
    });
  } else {
    res.status(401).send({
      status: "Error",
      message: "No se pudo actualizar la contraseña!",
    });
  }
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.loggedIn = true;
    res.redirect("/products");
  }
);

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/profile");
    }
    res.redirect("/login");
  });
});

router.get("/current", passportCall("jwt"), authorization("user"), (req, res) => {
    res.send({status:"OK", payload:req.user});
});

export default router;
