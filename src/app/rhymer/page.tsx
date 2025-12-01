'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import * as rhymerCn from '@/lib/rhymer/rhymer_cn';
import * as rhymerEn from '@/lib/rhymer/rhymer_en';
import type { Language, RhymeType } from '@/lib/rhymer/types';

export default function RhymerPage() {
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState<Language>('cn');
  const [typeIndex, setTypeIndex] = useState(1); // Default to Double
  const [toneMatch, setToneMatch] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const types = ['单押 (Single)', '双押 (Double)', '三押 (Triple)', '四押 (Quad)'];

  const handleSearch = async () => {
    if (!inputValue.trim()) {
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      let rhymes: string[] = [];
      
      if (language === 'cn') {
        const type = (parseInt(String(typeIndex)) + 1) as RhymeType;
        rhymes = await rhymerCn.getRhymes(inputValue, type, toneMatch);
      } else {
        rhymes = await rhymerEn.getRhymes(inputValue);
      }

      setResults(rhymes);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <motion.header
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 text-white">押韵 Rhymer</h1>
        </motion.header>

        <div className="space-y-6">
          {/* Search Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入词汇..."
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 outline-none focus:border-neutral-500 transition-colors"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !inputValue.trim()}
              className="bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-lg font-medium transition-colors flex items-center gap-2 border border-neutral-700"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? '搜索中...' : '搜索'}
            </button>
          </div>

          {/* Options */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 space-y-4">
            {/* Language Selection */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 w-20">语言:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => { setLanguage('cn'); setResults([]); setHasSearched(false); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    language === 'cn'
                      ? 'bg-neutral-700 text-white'
                      : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'
                  }`}
                >
                  中文
                </button>
                <button
                  onClick={() => { setLanguage('en'); setResults([]); setHasSearched(false); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    language === 'en'
                      ? 'bg-neutral-700 text-white'
                      : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Chinese Options */}
            {language === 'cn' && (
              <>
                {/* Rhyme Type */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 w-20">押韵类型:</span>
                  <select
                    value={typeIndex}
                    onChange={(e) => setTypeIndex(Number(e.target.value))}
                    className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 outline-none focus:border-neutral-500"
                  >
                    {types.map((type, index) => (
                      <option key={index} value={index}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tone Match */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 w-20">匹配声调:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={toneMatch}
                      onChange={(e) => setToneMatch(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-600"></div>
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Results */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 min-h-[300px] max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
              </div>
            ) : results.length === 0 && hasSearched ? (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                未找到押韵词汇
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {results.map((word, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.01 }}
                    className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg text-center transition-colors cursor-default"
                  >
                    {word}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                输入词汇并点击搜索
              </div>
            )}
          </div>

          {/* Result Count */}
          {results.length > 0 && (
            <div className="text-center text-gray-500 text-sm">
              找到 {results.length} 个押韵词
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
