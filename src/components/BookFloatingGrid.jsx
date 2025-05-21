"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FLOAT_INTERVAL = 3000;

const generateFloat = () => ({
  y: Math.random() * 10 - 5,
  x: Math.random() * 8 - 4,
  rotate: Math.random() * 4 - 2,
});

const FloatingBook = ({ book, index, total, radius, currentAngle }) => {
  const anglePerBook = 360 / total;
  const bookAngle = index * anglePerBook + currentAngle;

  const rad = (bookAngle * Math.PI) / 180;
  const x = radius * Math.sin(rad);
  const z = radius * Math.cos(rad);

  const isFront = Math.abs((bookAngle % 360) - 0) < anglePerBook / 2;

  const controls = useAnimation();

  useEffect(() => {
    const float = () => controls.start(generateFloat());
    float();
    const interval = setInterval(float, FLOAT_INTERVAL);
    return () => clearInterval(interval);
  }, [controls]);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-32 h-48"
      animate={controls}
      initial={false}
      transition={{ duration: 3, ease: "easeInOut" }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      <motion.img
        src={book.cover}
        alt={book.title}
        className="w-full h-full object-cover rounded-xl shadow-xl cursor-pointer"
        animate={{
          x,
          y: "-50%",
          z,
          rotateY: 0, // <-- no rotation at all, always upright
          scale: isFront ? 1.2 : 0.85,
          zIndex: isFront ? 20 : 5,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        draggable={false}
      />
    </motion.div>
  );
};

export default function BookCarousel3D({ books }) {
  const [angle, setAngle] = useState(0);

  const handleNext = () => {
    setAngle((prev) => prev - 60); // rotate right
  };

  const handlePrev = () => {
    setAngle((prev) => prev + 60); // rotate left
  };

  const handleSwipe = (event, info) => {
    const swipe = info.offset.x;
    if (swipe < -50) handleNext();
    else if (swipe > 50) handlePrev();
  };

  const radius = 300;

  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 to-blue-200 overflow-hidden"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleSwipe}
      style={{ touchAction: "pan-y" }}
    >
      <div className="relative w-full max-w-6xl h-[400px]">
        {books.map((book, index) => (
          <FloatingBook
            key={index}
            book={book}
            index={index}
            total={books.length}
            radius={radius}
            currentAngle={angle}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-200 z-50"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-200 z-50"
      >
        <ChevronRight />
      </button>
    </motion.div>
  );
}
