import RouterClass from "./router.js";
import { generateToken } from "../utils.js";
import { passportCall } from "../middlewares/passportCall.js";

export default class sessionRouter extends RouterClass {
  init() {
    // Login endpoint
    this.post("/login", ["PUBLIC"], passportCall("login"), async (req, res) => {
      const token = generateToken(req.user);
      res
        .cookie("cookieToken", token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        })
        .redirect("/api/products");
    });

    // Register endpoint
    this.post(
      "/register",
      ["PUBLIC"],
      passportCall("register"),
      async (req, res) => {
        res.redirect("/api/view/login");
      }
    );

    // Recovery-password endpoint
    this.post(
      "/recovery-password",
      ["PUBLIC"],
      passportCall("recovery-password"),
      async (req, res) => {
        res.redirect("/api/view/login");
      }
    );

    // Logout endpoint
    this.post(
      "/logout",
      ["USER", "ADMIN", "USER_PREMIUM"],
      async (req, res) => {
        res.clearCookie("cookieToken");
        res.redirect("/api/view/login");
      }
    );

    // Current endpoint
    this.get(
      "/current",
      ["USER"],
      passportCall("current"),
      async (req, res) => {
        res.render("current", { req });
      }
    );
  }
}
