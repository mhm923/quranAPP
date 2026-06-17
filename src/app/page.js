"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import quranData from "../quran.json";
import ThemeToggle from "./components/ThemeToggle";

const normalizeText = (value = "") => value.toString().trim().toLowerCase();

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [scriptMode, setScriptMode] = useState("both");

  const stats = useMemo(() => {
    const totalVerses = quranData.reduce((sum, surah) => {
      return sum + (surah.verses_count || surah.verses?.length || 0);
    }, 0);

    return {
      surahs: quranData.length,
      verses: totalVerses,
      meccan: quranData.filter((surah) => surah.type === "Meccan").length,
      medinan: quranData.filter((surah) => surah.type === "Medinan").length,
    };
  }, []);

  const filteredSurahs = useMemo(() => {
    const query = normalizeText(searchQuery);

    if (!query) {
      return quranData;
    }

    return quranData.filter((surah) => {
      return (
        normalizeText(surah.id).includes(query) ||
        normalizeText(surah.name_ar).includes(query) ||
        normalizeText(surah.name_osmanya).includes(query) ||
        normalizeText(surah.type).includes(query)
      );
    });
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-neutral-100 text-black dark:bg-black dark:text-white">
      <section className="border-b border-black bg-white dark:border-white dark:bg-black">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-black dark:text-white">
                Quranka Cismaaniya
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-black dark:text-white sm:text-4xl">
                Akhri Quranka Kariimka
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex w-fit rounded-lg border border-black bg-white p-1 dark:border-white dark:bg-black">
                {[
                  ["both", "Labada"],
                  ["ar", "Carabi"],
                  ["osm", "Cismaaniya"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setScriptMode(value)}
                    className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                      scriptMode === value
                        ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
                        : "text-slate-600 hover:bg-neutral-100 hover:text-black dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <ThemeToggle />
            </div>
          </nav>

          <div className="grid gap-4 md:grid-cols-[1fr_320px] md:items-end">
            <div>
              <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Liiska suuradaha, qoraalka Carabiga, farta Cismaaniya, tarjumaad
                Somali ah, iyo dhageysi aayad-aayad ah.
              </p>
              <label className="mt-6 block">
                <span className="sr-only">Raadi suurad</span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Raadi: nambar, magac Carabi, Cismaaniya, Makki ama Madani"
                  className="w-full rounded-lg border border-black bg-white px-4 py-3 text-base font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-4 focus:ring-black/10 dark:border-white dark:bg-black dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-white/20"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Stat label="Suurado" value={stats.surahs} />
              <Stat label="Aayado" value={stats.verses} />
              <Stat label="Makki" value={stats.meccan} />
              <Stat label="Madani" value={stats.medinan} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
            {filteredSurahs.length} suuradood ayaa muuqda
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="rounded-md border border-black bg-white px-3 py-2 text-sm font-bold text-black shadow-sm hover:bg-black hover:text-white dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
            >
              Nadiifi raadinta
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSurahs.map((surah) => (
            <Link
              href={`/surah/${surah.id}`}
              key={surah.id}
              className="group rounded-lg border border-slate-300 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-black hover:shadow-md dark:border-slate-700 dark:bg-black dark:hover:border-white"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-black text-sm font-black text-white dark:bg-white dark:text-black">
                  {surah.id}
                </span>

                <div className="min-w-0 flex-1">
                  {(scriptMode === "both" || scriptMode === "ar") && (
                    <h2
                      dir="rtl"
                      className="truncate text-right font-serif text-2xl font-bold text-slate-950 dark:text-white"
                    >
                      {surah.name_ar}
                    </h2>
                  )}
                  {(scriptMode === "both" || scriptMode === "osm") && (
                    <p className="mt-1 truncate font-osmanya text-xl font-bold text-black dark:text-white">
                      {surah.name_osmanya}
                    </p>
                  )}
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                    {surah.type === "Meccan" ? "Makki" : "Madani"} -{" "}
                    {surah.verses_count || surah.verses?.length || 0} aayadood
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-black">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Wax natiijo ah lama helin
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Isku day nambar suurad, magaca Carabiga, ama magaca Cismaaniya.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-black bg-white p-4 dark:border-white dark:bg-black">
      <p className="text-2xl font-black text-black dark:text-white">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}
