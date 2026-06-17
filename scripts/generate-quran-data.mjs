import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ARABIC_SOURCE = "https://api.alquran.cloud/v1/quran/quran-uthmani";
const SOMALI_SOURCE = "https://api.alquran.cloud/v1/quran/so.abduh";

const osmanyaMap = new Map([
  ["kh", "𐒅"],
  ["sh", "𐒉"],
  ["dh", "𐒊"],
  ["aa", "𐒛"],
  ["ee", "𐒜"],
  ["ii", "𐒕"],
  ["oo", "𐒝"],
  ["uu", "𐒓"],
  ["b", "𐒁"],
  ["t", "𐒂"],
  ["j", "𐒃"],
  ["x", "𐒄"],
  ["d", "𐒆"],
  ["r", "𐒇"],
  ["s", "𐒈"],
  ["g", "𐒌"],
  ["c", "𐒋"],
  ["f", "𐒍"],
  ["q", "𐒎"],
  ["k", "𐒏"],
  ["l", "𐒐"],
  ["m", "𐒑"],
  ["n", "𐒒"],
  ["w", "𐒓"],
  ["h", "𐒔"],
  ["y", "𐒕"],
  ["a", "𐒖"],
  ["e", "𐒗"],
  ["i", "𐒘"],
  ["o", "𐒙"],
  ["u", "𐒚"],
]);

function latinToOsmanya(text = "") {
  let output = "";
  let index = 0;
  const normalized = text.toLowerCase();

  while (index < normalized.length) {
    const two = normalized.slice(index, index + 2);
    const one = normalized[index];

    if (osmanyaMap.has(two)) {
      output += osmanyaMap.get(two);
      index += 2;
      continue;
    }

    output += osmanyaMap.get(one) || text[index];
    index += 1;
  }

  return output;
}

async function fetchEdition(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const payload = await response.json();

  if (payload.code !== 200 || !payload.data?.surahs) {
    throw new Error(`Unexpected response from ${url}`);
  }

  return payload.data.surahs;
}

function buildSurah(arabicSurah, somaliSurah) {
  const verses = arabicSurah.ayahs.map((ayah, index) => {
    const somali = somaliSurah.ayahs[index]?.text || "";

    return {
      id: ayah.numberInSurah,
      ar: ayah.text,
      osm: latinToOsmanya(somali),
      somali,
    };
  });

  return {
    id: arabicSurah.number,
    name_ar: arabicSurah.name,
    name_osmanya: latinToOsmanya(arabicSurah.englishName),
    type: arabicSurah.revelationType,
    verses_count: verses.length,
    verses,
  };
}

const [arabicSurahs, somaliSurahs] = await Promise.all([
  fetchEdition(ARABIC_SOURCE),
  fetchEdition(SOMALI_SOURCE),
]);

if (arabicSurahs.length !== 114 || somaliSurahs.length !== 114) {
  throw new Error(
    `Expected 114 surahs, received Arabic=${arabicSurahs.length}, Somali=${somaliSurahs.length}`,
  );
}

const quranData = arabicSurahs.map((arabicSurah, index) => {
  const somaliSurah = somaliSurahs[index];

  if (arabicSurah.number !== somaliSurah.number) {
    throw new Error(`Surah mismatch at index ${index}`);
  }

  return buildSurah(arabicSurah, somaliSurah);
});

const totalVerses = quranData.reduce((sum, surah) => sum + surah.verses.length, 0);

if (totalVerses !== 6236) {
  throw new Error(`Expected 6236 verses, received ${totalVerses}`);
}

const json = `${JSON.stringify(quranData, null, 2)}\n`;
const root = process.cwd();
const publicDataDir = path.join(root, "public", "data");

await mkdir(publicDataDir, { recursive: true });
await writeFile(path.join(root, "src", "quran.json"), json, "utf8");
await writeFile(path.join(root, "quran.json"), json, "utf8");
await writeFile(path.join(publicDataDir, "quran.json"), json, "utf8");

console.log(`Generated ${quranData.length} surahs and ${totalVerses} verses.`);
