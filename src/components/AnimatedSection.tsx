"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const variants: Record<string, Variants> = {
  slide: {
    hidden: { opacity: 0, x: -90, rotate: -1 },
    visible: { opacity: 1, x: 0, rotate: 0 }
  },
  rise: {
    hidden: { opacity: 0, y: 90, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 }
  },
  snap: {
    hidden: { opacity: 0, scale: 0.86, rotate: 3 },
    visible: { opacity: 1, scale: 1, rotate: 0 }
  },
  print: {
    hidden: { opacity: 0.001, y: 28 },
    visible: { opacity: 1, y: 0 }
  }
};

export default function AnimatedSection({
  id,
  mode = "rise",
  className,
  children
}: {
  id?: string;
  mode?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      className={cn("mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24", className)}
      variants={variants[mode]}
      initial={false}
      whileInView="visible"
      viewport={{ once: true, amount: 0.04, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}
