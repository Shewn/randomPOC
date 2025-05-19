"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const generateRandomStyles = () => ({
  x: Math.random() * 40 - 20,
  y: Math.random() * 40 - 20,
  rotate: Math.random() * 20 - 10,
});

const FloatingBook = ({
  src,
  alt,
  isSelected,
  isDimmed,
  onClick,
  onHover,
  onLeave,
}) => {
  const [animation, setAnimation] = useState(generateRandomStyles());

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimation(generateRandomStyles());
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.img
      src={src}
      alt={alt}
      className={`w-32 h-48 object-cover rounded-xl shadow-xl cursor-pointer transition-transform duration-500
        ${isSelected ? "scale-125 z-30" : ""}
        ${isDimmed ? "scale-90 opacity-50 z-0" : ""}
        ${!isSelected && !isDimmed ? "z-10" : ""}
      `}
      animate={animation}
      transition={{ duration: 3, ease: "easeInOut" }}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    />
  );
};

export default function BookFloatingGrid({ books }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleBookClick = (index) => {
    setSelectedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="grid grid-cols-3 gap-6 justify-items-center items-center min-h-screen bg-gradient-to-b from-slate-100 to-blue-200 p-10">
      {books.slice(0, 6).map((book, index) => {
        const isSelected = selectedIndex === index;
        const isDimmed = selectedIndex !== null && selectedIndex !== index;

        return (
          <FloatingBook
            key={index}
            src={book.cover}
            alt={book.title}
            isSelected={isSelected}
            isDimmed={isDimmed}
            onClick={() => handleBookClick(index)}
            onHover={() => setHoveredIndex(index)}
            onLeave={() => setHoveredIndex(null)}
          />
        );
      })}
    </div>
  );
}
