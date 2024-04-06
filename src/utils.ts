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
      });
    } else {
      const obvodData = await fetchObvod(obvodId);
      const obvodDistricts = await getDistricts(obvodData, false);
      districts.push(...obvodDistricts);
    }
  }

  return districts;
};
