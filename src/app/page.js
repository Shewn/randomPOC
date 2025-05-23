"use client";

import BookFloatingGrid from "@/components/BookFloatingGrid";

import { useEffect } from "react";
import { startConfetti } from "@/utils/confetti";
import { runVerletConfettiAnimation } from "@/utils/verletConfetti";

export default function Home() {
  useEffect(() => {
    startConfetti();
    const timeout1 = setTimeout(() => {
      runVerletConfettiAnimation();
    }, 3000);

    return () => {
      clearTimeout(timeout1);
    };
  }, []);

  const books = [
    { title: "Book 1", cover: "/book1.png" },
    { title: "Book 2", cover: "/book2.png" },
    { title: "Book 3", cover: "/book3.png" },
    { title: "Book 4", cover: "/book4.png" },
    { title: "Book 5", cover: "/book5.png" },
    { title: "Book 6", cover: "/book6.png" },
  ];

  return (
    <>
      {/* <ParticleExplosion /> */}

      <div id="canvas-container-div">
        <canvas
          id="canvas"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        ></canvas>
      </div>

      <div className="book-container">
        <BookFloatingGrid books={books} />;
      </div>
    </>
  );
}
