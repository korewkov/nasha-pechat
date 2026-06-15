"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowDown, Calculator, Send } from "lucide-react";

export default function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-200, 200], [5, -5]);
  const rotateY = useTransform(mouseX, [-200, 200], [-5, 5]);

  return (
    <section
      className="paper-grid relative isolate min-h-screen overflow-hidden px-4 pb-14 pt-6 sm:px-6 lg:px-8"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX.set(event.clientX - rect.left - rect.width / 2);
        mouseY.set(event.clientY - rect.top - rect.height / 2);
      }}
    >
      <div className="pointer-events-none absolute left-1/2 top-16 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-pinkBrand/25 blur-3xl" />
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-graphite/10 bg-white/70 px-4 py-3 backdrop-blur">
        <a href="#" className="relative block h-10 w-44 overflow-hidden" aria-label="Наша печать">
          <Image
            src="/brand/logos/logo-main.png"
            alt="Наша печать"
            fill
            className="object-contain object-left"
            priority
          />
        </a>
        <div className="hidden items-center gap-6 text-sm font-bold text-graphite/70 md:flex">
          <a href="#works">Работы</a>
          <a href="#calculator">Калькулятор</a>
          <a href="#order">Заявка</a>
        </div>
      </nav>

      <div className="mx-auto grid max-w-7xl items-center gap-10 pt-14 lg:grid-cols-[1.02fr_0.98fr] lg:pt-20">
        <div>
          <motion.p
            className="mb-5 inline-flex rounded-full bg-pinkSoft px-4 py-2 text-sm font-black uppercase text-pinkBrand"
            initial={{ opacity: 0, y: -24, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.55 }}
          >
            Домашняя полиграфия
          </motion.p>
          <h1 className="font-display text-[clamp(3.4rem,10vw,9.4rem)] font-black uppercase leading-[0.9] tracking-normal text-graphite">
            <motion.span
              className="block overflow-hidden"
              initial={{ clipPath: "inset(0 100% 0 0)", x: -40 }}
              animate={{ clipPath: "inset(0 0% 0 0)", x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              Наша
            </motion.span>
            <motion.span
              className="block overflow-hidden text-pinkBrand"
              initial={{ clipPath: "inset(0 0 0 100%)", x: 40 }}
              animate={{ clipPath: "inset(0 0 0 0%)", x: 0 }}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              Печать
            </motion.span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-bold leading-relaxed text-graphite/80">
            Домашняя полиграфия, где ваши идеи становятся красивыми печатными вещами.
          </p>
          <p className="mt-7 max-w-xl font-display text-3xl font-black uppercase leading-tight text-graphite sm:text-5xl">
            Печатаем смело. <span className="text-pinkBrand">Делаем красиво.</span>
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#calculator"
              className="magnetic inline-flex items-center justify-center gap-2 rounded-full bg-pinkBrand px-7 py-4 text-base font-black uppercase text-white shadow-sticker"
            >
              <Calculator size={20} /> Рассчитать стоимость
            </a>
            <a
              href="#order"
              className="magnetic inline-flex items-center justify-center gap-2 rounded-full border-2 border-graphite bg-white px-7 py-4 text-base font-black uppercase text-graphite shadow-paper"
            >
              <Send size={20} /> Оставить заявку
            </a>
          </div>
        </div>

        <motion.div
          className="relative min-h-[520px] [perspective:1100px]"
          style={{ rotateX, rotateY }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <motion.div
            className="peeled absolute inset-x-0 top-6 overflow-hidden rounded-[2.25rem] bg-white p-3 shadow-paper"
            initial={{ opacity: 0, rotate: -4, y: 60 }}
            animate={{ opacity: 1, rotate: -1.5, y: 0 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 95 }}
          >
            <Image
              src="/generated/hero-print-products.png"
              alt="Мокап печатной продукции: визитки, открытки и документы"
              width={1400}
              height={900}
              className="h-[420px] rounded-[1.7rem] object-cover sm:h-[500px]"
              priority
            />
          </motion.div>
          <motion.div
            className="absolute -left-2 bottom-8 rounded-full bg-graphite px-5 py-4 text-sm font-black uppercase text-white shadow-paper"
            animate={{ y: [0, -10, 0], rotate: [-4, 3, -4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            Важное внутри
          </motion.div>
          <motion.div
            className="absolute right-8 top-0 rounded-[1.4rem] bg-pinkBrand px-5 py-4 text-center font-display text-xl font-black uppercase text-white shadow-sticker"
            initial={{ opacity: 0, scale: 0.6, rotate: 16 }}
            animate={{ opacity: 1, scale: 1, rotate: 6 }}
            transition={{ delay: 0.8, type: "spring" }}
          >
            Печатаем
            <br />
            смело
          </motion.div>
          <motion.div
            className="absolute right-3 top-56 grid h-28 w-28 place-items-center rounded-full bg-pinkBrand text-center font-display text-4xl font-black text-white shadow-sticker"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            P
          </motion.div>
        </motion.div>
      </div>

      <a href="#services" className="mx-auto mt-4 flex w-fit items-center gap-2 text-sm font-black uppercase text-graphite/60">
        Листайте <ArrowDown size={16} />
      </a>
    </section>
  );
}
