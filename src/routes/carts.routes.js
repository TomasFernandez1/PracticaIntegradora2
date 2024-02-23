import RouterClass from "./router.js";
import cartManagerMongo from "../daos/Mongo/cartDao.mongo.js";

export default class cartRouter extends RouterClass {
  init() {
    // Init service
    const cartService = new cartManagerMongo();

    // Cart view
    this.get("/:cid", ["USER", "ADMIN"], async (req, res) => {
      try {
        const { cid } = req.params; // ID Cart
        const { products } = await cartService.getCart(cid);
        const productsArray = products.map((product) => {
          return {
            title: product.product.title,
            price: product.product.price,
            quantity: product.quantity,
          };
        });
        res.render("cart", { products: productsArray, req });
      } catch (error) {
        res.sendServerError(error);
      }
    });

    // Carts view
    this.get("/", ["ADMIN"], async (req, res) => {
      res.status(200).send(await cartService.getCarts());
    });

    // Add a product to a cart
    this.post("/:cid/products/:pid", ["USER", "ADMIN"], async (req, res) => {
      try {
        const { cid, pid } = req.params;
        const cart = await cartService.getCart(cid);
        const productIndex = cart.products.findIndex(
          (p) => p.product && p.product.id === pid
        );

        if (productIndex !== -1) {
          cart.products[productIndex].quantity += 1;
        } else {
          cart.products.push({ product: pid, quantity: 1 });
        }

        const result = await cartService.updateCart(cid, cart);
        res.sendSuccess(result);
      } catch (error) {
        res.sendServerError(error);
      }
    });

    // Update cart
    this.put("/carts/:cid", ["USER", "ADMIN"], async (req, res) => {
      try {
        const { cid } = req.params;
        const { products } = req.body;
        const cart = await cartService.getCart(cid);
        cart.products = products;
        await cartService.updateCart(cid, cart);
        res.sendSuccess("Cart updated successfully");
      } catch (error) {
        res.sendServerError(error);
      }
    });

    // Update quantity of a product in the cart 
    this.put(
      "/carts/:cid/products/:pid",
      ["USER", "ADMIN"],
      async (req, res) => {
        try {
          const { cid, pid } = req.params;
          const { quantity } = req.body;
          const result = await cartService.updateQuantityProductCart(
            cid,
            pid,
            quantity
          );

          res.sendSuccess("The quantity was updated successfully");
        } catch (error) {
          res.sendServerError(error);
        }
      }
    );

    // Delete a product from the cart
    this.delete(
      "/carts/:cid/products/:pid",
      ["USER", "ADMIN"],
      async (req, res) => {
        try {
          const { cid, pid } = req.params;
          const result = await cartService.deleteProductCart(cid, pid);
          res.sendSuccess("The product was deleted successfully");
        } catch (error) {
          res.sendServerError(error);
        }
      }
    );

    // Delete all the products from the carts
    this.delete("/carts/:cid", ["USER", "ADMIN"], async (req, res) => {
      try {
        const { cid } = req.params;
        const result = await cartService.deleteProductsCart(cid);
        res.status(200).send(result);
      } catch (error) {
        res.sendServerError(error);
      }
    });
  }
}
