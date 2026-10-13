import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, Classroom, User } from '../types';
import { api } from '../api';
import { Trophy, Medal, Sparkles, Filter } from 'lucide-react';

interface LeaderboardViewProps {
  currentUser: User;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ currentUser }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classes, board] = await Promise.all([
        api.getClassrooms(),
        api.getLeaderboard(selectedClassroomId || undefined),
      ]);
      setClassrooms(classes);
      setLeaderboard(board);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedClassroomId]);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Hero Header */}
      <div className="bg-[#211d17] border-4 border-[#a62b2b] p-6 rounded-lg text-center shadow-xl">
        <h2 className="font-press-start text-base sm:text-lg text-[#fbbf24] flex items-center justify-center gap-2">
          <Trophy className="w-5 h-5 text-[#fbbf24]" />
          TABLA DE HONOR DE LOS GUERREROS AJAU
        </h2>
        <p className="font-silkscreen text-xs text-[#d1d5db] mt-2 max-w-lg mx-auto">
          Los estudiantes que acumulan más gemas de jade y sellos estelares consagran su nombre en el templo mayor.
        </p>

        {/* Classroom Filter */}
        {classrooms.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Filter className="w-4 h-4 text-[#d99b26]" />
            <select
              value={selectedClassroomId}
              onChange={(e) => setSelectedClassroomId(e.target.value)}
              className="bg-[#111] border-2 border-[#d99b26] text-[#fbbf24] font-silkscreen text-xs px-3 py-1.5 rounded outline-none cursor-pointer"
            >
              <option value="">Clasificación Global (Todos los Templos)</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  Aula: {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 pb-2">
          {/* 2nd Place */}
          <div className="bg-[#1e1e1e] border-2 border-[#94a3b8] p-3 rounded-lg text-center flex flex-col items-center">
            <Medal className="w-6 h-6 text-[#94a3b8] mb-1" />
            <span className="font-press-start text-[10px] text-[#94a3b8]">2° LUGAR</span>
            <div className="font-press-start text-xs text-[#f4efe6] mt-1 line-clamp-1">
              {leaderboard[1].nickname}
            </div>
            <div className="font-silkscreen text-xs text-[#22c55e] mt-1">
              🟢 {leaderboard[1].jadeCoins}
            </div>
          </div>

          {/* 1st Place */}
          <div className="bg-[#2b220e] border-4 border-[#d99b26] p-4 rounded-lg text-center flex flex-col items-center transform -translate-y-2 shadow-2xl">
            <Trophy className="w-8 h-8 text-[#fbbf24] mb-1 animate-bounce" />
            <span className="font-press-start text-xs text-[#fbbf24]">1° GRAN AJAU</span>
            <div className="font-press-start text-sm text-[#f4efe6] mt-1 font-bold line-clamp-1">
              {leaderboard[0].nickname}
            </div>
            <div className="font-silkscreen text-xs text-[#fbbf24] mt-1 font-bold">
              🟢 {leaderboard[0].jadeCoins} JADE
            </div>
          </div>

          {/* 3rd Place */}
          <div className="bg-[#1e1e1e] border-2 border-[#b45309] p-3 rounded-lg text-center flex flex-col items-center">
            <Medal className="w-6 h-6 text-[#b45309] mb-1" />
            <span className="font-press-start text-[10px] text-[#b45309]">3° LUGAR</span>
            <div className="font-press-start text-xs text-[#f4efe6] mt-1 line-clamp-1">
              {leaderboard[2].nickname}
            </div>
            <div className="font-silkscreen text-xs text-[#22c55e] mt-1">
              🟢 {leaderboard[2].jadeCoins}
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-[#1a1a1a] border-2 border-[#333] rounded-lg overflow-hidden shadow-lg">
        <div className="grid grid-cols-12 bg-[#262626] p-3 font-press-start text-[10px] text-[#9ca3af] border-b border-[#333]">
          <div className="col-span-2 text-center">RANGO</div>
          <div className="col-span-4">GUERRERO</div>
          <div className="col-span-3 text-right">JADE COINS</div>
          <div className="col-span-3 text-right">ESTRELLAS</div>
        </div>

        <div className="divide-y divide-[#262626]">
          {leaderboard.map((entry) => {
            const isMe = entry.userId === currentUser.id;

            return (
              <div
                key={entry.userId}
                className={`grid grid-cols-12 p-3 items-center transition ${
                  isMe ? 'bg-[#31250b] border-l-4 border-[#d99b26]' : 'hover:bg-[#222]'
                }`}
              >
                <div className="col-span-2 text-center font-press-start text-xs">
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                </div>
                <div className="col-span-4">
                  <span className="font-press-start text-xs text-[#f4efe6]">
                    {entry.nickname}
                  </span>
                  {isMe && (
                    <span className="ml-2 font-silkscreen text-[9px] bg-[#d99b26] text-black px-1.5 py-0.5 rounded font-bold">
                      TÚ
                    </span>
                  )}
                </div>
                <div className="col-span-3 text-right font-silkscreen text-xs text-[#22c55e] font-bold">
                  🟢 {entry.jadeCoins}
                </div>
                <div className="col-span-3 text-right font-silkscreen text-xs text-[#fbbf24]">
                  ⭐ {entry.totalStars}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
