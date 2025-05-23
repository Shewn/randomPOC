"use client";

import BookFloatingGrid from "@/components/BookFloatingGrid";
import ParticleExplosion from "@/components/ParticleExplosion";

import { useEffect } from "react";
import { startConfetti } from "@/utils/confetti";

export default function Home() {
  useEffect(() => {
    startConfetti();
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
      <div className="book-container">
        <BookFloatingGrid books={books} />;
      </div>
    </>
  );
}
