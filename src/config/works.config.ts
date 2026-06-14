export type WorkCategory =
  | "Все"
  | "Раскраски"
  | "Фото"
  | "Визитки"
  | "Стикеры"
  | "Открытки"
  | "Упаковка";

export const workCategories: WorkCategory[] = [
  "Все",
  "Раскраски",
  "Фото",
  "Визитки",
  "Стикеры",
  "Открытки",
  "Упаковка"
];

export const works = [
  {
    title: "Раскраска из семейных фото",
    description: "Нежная персональная книжка с плотной обложкой.",
    category: "Раскраски",
    image: "/works/coloring-1.jpg"
  },
  {
    title: "Фото на документы",
    description: "Чистая подготовка, нужный формат и печать без суеты.",
    category: "Фото",
    image: "/works/photo-1.jpg"
  },
  {
    title: "Карточки мастера",
    description: "Плотная бумага, контрастный бренд и аккуратная резка.",
    category: "Визитки",
    image: "/works/business-1.jpg"
  },
  {
    title: "Набор стикеров",
    description: "Яркие наклейки для упаковки и подарочных наборов.",
    category: "Стикеры",
    image: "/works/stickers-1.jpg"
  },
  {
    title: "Спасибо-карточка",
    description: "Маленький печатный жест, который запоминают.",
    category: "Открытки",
    image: "/works/card-1.jpg"
  },
  {
    title: "Упаковочные вкладыши",
    description: "Наклейки, бирки и вкладыши в едином стиле.",
    category: "Упаковка",
    image: "/works/packaging-1.jpg"
  },
  {
    title: "Мини-тираж документов",
    description: "Печать, ламинация и сборка небольших партий.",
    category: "Фото",
    image: "/works/printing-1.jpg"
  },
  {
    title: "Раскраска-подарок",
    description: "Персональный подарок для важного момента.",
    category: "Раскраски",
    image: "/works/coloring-2.jpg"
  }
] as const;

export const reviews = [
  {
    name: "Мария",
    service: "Раскраска по фото",
    text: "Mock data: сделали очень быстро, ребёнок был в восторге от книжки с нашими фотографиями.",
    rating: 5
  },
  {
    name: "Анна",
    service: "Стикеры",
    text: "Mock data: помогли подобрать бумагу и напечатали наклейки для упаковки красиво и ровно.",
    rating: 5
  },
  {
    name: "Илья",
    service: "Визитки",
    text: "Mock data: всё понятно объяснили, проверили макет и сделали аккуратный небольшой тираж.",
    rating: 5
  }
];
