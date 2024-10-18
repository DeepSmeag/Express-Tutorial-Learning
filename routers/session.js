import { Router } from "express";

const sessionRouter = Router();
export default sessionRouter;

const sessionMiddleware = (req, res, next) => {
  if (!req.session.visitedTimes) {
    req.session.visitedTimes = 0;
  }
  req.session.visitedTimes++;
  next();
};
sessionRouter.use(sessionMiddleware);

sessionRouter.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);

  res.send(req.session);
});

sessionRouter.get("/visited", (req, res) => {
  if (req.session.visited) {
    return res.send("You have visited this page before");
  }
  req.session.visited = true;
  return res.send("You have not visited this page before"); //then refresh
});

sessionRouter.get("/visited-times", (req, res) => {
  res.send(`You have visited /api/session/ ${req.session.visitedTimes} times`);
});

const users = [
  { id: 1, username: "admin", password: "admin" },
  { id: 2, username: "user", password: "user" },
  { id: 3, username: "guest", password: "guest" },
];

sessionRouter.post("/auth", (req, res) => {
  const user = users.find((user) => user.username === req.body.username);
  if (!user || user.password !== req.body.password) {
    return res.status(401).send("Unauthorized");
  }
  req.session.authenticated = true;
  switch (req.body.username) {
    case "admin":
      req.session.role = "admin";
      break;
    case "user":
      req.session.role = "user";
      break;
    case "guest":
      req.session.role = "guest";
      break;
  }
  // we could also do this
  req.session.user = user;
  return res.send("You are authenticated");
});

sessionRouter.get("/auth/admin-dashboard", (req, res) => {
  if (req.session.authenticated && req.session.role === "admin") {
    return res.send("Welcome to admin dashboard");
  }
  // we could also check like this; many ways of keeping data; generally we'd want user-related data packaged as part of the user object
  if (req.session.user && req.session.role === "admin") {
    return res.send("Welcome to admin dashboard");
  }
  return res.status(401).send("Unauthorized");
});

sessionRouter.get("/auth/user-dashboard", (req, res) => {
  if (
    (req.session.authenticated && req.session.role === "user") ||
    req.session.role === "admin"
  ) {
    return res.send("Welcome to user dashboard");
  }
  return res.status(401).send("Unauthorized");
});

sessionRouter.get("/auth/guest-dashboard", (req, res) => {
  if (
    (req.session.authenticated && req.session.role === "guest") ||
    req.session.role === "user" ||
    req.session.role === "admin"
  ) {
    return res.send("Welcome to guest dashboard");
  }
  return res.status(401).send("Unauthorized");
});
