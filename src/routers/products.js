import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { createProductValidationSchema } from "../validate/validationSchema.js";

const productsRouter = Router();
export default productsRouter;

export const products = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Cherry" },
  { id: 4, name: "Grape" },
  { id: 5, name: "Kiwi" },
  { id: 6, name: "Lemon" },
];
export const productsRouterGet = (req, res) => {
  res.send(products);
};
productsRouter.get("/", productsRouterGet);

export const productsRouterPost = (req, res) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return res.status(400).send(valResult);
  }
  const product = { id: products.length + 1, ...matchedData(req) };
  products.push(product);
  res.send(product);
};

productsRouter.post(
  "/",
  checkSchema(createProductValidationSchema),
  productsRouterPost
);
