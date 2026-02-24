import { Router, Request, Response } from "express";

const router = Router();

router.get("/tasks", async (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  res.status(200).send({ tasks: ["Task 1", "Task 2", "Task 3"] });
});

export default router;
