"use client";

import { motion } from "framer-motion";
import { Calculator, MessageCircle } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-pinkBrand px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <motion.p
            className="font-display text-4xl font-black uppercase leading-tight sm:text-7xl"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Есть идея? Давайте напечатаем красиво.
          </motion.p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <a href="#calculator" className="magnetic inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-black uppercase text-graphite">
            <Calculator size={20} /> Рассчитать заказ
          </a>
          <a href="#order" className="peeled magnetic inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-7 py-4 font-black uppercase text-white">
            <MessageCircle size={20} /> Написать нам
          </a>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-4 right-8 hidden grid-cols-6 gap-3 md:grid">
        {Array.from({ length: 30 }).map((_, index) => (
          <motion.span
            key={index}
            className="h-2 w-2 rounded-full bg-white"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ delay: index * 0.04, duration: 1.5, repeat: Infinity }}
          />
        ))}
      </div>
    </section>
  );
}
