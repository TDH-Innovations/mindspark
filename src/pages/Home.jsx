import React from "react";

export default function Home() {
  const games = [
    {
      id: "quick-tap",
      title: "Quick Tap",
      emoji: "⚡",
      description: "Test your memory & speed",
      difficulty: "medium",
      completed: false,
    },
    {
      id: "word-chain",
      title: "Word Chain",
      emoji: "📝",
      description: "Build words from letters",
      difficulty: "medium",
      completed: false,
    },
    {
      id: "color-match",
      title: "Color Match",
      emoji: "🎨",
      description: "Find the different shade",
      difficulty: "easy",
      completed: false,
    },
    {
      id: "number-ninjas",
      title: "Number Ninjas",
      emoji: "🔢",
      description: "Lightning-fast math",
      difficulty: "hard",
      completed: false,
    },
    {
      id: "daily-goals",
      title: "Daily Goals",
      emoji: "🎯",
      description: "Set your daily intentions",
      difficulty: "easy",
      completed: false,
    },
  ];

  const completedCount = games.filter((g) => g.completed).length;
  const totalGames = games.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 text-white text-center">
        <h1 className="text-3xl font-bold tracking-tight">🧠 Brain Boost</h1>
        <p className="text-indigo-100 mt-1 text-sm">Daily mental warm-up</p>
      </div>

      {/* Progress */}
      <div className="mx-6 mb-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Today's Progress</span>
          <span className="text-sm font-medium">
            {completedCount}/{totalGames} games
          </span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-3">
          <div
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${(completedCount / totalGames) * 100}%` }}
          />
        </div>
        {completedCount === totalGames && (
          <p className="text-center mt-2 text-sm font-semibold">
            🎉 All done! Amazing work!
          </p>
        )}
      </div>

      {/* Games Grid */}
      <div className="px-6 pb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {games.map((game) => (
          <div
            key={game.id}
            className={`relative bg-white rounded-2xl p-5 shadow-lg cursor-pointer transition-transform active:scale-95 hover:scale-[1.02] ${
              game.completed ? "opacity-75" : ""
            }`}
          >
            {game.completed && (
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                ✓ Done
              </div>
            )}
            <div className="text-4xl mb-3">{game.emoji}</div>
            <h3 className="text-lg font-bold text-gray-800">{game.title}</h3>
            <p className="text-gray-500 text-sm mt-1">{game.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  game.difficulty === "easy"
                    ? "bg-green-100 text-green-700"
                    : game.difficulty === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {game.difficulty}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}