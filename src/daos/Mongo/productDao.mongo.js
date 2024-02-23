import productModel from "../../models/product.model.js";

export default class ProductDaoMongo {
  // manager
  constructor() {
    this.model = productModel;
  }

  async getProducts(limit, page, sort) {
    if (!sort) {
      return await this.model.paginate({}, { limit, page, lean: true });
    } else {
      return await this.model.paginate(
        {},
        { limit, page, lean: true, sort: { price: sort } }
      );
    }
  }

  async getProduct(id) {
    return await this.model.findById({ _id: id }).lean();
  }

  async createProduct(newProduct) {
    return await this.model.create(newProduct);
  }

  async updateProduct(id, newProduct) {
    return await this.model.findByIdAndUpdate({ _id: id }, newProduct);
  }

  async deleteProduct(id) {
    return await this.model.findByIdAndDelete({ _id: id });
  }
}
