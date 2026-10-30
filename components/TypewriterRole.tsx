"use client";

import { useState, useEffect } from "react";

interface TypewriterRoleProps {
  words: string[];
}

export default function TypewriterRole({ words }: TypewriterRoleProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(80);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const word = words[currentWordIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        setCurrentText(word.substring(0, currentText.length + 1));
        setSpeed(75);

        // Word completely typed
        if (currentText.length + 1 === word.length) {
          setSpeed(2200); // Pause on finished word
          setIsDeleting(true);
        }
      } else {
        // Deleting backward
        setCurrentText(word.substring(0, currentText.length - 1));
        setSpeed(35); // Fast backspace

        // Word completely erased
        if (currentText.length - 1 <= 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setSpeed(350); // Pause before typing next word
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, speed]);

  return (
    <span className="inline-flex items-center min-h-[1.5rem] tracking-wider">
      <span className="text-cyan-200">{currentText}</span>
      <span className="ml-1 inline-block h-4 w-[2px] sm:h-5 bg-cyan-300 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
    </span>
  );
}
