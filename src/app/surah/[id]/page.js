"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import quranData from "../../../quran.json";
import ThemeToggle from "../../components/ThemeToggle";

const RECITER_BASE_URL = "https://everyayah.com/data/Alafasy_128kbps";

export default function SurahDetail({ params }) {
  const [resolvedId, setResolvedId] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    Promise.resolve(params).then((resolvedParams) => {
      setResolvedId(resolvedParams?.id || null);
    });
  }, [params]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const surahIndex = useMemo(() => {
    if (!resolvedId) {
      return -1;
    }

    return quranData.findIndex((item) => item.id === Number(resolvedId));
  }, [resolvedId]);

  const surah = surahIndex >= 0 ? quranData[surahIndex] : null;
  const previousSurah = surahIndex > 0 ? quranData[surahIndex - 1] : null;
  const nextSurah =
    surahIndex >= 0 && surahIndex < quranData.length - 1
      ? quranData[surahIndex + 1]
      : null;

  const handleCopy = async (verse) => {
    if (!surah) {
      return;
    }

    const textToCopy = [
      "Quranka Kariimka",
      `Suuradda: ${surah.name_ar} (${surah.name_osmanya})`,
      `Aayadda ${verse.id}`,
      "",
      verse.ar,
      "",
      verse.osm,
      "",
      verse.somali,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(verse.id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setCopiedId(null);
    }
  };

  const handlePlayAudio = async (verseId) => {
    if (!surah) {
      return;
    }

    if (playingId === verseId) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    audioRef.current?.pause();

    const surahStr = String(surah.id).padStart(3, "0");
    const verseStr = String(verseId).padStart(3, "0");
    const audio = new Audio(`${RECITER_BASE_URL}/${surahStr}${verseStr}.mp3`);

    audioRef.current = audio;
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => setPlayingId(null);

    try {
      await audio.play();
      setPlayingId(verseId);
    } catch {
      setPlayingId(null);
    }
  };

  if (!resolvedId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-100 dark:bg-black">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-black border-t-transparent" />
          <p className="text-sm font-bold text-slate-500 dark:text-slate-300">Soo raraya...</p>
        </div>
      </main>
    );
  }

  if (!surah) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-100 p-6 text-center dark:bg-black">
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">
          Suuradda lama helin
        </h1>
        <Link
          href="/"
          className="mt-5 rounded-lg bg-black px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-slate-800 dark:border dark:border-white"
        >
          Ku laabo bogga hore
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 text-black dark:bg-black dark:text-white">
      <header className="border-b border-black bg-white dark:border-white dark:bg-black">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex rounded-md border border-black bg-white px-3 py-2 text-sm font-bold text-black hover:bg-black hover:text-white dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
            >
              &lt;- Liiska suuradaha
            </Link>
            <ThemeToggle />
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-black dark:text-white">
                Suuradda {surah.id}
              </p>
              <h1
                dir="rtl"
                className="mt-3 font-serif text-5xl font-black leading-tight text-black dark:text-white sm:text-6xl"
              >
                {surah.name_ar}
              </h1>
              <p className="mt-3 font-osmanya text-3xl font-bold text-black dark:text-white">
                {surah.name_osmanya}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:min-w-72">
              <Meta label="Nooca" value={surah.type === "Meccan" ? "Makki" : "Madani"} />
              <Meta label="Aayado" value={surah.verses_count || surah.verses.length} />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {previousSurah && (
              <Link
                href={`/surah/${previousSurah.id}`}
                className="rounded-lg border border-black bg-white px-4 py-3 text-sm font-bold text-black shadow-sm hover:bg-black hover:text-white dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
                &lt;- {previousSurah.name_ar}
              </Link>
            )}
            {nextSurah && (
              <Link
                href={`/surah/${nextSurah.id}`}
                className="rounded-lg border border-black bg-white px-4 py-3 text-sm font-bold text-black shadow-sm hover:bg-black hover:text-white dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black sm:ml-auto"
              >
                {nextSurah.name_ar} -&gt;
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {surah.verses.map((verse) => (
            <article
              key={verse.id}
              className="rounded-lg border border-slate-300 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-black sm:p-6"
            >
              <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-black text-sm font-black text-white dark:bg-white dark:text-black">
                  {verse.id}
                </span>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(verse.id)}
                    className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
                      playingId === verse.id
                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                        : "border-black bg-white text-black hover:bg-black hover:text-white dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
                    }`}
                  >
                    {playingId === verse.id ? "Jooji codka" : "Dhageyso"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(verse)}
                    className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
                      copiedId === verse.id
                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                        : "border-black bg-white text-black hover:bg-black hover:text-white dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
                    }`}
                  >
                    {copiedId === verse.id ? "Waa la koobiyey" : "Koobi"}
                  </button>
                </div>
              </div>

              <p
                dir="rtl"
                className="font-serif text-3xl font-bold leading-[2.15] text-slate-950 dark:text-white sm:text-4xl"
              >
                {verse.ar}
              </p>

              <div className="my-6 h-px bg-slate-100 dark:bg-slate-800" />

              <p className="font-osmanya text-2xl font-bold leading-[2] text-black dark:text-white sm:text-3xl">
                {verse.osm}
              </p>

              {verse.somali && (
                <p className="mt-5 rounded-md bg-slate-50 px-4 py-3 text-base leading-7 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {verse.somali}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Meta({ label, value }) {
  return (
    <div className="rounded-lg border border-black bg-white p-4 dark:border-white dark:bg-black">
      <p className="text-xl font-black text-black dark:text-white">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}
