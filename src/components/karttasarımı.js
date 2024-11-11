import React from 'react';
import { Card } from '@/components/ui/card';
import { Speaker, BookOpen, BookmarkIcon, Share } from 'lucide-react';

const UltraPremiumDictionaryCard = ({
  word = "abate",
  pronunciation = "əˈbeɪt",
  meaning = "become less in amount or intensity",
  example = "The storm that had been raging for hours finally began to abate after a few hours",
  synonyms = ["subside", "ease (off)", "lessen"]
}) => {
  return (
    <div className="p-8 w-full max-w-3xl mx-auto bg-zinc-950">
      <Card className="relative overflow-hidden rounded-[3rem] border-0 bg-zinc-900">
        {/* Dark mode optimized gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-indigo-950/30 to-zinc-950/20" />

        {/* Subtle animated grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:14px_24px] opacity-20" />

        {/* Enhanced glass morphism for dark mode */}
        <div className="absolute inset-0 backdrop-blur-xl bg-zinc-900/30" />

        {/* Main content container */}
        <div className="relative">
          {/* Action bar with glowing effects */}
          <div className="flex justify-end space-x-2 p-6 bg-zinc-800/30 backdrop-blur-xl border-b border-zinc-700/30">
            <button className="p-3 rounded-2xl bg-zinc-800/50 hover:bg-violet-600/20 transition-all duration-300 group">
              <Speaker className="w-5 h-5 text-zinc-400 group-hover:text-violet-400 transition-colors" />
            </button>
            <button className="p-3 rounded-2xl bg-zinc-800/50 hover:bg-violet-600/20 transition-all duration-300 group">
              <BookmarkIcon className="w-5 h-5 text-zinc-400 group-hover:text-violet-400 transition-colors" />
            </button>
            <button className="p-3 rounded-2xl bg-zinc-800/50 hover:bg-violet-600/20 transition-all duration-300 group">
              <Share className="w-5 h-5 text-zinc-400 group-hover:text-violet-400 transition-colors" />
            </button>
          </div>

          {/* Content wrapper with enhanced spacing */}
          <div className="px-12 py-10 space-y-10">
            {/* Word section with glowing gradient */}
            <div className="space-y-6">
              <div className="flex items-end justify-between">
                <div className="space-y-2">
                  <h2 className="text-6xl font-bold tracking-tight bg-gradient-to-br from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {word}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm px-4 py-1.5 rounded-full bg-violet-950/50 text-violet-400 font-medium border border-violet-700/30">
                      verb
                    </span>
                    <span className="text-lg font-light text-zinc-400 tracking-wide">
                      {pronunciation}
                    </span>
                  </div>
                </div>
                <BookOpen className="w-7 h-7 text-violet-400" />
              </div>
            </div>

            {/* Meaning section with glass effect */}
            <div className="space-y-3 p-6 rounded-3xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/30 backdrop-blur-xl">
              <p className="text-sm font-medium text-violet-400 tracking-wide">
                anlam
              </p>
              <p className="text-2xl text-zinc-100 font-normal leading-relaxed tracking-tight">
                {meaning}
              </p>
            </div>

            {/* Example section with highlight effect */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-violet-400 tracking-wide">
                örnek cümle
              </p>
              <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-950/30 to-zinc-900/30 border border-violet-800/20">
                <p className="text-xl text-zinc-300 leading-relaxed tracking-tight">
                  {example.split(word).map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="text-violet-400 font-medium">
                          {word}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>

            {/* Synonyms section with floating cards */}
            <div className="space-y-5">
              <p className="text-sm font-medium text-violet-400 tracking-wide">
                benzerleri
              </p>
              <div className="flex flex-wrap gap-2">
                {synonyms.map((synonym, index) => (
                  <span
                    key={index}
                    className="px-6 py-3 rounded-2xl text-sm font-medium
                      bg-gradient-to-br from-zinc-800/80 to-zinc-900/80
                      shadow-[0_2px_14px_-6px_rgba(139,92,246,0.3)]
                      border border-zinc-700/30
                      text-zinc-300
                      hover:scale-105 hover:-translate-y-0.5
                      hover:bg-gradient-to-br hover:from-violet-900/50 hover:to-zinc-800/50
                      hover:border-violet-700/40
                      hover:text-violet-300
                      hover:shadow-[0_4px_18px_-4px_rgba(139,92,246,0.4)]
                      transition-all duration-300 ease-out cursor-pointer"
                  >
                    {synonym}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UltraPremiumDictionaryCard;