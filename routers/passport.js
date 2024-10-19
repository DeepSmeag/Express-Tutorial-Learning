import { Router } from "express";
import passport from "passport";
import "../strategies/local-strategy.js";

const passportRouter = Router();
export default passportRouter;

passportRouter.post(
  "/login",
  passport.authenticate("local", { session: true }),
  (req, res) => {
    res.send("Login page");
  }
);
passportRouter.get("/status", (req, res) => {
  console.log(req.session);
  console.log(req.user);
  return req.user ? res.send(req.user) : res.sendStatus(401);
});
passportRouter.post("/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);
  req.logout((err) => {
    if (err) return res.sendStatus(500);
  });
  res.send("Logged out");
});
