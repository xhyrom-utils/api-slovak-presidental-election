const obvody = {};

for (let i = 1; i <= 8; i++) {
  const res = await (
    await fetch(
      "https://services.cms.markiza.sk/data/volby2024data/prezident/1/" +
        i +
        ".json"
    )
  ).json();

  obvody[i] = Object.keys(res.OBVOD_LIST).map((k) => parseInt(k));
}

const obvod_is_district = [];

for (const [k, v] of Object.entries(obvody)) {
  for (const id of v) {
    const res = await (
      await fetch(
        "https://services.cms.markiza.sk/data/volby2024data/prezident/1/obvod-" +
          id +
          ".json"
      )
    ).json();

    if (Object.keys(res.OBVOD_LIST).length == 1) {
      obvod_is_district.push(id);
    }
  }
}

console.log(obvod_is_district);

export {};
