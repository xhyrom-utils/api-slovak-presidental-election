import { isObvodDistrict } from "./data";
import { District } from "./types";

export const fetchRegion = async (regionId: string): Promise<any> => {
  return (await (
    await fetch(
      `https://services.cms.markiza.sk/data/volby2024data/prezident/2/${regionId}.json?_=${Date.now()}`
    )
  ).json()) as any;
};

export const fetchObvod = async (obvodId: string): Promise<any> => {
  return (await (
    await fetch(
      `https://services.cms.markiza.sk/data/volby2024data/prezident/2/obvod-${obvodId}.json?_=${Date.now()}`
    )
  ).json()) as any;
};

export const getDistricts = async (
  data: any,
  recursive: boolean
): Promise<District[]> => {
  const districts: District[] = [];

  for (const [obvodId, obvod] of Object.entries(data.OBVOD_LIST) as any[]) {
    if (isObvodDistrict(parseInt(obvodId)) || !recursive) {
      districts.push({
        name: obvod.NAME,
        votes: obvod.P_HL,
        votes_percentage: parseFloat(obvod.PROGRESS),
        attendance: obvod.UCAST,
        candidates: obvod.PS_LIST.filter((c: any) => c.POZNAMKA != "X").map(
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
      });
    } else {
      const obvodData = await fetchObvod(obvodId);
      const obvodDistricts = await getDistricts(obvodData, false);
      districts.push(...obvodDistricts);
    }
  }

  return districts;
};
