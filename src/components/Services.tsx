"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { services } from "@/config/services.config";

export default function Services() {
  return (
    <AnimatedSection id="services" mode="slide">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-black uppercase text-pinkBrand">Что мы делаем</p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase text-graphite sm:text-6xl">
            Печатные вещи для важных моментов
          </h2>
        </div>
        <p className="max-w-md text-lg font-bold text-graphite/65">
          От одной открытки до мини-тиража: поможем выбрать материал, формат и аккуратно собрать заказ.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.article
              key={service.title}
              className="peeled group min-h-64 rounded-[1.75rem] border border-graphite/10 bg-white p-6 shadow-paper"
              initial={{ opacity: 0, y: 80, rotate: index % 2 ? 5 : -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: index % 3 === 0 ? -1.5 : 1.5 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.08, type: "spring", stiffness: 120, damping: 18 }}
              whileHover={{ y: -10, rotate: 0, scale: 1.015 }}
            >
              <motion.div
                className="mb-10 grid h-16 w-16 place-items-center rounded-2xl bg-pinkBrand text-white"
                whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
              >
                <Icon size={30} strokeWidth={2.8} />
              </motion.div>
              <h3 className="font-display text-2xl font-black uppercase text-graphite">{service.title}</h3>
              <p className="mt-3 inline-flex rounded-full bg-pinkSoft px-4 py-2 text-sm font-black uppercase text-pinkBrand">
                {service.price}
              </p>
              <p className="mt-3 text-base font-semibold leading-relaxed text-graphite/65">{service.text}</p>
            </motion.article>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
