import { Router, Request, Response } from "express";
import prismaClient from "../lib/prisma";
import argon2 from "argon2";

const router = Router();

router.post("/logout", async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ message: "Failed to logout" });
    }
    res.status(200).send({ message: "Logout successful" });
  });
});

export default router;
