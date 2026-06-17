"use client";
import { useState } from 'react';
import Link from 'next/link';
import quranData from '../quran.json';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sifaynta suuradaha ku salaysan waxa uu qofku qorayo
  const filteredSurahs = quranData.filter(surah => {
    const query = searchQuery.toLowerCase();
    return (
      surah.name_ar.includes(query) || 
      surah.name_osmanya.toLowerCase().includes(query) ||
      surah.id.toString() === query
    );
  });

  return (
    <main className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-emerald-50/20 to-gray-50/50">
      <div className="max-w-4xl mx-auto">
        
        {/* Madaxa Bogga */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-emerald-950 mb-3 font-osmanya tracking-wide">
            𐒖𐒗𐒕𐒖𐒜𐒘𐒜𐒖 𐒖𐒗𐒈𐒖𐒜𐒘𐒕𐒜𐒘𐒜𐒖
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Akhriska Qur'anka Kariimka ee farta Far Soomaali Cismaaniya
          </p>
        </header>

        {/* Sanduuqa Raadinta (Search Bar) oo shaqaynaya */}
        <div className="mb-8 relative">
          <input 
            type="text" 
            placeholder="Raadi suurad... (Qor nambar, Carabi ama Cismaaniya)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 pl-12 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-left text-gray-800 font-medium"
          />
          <span className="absolute left-4 top-4 text-gray-400 font-bold">🔍</span>
        </div>

        {/* Grid-ka Suuradaha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSurahs.map((surah) => (
            <Link 
              href={`/surah/${surah.id}`} 
              key={surah.id}
              className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all duration-200 group hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 text-gray-500 font-extrabold text-sm border border-gray-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                  {surah.id}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 font-osmanya">
                    {surah.name_osmanya}
                  </h2>
                  <p className="text-xs font-semibold text-gray-400 mt-0.5">
                    {surah.type === 'Meccan' ? '𐒑𐒖𐒏𐒘𐒕𐒖' : '𐒑𐒖𐒔𐒘𐒒𐒘𐒕𐒖'} • {surah.verses_count} Aayadood
                  </p>
                </div>
              </div>

              <div className="text-right">
                <h3 className="text-2xl font-bold text-emerald-600 font-serif" dir="rtl">
                  {surah.name_ar}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Haddii waxba la waayo */}
        {filteredSurahs.length === 0 && (
          <div className="text-center py-12 text-gray-400 font-medium">
            Ma jirto suurad u dhiganta raadintaada.
          </div>
        )}

      </div>
    </main>
  );
}