import request from "supertest";
import express from "express";

import { createApp } from "../main";
import { products } from "../routers/products";

const app = express();
app.get("/hello", (req, res) => res.sendStatus(200));

describe("hello endpoint", () => {
  it("get /hello and expect 200", async () => {
    const res = await request(app).get("/hello");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({});
  });
});

const appBig = createApp();
describe("/api/cookies", () => {
  it("/secret should return 404", async () => {
    const res = await request(appBig).get("/api/cookies/secret");
    expect(res.status).toBe(404);
  });
  it("/verify should return COOKIE NOT VERIFIED", async () => {
    const res = await request(appBig).get("/api/cookies/verify");
    expect(res.text).toBe("COOKIE NOT VERIFIED");
  });
  it("/clear should return Cookie deleted", async () => {
    const res = await request(appBig).get("/api/cookies/clear");
    expect(res.text).toBe("Cookie deleted");
  });
  // testing with cookies is tougher; we'd need to chain requests and set cookies on next request by extracting 'set-cookie' header from the response
  // an alternative is to have cookies as a test suite variable and add them to each request
  // this makes it tough to test behaviour that has preconditions, since the test needs to do all the steps and increase complexity
  it("should set cookies and call /secret", async () => {
    const res = await request(appBig).get("/api/cookies");
    expect(res.status).toBe(200);
    const res2 = await request(appBig)
      .get("/api/cookies/secret")
      .set("Cookie", res.header["set-cookie"]);
    expect(res2.text).toBe(
      "You have a secret cookie! Here's my secret then: 42"
    );
  });
});

describe("/api/products", () => {
  it("get /api/products and expect 200", async () => {
    const res = await request(appBig).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(products);
  });
  it("post /api/products and expect 400", async () => {
    const res = await request(appBig).post("/api/products");
    expect(res.status).toBe(400);
  });
  it("post /api/products and expect product", async () => {
    const res = await request(appBig)
      .post("/api/products")
      .send({ name: "Mango" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 7, name: "Mango" });
  });
});
