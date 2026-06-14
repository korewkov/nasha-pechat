export const serviceTypes = [
  "Раскраска по фото",
  "Фото на документы",
  "Визитки",
  "Стикеры",
  "Открытки",
  "Ламинация",
  "Печать документов",
  "Другое"
] as const;

export const formats = ["A6", "A5", "A4", "10x15", "3x4", "3,5x4,5", "свой размер"] as const;

export const paperTypes = [
  "обычная",
  "плотная матовая",
  "глянцевая",
  "фотобумага",
  "самоклеящаяся",
  "дизайнерская"
] as const;

export const extraOptions = [
  "ламинация",
  "скругление углов",
  "резка",
  "упаковка",
  "срочность",
  "разработка макета"
] as const;

export const pricingConfig = {
  services: {
    "Раскраска по фото": 650,
    "Фото на документы": 250,
    "Визитки": 900,
    "Стикеры": 450,
    "Открытки": 350,
    "Ламинация": 120,
    "Печать документов": 35,
    "Другое": 300
  },
  formats: {
    A6: 0.85,
    A5: 1,
    A4: 1.35,
    "10x15": 1,
    "3x4": 0.75,
    "3,5x4,5": 0.8,
    "свой размер": 1.45
  },
  papers: {
    обычная: 1,
    "плотная матовая": 1.25,
    глянцевая: 1.3,
    фотобумага: 1.45,
    самоклеящаяся: 1.55,
    дизайнерская: 1.8
  },
  extras: {
    ламинация: 180,
    "скругление углов": 120,
    резка: 150,
    упаковка: 180,
    срочность: 350,
    "разработка макета": 700
  },
  quantityDiscounts: [
    { min: 100, multiplier: 0.78 },
    { min: 50, multiplier: 0.86 },
    { min: 20, multiplier: 0.92 }
  ]
} as const;

export type ServiceType = (typeof serviceTypes)[number];
export type PrintFormat = (typeof formats)[number];
export type PaperType = (typeof paperTypes)[number];
export type ExtraOption = (typeof extraOptions)[number];

export function calculateOrderPrice(input: {
  service: ServiceType;
  format: PrintFormat;
  quantity: number;
  paper: PaperType;
  extras: ExtraOption[];
}) {
  const basePerItem =
    pricingConfig.services[input.service] *
    pricingConfig.formats[input.format] *
    pricingConfig.papers[input.paper];
  const discount =
    pricingConfig.quantityDiscounts.find((item) => input.quantity >= item.min)?.multiplier ?? 1;
  const base = Math.round(basePerItem * input.quantity * discount);
  const extras = input.extras.reduce((sum, option) => sum + pricingConfig.extras[option], 0);

  return {
    base,
    extras,
    total: base + extras
  };
}
