import { Router, Request, Response } from "express";
import prismaClient from "../lib/prisma";
import argon2 from "argon2";

const router = Router();

router.post("/user", async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  const passwordHash = await argon2.hash(password);

  await prismaClient.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  res.status(200).send({ message: "User created successfully" });
});

export default router;
