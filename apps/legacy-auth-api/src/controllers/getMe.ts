import { Router, Request, Response } from "express";

const router = Router();

router.get("/me", async (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  res.status(200).send({ user: req.session.user });
});

export default router;
