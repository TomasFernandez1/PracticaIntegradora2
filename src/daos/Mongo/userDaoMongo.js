import userModel from "../../models/user.model.js";
import cartDaoMongo from "./cartDao.mongo.js";

const cartService = new cartDaoMongo();

export default class UserDaoMongo {
  constructor() {
    this.userModel = userModel;
  }

  async getUsers(filters) {
    return await this.userModel.find(filters).lean();
  }

  async getUserById(id) {
    return await this.userModel.findById({ _id: id }).lean();
  }

  async getUser(filters) {
    return await this.userModel.findOne(filters).lean();
  }

  async createUser(newUser) {
    newUser.cart = await cartService.createCart();
    return await this.userModel.create(newUser);
  }

  async updateUser(id, updatedUser) {
    return await this.userModel.findByIdAndUpdate({ _id: id }, updatedUser);
  }

  async deleteUser(id) {
    return await this.userModel.delete({ _id: id });
  }
}
