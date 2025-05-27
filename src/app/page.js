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
    { title: "Book 1", cover: "/posters/poster1.jpg", rating: 3.4 },
    { title: "Book 2", cover: "/posters/poster2.jpg", rating: 4.7 },
    { title: "Book 3", cover: "/posters/poster3.jpg", rating: 3.2 },
    { title: "Book 4", cover: "/posters/poster4.jpg", rating: 5.0 },
    { title: "Book 5", cover: "/posters/poster5.jpg", rating: 4.4 },
    { title: "Book 6", cover: "/posters/poster6.jpg", rating: 4.8 },
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
