import { writeFileSync } from "node:fs";

const URL = "https://spe.xhyrom.dev";
const year = new Date().getFullYear();
const type = "second";

export function url() {
  return `${URL}/${year}/${type}`;
}

export async function main() {
  const response = await fetch(url());
  const data = await response.json();
  return data;
}

export async function regions() {
  const response = await fetch(url() + "/regions");
  const data = await response.json();
  return data;
}

export async function region(code) {
  const response = await fetch(url() + `/region/${code}`);
  const data = await response.json();
  return data;
}

let result = "";

result += `export const main = ${JSON.stringify(await main())};`;
result += "\n";
result += `export const regions = ${JSON.stringify(await regions())};`;
result += "\n";

result += "export const region = {";

const regionCodes = ["BL", "TA", "TC", "NI", "ZI", "BC", "PV", "KI"];
for (const i in regionCodes) {
  const code = regionCodes[i];

  result += `\n  ${i}: ${JSON.stringify(await region(code))},`;
}

result += "\n};";

writeFileSync(`src/archive/${year}/${type}.ts`, result);
