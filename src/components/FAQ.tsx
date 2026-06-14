"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const faqs = [
  ["Можно ли заказать одну штуку?", "Да. Мы спокойно берём маленькие заказы: открытку, наклейку, один комплект фото или пробный экземпляр."],
  ["Можно ли сделать без готового макета?", "Да. Опишите идею, пришлите референсы или фото, а мы подскажем формат и стоимость подготовки."],
  ["Можно ли напечатать срочно?", "Можно, если есть свободное окно. Срочность учитывается в калькуляторе как дополнительная опция."],
  ["Какие форматы доступны?", "Чаще всего A6, A5, A4, 10x15, 3x4 и 3,5x4,5. Свой размер тоже можно обсудить."],
  ["Можно ли заказать раскраску по фото?", "Да, это одна из ключевых услуг. Нужны фотографии хорошего качества и пожелания по стилю."],
  ["Как передать фотографии или файлы?", "После заявки мы напишем вам и дадим удобный способ передачи файлов: Telegram, WhatsApp или облачная ссылка."],
  ["Когда будет точная цена?", "После проверки макета, количества, бумаги и сроков. Калькулятор показывает предварительную оценку."]
] as const;

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <AnimatedSection mode="print">
      <div className="mb-10">
        <p className="font-black uppercase text-pinkBrand">FAQ</p>
        <h2 className="mt-2 font-display text-4xl font-black uppercase text-graphite sm:text-6xl">
          Быстрые ответы без сложных слов
        </h2>
      </div>
      <div className="space-y-3">
        {faqs.map(([question, answer], index) => {
          const isOpen = open === index;
          return (
            <motion.div
              key={question}
              className="overflow-hidden rounded-[1.5rem] border border-graphite/10 bg-white shadow-paper"
              initial={{ opacity: 0, x: index % 2 ? 60 : -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-display text-lg font-black uppercase text-graphite"
              >
                {question}
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pinkBrand text-white">
                  {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </motion.span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.p
                    className="px-5 pb-5 font-semibold leading-relaxed text-graphite/70"
                    initial={{ height: 0, opacity: 0, filter: "blur(6px)" }}
                    animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
                    exit={{ height: 0, opacity: 0, filter: "blur(6px)" }}
                  >
                    {answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
