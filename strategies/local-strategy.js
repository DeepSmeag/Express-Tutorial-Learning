import passport from "passport";
import { Strategy } from "passport-local";
import { users } from "../routers/session.js";

passport.serializeUser((user, done) => {
  console.log("Serializing user");
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  console.log("Deserializing user", id);
  try {
    const findUser = users.find((user) => user.id === id);
    if (!findUser) throw new Error("User not found // invalid credentials");
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy((username, password, done) => {
    try {
      const findUser = users.find((user) => user.username === username);
      if (!findUser)
        throw new Error(
          "User not found // security issue, never tell the client if user exists or not; simply say invalid credentials"
        );
      if (findUser.password !== password)
        throw new Error("Invalid credentials");
      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);
