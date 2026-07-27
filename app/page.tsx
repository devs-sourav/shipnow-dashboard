"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import LoginForm from "@/components/forms/LoginForm";

type Phase = "reveal" | "shine" | "closing" | "opening" | "done";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("reveal");
  const [showLogin, setShowLogin] = useState(false);

  const name = "Sourav Acherjee";
  const letters = name.split("");

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 60, rotateX: -90, scale: 0.6 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 260,
        damping: 20,
        mass: 0.9,
      },
    }),
  };

  return (
    <div
      className={`relative w-full transition-colors duration-1000 ease-in-out ${
        phase === "done" ? "bg-white" : "bg-[#0B0E14]"
      } ${showLogin ? "min-h-screen" : "h-screen overflow-hidden"}`}
    >
      {/* ---------------- INTRO LAYER ---------------- */}
      {!showLogin && (
        <div className="relative flex h-full w-full items-center justify-center">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute h-[700px] w-[700px] rounded-full bg-[#E8B04B]/10 blur-[140px]" />
          <div className="pointer-events-none absolute h-[400px] w-[400px] translate-x-1/3 translate-y-1/4 rounded-full bg-[#3B5BFF]/10 blur-[120px]" />

          {/* Grain texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Name */}
          <div
            className="relative z-10 flex flex-col items-center gap-5"
            style={{ perspective: 800 }}
          >
            <h1 className="font-display relative flex text-6xl font-semibold tracking-tight md:text-8xl">
              {letters.map((ch, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block bg-gradient-to-b from-[#FBEFD9] to-[#E8B04B] bg-clip-text text-transparent"
                  style={{ transformStyle: "preserve-3d" }}
                  onAnimationComplete={() => {
                    if (i === letters.length - 1) {
                      setTimeout(() => setPhase("shine"), 200);
                    }
                  }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
              ))}

              {phase !== "reveal" && (
                <motion.span
                  className="pointer-events-none absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent mix-blend-overlay"
                  style={{ transform: "skewX(-20deg)" }}
                  initial={{ left: "-40%", opacity: 0 }}
                  animate={{ left: "120%", opacity: [0, 1, 0] }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                  onAnimationComplete={() => {
                    if (phase === "shine") setTimeout(() => setPhase("closing"), 250);
                  }}
                />
              )}
            </h1>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: letters.length * 0.05 + 0.4, duration: 0.6 }}
            >
              <span className="h-px w-8 bg-[#6B7280]/50" />
              <p className="text-xs uppercase tracking-[0.35em] text-[#6B7280]">
                opening the frame
              </p>
              <span className="h-px w-8 bg-[#6B7280]/50" />
            </motion.div>
          </div>
        </div>
      )}

      {/* ---------------- LOGIN LAYER ---------------- */}
      {showLogin && (
        <main className="min-h-screen w-full sm:h-[1024px] md:w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2  sm:h-full">
            {/* LEFT */}
            <section className="relative flex flex-col items-center justify-center bg-[#856DF3] py-10 h-[844px] sm:h-[1024px]">
              <div>
                <Image
                  src="/assets/logo/Logo.png"
                  alt="logo"
                  width={265}
                  height={72}
                  priority
                />
              </div>

              <div className="relative w-[326px] h-[298px] sm:w-[553px] sm:h-[499px] mt-6">
                <Image
                  src="/assets/images/login.png"
                  alt="login"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="mt-[42px] w-[326px] sm:w-[420px] md:w-[487px] text-center text-white">
                <h1 className="text-[32px] sm:text-[36px] md:text-[40px] font-semibold leading-none">
                  Welcome to ShipNow
                </h1>
                <p className="mx-auto mt-3 text-[16px] text-[#FEFEFE]">
                  Manage your shipments, fleet, and warehouse in one smart
                  dashboard.
                </p>
              </div>
            </section>

            {/* RIGHT */}
            <section className="flex items-center justify-center bg-white py-10 h-[844px] sm:h-[1024px]">
              <LoginForm />
            </section>
          </div>
        </main>
      )}

      {/* ---------------- IRIS SHUTTER TRANSITION ---------------- */}
      <AnimatePresence>
        {(phase === "closing" || phase === "opening") && (
          <motion.div
            key="iris"
            className="pointer-events-none fixed inset-0 z-30 bg-[#0B0E14]"
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={
              phase === "closing"
                ? { clipPath: "circle(150% at 50% 50%)" }
                : { clipPath: "circle(0% at 50% 50%)" }
            }
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            onAnimationComplete={() => {
              if (phase === "closing") {
                setShowLogin(true);
                setPhase("opening");
              } else if (phase === "opening") {
                setPhase("done");
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}