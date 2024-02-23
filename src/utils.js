import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const createHash = password =>  bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (password, userPassword) => bcrypt.compareSync(password, userPassword);

export const PRIVATE_KEY = 'Cl4v3T0k3n_2024'

export const generateToken = user => jwt.sign(user, PRIVATE_KEY,{expiresIn: '1d'})
