"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { workCategories, works, type WorkCategory } from "@/config/works.config";

export default function WorksGallery() {
  const [active, setActive] = useState<WorkCategory>("Все");
  const filtered = useMemo(
    () => (active === "Все" ? works : works.filter((work) => work.category === active)),
    [active]
  );

  return (
    <AnimatedSection id="works" mode="snap" className="overflow-hidden">
      <div className="mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-black uppercase text-pinkBrand">Примеры работ</p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase text-graphite sm:text-6xl">
            Галерея, которая собирается на глазах
          </h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {workCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActive(category)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-black uppercase transition ${
                active === category
                  ? "border-pinkBrand bg-pinkBrand text-white shadow-sticker"
                  : "border-graphite/10 bg-white text-graphite hover:border-pinkBrand"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((work, index) => (
            <motion.article
              layout
              key={work.title}
              className="group overflow-hidden rounded-[1.75rem] border border-graphite/10 bg-white shadow-paper"
              initial={{ opacity: 0, x: index % 2 ? 80 : -80, y: index % 3 ? 40 : -40, rotate: index % 2 ? 7 : -7 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.86, rotate: -8 }}
              transition={{ type: "spring", stiffness: 130, damping: 18 }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-pinkBrand">
                  {work.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-black uppercase text-graphite">{work.title}</h3>
                <p className="mt-2 min-h-12 text-sm font-semibold leading-relaxed text-graphite/65">{work.description}</p>
                <a href="#order" className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase text-pinkBrand">
                  Хочу так же <ArrowRight size={16} />
                </a>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="mt-8 flex gap-4 overflow-x-auto pb-4"
        drag="x"
        dragConstraints={{ left: -360, right: 0 }}
      >
        {works.slice(0, 6).map((work) => (
          <div key={`strip-${work.title}`} className="relative h-32 w-52 shrink-0 overflow-hidden rounded-2xl shadow-paper">
            <Image src={work.image} alt={work.title} fill className="object-cover" />
          </div>
        ))}
      </motion.div>
    </AnimatedSection>
  );
}
