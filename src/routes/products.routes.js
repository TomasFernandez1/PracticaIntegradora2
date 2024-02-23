import RouterClass from "./router.js";
import ProductDaoMongo from "../daos/Mongo/productDao.mongo.js";

export default class productsRouter extends RouterClass {
  init() {
    // Init service
    const productService = new ProductDaoMongo();

    // Products view
    this.get("/", ["USER", "USER_PREMIUM", "ADMIN"], async (req, res) => {
      try {
        const { limit = 10, pageQuery = 1, sort, query } = req.query;
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } =
          await productService.getProducts(limit, pageQuery, sort, query);
        res.render("products", {
          products: docs,
          hasPrevPage,
          hasNextPage,
          prevPage,
          nextPage,
          page,
          req,
          cartId: req.user.cart,
        });
      } catch (error) {
        return res.sendServerError(error.message);
      }
    });

    // Product view
    this.get("/:pid", ["USER", "USER_PREMIUM", "ADMIN"], async (req, res) => {
      try {
        const { pid } = req.params; // Product ID
        const result = await productService.getProduct(pid);
        return res.render("product", { result });
      } catch (error) {
        return res.sendServerError(error.message);
      }
    });

    // New product endpoint
    this.post("/", ["USER", "USER_PREMIUM", "ADMIN"], async (req, res) => {
      try {
        const newProduct = req.body; // New Product

        const result = await productService.createProduct(newProduct);
        return res.send(result);
      } catch (error) {
        return res.sendServerError(error.message);
      }
    });

    // Update product endpoint
    this.put("/:pid", ["USER", "USER_PREMIUM", "ADMIN"], async (req, res) => {
      try {
        const { pid } = req.params; // Product ID
        const updateProduct = req.body; // Updated product
        await productService.updateProduct(pid, updateProduct);
        res.sendSuccess(`The Product with id ${pid} was successfully updated`);
      } catch (error) {
        return res.sendServerError(error.message);
      }
    });

    // Delete product endpoint
    this.delete(
      "/:pid",
      ["USER", "USER_PREMIUM", "ADMIN"],
      async (req, res) => {
        try {
          const { pid } = req.params; // Product ID
          await productService.deleteProduct(pid);
          res.sendSuccess("Product deleted successfully");
        } catch (error) {
          return res.sendServerError(error.message);
        }
      }
    );
  }
}
