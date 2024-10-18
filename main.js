import express from "express";

const PORT = process.env.PORT || 3000;
const app = express();
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
  console.log(filter, value);
  if (!filter || !value) return res.send(users);
  if (filter && value) {
    const filteredUsers = users.filter((user) => user[filter].includes(value));
    if (!filteredUsers) return res.sendStatus(404);
    return res.send(filteredUsers);
  }
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
