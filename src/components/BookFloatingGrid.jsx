"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FLOAT_INTERVAL = 3000;
const randomXPosition = Math.floor(Math.random() * 31) - 15;
const randomYPosition = Math.floor(Math.random() * 41) - 20;
const randomRotatePosition = Math.floor(Math.random() * 31) - 15;
const generateFloat = () => ({
  y: Math.random() * 60 - 30, // Float up/down more (±30px)
  x: Math.random() * 30 - 15, // Optional: more lateral drift
  rotate: Math.random() * 6 - 3, // Optional: slightly more rotation
});

const normalizeAngle = (angle) => ((angle % 360) + 360) % 360;

const FloatingBook = ({ book, index, total, radius, currentAngle }) => {
  const anglePerBook = 360 / total;
  const bookAngle = index * anglePerBook + currentAngle;

  const rad = (bookAngle * Math.PI) / 180;
  const x = radius * Math.sin(rad);
  const z = radius * Math.cos(rad);

  // Shadow intensity and offset based on depth
  const shadowDepth = Math.max(0, 1 - z / 600); // 1 (front) -> ~0 (back)
  const shadowOffsetY = 10 + shadowDepth * 20; // offset more when closer
  const shadowBlur = 15 + shadowDepth * 30;

  const shadowColor = `rgba(0, 0, 0, ${0.3 + shadowDepth * 0.2})`;

  const boxShadow = `${0}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}`;

  const isFront = Math.abs((bookAngle % 360) - 0) < anglePerBook / 2;

  const blurAmount = isFront ? 0 : Math.min(Math.abs(z / 100), 6);

  const angleToFront = Math.abs((bookAngle % 360) - 180);

  const normalizedAngle = normalizeAngle(bookAngle);
  const angleToBack = Math.abs(normalizedAngle - 180);

  const isBack = angleToBack < anglePerBook / 2;

  const verticalLift = isBack ? -350 : 0; // move upward if it's the farthest back
  const horizontalShift = isBack ? 40 : 0;

  const controls = useAnimation();
  const [floatOffset, setFloatOffset] = useState({ x: 0, y: 0, rotate: 0 });

  useEffect(() => {
    const randomFloat = () => {
      const newOffset = generateFloat();
      setFloatOffset(newOffset);
      controls.start(newOffset);
    };

    // Random initial delay
    const initialDelay = Math.random() * 2000;

    const timeout = setTimeout(() => {
      randomFloat();
      const interval = setInterval(
        randomFloat,
        FLOAT_INTERVAL + Math.random() * 1000
      );
      return () => clearInterval(interval);
    }, initialDelay);

    return () => clearTimeout(timeout);
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
        zIndex: isFront ? 20 : 5,
      }}
    >
      <motion.img
        src={book.cover}
        alt={book.title}
        className="w-full h-full object-cover shadow-xl cursor-pointer"
        style={{
          filter: `blur(${blurAmount}px)`,
          boxShadow,
        }}
        animate={{
          x: x + floatOffset.x + horizontalShift,
          y: `calc(-50% + ${floatOffset.y + verticalLift}px)`,
          z,
          rotateY: 0,
          rotate: floatOffset.rotate,
          scale: isFront ? 1.2 : isBack ? 0.7 : 1,
          // zIndex: isFront ? 20 : 5,
          opacity: 1,
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
