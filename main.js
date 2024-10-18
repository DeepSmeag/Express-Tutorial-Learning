import express from "express";
import {
  checkSchema,
  matchedData,
  query,
  validationResult,
} from "express-validator";
import { createUserValidationSchema } from "./validate/validationSchema.js";
import productsRouter from "./routers/products.js";
import cookiesRouter from "./routers/cookies.js";
import sessionRouter from "./routers/session.js";
import session from "express-session";

const PORT = process.env.PORT || 3000;
const app = express();

//! Middleware(s)

const printRequest = (req, res, next) => {
  console.log(
    "Request received on path:",
    req.path,
    "with method:",
    req.method
  );
  next();
};
app.use(printRequest);
app.use(express.json());
app.use(
  session({
    secret: "mysecrettoencodecookies",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60000 * 60 }, //1h
  })
);

//! Router

app.use("/api/products", productsRouter);
app.use("/api/cookies", cookiesRouter);
app.use("/api/session", sessionRouter);

//! Basic routes

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/json", (req, res) => {
  res.send({ message: "Hello World!" });
});

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

//! Validation without schema
app.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Filter is required")
    .isLength({ min: 3, max: 10 })
    .withMessage("Filter must be a string with length between 3 and 10"),
  (req, res) => {
    const valResult = validationResult(req);
    console.log(valResult);

    const query = req.query;
    const { filter, value } = query;
    if (!filter || !value) return res.send(users);
    if (filter && value) {
      const filteredUsers = users.filter((user) =>
        user[filter].includes(value)
      );
      if (!filteredUsers) return res.sendStatus(404);
      return res.send(filteredUsers);
    }
  }
);

//! Validation with schema
app.post("/api/users", checkSchema(createUserValidationSchema), (req, res) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty())
    return res.status(400).send({ errors: valResult.array() });

  const data = matchedData(req);
  const newUser = { id: users[users.length - 1].id + 1, ...data };
  users.push(newUser);
  return res.send(newUser);
});

app.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const parsedId = parseInt(id);
  console.log(parsedId);
  if (isNaN(parsedId)) {
    return res.status(400).send({ message: "Invalid ID" });
  }
  const findUser = users.find((user) => user.id === parsedId);
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

app.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return res.status(400).send({ message: "Invalid ID" });
  }
  const findUser = users.find((user) => user.id === parsedId);
  if (!findUser) return res.sendStatus(404);
  const { body } = req;
  if (!body) return res.sendStatus(400);
  if (!body.name) return res.status(400).send({ message: "Name is required" });
  const updatedUser = { ...findUser, ...body };
  users[users.indexOf(findUser)] = { id: findUser.id, ...updatedUser };
  return res.send(updatedUser);
});
app.patch("/api/users/:id", (req, res) => {
  // the same as above because we handled both cases with same code
  const id = req.params.id;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return res.status(400).send({ message: "Invalid ID" });
  }
  const findUser = users.find((user) => user.id === parsedId);
  if (!findUser) return res.sendStatus(404);
  const { body } = req;
  if (!body) return res.sendStatus(400);
  const updatedUser = { ...findUser, ...body };
  users[users.indexOf(findUser)] = { id: findUser.id, ...updatedUser };
  return res.send(updatedUser);
});
app.delete("/api/users/:id", (req, res, next) => {
  const id = req.params.id;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return res.status(400).send({ message: "Invalid ID" });
  }
  const findUser = users.find((user) => user.id === parsedId);
  if (!findUser) return next(new Error("User not found"));
  users.splice(users.indexOf(findUser), 1);
  return res.send(findUser);
});

//error handler
app.use((err, req, res, next) => {
  if (err) {
    console.error(err.message);
    res.status(500).send({ message: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
