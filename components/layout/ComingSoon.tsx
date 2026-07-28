"use client";

import { useEffect, useRef, useState } from "react";
import { Clock3, Rocket, Bell, Gamepad2, RotateCcw, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ComingSoonProps {
  title: string;
  description?: string;
}

// ---------- Game Config ----------
const DEFAULT_DURATION = 20; // seconds
const DURATION_OPTIONS = [15, 20, 30, 45];
const GOOD_EMOJIS = ["🍕", "🍔", "🍩", "🎯", "⭐", "🍎", "🍉", "🚀"];
const BAD_EMOJIS = ["💣", "🐛", "🦟", "☠️", "🕷️"];

const FUNNY_RESULTS = [
  { min: 0, max: 0, text: "0 points?! Were you playing with your eyes closed? 😴" },
  { min: 1, max: 5, text: "Not bad! About as sharp as swatting a mosquito 🦟" },
  { min: 6, max: 12, text: "Nice reflexes! You've got a knack for pizza-catching 🍕😎" },
  { min: 13, max: 20, text: "Amazing! You're basically an emoji ninja! 🥷🔥" },
  { min: 21, max: 9999, text: "Whoa, slow down! Are you secretly a robot? 🤖" },
];

function getFunnyResult(score: number) {
  return (
    FUNNY_RESULTS.find((r) => score >= r.min && score <= r.max)?.text ??
    "Game over! 🎮"
  );
}

function pickEmoji(forceBad: boolean) {
  // 35% base chance of a bomb, but never more than 2 good emojis in a row
  const isGood = forceBad ? false : Math.random() > 0.35;
  const pool = isGood ? GOOD_EMOJIS : BAD_EMOJIS;
  const emoji = pool[Math.floor(Math.random() * pool.length)];
  return { emoji, isGood };
}

function randomPosition() {
  // keep emoji within a safe % range so it doesn't overflow the box
  const top = 12 + Math.random() * 66; // 12% - 78%
  const left = 10 + Math.random() * 76; // 10% - 86%
  return { top: `${top}%`, left: `${left}%` };
}

// Angles for explosion particles, spread evenly around a circle
const PARTICLE_ANGLES = Array.from({ length: 10 }, (_, i) => (i * 360) / 10);

export default function ComingSoon({
  title,
  description = "We are working hard to bring this feature to you. Stay tuned for something amazing!",
}: ComingSoonProps) {
  const [showGame, setShowGame] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION);
  const [target, setTarget] = useState<{
    emoji: string;
    isGood: boolean;
    top: string;
    left: string;
    key: number;
  } | null>(null);
  const [popText, setPopText] = useState<{
    text: string;
    key: number;
    good: boolean;
  } | null>(null);
  const [explosion, setExplosion] = useState<{
    top: string;
    left: string;
    key: number;
  } | null>(null);
  const [flash, setFlash] = useState(false);

  const keyRef = useRef(0);
  const goodStreakRef = useRef(0);

  // Spawn a new emoji at a random spot
  const spawnTarget = () => {
    // Force a bomb after 2 good emojis in a row so bombs show up
    // at a steady pace instead of sometimes skipping the whole round
    const forceBad = goodStreakRef.current >= 2;
    const { emoji, isGood } = pickEmoji(forceBad);
    goodStreakRef.current = isGood ? goodStreakRef.current + 1 : 0;

    const { top, left } = randomPosition();
    keyRef.current += 1;
    setTarget({ emoji, isGood, top, left, key: keyRef.current });
  };

  // Game timer
  useEffect(() => {
    if (!isPlaying) return;

    if (timeLeft <= 0) {
      setIsPlaying(false);
      setTarget(null);
      setScore((s) => {
        setBestScore((b) => Math.max(b, s));
        return s;
      });
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  // Emoji respawn loop
  useEffect(() => {
    if (!isPlaying) return;
    spawnTarget();
    const spawnInterval = setInterval(spawnTarget, 1100);
    return () => clearInterval(spawnInterval);
  }, [isPlaying]);

  const startGame = () => {
    setShowGame(true);
    setScore(0);
    setTimeLeft(duration);
    setIsPlaying(true);
    setPopText(null);
    setExplosion(null);
    setFlash(false);
    goodStreakRef.current = 0;
  };

  const resetGame = () => {
    setShowGame(false);
    setIsPlaying(false);
    setTarget(null);
    setScore(0);
    setTimeLeft(duration);
  };

  const handleHit = () => {
    if (!target) return;

    if (target.isGood) {
      setScore((s) => s + 1);
      showPop("+1", true);
    } else {
      setScore((s) => Math.max(0, s - 2));
      showPop("-2", false);
      triggerExplosion(target.top, target.left);
    }
    setTarget(null);
  };

  const showPop = (text: string, good: boolean) => {
    keyRef.current += 1;
    setPopText({ text, key: keyRef.current, good });
    setTimeout(() => setPopText(null), 500);
  };

  const triggerExplosion = (top: string, left: string) => {
    keyRef.current += 1;
    setExplosion({ top, left, key: keyRef.current });
    setFlash(true);
    setTimeout(() => setExplosion(null), 550);
    setTimeout(() => setFlash(false), 280);
  };

  const progressPct = (timeLeft / duration) * 100;

  return (
    <div className="flex h-[700px] sm:min-h-screen items-center justify-center overflow-hidden rounded-2xl bg-white p-4 sm:p-6">
      <div className="flex w-full h-full max-w-2xl flex-col items-center text-center">
        <AnimatePresence mode="wait">
          {!showGame ? (
            // ---------------- COMING SOON VIEW ----------------
            <motion.div
              key="coming-soon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              {/* Icon Wrapper */}
              <div className="relative mb-6 sm:mb-8 flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center">
                {/* Moving Glow */}
                <motion.div
                  animate={{
                    x: [-18, 18, -18],
                    y: [-12, 12, -12],
                    scale: [1, 1.15, 1],
                    opacity: [0.35, 0.7, 0.35],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-violet-300 blur-3xl"
                />

                {/* Floating Icon */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-purple-50 shadow-lg"
                >
                  <Rocket className="h-8 w-8 sm:h-11 sm:w-11 text-violet-600" />
                </motion.div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {title} <span className="text-violet-600">Coming Soon</span>
              </h1>

              {/* Description */}
              <p className="mt-3 max-w-sm px-2 text-sm leading-6 text-gray-500">
                {description}
              </p>

              {/* Status Card */}
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 sm:px-5 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Clock3 className="h-5 w-5 text-violet-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">
                    Under Development
                  </p>
                  <p className="text-xs text-gray-500">
                    Expected launch soon
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-700 sm:w-auto">
                  <Bell className="h-4 w-4" />
                  Notify Me
                </button>

                <button
                  onClick={startGame}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-6 py-3 text-sm font-medium text-violet-700 transition hover:bg-violet-50 sm:w-auto"
                >
                  <Gamepad2 className="h-4 w-4" />
                  Play a Game
                </button>
              </div>

              {/* Duration picker */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 px-2 w-full">
                <span className="text-xs text-gray-400 w-full sm:w-auto">Round length:</span>
                {DURATION_OPTIONS.map((secs) => (
                  <button
                    key={secs}
                    onClick={() => setDuration(secs)}
                    className={`rounded-full px-2 py-1 text-xs font-medium transition ${
                      duration === secs
                        ? "bg-violet-600 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {secs}s
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            // ---------------- GAME VIEW ----------------
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex w-full flex-col items-center"
            >
              {/* Header */}
              <div className="mb-4 flex w-full items-center justify-between gap-2 rounded-2xl bg-gradient-to-r from-violet-50 via-white to-violet-50 px-3 sm:px-5 py-3 shadow-sm">
                <div className="text-left">
                  <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Score
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-violet-600">{score}</p>
                </div>

                <div className="flex flex-col items-center">
                  <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Time Left
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-800">
                    {timeLeft}s
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-right">
                    <p className="flex items-center justify-end gap-1 text-[10px] sm:text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      <Trophy className="h-3 w-3 text-amber-400" />
                      Best
                    </p>
                    <p className="text-sm sm:text-lg font-semibold text-gray-700">
                      {bestScore}
                    </p>
                  </div>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 sm:px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Exit</span>
                  </button>
                </div>
              </div>

              {/* Timer progress bar */}
              <div className="mb-4 h-1.5 w-[calc(100%-0.5rem)] overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.9, ease: "linear" }}
                />
              </div>

              {/* Game Board */}
              <div className="relative h-72 sm:h-96 md:h-[26rem] w-[calc(100%-0.5rem)] overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 shadow-inner">
                {isPlaying ? (
                  <>
                    {/* Red flash overlay on bomb hit */}
                    <AnimatePresence>
                      {flash && (
                        <motion.div
                          key="flash"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.55, 0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.28, ease: "easeOut" }}
                          className="pointer-events-none absolute inset-0 z-30 bg-red-500"
                        />
                      )}
                    </AnimatePresence>

                    {/* Explosion particles */}
                    <AnimatePresence>
                      {explosion && (
                        <div
                          key={explosion.key}
                          className="pointer-events-none absolute z-20 flex h-14 w-14 items-center justify-center"
                          style={{ top: explosion.top, left: explosion.left }}
                        >
                          {/* Central flash */}
                          <motion.span
                            initial={{ scale: 0.4, opacity: 1 }}
                            animate={{ scale: 2.2, opacity: 0 }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                            className="absolute text-4xl"
                          >
                            💥
                          </motion.span>
                          {/* Flying particles */}
                          {PARTICLE_ANGLES.map((angle, i) => {
                            const rad = (angle * Math.PI) / 180;
                            const dist = 55 + (i % 3) * 15;
                            const x = Math.cos(rad) * dist;
                            const y = Math.sin(rad) * dist;
                            return (
                              <motion.span
                                key={angle}
                                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                animate={{ x, y, opacity: 0, scale: 0.3 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="absolute h-2 w-2 rounded-full bg-gradient-to-br from-orange-400 to-red-600"
                              />
                            );
                          })}
                        </div>
                      )}
                    </AnimatePresence>

                    {/* Popup feedback text */}
                    <AnimatePresence>
                      {popText && (
                        <motion.div
                          key={popText.key}
                          initial={{ opacity: 0, y: 6, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1.15 }}
                          exit={{ opacity: 0, y: -6 }}
                          className={`pointer-events-none absolute left-1/2 top-10 z-30 -translate-x-1/2 text-lg sm:text-xl font-extrabold drop-shadow-sm ${
                            popText.good ? "text-emerald-500" : "text-red-500"
                          }`}
                        >
                          {popText.text}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Target emoji */}
                    <AnimatePresence>
                      {target && (
                        <motion.button
                          key={target.key}
                          onClick={handleHit}
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          style={{ top: target.top, left: target.left }}
                          className="absolute z-10 flex h-12 w-12 sm:h-16 sm:w-16 cursor-pointer items-center justify-center rounded-full bg-white text-2xl sm:text-3xl shadow-lg ring-1 ring-black/5"
                        >
                          {target.emoji}
                        </motion.button>
                      )}
                    </AnimatePresence>

                    <p className="absolute bottom-3 left-1/2 z-10 w-full -translate-x-1/2 px-3 text-center text-[11px] sm:text-xs text-gray-400">
                      Tap the treats (🍕🍔🍩⭐🍎) — avoid the bombs 💣!
                    </p>
                  </>
                ) : (
                  // ---------------- RESULT VIEW ----------------
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4 sm:p-6">
                    <span className="text-5xl sm:text-6xl">
                      {score >= 13 ? "🏆" : score >= 1 ? "😄" : "😅"}
                    </span>
                    <p className="text-lg sm:text-xl font-semibold text-gray-800">
                      Your Score: {score}
                    </p>
                    <p className="max-w-xs px-2 text-sm text-gray-500">
                      {getFunnyResult(score)}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center justify-center gap-2 px-2">
                      <span className="text-xs text-gray-400">Next round:</span>
                      {DURATION_OPTIONS.map((secs) => (
                        <button
                          key={secs}
                          onClick={() => setDuration(secs)}
                          className={`rounded-full px-2 sm:px-3 py-1 text-xs font-medium transition ${
                            duration === secs
                              ? "bg-violet-600 text-white"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {secs}s
                        </button>
                      ))}
                    </div>

                    <div className="mt-2 flex w-full flex-col gap-3 px-4 sm:w-auto sm:flex-row sm:px-0">
                      <button
                        onClick={startGame}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 sm:w-auto"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Play Again
                      </button>
                      <button
                        onClick={resetGame}
                        className="w-full rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 sm:w-auto"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}