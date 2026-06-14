"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { reviews } from "@/config/works.config";

export default function Reviews() {
  return (
    <AnimatedSection mode="slide">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-black uppercase text-pinkBrand">Отзывы / доверие</p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase text-graphite sm:text-6xl">
            Карточки из конверта
          </h2>
        </div>
        <p className="max-w-md text-sm font-bold text-graphite/60">
          Сейчас здесь mock data. После первых реальных отзывов замените тексты в конфиге.
        </p>
      </div>
      <motion.div className="flex gap-5 overflow-x-auto pb-6" drag="x" dragConstraints={{ left: -420, right: 0 }}>
        {reviews.map((review, index) => (
          <motion.article
            key={review.name}
            className="group min-h-72 w-[320px] shrink-0 rounded-[1.75rem] border border-graphite/10 bg-white p-6 shadow-paper sm:w-[420px]"
            initial={{ opacity: 0, y: 120, rotate: -12 }}
            whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 3 : -3 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12, type: "spring", stiffness: 120 }}
            whileHover={{ y: -8, rotate: 0 }}
          >
            <div className="mb-8 flex gap-1 text-pinkBrand">
              {Array.from({ length: review.rating }).map((_, starIndex) => (
                <Star key={starIndex} fill="currentColor" size={20} />
              ))}
            </div>
            <h3 className="font-display text-2xl font-black uppercase text-graphite">{review.name}</h3>
            <p className="mt-1 text-sm font-black uppercase text-pinkBrand">{review.service}</p>
            <p className="mt-5 line-clamp-4 text-base font-semibold leading-relaxed text-graphite/70 transition group-hover:line-clamp-none">
              {review.text}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </AnimatedSection>
  );
}
