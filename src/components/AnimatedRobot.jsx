import { motion } from "framer-motion";

export default function AnimatedRobot({ size = 48 }) {
  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
        rotate: [0, 3, -3, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      className="relative"
    >
      <div
        className="bg-gradient-to-br from-[#5d60ef] to-purple-600 rounded-full flex items-center justify-center shadow-lg"
        style={{ width: size, height: size }}
      >
        <span className="text-white text-2xl">🤖</span>
      </div>
      <motion.div
        className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}
