import { Hono } from "hono";
import { main, regions, region as regionMap } from "../../archive/2024/first";
import { ISO_REGION_TO_ID } from "../../data";

const router = new Hono();

router.get("/", async (c) => {
  return c.json(main);
});

router.get("/regions", async (c) => {
  return c.json(regions);
});

router.get("/region/:region", async (c) => {
  const region = ISO_REGION_TO_ID[
    c.req.param("region") as keyof typeof ISO_REGION_TO_ID
  ] as keyof typeof regionMap;

  if (!region || !(region in regionMap)) {
    c.status(404);
    return c.json({ error: "Region not found" });
  }

  return c.json(regionMap[region]);
});

export default router;
