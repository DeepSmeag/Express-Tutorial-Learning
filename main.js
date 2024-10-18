import express from "express";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

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

app.get("/api/users", (req, res) => {
  const query = req.query;
  const { filter, value } = query;
  if (!filter || !value) return res.send(users);
  if (filter && value) {
    const filteredUsers = users.filter((user) => user[filter].includes(value));
    if (!filteredUsers) return res.sendStatus(404);
    return res.send(filteredUsers);
  }
});

app.post("/api/users", (req, res) => {
  const { body } = req;
  if (!body) return res.sendStatus(400);
  if (!body.name) return res.status(400).send({ message: "Name is required" });
  const newUser = { id: users[users.length - 1].id + 1, ...body };
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
app.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return res.status(400).send({ message: "Invalid ID" });
  }
  const findUser = users.find((user) => user.id === parsedId);
  if (!findUser) return res.sendStatus(404);
  users.splice(users.indexOf(findUser), 1);
  return res.send(findUser);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
