import { Router } from "express";
import { User } from "../mongoose/schemas/user.js";
import { comparePasswords, hashPassword } from "../utils/helpers.js";
const dbRouter = Router();
export default dbRouter;

dbRouter.get("/", (req, res) => {
  res.send("DB page");
});
dbRouter.post("/", async (req, res) => {
  const { body } = req;
  const hashedPassword = hashPassword(body.password);
  // here we'd validate the body, perhaps using express-validator
  const newUser = new User({
    username: body.username,
    password: body.password,
    hashedPassword: hashedPassword,
  });
  try {
    const savedUser = await newUser.save();
    return res.send(savedUser);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

dbRouter.get("/all", async (req, res) => {
  try {
    const users = await User.find({}).exec();
    const usersObject = users.map((user) => {
      return {
        username: user.username,
        password: user.password,
        hashedPassword: user.hashedPassword ?? null,
      };
    });
    return res.send(usersObject);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

dbRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ username: id }).exec();
    if (!user) {
      return res.sendStatus(404);
    }
    return res.send(user);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});
dbRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOneAndDelete({ username: id }).exec();
    if (!user) {
      return res.sendStatus(404);
    }
    return res.send(user);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

dbRouter.post("/check/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const user = await User.findOne({ username: id }).exec();
    if (!user) {
      return res.sendStatus(404);
    }
    const isMatch = comparePasswords(body.password, user.hashedPassword);
    return res.send({ isMatch });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});
