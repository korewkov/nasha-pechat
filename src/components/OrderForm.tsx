"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Send, ShieldCheck } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import type { CalculatorState } from "@/components/LandingPage";
import { serviceTypes } from "@/config/pricing.config";
import { formatRub } from "@/lib/utils";
import { orderSchema, type OrderFormValues } from "@/lib/validation";

export default function OrderForm({ calculator }: { calculator: CalculatorState }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: "",
      phone: "",
      messenger: "",
      service: calculator.service,
      format: calculator.format,
      quantity: calculator.quantity,
      paper: calculator.paper,
      extras: calculator.extras,
      hasDesign: "нет",
      urgency: "стандартно",
      description: "",
      estimatedPrice: calculator.total,
      comment: "",
      consent: false,
      website: ""
    }
  });

  useEffect(() => {
    setValue("service", calculator.service);
    setValue("format", calculator.format);
    setValue("quantity", calculator.quantity);
    setValue("paper", calculator.paper);
    setValue("extras", calculator.extras);
    setValue("estimatedPrice", calculator.total);
  }, [calculator, setValue]);

  async function onSubmit(values: OrderFormValues) {
    setStatus("idle");
    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      setStatus("error");
      setMessage(result.error ?? "Не удалось отправить заявку.");
      return;
    }

    setStatus("success");
    setMessage(
      result.mocked
        ? "Заявка отправлена в mock-режиме. Подключите Google Sheets webhook для реальной таблицы."
        : "Заявка отправлена! Скоро свяжемся с вами и уточним детали."
    );
    reset({ ...values, name: "", phone: "", messenger: "", description: "", comment: "", consent: false });
  }

  return (
    <AnimatedSection id="order" mode="snap" className="relative">
      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-[2rem] bg-graphite p-7 text-white shadow-paper">
          <p className="font-black uppercase text-pinkSoft">Форма заявки</p>
          <h2 className="mt-3 font-display text-4xl font-black uppercase sm:text-6xl">
            Расскажите, что печатаем
          </h2>
          <p className="mt-6 text-lg font-bold leading-relaxed text-white/70">
            Оставьте контакты и пару слов о задаче. Формат, бумага, доп. опции и цена подтянутся из калькулятора.
          </p>
          <div className="peeled mt-8 rounded-3xl bg-pinkBrand p-6 shadow-sticker">
            <p className="text-sm font-black uppercase">Предварительно</p>
            <p className="mt-2 font-display text-4xl font-black">{formatRub(calculator.total)}</p>
            <p className="mt-3 text-sm font-bold">{calculator.service} / {calculator.quantity} шт.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="rounded-[2rem] border border-graphite/10 bg-white p-5 shadow-paper sm:p-7">
          <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Имя" error={errors.name?.message}>
              <input {...register("name")} className="field" placeholder="Мария" />
            </Field>
            <Field label="Телефон" error={errors.phone?.message}>
              <input {...register("phone")} className="field" placeholder="+7 912 345-67-89" />
            </Field>
            <Field label="Telegram / WhatsApp" error={errors.messenger?.message}>
              <input {...register("messenger")} className="field" placeholder="@nasha_pechat" />
            </Field>
            <Field label="Тип услуги" error={errors.service?.message}>
              <select {...register("service")} className="field">
                {serviceTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Что нужно сделать" error={errors.description?.message}>
              <textarea
                {...register("description")}
                className="field min-h-32 resize-y"
                placeholder="Например: нужны стикеры для упаковки, хочу нежно-розовые, макета пока нет..."
              />
            </Field>
          </div>
          <div className="mt-4 rounded-3xl bg-milk p-4">
            <p className="text-xs font-black uppercase text-graphite/55">Из калькулятора</p>
            <p className="mt-2 text-sm font-bold leading-relaxed text-graphite/70">
              {calculator.format}, {calculator.paper}, {calculator.extras.length ? calculator.extras.join(", ") : "без доп. опций"}.
              Предварительно: <span className="font-black text-pinkBrand">{formatRub(calculator.total)}</span>
            </p>
          </div>
          <label className="mt-5 flex items-start gap-3 rounded-2xl bg-milk p-4 text-sm font-bold text-graphite/70">
            <input type="checkbox" {...register("consent")} className="mt-1 h-5 w-5 accent-pinkBrand" />
            <span>Согласен(на) на обработку данных для связи по заявке.</span>
          </label>
          {errors.consent?.message && <p className="mt-2 text-sm font-bold text-pinkBrand">{errors.consent.message}</p>}

          <button
            disabled={isSubmitting}
            className="magnetic mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-pinkBrand px-7 py-4 font-black uppercase text-white shadow-sticker disabled:cursor-wait disabled:opacity-60 md:w-auto"
          >
            <Send size={20} /> {isSubmitting ? "Отправляем..." : "Отправить заявку"}
          </button>

          {status !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              className={`mt-6 rounded-3xl p-5 font-bold ${
                status === "success" ? "bg-pinkSoft text-graphite" : "bg-graphite text-white"
              }`}
            >
              <div className="flex items-center gap-2 font-display text-xl font-black uppercase">
                <ShieldCheck className="text-pinkBrand" /> {status === "success" ? "Принято в печать" : "Нужна проверка"}
              </div>
              <p className="mt-2">{message}</p>
            </motion.div>
          )}
        </form>
      </div>
    </AnimatedSection>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-graphite/55">{label}</span>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-1 text-sm font-bold text-pinkBrand">{error}</p>}
    </label>
  );
}
