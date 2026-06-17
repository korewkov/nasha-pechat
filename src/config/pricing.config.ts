export const serviceTypes = [
  "Раскраска по фото",
  "Фото на документы",
  "Визитки",
  "Открытки",
  "Документы",
  "Макеты",
  "Другое"
] as const;

export const formats = ["90×50 мм", "85×55 мм", "A6", "A5", "A4", "10x15", "3x4", "3,5x4,5", "свой размер"] as const;
export const serviceFormatOptions: Record<ServiceType, PrintFormat[]> = {
  "Раскраска по фото": ["A5", "A4"],
  "Фото на документы": ["3x4", "3,5x4,5"],
  "Визитки": ["90×50 мм", "85×55 мм"],
  "Открытки": ["A6", "A5"],
  "Документы": ["A4"],
  "Макеты": ["свой размер"],
  "Другое": ["A6", "A5", "A4", "10x15", "3x4", "3,5x4,5", "свой размер"]
};

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
    "Раскраска по фото": 1000,
    "Фото на документы": 300,
    "Визитки": 900,
    "Открытки": 200,
    "Документы": 100,
    "Макеты": 300,
    "Другое": 300
  },
  formats: {
    "90×50 мм": 1,
    "85×55 мм": 1,
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

export type BusinessCardSides = "односторонние" | "двусторонние";
export type PostcardDesign = "свой макет" | "нужна подготовка макета";
export type DocumentJobType = "печать" | "копия" | "скан" | "ламинация";
export type PrintColor = "ч/б" | "цветная";
export type LayoutType = "лёгкая правка" | "подготовка к печати" | "макет с нуля";
export type LayoutPurpose = "открытка" | "визитка" | "листовка" | "другой макет";

export function calculateOrderPrice(input: {
  service: ServiceType;
  format: PrintFormat;
  quantity: number;
  paper: PaperType;
  extras: ExtraOption[];
  sides?: BusinessCardSides;
  postcardDesign?: PostcardDesign;
  hasEnvelope?: boolean;
  documentJob?: DocumentJobType;
  printColor?: PrintColor;
  layoutType?: LayoutType;
  layoutPurpose?: LayoutPurpose;
}) {
  if (input.service === "Раскраска по фото") {
    const isA4 = input.format === "A4";
    const base = isA4 ? 1500 : 1000;
    const extraPhotoPrice = isA4 ? 150 : 100;
    const photos = Math.max(1, input.quantity);
    const extraPhotos = Math.max(0, photos - 5);
    const extras = input.extras.reduce((sum, option) => sum + pricingConfig.extras[option], 0);

    return {
      base: base + extraPhotos * extraPhotoPrice,
      extras,
      total: base + extraPhotos * extraPhotoPrice + extras
    };
  }

  if (input.service === "Фото на документы") {
    const extras = input.extras.reduce((sum, option) => sum + pricingConfig.extras[option], 0);

    return {
      base: 300,
      extras,
      total: 300 + extras
    };
  }

  if (input.service === "Визитки") {
    const quantity = [50, 100, 200].includes(input.quantity) ? input.quantity : 50;
    const basePrices: Record<number, number> = { 50: 900, 100: 1500, 200: 2600 };
    const thickPaper: Record<number, number> = { 50: 300, 100: 500, 200: 800 };
    let total = basePrices[quantity];

    if (input.sides === "двусторонние") total = Math.round(total * 1.4);
    if (input.paper === "плотная матовая") total += thickPaper[quantity];
    if (input.extras.includes("скругление углов")) total += 300;
    if (input.extras.includes("срочность")) total = Math.round(total * 1.3);

    return {
      base: basePrices[quantity],
      extras: Math.max(0, total - basePrices[quantity]),
      total: Math.max(900, total)
    };
  }

  if (input.service === "Открытки") {
    const quantity = [1, 5, 10, 20].includes(input.quantity) ? input.quantity : 1;
    const a6: Record<number, number> = { 1: 200, 5: 700, 10: 1200, 20: 2000 };
    const a5: Record<number, number> = { 1: 300, 5: 1100, 10: 1900, 20: 3200 };
    const priceMap = input.format === "A5" ? a5 : a6;
    let total = priceMap[quantity];

    if (input.sides === "двусторонние") total = Math.round(total * 1.3);
    if (input.paper === "плотная матовая") total = Math.round(total * 1.2);
    if (input.hasEnvelope) total += quantity * 50;
    if (input.postcardDesign === "нужна подготовка макета") total += 700;

    return {
      base: priceMap[quantity],
      extras: Math.max(0, total - priceMap[quantity]),
      total: Math.max(200, total)
    };
  }

  if (input.service === "Документы") {
    const pages = Math.max(1, input.quantity);
    let total = 100;

    if (input.documentJob === "скан") {
      total = pages * 30;
    } else if (input.documentJob === "ламинация") {
      total = pages * 150;
    } else if (input.documentJob === "копия") {
      total = pages * 20;
    } else if (input.printColor === "цветная") {
      total = pages * 50;
    } else if (pages <= 10) {
      total = pages * 20;
    } else if (pages <= 50) {
      total = pages * 15;
    } else {
      total = pages * 12;
    }

    if (input.extras.includes("срочность")) total = Math.round(total * 1.2);

    return {
      base: total,
      extras: 0,
      total: Math.max(100, total)
    };
  }

  if (input.service === "Макеты") {
    let total = 500;
    if (input.layoutType === "лёгкая правка") total = 300;
    if (input.layoutType === "подготовка к печати") total = 500;
    if (input.layoutType === "макет с нуля") {
      if (input.layoutPurpose === "открытка") total = 700;
      else if (input.layoutPurpose === "визитка") total = 1000;
      else if (input.layoutPurpose === "листовка") total = 1500;
      else total = 2000;
    }
    if (input.extras.includes("срочность")) total = Math.round(total * 1.3);

    return {
      base: total,
      extras: 0,
      total
    };
  }

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
