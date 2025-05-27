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
  const [isHovered, setIsHovered] = useState(false);

  const anglePerBook = 360 / total;
  const bookAngle = index * anglePerBook + normalizeAngle(currentAngle);
  const rad = (bookAngle * Math.PI) / 180;
  const x = radius * Math.sin(rad);
  const z = radius * Math.cos(rad);

  const shadowDepth = Math.max(0, 1 - z / 600);
  const shadowOffsetY = 10 + shadowDepth * 20;
  const shadowBlur = 15 + shadowDepth * 30;
  const shadowColor = `rgba(0, 0, 0, ${0.3 + shadowDepth * 0.2})`;

  const hoverGlow = isHovered
    ? `0 0 20px rgba(255, 255, 255, 0.6), 0 0 40px rgba(0, 132, 255, 0.4)`
    : "";
  const boxShadow = `${0}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}${
    isHovered ? `, ${hoverGlow}` : ""
  }`;

  const isFront = Math.abs((bookAngle % 360) - 0) < anglePerBook / 2;
  const blurAmount = isFront ? 0 : 1;
  const angleToBack = Math.abs(normalizeAngle(bookAngle) - 180);
  const isBack = angleToBack < anglePerBook / 2;

  const scale = isFront ? 1.2 : isBack ? 0.7 : 1;
  const finalScale = isHovered ? scale + 0.1 : scale;
  const verticalLift = isBack ? -250 : isFront ? 75 : Math.random() * 100 - 130;
  const horizontalShift = isBack ? 40 : Math.random() * 60 - 30;

  const controls = useAnimation();
  const [floatOffset, setFloatOffset] = useState({ x: 0, y: 0, rotate: 0 });

  useEffect(() => {
    const randomFloat = () => {
      const newOffset = generateFloat();
      setFloatOffset(newOffset);
      controls.start(newOffset);
    };
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

  const rating = book.rating ?? (Math.random() * 4 + 1).toFixed(1); // fallback if no rating

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-32 h-48"
      animate={controls}
      initial={false}
      transition={{ duration: 3, ease: "easeInOut" }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
        zIndex: isFront ? 20 : isBack ? 5 : 15,
      }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{
          x: x + floatOffset.x + horizontalShift,
          y: `calc(-50% + ${floatOffset.y + verticalLift}px)`,
          z,
          rotateY: 0,
          rotate: floatOffset.rotate,
          scale: finalScale,
          opacity: 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover rounded-xl shadow-xl"
          style={{ filter: `blur(${blurAmount}px)`, boxShadow }}
          draggable={false}
        />

        {/* Top-left badge */}
        {book.IsNew && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full shadow-md">
            New!
          </div>
        )}

        {/* Bottom-right rating badge */}
        <div className="absolute bottom-2 right-2 bg-white text-gray-800 text-xs px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
          ⭐ {rating}
        </div>
      </motion.div>

      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.6, scale: 1.3 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(0,162,255,0.1) 50%, transparent 70%)",
            zIndex: -1,
          }}
        />
      )}
    </motion.div>
  );
};

export default function BookCarousel3D({ books }) {
  const [angle, setAngle] = useState(0);

  const [showBooks, setShowBooks] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBooks(true);
    }, 500); // syncs with explosion (adjust as needed)
    return () => clearTimeout(timer);
  }, []);

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

  const radius = 400;

  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center from-slate-100 to-blue-200 overflow-hidden"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleSwipe}
      style={{ touchAction: "pan-y" }}
    >
      <div className="relative w-full max-w-6xl h-[400px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showBooks ? 1 : 0 }}
          transition={{ duration: 3.5, ease: "easeOut" }}
          className="relative w-full max-w-6xl h-[400px]"
        >
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
        </motion.div>
      </div>

      {/* Navigation Buttons
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
      </button> */}
    </motion.div>
  );
}
