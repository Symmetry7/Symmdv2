import React from "react";
import { motion } from "framer-motion";

function BackgroundElements() {
  const shapes = [
    { size: "w-32 h-32", position: "top-10 left-10", delay: 0 },
    { size: "w-24 h-24", position: "top-1/4 right-10", delay: 2 },
    { size: "w-20 h-20", position: "bottom-1/4 left-20", delay: 4 },
    { size: "w-28 h-28", position: "bottom-10 right-20", delay: 1 },
    { size: "w-16 h-16", position: "top-1/2 left-1/4", delay: 3 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating Shapes */}
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.size} ${shape.position} rounded-full bg-gradient-to-br from-primary-400/20 to-accent-400/20 blur-xl`}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            delay: shape.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-500/30 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-accent-500/30 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
    </div>
  );
}

export default BackgroundElements;
