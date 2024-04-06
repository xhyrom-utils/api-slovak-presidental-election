import { Hono } from "hono";
import first from "./first";
import second from "./second";

const router = new Hono();

router.route("/", second);
router.route("/first", first);
router.route("/second", second);

export default router;
