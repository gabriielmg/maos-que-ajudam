"use client";

import { useEffect, useRef } from "react";
import { X, Trophy } from "lucide-react";

interface CelebrationModalProps {
  alaName: string;
  onClose: () => void;
}

export function CelebrationModal({ alaName, onClose }: CelebrationModalProps) {
  const confettiRef = useRef<boolean>(false);

  useEffect(() => {
    if (confettiRef.current) return;
    confettiRef.current = true;

    const launchConfetti = async () => {
      const confetti = (await import("canvas-confetti")).default;

      const duration = 4000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#0D3B8C", "#1E5BB8", "#2E8B57", "#F4C430", "#ffffff"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#0D3B8C", "#1E5BB8", "#2E8B57", "#F4C430", "#ffffff"],
        });
      }, 250);
    };

    launchConfetti();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-bounce-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="text-6xl mb-4">🎉</div>

        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>

        <h2 className="text-2xl font-bold text-[#0D3B8C] mb-2">
          Meta Alcançada!
        </h2>
        <p className="text-gray-600 mb-1">
          Parabéns à
        </p>
        <p className="text-xl font-bold text-[#2E8B57] mb-4">
          {alaName}
        </p>
        <p className="text-gray-500 text-sm">
          Vocês atingiram 100% da meta de arrecadação! Que benção! 🙏
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-[#0D3B8C] to-[#1E5BB8] text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Continuar arrecadando!
        </button>
      </div>
    </div>
  );
}
