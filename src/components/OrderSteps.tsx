"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ClipboardPen, PackageCheck, Printer, SearchCheck } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const steps = [
  ["Вы оставляете заявку", "Рассказываете, что хотите напечатать.", ClipboardPen],
  ["Мы уточняем детали", "Проверяем макет, формат, материалы и сроки.", SearchCheck],
  ["Печатаем и собираем", "Аккуратно готовим заказ.", Printer],
  ["Вы получаете красоту", "Забираете готовую печатную вещь.", PackageCheck]
] as const;

export default function OrderSteps() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0.35, 0.56], ["0%", "100%"]);

  return (
    <AnimatedSection mode="rise">
      <div className="mb-12">
        <p className="font-black uppercase text-pinkBrand">Как проходит заказ</p>
        <h2 className="mt-2 font-display text-4xl font-black uppercase text-graphite sm:text-6xl">
          Как печатная лента: понятно и по шагам
        </h2>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-12 hidden h-2 w-full rounded-full bg-pinkSoft md:block" />
        <motion.div className="absolute left-0 top-12 hidden h-2 rounded-full bg-pinkBrand md:block" style={{ width }} />
        <div className="grid gap-5 md:grid-cols-4">
          {steps.map(([title, text, Icon], index) => (
            <motion.article
              key={title}
              className="relative rounded-[1.5rem] border border-graphite/10 bg-white p-5 shadow-paper"
              initial={{ opacity: 0, y: 70, skewX: -5 }}
              whileInView={{ opacity: 1, y: 0, skewX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, type: "spring", stiffness: 110 }}
            >
              <motion.div
                className="mb-9 grid h-14 w-14 place-items-center rounded-full bg-pinkBrand text-white"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5 + index * 0.3, repeat: Infinity }}
              >
                <Icon />
              </motion.div>
              <h3 className="font-display text-xl font-black uppercase text-graphite">{title}</h3>
              <p className="mt-3 font-semibold text-graphite/65">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
