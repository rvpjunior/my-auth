import { Router, Request, Response } from "express";
import prismaClient from "../lib/prisma";
import argon2 from "argon2";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  const user = await prismaClient.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).send({ message: "Invalid credentials" });
  }

  const isPasswordValid = await argon2.verify(user.passwordHash, password);

  if (!isPasswordValid) {
    return res.status(401).send({ message: "Invalid credentials" });
  }

  req.session.user = { id: user.id };

  res.status(200).send({ message: "Login successful" });
});

export default router;
