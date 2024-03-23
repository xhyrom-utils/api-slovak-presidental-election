import { Hono } from "hono";
import { ISO_REGIONS, ISO_REGION_TO_ID } from "./data";
import { District, Region, Slovakia } from "./types";
import { getDistricts } from "./utils";

const app = new Hono();

type SlovakiaWRegions = Slovakia & {
  regions: Record<string, Region>;
};

app.get("/2024", async (c) => {
  const data = (await (
    await fetch(
      `https://services.cms.markiza.sk/data/volby2024data/prezident/1/homepage.json?_=${Date.now()}`
    )
  ).json()) as any;

  return c.json({
    data: {
      votes: data.P_HL,
      votes_percentage: data.PROGRESS,
      attendance: data.UCAST,
    },
    whole: data.PS_LIST.filter((c: any) => c.POZNAMKA != "X").map(
      (candidate: any) => ({
        first_name: candidate.MENO,
        last_name:
          candidate.PRIEZVISKO.slice(0, 1).toLocaleUpperCase() +
          candidate.PRIEZVISKO.slice(1).toLocaleLowerCase(),
        title: candidate.TITUL,
        votes: candidate.P_HL,
        votes_percentage: parseFloat(candidate.P_HL_PCT),
      })
    ),
  } as Slovakia);
});

app.get("/2024/regions", async (c) => {
  const data = (await (
    await fetch(
      `https://services.cms.markiza.sk/data/volby2024data/prezident/1/homepage.json?_=${Date.now()}`
    )
  ).json()) as any;

  return c.json({
    data: {
      votes: data.P_HL,
      votes_percentage: data.PROGRESS,
      attendance: data.UCAST,
    },
    whole: data.PS_LIST.filter((c: any) => c.POZNAMKA != "X").map(
      (candidate: any) => ({
        first_name: candidate.MENO,
        last_name:
          candidate.PRIEZVISKO.slice(0, 1).toLocaleUpperCase() +
          candidate.PRIEZVISKO.slice(1).toLocaleLowerCase(),
        title: candidate.TITUL,
        votes: candidate.P_HL,
        votes_percentage: parseFloat(candidate.P_HL_PCT),
      })
    ),
    regions: Object.fromEntries(
      Object.entries(data.OBVOD_LIST).map(([id, region]: [string, any]) => [
        ISO_REGIONS[parseInt(id) as keyof typeof ISO_REGIONS],
        {
          votes: region.P_HL,
          votes_percentage: parseFloat(region.P_HL_PCT),
          attendance: region.UCAST,
          candidates: region.PS_LIST.filter((c: any) => c.POZNAMKA != "X").map(
            (candidate: any) => ({
              first_name: candidate.MENO,
              last_name:
                candidate.PRIEZVISKO.slice(0, 1).toLocaleUpperCase() +
                candidate.PRIEZVISKO.slice(1).toLocaleLowerCase(),
              title: candidate.TITUL,
              votes: candidate.P_HL,
              votes_percentage: parseFloat(candidate.P_HL_PCT),
            })
          ),
        },
      ])
    ),
  } as SlovakiaWRegions);
});

app.get("/2024/region/:region", async (c) => {
  const id =
    ISO_REGION_TO_ID[c.req.param("region") as keyof typeof ISO_REGION_TO_ID];

  if (!id) {
    c.status(404);
    return c.json({ error: "Region not found" });
  }

  const req = (await (
    await fetch(
      `https://services.cms.markiza.sk/data/volby2024data/prezident/1/${id}.json?_=${Date.now()}`
    )
  ).json()) as any;

  const districts: District[] = await getDistricts(req, true);

  return c.json({
    votes: req.P_HL,
    votes_percentage: parseFloat(req.PROGRESS),
    attendance: req.UCAST,
    candidates: req.PS_LIST.filter((c: any) => c.POZNAMKA != "X").map(
      (candidate: any) => ({
        first_name: candidate.MENO,
        last_name:
          candidate.PRIEZVISKO.slice(0, 1).toLocaleUpperCase() +
          candidate.PRIEZVISKO.slice(1).toLocaleLowerCase(),
        title: candidate.TITUL,
        votes: candidate.P_HL,
        votes_percentage: parseFloat(candidate.P_HL_PCT),
      })
    ),
    districts,
  } as Region);
});

export default app;
