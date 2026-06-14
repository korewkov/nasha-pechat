"use client";

import { motion } from "framer-motion";
import { Grid3X3, Heart, Lightbulb, MessageCircle, Zap } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const benefits = [
  ["Смело", "Делаем визуал, который выделяется.", Zap],
  ["Аккуратно", "Следим за деталями, цветом и качеством печати.", Grid3X3],
  ["С заботой", "Относимся к заказу как к своему.", Heart],
  ["Понятно", "Объясняем простыми словами и помогаем выбрать вариант.", MessageCircle],
  ["Гибко", "Берём небольшие заказы и индивидуальные задачи.", Lightbulb]
] as const;

export default function Benefits() {
  return (
    <AnimatedSection mode="snap" className="paper-grid rounded-[2.5rem] bg-white">
      <div className="mb-10">
        <p className="font-black uppercase text-pinkBrand">Почему выбирают нас</p>
        <h2 className="mt-2 font-display text-4xl font-black uppercase text-graphite sm:text-6xl">
          Доска с наклейками характера
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-5">
        {benefits.map(([title, text, Icon], index) => (
          <motion.article
            key={title}
            className="min-h-56 rounded-[1.5rem] bg-milk p-5 shadow-paper"
            initial={{ opacity: 0, y: -80, rotate: index % 2 ? 8 : -8 }}
            whileInView={{ opacity: 1, y: 0, rotate: [-3, 2, 0][index % 3] }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 120 }}
            whileHover={{ rotate: index % 2 ? -4 : 4, y: -8 }}
          >
            <Icon className="mb-10 text-pinkBrand" size={34} strokeWidth={2.8} />
            <h3 className="font-display text-xl font-black uppercase text-graphite">{title}</h3>
            <p className="mt-3 text-sm font-bold leading-relaxed text-graphite/65">{text}</p>
          </motion.article>
        ))}
      </div>
    </AnimatedSection>
  );
}
