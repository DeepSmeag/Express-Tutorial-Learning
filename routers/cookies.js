import { Router } from "express";
import cookieParser from "cookie-parser";
const cookiesRouter = Router();
export default cookiesRouter;

cookiesRouter.use(cookieParser("mysecrettosigncookies"));
cookiesRouter.get("/", (req, res) => {
  res.cookie("hello", "world", { maxAge: 60000 });
  res.cookie("secret", "shhhhh", { maxAge: 10000, httpOnly: true });
  res.cookie("signed", "signed", { signed: true });
  const cookies = req.cookies;
  res.send(cookies);
});

cookiesRouter.get("/verify", (req, res) => {
  const cookies = req.cookies;
  if (cookies.hello && cookies.hello === "world") {
    return res.send("COOKIE VERIFIED");
  }
  return res.send("COOKIE NOT VERIFIED");
});
cookiesRouter.get("/clear", (req, res) => {
  res.clearCookie("hello");
  res.clearCookie("secret");
  res.clearCookie("signed");
  res.send("Cookie deleted");
});

cookiesRouter.get("/secret", (req, res) => {
  const cookies = req.cookies;
  if (cookies.secret) {
    return res.send("You have a secret cookie! Here's my secret then: 42");
  }
  return res.sendStatus(404); // or 403, which is Unauthorized
});
cookiesRouter.get("/signed", (req, res) => {
  const cookies = req.signedCookies;
  if (cookies.signed) {
    return res.send(
      "You have a signed cookie! Here's my secret then...<><>BABA"
    );
  }
  return res.sendStatus(403);
});
