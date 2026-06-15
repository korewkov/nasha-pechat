"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Layers, Plus } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import type { CalculatorState } from "@/components/LandingPage";
import {
  calculateOrderPrice,
  extraOptions,
  paperTypes,
  serviceFormatOptions,
  serviceTypes,
  type ExtraOption
} from "@/config/pricing.config";
import { formatRub } from "@/lib/utils";

export default function PriceCalculator({
  value,
  onChange
}: {
  value: CalculatorState;
  onChange: (next: CalculatorState) => void;
}) {
  const price = calculateOrderPrice(value);
  const availableFormats = serviceFormatOptions[value.service];

  useEffect(() => {
    if (value.total !== price.total) {
      onChange({ ...value, total: price.total });
    }
  }, [onChange, price.total, value]);

  const patch = (next: Partial<CalculatorState>) => onChange({ ...value, ...next });
  const toggleExtra = (extra: ExtraOption) => {
    patch({
      extras: value.extras.includes(extra)
        ? value.extras.filter((item) => item !== extra)
        : [...value.extras, extra]
    });
  };

  return (
    <AnimatedSection id="calculator" mode="print" className="relative">
      <div className="absolute inset-x-4 top-10 -z-10 h-64 rounded-[3rem] bg-pinkBrand/10 blur-3xl" />
      <div className="mb-10">
        <p className="font-black uppercase text-pinkBrand">Калькулятор стоимости</p>
        <h2 className="mt-2 max-w-4xl font-display text-4xl font-black uppercase text-graphite sm:text-6xl">
          Соберите заказ и получите ориентир по стоимости
        </h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-graphite/10 bg-white p-5 shadow-paper sm:p-7">
          <OptionGroup title="Тип услуги">
            {serviceTypes.map((item) => (
              <Pill
                key={item}
                active={value.service === item}
                onClick={() => {
                  const nextFormats = serviceFormatOptions[item];
                  patch({
                    service: item,
                    format: nextFormats.includes(value.format) ? value.format : nextFormats[0]
                  });
                }}
              >
                {item}
              </Pill>
            ))}
          </OptionGroup>

          <OptionGroup title="Формат">
            {availableFormats.map((item) => (
              <Pill key={item} active={value.format === item} onClick={() => patch({ format: item })}>
                {item}
              </Pill>
            ))}
          </OptionGroup>

          <div className="my-8 grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-black uppercase text-graphite/60">Количество</span>
              <input
                type="number"
                min={1}
                value={value.quantity}
                onChange={(event) => patch({ quantity: Math.max(1, Number(event.target.value)) })}
                className="mt-2 w-full rounded-2xl border-2 border-graphite bg-milk px-5 py-4 text-3xl font-black outline-none focus:border-pinkBrand"
              />
            </label>
            <label className="block">
              <span className="text-sm font-black uppercase text-graphite/60">Бумага</span>
              <select
                value={value.paper}
                onChange={(event) => patch({ paper: event.target.value as CalculatorState["paper"] })}
                className="mt-2 w-full rounded-2xl border-2 border-graphite bg-milk px-5 py-4 text-lg font-black outline-none focus:border-pinkBrand"
              >
                {paperTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <OptionGroup title="Дополнительно">
            {extraOptions.map((item) => (
              <Pill key={item} active={value.extras.includes(item)} onClick={() => toggleExtra(item)}>
                {value.extras.includes(item) ? <Check size={16} /> : <Plus size={16} />} {item}
              </Pill>
            ))}
          </OptionGroup>
        </div>

        <aside className="sticky top-6 h-fit rounded-[2rem] bg-graphite p-6 text-white shadow-paper">
          <div className="flex items-center justify-between">
            <p className="font-black uppercase text-pinkSoft">Превью заказа</p>
            <Layers className="text-pinkBrand" />
          </div>
          <div className="relative mt-5 h-40 overflow-hidden rounded-3xl border border-white/10">
            <Image
              src="/generated/order-stack.png"
              alt="Стопка печатного заказа с карточками и документами"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative mt-8 min-h-72">
            <motion.div layout className="peeled absolute left-6 top-8 h-40 w-56 rotate-[-7deg] rounded-3xl bg-white p-5 text-graphite shadow-sticker">
              <p className="font-display text-2xl font-black uppercase">{value.service}</p>
              <p className="mt-4 text-sm font-black text-pinkBrand">{value.format} / {value.paper}</p>
            </motion.div>
            <motion.div layout className="absolute right-2 top-20 h-36 w-48 rotate-[8deg] rounded-3xl bg-pinkBrand p-5 shadow-sticker">
              <p className="font-display text-4xl font-black">{value.quantity}</p>
              <p className="text-sm font-black uppercase">штук в заказе</p>
            </motion.div>
            <AnimatePresence>
              {value.extras.map((extra, index) => (
                <motion.span
                  key={extra}
                  className="absolute rounded-full bg-pinkSoft px-3 py-2 text-xs font-black uppercase text-pinkBrand"
                  style={{ left: `${8 + index * 11}%`, bottom: `${18 + (index % 3) * 16}px` }}
                  initial={{ opacity: 0, scale: 0, rotate: -30 }}
                  animate={{ opacity: 1, scale: 1, rotate: index % 2 ? 8 : -8 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  {extra}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-6 rounded-3xl bg-white p-5 text-graphite">
            <div className="flex justify-between text-sm font-bold text-graphite/65">
              <span>База</span>
              <span>{formatRub(price.base)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm font-bold text-graphite/65">
              <span>Доп. услуги</span>
              <span>{formatRub(price.extras)}</span>
            </div>
            <motion.div
              key={price.total}
              initial={{ scale: 0.88, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="mt-5 font-display text-4xl font-black uppercase text-pinkBrand"
            >
              {formatRub(price.total)}
            </motion.div>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-graphite/60">
              Итоговая цена предварительная. Точную стоимость подтвердим после проверки макета.
            </p>
          </div>
        </aside>
      </div>
    </AnimatedSection>
  );
}

function OptionGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h3 className="mb-3 text-sm font-black uppercase text-graphite/60">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`magnetic inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-black uppercase ${
        active
          ? "border-pinkBrand bg-pinkBrand text-white shadow-sticker"
          : "border-graphite/10 bg-milk text-graphite hover:border-pinkBrand"
      }`}
    >
      {children}
    </button>
  );
}
