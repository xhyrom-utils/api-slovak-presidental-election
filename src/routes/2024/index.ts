import { Hono } from "hono";
import first from "./first";
import second from "./second";

const router = new Hono();

router.route("/", first);
router.route("/first", first);

router.use("/second/*", async (c, next) => {
  // 6th april 2024
  if (Date.now() < 1712354400000) {
    c.status(404);
    return c.json({ error: "No data yet" });
  }

  await next();
});
router.route("/second", second);

export default router;
