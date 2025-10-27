import { Card } from "@/components/ui/card";
import { Trophy, Medal, Star, TrendingUp } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  gamesPlayed: number;
  winRate: number;
  avatar: string;
  level: number;
  xp: number;
  maxXp: number;
}

const Leaderboard = () => {
  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, name: "GK", score: 2850, gamesPlayed: 32, winRate: 89, avatar: "👦", level: 12, xp: 850, maxXp: 1000 },
    { rank: 2, name: "Archi", score: 2730, gamesPlayed: 28, winRate: 87, avatar: "👧", level: 11, xp: 730, maxXp: 1000 },
    { rank: 3, name: "Bakshi", score: 2650, gamesPlayed: 30, winRate: 83, avatar: "🧑", level: 11, xp: 650, maxXp: 1000 },
    { rank: 4, name: "Aaditya", score: 2480, gamesPlayed: 25, winRate: 82, avatar: "🧑", level: 10, xp: 480, maxXp: 1000 },
    { rank: 5, name: "Mahi", score: 2390, gamesPlayed: 27, winRate: 79, avatar: "👧", level: 10, xp: 390, maxXp: 1000 },
    { rank: 6, name: "Rahul", score: 2210, gamesPlayed: 24, winRate: 75, avatar: "🧑", level: 9, xp: 210, maxXp: 1000 },
    { rank: 7, name: "Krishna", score: 2150, gamesPlayed: 22, winRate: 73, avatar: "🧑", level: 9, xp: 150, maxXp: 1000 },
    { rank: 8, name: "Aarvi", score: 2080, gamesPlayed: 21, winRate: 71, avatar: "👧", level: 9, xp: 80, maxXp: 1000 },
    { rank: 9, name: "Aarju", score: 1950, gamesPlayed: 20, winRate: 68, avatar: "👧", level: 8, xp: 950, maxXp: 1000 },
    { rank: 10, name: "Ravi", score: 1880, gamesPlayed: 19, winRate: 65, avatar: "👨", level: 8, xp: 880, maxXp: 1000 },
    { rank: 11, name: "Aditya", score: 1750, gamesPlayed: 18, winRate: 62, avatar: "👦", level: 8, xp: 750, maxXp: 1000 },
    { rank: 12, name: "Kishn", score: 1680, gamesPlayed: 17, winRate: 59, avatar: "👦", level: 7, xp: 680, maxXp: 1000 },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return <Star className="w-5 h-5 text-muted-foreground" />;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-500/20 to-orange-500/20 border-yellow-500/50";
    if (rank === 2) return "from-gray-400/20 to-gray-500/20 border-gray-400/50";
    if (rank === 3) return "from-orange-600/20 to-orange-700/20 border-orange-600/50";
    return "from-muted/10 to-muted/20 border-border/30";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold neon-glow mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">Top performers in AI Mind Games</p>
        </div>
        <Trophy className="w-12 h-12 text-yellow-500 animate-float" />
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {leaderboardData.slice(0, 3).map((entry) => (
          <Card
            key={entry.rank}
            className={`glass-panel border-0 p-6 text-center ${
              entry.rank === 1 ? "md:order-2 md:scale-110" : entry.rank === 2 ? "md:order-1" : "md:order-3"
            }`}
          >
            <div className="text-5xl mb-3">{entry.avatar}</div>
            <div className="flex justify-center mb-2">{getRankIcon(entry.rank)}</div>
            <h3 className="font-bold text-lg mb-1">{entry.name}</h3>
            <p className="text-2xl font-bold text-primary">{entry.score}</p>
            <p className="text-xs text-muted-foreground mt-1">Level {entry.level}</p>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard */}
      <Card className="glass-panel border-0 p-6">
        <h2 className="text-2xl font-bold mb-6 neon-glow-cyan flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Full Rankings
        </h2>

        <div className="space-y-3">
          {leaderboardData.map((entry) => (
            <div
              key={entry.rank}
              className={`p-4 rounded-lg bg-gradient-to-r ${getRankColor(entry.rank)} border backdrop-blur-sm`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background/50">
                  {getRankIcon(entry.rank)}
                </div>

                <div className="text-3xl">{entry.avatar}</div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{entry.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-xs">
                      Level {entry.level}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Score: <span className="text-primary font-semibold">{entry.score}</span></span>
                    <span>Games: {entry.gamesPlayed}</span>
                    <span>Win Rate: {entry.winRate}%</span>
                  </div>

                  {/* XP Progress Bar */}
                  <div className="mt-2">
                    <div className="w-full bg-background/30 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                        style={{ width: `${(entry.xp / entry.maxXp) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      XP: {entry.xp} / {entry.maxXp}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;