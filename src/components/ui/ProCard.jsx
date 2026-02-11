import { motion } from "framer-motion";

export default function ProCard({
  children,
  className = "",
  hover = true,
  onClick,
}) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }
          : {}
      }
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onClick}
      className={`
        bg-white border border-gray-200 rounded-xl shadow-sm 
        p-6 md:p-8 overflow-hidden
        ${hover ? "cursor-pointer" : ""}
        transition-shadow duration-200 ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
