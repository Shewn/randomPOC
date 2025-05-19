"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const generateRandomStyles = () => ({
  x: Math.random() * 40 - 20,
  y: Math.random() * 40 - 20,
  rotate: Math.random() * 20 - 10,
});

const FloatingBook = ({ src, alt }) => {
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
      className="w-32 h-48 object-cover rounded-xl shadow-xl"
      animate={animation}
      transition={{
        duration: 3,
        ease: "easeInOut",
      }}
    />
  );
};

export default function BookFloatingGrid({ books }) {
  return (
    <div className="grid grid-cols-3 gap-6 justify-items-center items-center min-h-screen bg-gradient-to-b from-slate-100 to-blue-200 p-10">
      {books.slice(0, 6).map((book, index) => (
        <FloatingBook key={index} src={book.cover} alt={book.title} />
      ))}
    </div>
  );
}
