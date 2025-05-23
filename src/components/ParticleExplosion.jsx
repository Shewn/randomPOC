"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const NUM_PARTICLES = 60;

const generateParticle = () => {
  const angle = Math.random() * 2 * Math.PI;
  const distance = 250 + Math.random() * 300;
  const x = Math.cos(angle) * distance;
  const y = -Math.abs(Math.sin(angle)) * distance - 200;

  return {
    x,
    y,
    size: 6 + Math.random() * 6,
    duration: 3 + Math.random() * 2, // 3 to 5 seconds
    delay: Math.random() * 0.5,
    opacity: 0.6 + Math.random() * 0.4,
    color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
  };
};

export default function ParticleExplosion() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: NUM_PARTICLES }, generateParticle);
    setParticles(generated);

    const timer = setTimeout(() => {
      setParticles([]); // remove after 3s
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: p.color,
            opacity: p.opacity,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}
