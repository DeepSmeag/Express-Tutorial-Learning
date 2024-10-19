import {
  products,
  productsRouterGet,
  productsRouterPost,
} from "../routers/products";
import validator from "express-validator";
import { hashPassword } from "../utils/helpers";
import helpers from "../utils/helpers.js";
jest.mock("express-validator", () => {
  const originalModule = jest.requireActual("express-validator");
  return {
    ...originalModule,
    validationResult: jest.fn(() => ({
      isEmpty: jest.fn(() => false),
    })),
    matchedData: jest.fn(() => ({
      name: "Mango",
    })),
  };
});

jest.mock("../utils/helpers.js", () => ({
  hashPassword: jest.fn((password) => `hashed_${password}`),
}));

describe("get products", () => {
  const mockRequest = {};
  const mockResponse = {
    send: jest.fn(),
  };
  it("should get products", () => {
    productsRouterGet(mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalledWith(products);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
    expect(mockResponse.send).toHaveReturned();
  });
});
describe("post product", () => {
  beforeEach(() => {}); // if needed
  it("should send status 400", () => {
    const mockRequest = {};
    const mockResponse = {
      send: jest.fn(),
      status: jest.fn(() => mockResponse),
    };
    productsRouterPost(mockRequest, mockResponse);
    expect(validator.validationResult).toHaveBeenCalledTimes(1);
    expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalled();
  });
  it("should return product", () => {
    const mockRequest = {
      name: "Mango",
    };
    const mockResponse = {
      send: jest.fn(),
      status: jest.fn(() => mockResponse),
    };
    jest.spyOn(validator, "validationResult").mockReturnValue({
      isEmpty: jest.fn(() => true),
    });
    const productsLengthBefore = products.length;
    productsRouterPost(mockRequest, mockResponse);
    const productsLengthAfter = products.length;
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalledWith({
      id: products.length,
      name: "Mango",
    });
    console.log(products[products.length - 1]);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
    expect(mockResponse.send).toHaveReturned();
    expect(productsLengthAfter).toBe(productsLengthBefore + 1);
  });
});
