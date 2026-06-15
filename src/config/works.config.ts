export type WorkCategory =
  | "Все"
  | "Раскраски"
  | "Фото"
  | "Визитки"
  | "Открытки"
  | "Документы";

export const workCategories: WorkCategory[] = [
  "Все",
  "Раскраски",
  "Фото",
  "Визитки",
  "Открытки",
  "Документы"
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
    title: "Спасибо-карточка",
    description: "Маленький печатный жест, который запоминают.",
    category: "Открытки",
    image: "/works/card-1.jpg"
  },
  {
    title: "Печать документов",
    description: "Файлы, анкеты и учебные материалы в аккуратной стопке.",
    category: "Документы",
    image: "/works/printing-1.jpg"
  },
  {
    title: "Мини-тираж документов",
    description: "Печать, ламинация и сборка небольших партий.",
    category: "Документы",
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
    service: "Открытки",
    text: "Mock data: помогли подобрать бумагу и напечатали открытки красиво и ровно.",
    rating: 5
  },
  {
    name: "Илья",
    service: "Визитки",
    text: "Mock data: всё понятно объяснили, проверили макет и сделали аккуратный небольшой тираж.",
    rating: 5
  }
];
