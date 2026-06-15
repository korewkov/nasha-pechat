import { z } from "zod";
import { extraOptions, formats, paperTypes, serviceTypes } from "@/config/pricing.config";

export const orderSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя"),
  phone: z
    .string()
    .trim()
    .min(3, "Укажите телефон или мессенджер"),
  messenger: z.string().trim().optional().default(""),
  service: z.enum(serviceTypes),
  format: z.enum(formats),
  quantity: z.coerce.number().int().min(1).max(10000),
  paper: z.enum(paperTypes),
  extras: z.array(z.enum(extraOptions)).default([]),
  hasDesign: z.enum(["да", "нет", "нужно разработать"]),
  urgency: z.enum(["стандартно", "срочно"]),
  description: z.string().trim().min(8, "Опишите заказ чуть подробнее"),
  estimatedPrice: z.coerce.number().min(0).max(500000),
  promoCode: z.string().trim().max(80).optional().default(""),
  comment: z.string().trim().max(800).optional().default(""),
  consent: z.boolean().refine(Boolean, "Нужно согласие на обработку данных"),
  website: z.string().max(0).optional().default("")
});

export type OrderFormValues = z.infer<typeof orderSchema>;
