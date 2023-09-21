import { userModel } from "../dao/models/user.models.js";
import { isValidPassword } from "../../utils.js";

class UserManager {
  async addUser(user) {
    try {
      if (user.email == "adminCoder@coder.com") {
        user.role = "admin";
      }

      await userModel.create(user);
      console.log("User added!");

      return true;
    } catch (error) {
      return false;
    }
  }

  async login(user, pass, req) {
    try {
      const userLogged = await userModel.findOne({ email: user });

      if (userLogged && isValidPassword(userLogged, pass)) {
        const role =
          userLogged.email === "adminCoder@coder.com" ? "admin" : "usuario";

        req.session.user = {
          id: userLogged._id,
          email: userLogged.email,
          first_name: userLogged.first_name,
          last_name: userLogged.last_name,
          role: role,
        };

        const userToReturn = userLogged;
        return userToReturn;
      }
      return false;
    } catch (error) {
      console.error("Error durante el login:", error);
      return false;
    }
  }

  async getUserByEmail(user) {
    try {
      const userRegisteredBefore =
        (await userModel.findOne([{ email: user }])) || null;
      if (userRegisteredBefore) {
        console.log("Mail registrado anteriormente");
        return user;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async getUserByID(id) {
    try {
      const userID = (await userModel.findOne([{ _id: id }])) || null;
      if (userID) {
        console.log(userID);
        return user;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}

export default UserManager;
