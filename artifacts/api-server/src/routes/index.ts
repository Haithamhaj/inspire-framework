import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import assessmentsRouter from "./assessments";
import resultsRouter from "./results";
import adminRouter from "./admin";
import billingRouter from "./billing";
import questionsRouter from "./questions";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(assessmentsRouter);
router.use(resultsRouter);
router.use(adminRouter);
router.use(billingRouter);
router.use(questionsRouter);

export default router;
