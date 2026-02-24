import "dotenv/config";
import express from "express";
import session from "express-session";
import cors from "cors";

import postLoginController from "./controllers/postLogin";
import postUserController from "./controllers/postUser";
import getTasksController from "./controllers/getTasks";
import getMeController from "./controllers/getMe";
import postLogoutController from "./controllers/postLogout";

const app = express();
const port = process.env.PORT ?? 4000;

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(
  session({
    name: "legacy-auth.sid",
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 5, // 5 minutes
    },
  })
);

app.use("/auth", postLoginController);
app.use("/auth", getMeController);
app.use("/auth", postLogoutController);
app.use("/", postUserController);
app.use("/", getTasksController);

app.listen(port, () => {
  console.log(`Legacy Auth API listening on port ${port}`);
});
