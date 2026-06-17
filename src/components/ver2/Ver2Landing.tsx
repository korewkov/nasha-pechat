"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Lenis from "lenis";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Gift,
  Heart,
  Mail,
  Minus,
  Phone,
  Play,
  Plus,
  Rows3,
  Send,
  ShoppingBag,
  Sparkles,
  Wrench,
  X
} from "lucide-react";
import {
  calculateOrderPrice,
  serviceFormatOptions,
  type BusinessCardSides,
  type DocumentJobType,
  type ExtraOption,
  type LayoutPurpose,
  type LayoutType,
  type PaperType,
  type PostcardDesign,
  type PrintFormat,
  type PrintColor,
  type ServiceType
} from "@/config/pricing.config";
import { formatRub } from "@/lib/utils";

const serviceMap: Record<string, ServiceType> = {
  Раскраска: "Раскраска по фото",
  Фото: "Фото на документы",
  Визитки: "Визитки",
  Открытки: "Открытки",
  Документы: "Документы",
  Макеты: "Макеты"
};

const faqItems = [
  ["Можно заказать одну штуку?", "Да, можно. Мы берём и маленькие заказы: открытку, одно фото, один макет или небольшой тираж."],
  ["Можно без макета?", "Да. Напишите идею, подскажем формат и подготовку."],
  ["Сколько стоит?", "Цена зависит от формата, количества и типа заказа. Базовые цены указаны в карточках услуг и калькуляторе. Точную стоимость покажем перед оформлением заявки."],
  ["Как передать фото?", "Фото можно передать через Telegram, MAX, ВКонтакте или отправить на электронную почту. После заявки подскажем самый удобный способ и поможем с файлами."],
  ["Можно срочно?", "Да, если есть свободное окно в графике. Напишите нам — сразу сориентируем по срокам."]
] as const;

const stageVideos = [
  {
    title: "Подготовка",
    caption: "Проверяем файлы, фото и пожелания.",
    src: "/reels/optimized/process-1.mp4",
    poster: "/works/optimized/coloring-1.jpg"
  },
  {
    title: "Печать и сборка",
    caption: "Печатаем аккуратно и собираем заказ.",
    src: "/reels/optimized/process-2.mp4",
    poster: "/works/optimized/printing-1.jpg"
  },
  {
    title: "Проверка",
    caption: "Смотрим качество, размеры и детали.",
    src: "/reels/optimized/process-3.mp4",
    poster: "/works/optimized/photo-1.jpg"
  },
  {
    title: "Упаковка",
    caption: "Передаём заказ в аккуратном виде.",
    src: "/reels/optimized/process-4.mp4",
    poster: "/works/optimized/packaging-1.jpg"
  }
] as const;

type BuilderState = {
  product: keyof typeof serviceMap;
  service: ServiceType;
  format: PrintFormat;
  quantity: number;
  paper: PaperType;
  extras: ExtraOption[];
  sides: BusinessCardSides;
  postcardDesign: PostcardDesign;
  hasEnvelope: boolean;
  documentJob: DocumentJobType;
  printColor: PrintColor;
  layoutType: LayoutType;
  layoutPurpose: LayoutPurpose;
};

const initialBuilder: BuilderState = {
  product: "Раскраска",
  service: "Раскраска по фото",
  format: "A5",
  quantity: 5,
  paper: "плотная матовая",
  extras: [],
  sides: "односторонние",
  postcardDesign: "свой макет",
  hasEnvelope: false,
  documentJob: "печать",
  printColor: "ч/б",
  layoutType: "подготовка к печати",
  layoutPurpose: "открытка"
};

const heroFlowers = [
  { src: "/brand/flowers/flower-1.svg", className: "left-[5%] top-32 h-24 w-24 opacity-80 sm:h-32 sm:w-32 lg:left-[9%] lg:top-40", delay: 0 },
  { src: "/brand/flowers/flower-2.svg", className: "right-[6%] top-44 hidden h-28 w-28 opacity-75 sm:block lg:right-[11%] lg:top-36 lg:h-36 lg:w-36", delay: 0.4 },
  { src: "/brand/flowers/flower-3.svg", className: "bottom-24 left-[12%] hidden h-24 w-24 opacity-70 md:block lg:h-32 lg:w-32", delay: 0.9 },
  { src: "/brand/flowers/flower-4.svg", className: "bottom-28 right-[10%] h-20 w-20 opacity-75 sm:h-28 sm:w-28 lg:h-36 lg:w-36", delay: 1.2 }
] as const;

const tapeCards = [
  {
    title: "Раскраска по фото",
    description: "Соберём персональную книжку по вашим снимкам: обложка, страницы, печать и аккуратная сборка.",
    price: "от 1000 ₽",
    image: "/images/tape/tape-coloring.jpeg"
  },
  {
    title: "Фото на документы",
    description: "Подготовим снимок под нужный формат и напечатаем листом или отдельными фотографиями.",
    price: "от 300 ₽",
    image: "/images/tape/tape-doc-photo.jpeg"
  },
  {
    title: "Визитки",
    description: "Поможем с макетом, подберём бумагу и напечатаем небольшой тираж для мастера, бренда или события.",
    price: "от 500 ₽",
    image: "/images/tape/tape-business-cards.jpeg"
  },
  {
    title: "Открытки",
    description: "Сделаем карточку с вашим текстом, фото или иллюстрацией. Можно заказать от одной штуки.",
    price: "от 200 ₽",
    image: "/images/tape/tape-postcards.jpeg"
  },
  {
    title: "Документы",
    description: "Распечатаем, отсканируем или заламинируем материалы для учёбы, работы и бытовых задач.",
    price: "от 100 ₽",
    image: "/images/tape/tape-documents.jpeg"
  },
  {
    title: "Макеты",
    description: "Подготовим файл к печати: поправим размер, поля, качество, текст и расположение элементов.",
    price: "от 300 ₽",
    image: "/works/optimized/printing-1.jpg"
  }
] as const;

const galleryItems = [
  { src: "/works/optimized/coloring-1.jpg", alt: "Персональная раскраска по фото", category: "Раскраски" },
  { src: "/works/optimized/photo-1.jpg", alt: "Фото на документы", category: "Фото" },
  { src: "/works/optimized/business-1.jpg", alt: "Партия визиток", category: "Визитки" },
  { src: "/works/optimized/card-1.jpg", alt: "Печатные открытки", category: "Открытки" },
  { src: "/works/optimized/printing-1.jpg", alt: "Печать документов", category: "Документы" },
  { src: "/works/optimized/coloring-2.jpg", alt: "Разворот раскраски", category: "Раскраски" },
  { src: "/works/optimized/card-2.jpg", alt: "Открытки с иллюстрацией", category: "Открытки" },
  { src: "/works/optimized/packaging-1.jpg", alt: "Аккуратная упаковка заказа", category: "Документы" },
  { src: "/works/optimized/stickers-1.jpg", alt: "Наклейки и небольшая полиграфия", category: "Документы" },
  { src: "/works/optimized/packaging-2.jpg", alt: "Готовый заказ перед выдачей", category: "Документы" }
] as const;

const galleryFilters = ["Все", "Раскраски", "Фото", "Визитки", "Открытки", "Документы"] as const;

const businessCardQuantities = [50, 100, 200] as const;
const postcardQuantities = [1, 5, 10, 20] as const;
const documentJobs: DocumentJobType[] = ["печать", "копия", "скан", "ламинация"];
const layoutTypes: LayoutType[] = ["лёгкая правка", "подготовка к печати", "макет с нуля"];
const layoutPurposes: LayoutPurpose[] = ["открытка", "визитка", "листовка", "другой макет"];

export default function Ver2Landing() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const [builder, setBuilder] = useState<BuilderState>(initialBuilder);
  const [copiedToForm, setCopiedToForm] = useState(false);
  const [cursor, setCursor] = useState({ x: -400, y: -400 });
  const price = calculateOrderPrice(builder);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    if (reduceMotion || !desktopQuery.matches) return;

    const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9 });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const track = galleryTrackRef.current;
      if (track) {
        const distance = Math.max(0, track.scrollWidth - window.innerWidth + 120);
        gsap.to(track, {
          x: () => -distance,
          ease: "none",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top top",
            end: () => `+=${distance + 500}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
          }
        });
      }

    });

    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  function updateBuilder(next: Partial<BuilderState>) {
    setBuilder((current) => ({ ...current, ...next }));
  }

  function chooseProduct(product: keyof typeof serviceMap) {
    setBuilder((current) => {
      const service = serviceMap[product];
      const availableFormats = serviceFormatOptions[service];
      const nextQuantity =
        service === "Раскраска по фото"
          ? Math.max(5, current.quantity)
          : service === "Визитки"
            ? 50
            : service === "Открытки"
              ? 1
              : service === "Макеты"
                ? 1
                : current.quantity;
      return {
        ...current,
        product,
        service,
        format: availableFormats.includes(current.format) ? current.format : availableFormats[0],
        quantity: nextQuantity,
        paper:
          service === "Визитки" || service === "Открытки"
            ? "обычная"
            : current.paper,
        extras: [],
        sides: "односторонние",
        postcardDesign: "свой макет",
        hasEnvelope: false,
        documentJob: "печать",
        printColor: "ч/б",
        layoutType: "подготовка к печати",
        layoutPurpose: "открытка"
      };
    });
  }

  function passToForm() {
    setCopiedToForm(true);
    document.querySelector("#ver2-order")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => setCopiedToForm(false), 1800);
  }

  function toggleExtra(option: ExtraOption) {
    setBuilder((current) => ({
      ...current,
      extras: current.extras.includes(option)
        ? current.extras.filter((item) => item !== option)
        : [...current.extras, option]
    }));
  }

  return (
    <main
      className="relative max-w-[100vw] overflow-x-clip bg-gradient-to-br from-white via-milk to-pinkSoft/70 text-graphite"
      onPointerMove={(event) => setCursor({ x: event.clientX, y: event.clientY })}
    >
      <div
        className="cursor-glow pointer-events-none fixed left-0 top-0 z-[80] hidden h-72 w-72 rounded-full lg:block"
        style={{ transform: `translate3d(${cursor.x - 144}px, ${cursor.y - 144}px, 0)` }}
      />
      <HeroScene />
      <HorizontalGallery galleryRef={galleryRef} trackRef={galleryTrackRef} />
      <WorksShowcase />
      <ColoringSlider />
      <ProcessReels />
      <OrderBuilder
        builder={builder}
        price={price.total}
        updateBuilder={updateBuilder}
        chooseProduct={chooseProduct}
        toggleExtra={toggleExtra}
        passToForm={passToForm}
      />
      <GiftMiniGame />
      <EmotionReasons />
      <CompactFAQ />
      <QuickOrder builder={builder} price={price.total} copiedToForm={copiedToForm} />
      <Contacts />
      <MobileBottomCTA />
    </main>
  );
}

function ProcessReels() {
  const [activeReel, setActiveReel] = useState(0);

  function toggleVideo(event: React.PointerEvent<HTMLElement>, index: number) {
    const videoElement = event.currentTarget.querySelector("video");
    if (!videoElement) return;
    setActiveReel(index);
    if (videoElement.paused) {
      videoElement.play().catch(() => undefined);
      return;
    }
    videoElement.pause();
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-[clamp(3.5rem,12vw,5rem)] sm:px-6 lg:px-8 lg:py-20">
      <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-black uppercase text-pinkBrand">Этапы</p>
          <h2 className="font-display text-4xl font-black uppercase sm:text-6xl">
            Как это рождается
          </h2>
        </div>
        <p className="max-w-sm text-lg font-black text-graphite/60">
          Из ваших фото, файлов и идей мы собираем аккуратный печатный заказ — от подготовки макета до упаковки.
        </p>
      </div>
      <div className="mobile-snap flex max-w-full gap-4 overflow-x-auto pb-5 sm:gap-5">
        {stageVideos.map((video, index) => (
          <motion.article
            key={video.src}
            whileHover={{ y: -10, rotate: index % 2 ? 2 : -2 }}
            whileTap={{ scale: 0.985 }}
            onPointerUp={(event) => toggleVideo(event, index)}
            onMouseEnter={(event) => {
              const videoElement = event.currentTarget.querySelector("video");
              videoElement?.play().catch(() => undefined);
            }}
            onMouseLeave={(event) => {
              const videoElement = event.currentTarget.querySelector("video");
              if (!videoElement) return;
              videoElement.pause();
              videoElement.currentTime = 0;
            }}
            className="group relative aspect-[9/16] h-[min(68vh,520px)] min-h-[390px] w-[min(78vw,315px)] shrink-0 snap-center overflow-hidden rounded-[1.6rem] bg-graphite shadow-paper sm:w-[315px] lg:rounded-[2rem]"
          >
            <video
              className="process-stage-video"
              src={video.src}
              poster={video.poster}
              muted
              playsInline
              loop
              preload="metadata"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite/85 via-graphite/8 to-transparent" />
            <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
              <span className="rounded-full bg-white/90 px-3 py-2 text-xs font-black uppercase text-pinkBrand">
                этап {index + 1}
              </span>
              <span className={`grid h-11 w-11 place-items-center rounded-full text-white shadow-sticker transition ${activeReel === index ? "bg-graphite" : "bg-pinkBrand"}`}>
                <Play size={18} fill="currentColor" />
              </span>
            </div>
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/70 bg-white p-4 shadow-paper">
              <h3 className="font-display text-xl font-black uppercase text-graphite">{video.title}</h3>
              <p className="mt-1 text-sm font-black text-graphite/75">{video.caption}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function HeroScene() {
  return (
    <section className="ver2-hero relative isolate min-h-[92svh] overflow-hidden bg-white px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:min-h-screen lg:px-8 lg:py-10">
      <div className="absolute inset-x-0 bottom-0 -z-20 h-56 bg-gradient-to-t from-milk to-transparent" />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {heroFlowers.map((flower, index) => (
          <motion.div
            key={flower.src}
            className={`absolute ${flower.className}`}
            initial={{ opacity: 0, scale: 0.92, rotate: index % 2 ? -8 : 8 }}
            animate={{
              opacity: 1,
              y: index % 2 ? [0, -12, 0] : [0, 12, 0],
              x: index % 2 ? [0, 8, 0] : [0, -8, 0],
              rotate: index % 2 ? [-4, 4, -4] : [4, -4, 4]
            }}
            transition={{
              delay: flower.delay,
              duration: 10 + index,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img src={flower.src} alt="" className="h-full w-full object-contain" draggable={false} />
          </motion.div>
        ))}
      </div>
      <nav className="fixed inset-x-4 top-4 z-[100] mx-auto flex max-w-7xl items-center justify-between rounded-full bg-white px-3 py-3 shadow-paper sm:px-5 sm:py-4">
        <a href="/" className="relative h-11 w-[min(54vw,16rem)] overflow-hidden sm:h-14 sm:w-64" aria-label="Наша печать">
          <Image src="/brand/logos/logo-wide-alt.svg" alt="Наша печать" fill className="object-contain object-left" priority />
        </a>
        <div className="hidden gap-6 text-sm font-black uppercase text-graphite/60 md:flex">
          <a href="#ver2-products">Услуги</a>
          <a href="#ver2-builder">Калькулятор</a>
          <a href="#ver2-order">Заявка</a>
        </div>
        <a href="#ver2-order" className="inline-flex min-h-11 items-center rounded-full bg-pinkBrand px-4 text-xs font-black uppercase text-white shadow-sticker md:hidden">
          Заявка
        </a>
      </nav>

      <div className="relative z-20 mx-auto flex min-h-[calc(92svh-7.5rem)] max-w-7xl items-center justify-center py-[clamp(5rem,15vw,7rem)] text-center lg:min-h-[calc(100vh-8.5rem)] lg:py-28">
        <div className="select-none">
          <div className="space-y-2 overflow-hidden font-display text-[clamp(2.35rem,12.5vw,7.4rem)] font-black uppercase leading-[0.9] tracking-normal sm:text-[clamp(3rem,7.6vw,7.4rem)]">
            {["Печатаем красиво.", "Делаем с душой."].map((line, index) => (
              <motion.h1
                key={line}
                initial={{ y: "110%", rotate: 2 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ delay: index * 0.18, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                className={index === 1 ? "text-pinkBrand" : ""}
              >
                {line}
              </motion.h1>
            ))}
          </div>
          <motion.p
            className="mx-auto mt-7 max-w-3xl text-balance text-lg font-bold leading-relaxed text-graphite/70 sm:text-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            Раскраски по фото, фото на документы, визитки, открытки и макеты — аккуратно, быстро и с вниманием к деталям.
          </motion.p>
          <motion.div className="pointer-events-auto mt-9 flex flex-col justify-center gap-3 sm:flex-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
            <a href="#ver2-builder" className="magnetic inline-flex min-h-12 items-center justify-center rounded-full bg-pinkBrand px-7 py-4 text-center font-black uppercase text-white shadow-sticker">
              Рассчитать стоимость
            </a>
            <a href="#ver2-products" className="magnetic inline-flex min-h-12 items-center justify-center rounded-full border-2 border-graphite bg-white px-7 py-4 text-center font-black uppercase text-graphite">
              Смотреть услуги
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ColoringSlider() {
  const [position, setPosition] = useState(58);

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-[clamp(3.5rem,12vw,5rem)] sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8 lg:py-20">
      <div className="self-center">
        <p className="font-black uppercase text-pinkBrand">Фото → раскраска</p>
        <h2 className="mt-3 font-display text-4xl font-black uppercase sm:text-6xl">Из фото — в личную раскраску</h2>
        <p className="mt-5 text-lg font-bold leading-relaxed text-graphite/65">Переключите до/после. Так фотография становится личной раскраской.</p>
        <a href="#ver2-order" className="magnetic mt-7 inline-flex min-h-12 items-center rounded-full bg-pinkBrand px-7 py-4 font-black uppercase text-white shadow-sticker">
          Хочу такую раскраску
        </a>
      </div>
      <div className="relative overflow-hidden rounded-[1.75rem] bg-white p-2 shadow-paper sm:p-4 lg:rounded-[2.5rem]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] lg:rounded-[2rem]">
          <Image src="/images/coloring/photo-before.png" alt="Фото до превращения в раскраску" fill className="object-cover" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <Image src="/images/coloring/coloring-after.png" alt="Контурная версия раскраски" fill className="object-cover" />
          </div>
          <div
            className="pointer-events-none absolute inset-y-4 z-10 w-1.5 rounded-full bg-pinkBrand shadow-sticker"
            style={{ left: `${position}%` }}
          >
            <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-pinkBrand text-lg font-black text-white shadow-sticker">
              ↔
            </span>
          </div>
          <input
            aria-label="Двигать разделитель до и после"
            className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
          />
        </div>
      </div>
    </section>
  );
}

function HorizontalGallery({
  galleryRef,
  trackRef
}: {
  galleryRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <section id="ver2-products" ref={galleryRef} className="relative overflow-hidden bg-graphite py-16 text-white lg:min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8">
        <p className="font-black uppercase text-pinkSoft">Услуги и цены</p>
        <h2 className="mt-2 font-display text-4xl font-black uppercase sm:text-6xl">Что можно заказать</h2>
        <p className="mt-4 max-w-xl text-lg font-black text-white/62">
          Листайте карточки услуг: видно, что заказать, как это выглядит и от какой цены стартует.
        </p>
      </div>
      <div ref={trackRef} className="mobile-snap mt-10 flex w-auto max-w-none items-end gap-4 overflow-x-auto px-4 pb-5 sm:px-6 lg:mt-12 lg:w-max lg:gap-5 lg:overflow-visible lg:px-8 lg:pb-0">
        {tapeCards.map((work, index) => (
          <article key={`${work.title}-${index}`} className="peeled group flex h-[500px] w-[min(84vw,360px)] shrink-0 snap-center flex-col overflow-hidden rounded-[1.6rem] bg-white p-3 text-graphite shadow-sticker lg:h-[540px] lg:w-[380px] lg:rounded-[2rem]">
            <div className="relative h-[68%] overflow-hidden rounded-[1.25rem] bg-milk lg:rounded-[1.5rem]">
              <Image src={work.image} alt={work.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <div className="flex min-h-0 flex-1 flex-col justify-between px-1 pb-1 pt-4">
              <div>
                <h3 className="font-display text-2xl font-black uppercase leading-none">{work.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-graphite/62">{work.description}</p>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-pinkSoft px-4 py-2 text-sm font-black uppercase text-pinkBrand">
                  {work.price}
                </span>
                <a href="#ver2-builder" className="inline-flex min-h-10 items-center rounded-full bg-pinkBrand px-4 py-2 text-xs font-black uppercase text-white shadow-sticker">
                  Рассчитать
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function WorksShowcase() {
  const [activeFilter, setActiveFilter] = useState<(typeof galleryFilters)[number]>("Все");
  const [isOpen, setIsOpen] = useState(false);
  const visibleItems = galleryItems.filter((item) => activeFilter === "Все" || item.category === activeFilter);
  const previewItems = visibleItems.slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-[clamp(3rem,10vw,4.5rem)] sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-black uppercase text-pinkBrand">Примеры работ</p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase sm:text-6xl">Посмотрите, что уже печатали</h2>
          <p className="mt-4 max-w-2xl text-lg font-bold leading-relaxed text-graphite/62">
            Раскраски, открытки, визитки, фото и другие заказы — в одном компактном блоке.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex min-h-11 w-fit items-center rounded-full bg-pinkBrand px-5 py-3 text-sm font-black uppercase text-white shadow-sticker"
        >
          Смотреть больше
        </button>
      </div>

      <div className="mobile-snap mt-6 flex gap-2 overflow-x-auto pb-1 text-xs font-black uppercase text-graphite/60">
        {galleryFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`shrink-0 rounded-full px-4 py-2 transition ${
              activeFilter === filter ? "bg-pinkBrand text-white shadow-sticker" : "bg-white text-graphite shadow-paper"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        {previewItems.map((item, index) => (
          <button
            key={`${item.src}-${index}`}
            type="button"
            onClick={() => setIsOpen(true)}
            className={`group relative overflow-hidden rounded-[1.25rem] bg-white shadow-paper ${index === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}
          >
            <span className="relative block aspect-square">
              <Image src={item.src} alt={item.alt} fill loading="lazy" className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 18rem, 45vw" />
            </span>
            <span className="absolute inset-x-2 bottom-2 rounded-full bg-white/92 px-3 py-2 text-left text-[11px] font-black uppercase text-graphite shadow-paper">
              {item.category}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[120] overflow-y-auto bg-graphite/78 px-4 py-6 backdrop-blur-sm sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="mx-auto max-w-6xl rounded-[1.8rem] bg-white p-4 text-graphite shadow-paper sm:p-6 lg:rounded-[2.5rem]"
              initial={{ y: 24, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 24, scale: 0.98 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-black uppercase text-pinkBrand">Галерея</p>
                  <h3 className="mt-1 font-display text-3xl font-black uppercase sm:text-5xl">Больше примеров</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-graphite text-white"
                  aria-label="Закрыть галерею"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {visibleItems.map((item) => (
                  <figure key={item.src} className="overflow-hidden rounded-[1.2rem] bg-milk">
                    <div className="relative aspect-square">
                      <Image src={item.src} alt={item.alt} fill loading="lazy" className="object-cover" sizes="(min-width: 1024px) 16rem, 45vw" />
                    </div>
                    <figcaption className="p-3 text-xs font-black uppercase text-graphite/65">{item.alt}</figcaption>
                  </figure>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function OrderBuilder({
  builder,
  price,
  updateBuilder,
  chooseProduct,
  toggleExtra,
  passToForm
}: {
  builder: BuilderState;
  price: number;
  updateBuilder: (next: Partial<BuilderState>) => void;
  chooseProduct: (product: keyof typeof serviceMap) => void;
  toggleExtra: (option: ExtraOption) => void;
  passToForm: () => void;
}) {
  const availableFormats = serviceFormatOptions[builder.service];
  const usesStepper = !["Визитки", "Открытки", "Макеты"].includes(builder.service);
  const quantityLabel =
    builder.service === "Раскраска по фото"
      ? "Количество фото"
      : builder.service === "Документы"
        ? "Количество страниц"
        : "Количество";
  const quantityUnit =
    builder.service === "Раскраска по фото"
      ? "фото"
      : builder.service === "Документы"
        ? "стр."
        : "шт.";
  const helperText =
    builder.service === "Раскраска по фото"
      ? "В базу входят 5 фото. Сверх 5 фото добавляются к цене."
      : builder.service === "Фото на документы"
        ? "Для фото на документы доступны только 3×4 и 3,5×4,5."
        : builder.service === "Визитки"
          ? "Выберите размер, тираж, стороны и бумагу. Минимальная стоимость визиток — 900 ₽."
          : builder.service === "Открытки"
            ? "Можно заказать одну открытку или небольшой тираж, со своим макетом или подготовкой дизайна."
            : builder.service === "Документы"
              ? "Для документов считаем страницы: печать, копии, сканы или ламинацию."
              : builder.service === "Макеты"
                ? builder.layoutType === "макет с нуля" && builder.layoutPurpose === "другой макет"
                  ? "Для нестандартного макета покажем цену от 2000 ₽ и уточним стоимость после просмотра задачи."
                  : "Подготовим файл к печати или соберём макет под выбранную задачу."
        : "Подскажем, как лучше оформить заказ: бумагу, резку, ламинацию и упаковку подберём под задачу.";
  const summaryDetails =
    builder.service === "Визитки"
      ? `${builder.format} / ${builder.quantity} шт. / ${builder.sides} / ${builder.paper === "плотная матовая" ? "плотная бумага" : "стандартная бумага"}`
      : builder.service === "Открытки"
        ? `${builder.format} / ${builder.quantity} шт. / ${builder.sides} / ${builder.paper === "плотная матовая" ? "плотная бумага" : "стандартная бумага"}`
        : builder.service === "Документы"
          ? `${builder.documentJob} / ${builder.printColor} / ${builder.quantity} ${quantityUnit}`
          : builder.service === "Макеты"
            ? `${builder.layoutType} / ${builder.layoutPurpose}`
            : `${builder.format} / ${builder.quantity} ${quantityUnit}`;
  const pricePrefix = builder.service === "Макеты" && builder.layoutType === "макет с нуля" && builder.layoutPurpose === "другой макет" ? "от " : "";

  return (
    <section id="ver2-builder" className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
      <div>
        <p className="font-black uppercase text-pinkBrand">Конструктор заказа</p>
        <h2 className="mt-2 font-display text-4xl font-black uppercase sm:text-6xl">Соберите заказ</h2>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 text-xs font-black uppercase text-graphite/45 md:hidden">
          {["1 Что", "2 Формат", "3 Кол-во", "4 Итог"].map((step) => (
            <span key={step} className="shrink-0 rounded-full bg-white px-4 py-2 shadow-paper">{step}</span>
          ))}
        </div>
        <BuilderGroup title="Что делаем?">
          {Object.keys(serviceMap).map((item) => (
            <Chip key={item} active={builder.product === item} onClick={() => chooseProduct(item as keyof typeof serviceMap)}>
              {item}
            </Chip>
          ))}
        </BuilderGroup>
        {builder.service !== "Макеты" && (
          <BuilderGroup title={builder.service === "Визитки" ? "Размер" : "Формат"}>
            {availableFormats.map((item) => (
              <Chip key={item} active={builder.format === item} onClick={() => updateBuilder({ format: item })}>
                {item}
              </Chip>
            ))}
          </BuilderGroup>
        )}

        {builder.service === "Визитки" && (
          <>
            <BuilderGroup title="Тираж">
              {businessCardQuantities.map((item) => (
                <Chip key={item} active={builder.quantity === item} onClick={() => updateBuilder({ quantity: item })}>
                  {item} шт.
                </Chip>
              ))}
            </BuilderGroup>
            <BuilderGroup title="Стороны">
              {(["односторонние", "двусторонние"] as BusinessCardSides[]).map((item) => (
                <Chip key={item} active={builder.sides === item} onClick={() => updateBuilder({ sides: item })}>
                  {item}
                </Chip>
              ))}
            </BuilderGroup>
            <BuilderGroup title="Бумага">
              {(["обычная", "плотная матовая"] as PaperType[]).map((item) => (
                <Chip key={item} active={builder.paper === item} onClick={() => updateBuilder({ paper: item })}>
                  {item === "обычная" ? "стандартная" : "плотная"}
                </Chip>
              ))}
            </BuilderGroup>
            <BuilderGroup title="Опции">
              {(["скругление углов", "срочность"] as ExtraOption[]).map((item) => (
                <Chip key={item} active={builder.extras.includes(item)} onClick={() => toggleExtra(item)}>
                  {item}
                </Chip>
              ))}
            </BuilderGroup>
          </>
        )}

        {builder.service === "Открытки" && (
          <>
            <BuilderGroup title="Количество">
              {postcardQuantities.map((item) => (
                <Chip key={item} active={builder.quantity === item} onClick={() => updateBuilder({ quantity: item })}>
                  {item} шт.
                </Chip>
              ))}
            </BuilderGroup>
            <BuilderGroup title="Тип">
              {(["односторонние", "двусторонние"] as BusinessCardSides[]).map((item) => (
                <Chip key={item} active={builder.sides === item} onClick={() => updateBuilder({ sides: item })}>
                  {item}
                </Chip>
              ))}
            </BuilderGroup>
            <BuilderGroup title="Бумага">
              {(["обычная", "плотная матовая"] as PaperType[]).map((item) => (
                <Chip key={item} active={builder.paper === item} onClick={() => updateBuilder({ paper: item })}>
                  {item === "обычная" ? "стандартная" : "плотная"}
                </Chip>
              ))}
            </BuilderGroup>
            <BuilderGroup title="Макет и конверт">
              {(["свой макет", "нужна подготовка макета"] as PostcardDesign[]).map((item) => (
                <Chip key={item} active={builder.postcardDesign === item} onClick={() => updateBuilder({ postcardDesign: item })}>
                  {item}
                </Chip>
              ))}
              <Chip active={builder.hasEnvelope} onClick={() => updateBuilder({ hasEnvelope: !builder.hasEnvelope })}>
                конверт
              </Chip>
            </BuilderGroup>
          </>
        )}

        {builder.service === "Документы" && (
          <>
            <BuilderGroup title="Тип">
              {documentJobs.map((item) => (
                <Chip key={item} active={builder.documentJob === item} onClick={() => updateBuilder({ documentJob: item })}>
                  {item}
                </Chip>
              ))}
            </BuilderGroup>
            {builder.documentJob !== "скан" && builder.documentJob !== "ламинация" && (
              <BuilderGroup title="Печать">
                {(["ч/б", "цветная"] as PrintColor[]).map((item) => (
                  <Chip key={item} active={builder.printColor === item} onClick={() => updateBuilder({ printColor: item })}>
                    {item}
                  </Chip>
                ))}
              </BuilderGroup>
            )}
          </>
        )}

        {builder.service === "Макеты" && (
          <>
            <BuilderGroup title="Тип работы">
              {layoutTypes.map((item) => (
                <Chip key={item} active={builder.layoutType === item} onClick={() => updateBuilder({ layoutType: item })}>
                  {item}
                </Chip>
              ))}
            </BuilderGroup>
            {builder.layoutType === "макет с нуля" && (
              <BuilderGroup title="Назначение">
                {layoutPurposes.map((item) => (
                  <Chip key={item} active={builder.layoutPurpose === item} onClick={() => updateBuilder({ layoutPurpose: item })}>
                    {item}
                  </Chip>
                ))}
              </BuilderGroup>
            )}
            <BuilderGroup title="Срок">
              <Chip active={builder.extras.includes("срочность")} onClick={() => toggleExtra("срочность")}>
                срочно
              </Chip>
            </BuilderGroup>
          </>
        )}

        {usesStepper && (
          <div className="my-5 rounded-[1.5rem] bg-white p-4 shadow-paper sm:my-8 sm:rounded-[2rem] sm:p-5">
            <p className="text-sm font-black uppercase text-graphite/55">{quantityLabel}</p>
            <div className="mt-3 flex items-center gap-4">
              <button type="button" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-graphite text-white sm:h-14 sm:w-14" onClick={() => updateBuilder({ quantity: Math.max(1, builder.quantity - 1) })}>
                <Minus />
              </button>
              <motion.div key={builder.quantity} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="font-display text-5xl font-black text-pinkBrand sm:text-6xl">
                {builder.quantity}
              </motion.div>
              <span className="text-sm font-black uppercase text-graphite/45">{quantityUnit}</span>
              <button type="button" className="ml-auto grid h-12 w-12 shrink-0 place-items-center rounded-full bg-pinkBrand text-white sm:h-14 sm:w-14" onClick={() => updateBuilder({ quantity: builder.quantity + 1 })}>
                <Plus />
              </button>
            </div>
            {builder.service === "Документы" && (
              <button type="button" className={`mt-4 rounded-full px-4 py-2 text-xs font-black uppercase transition ${builder.extras.includes("срочность") ? "bg-pinkBrand text-white" : "bg-pinkSoft text-pinkBrand"}`} onClick={() => toggleExtra("срочность")}>
                срочно
              </button>
            )}
          </div>
        )}
        <div className="mt-5 rounded-[1.5rem] bg-white p-4 font-black text-graphite/60 shadow-paper sm:mt-8 sm:rounded-[2rem] sm:p-5">
          {helperText}
          {builder.service === "Макеты" && builder.layoutType === "макет с нуля" && builder.layoutPurpose === "другой макет" && (
            <p className="mt-3 text-pinkBrand">Точную стоимость уточним после просмотра задачи.</p>
          )}
        </div>
      </div>

      <aside className="sticky top-4 h-fit overflow-hidden rounded-[1.8rem] bg-graphite p-4 text-white shadow-paper sm:p-6 lg:top-6 lg:rounded-[2.5rem]">
        <div className="relative h-36 overflow-hidden rounded-[1.35rem] sm:h-64 lg:rounded-[2rem]">
          <Image src="/generated/optimized/order-stack.jpg" alt="Превью заказа" fill className="object-cover" />
        </div>
        <div className="mt-4 rounded-[1.5rem] bg-white p-4 text-graphite sm:mt-6 sm:min-h-48 sm:rounded-[2rem] sm:p-5">
          <p className="font-black uppercase text-pinkBrand">Чек печатается</p>
          <p className="mt-3 font-display text-3xl font-black uppercase">{builder.product}</p>
          <p className="mt-2 font-bold text-graphite/60">{summaryDetails}</p>
          <p className="mt-4 hidden rounded-full bg-pinkSoft px-4 py-3 text-xs font-black uppercase text-pinkBrand sm:block">
            Подскажем, как лучше оформить заказ
          </p>
          <motion.p key={price} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-4 font-display text-5xl font-black text-pinkBrand sm:mt-6">
            {pricePrefix}{formatRub(price)}
          </motion.p>
        </div>
        <button onClick={passToForm} className="magnetic mt-5 min-h-12 w-full rounded-full bg-pinkBrand px-7 py-4 font-black uppercase text-white shadow-sticker">
          Оставить заявку
        </button>
      </aside>
    </section>
  );
}

function GiftMiniGame() {
  const [clicks, setClicks] = useState(0);
  const [copied, setCopied] = useState(false);
  const [targetClicks, setTargetClicks] = useState(18);
  const progress = Math.min(100, Math.round((clicks / targetClicks) * 100));
  const unlocked = progress >= 100;
  const progressAngle = progress * 3.6;

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const syncTarget = () => setTargetClicks(mobileQuery.matches ? 10 : 18);
    syncTarget();
    mobileQuery.addEventListener("change", syncTarget);
    return () => mobileQuery.removeEventListener("change", syncTarget);
  }, []);

  async function copyPromo() {
    await navigator.clipboard?.writeText("НАШИ10");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-[clamp(3.5rem,12vw,5rem)] sm:px-6 lg:px-8 lg:py-20">
      <div className="mb-8 max-w-3xl">
        <h2 className="mt-2 font-display text-4xl font-black uppercase sm:text-6xl">Откройте подарок</h2>
        <p className="mt-5 text-lg font-bold text-graphite/62">
          Заполните шкалу до конца — внутри промокод для первого заказа.
        </p>
      </div>
      <motion.div
        className="relative overflow-hidden rounded-[1.9rem] p-2 shadow-sticker lg:rounded-[2.75rem]"
        animate={{
          background: unlocked
            ? "linear-gradient(135deg, #ff4d7d, #ffd9e3)"
            : `conic-gradient(from -90deg, #ffffff ${progressAngle}deg, rgba(255,255,255,.25) ${progressAngle}deg 360deg)`
        }}
        transition={{ duration: 0.24 }}
      >
        <div className={`relative grid min-h-[440px] place-items-center overflow-hidden rounded-[1.55rem] sm:min-h-[520px] lg:rounded-[2.35rem] ${unlocked ? "bg-white" : "bg-pinkBrand"}`}>
          {!unlocked && (
            <div className="absolute right-7 top-7 rounded-full bg-white px-5 py-3 font-display text-2xl font-black text-pinkBrand shadow-paper">
              {progress}%
            </div>
          )}
          <motion.div
            initial={false}
            animate={unlocked ? { scale: 1, opacity: 1 } : { scale: 0.94, opacity: 0.16 }}
            className="relative z-10 grid w-full max-w-xl place-items-center rounded-[2rem] bg-white p-8 text-center shadow-paper sm:p-10"
          >
            <div className="relative grid h-44 w-48 place-items-center rounded-[2rem] bg-pinkBrand text-white shadow-sticker">
              <Gift size={82} />
              <div className="absolute left-1/2 top-0 h-full w-8 -translate-x-1/2 bg-white/25" />
              <div className="absolute left-0 top-1/2 h-8 w-full -translate-y-1/2 bg-white/25" />
            </div>
            <p className="mt-7 font-display text-4xl font-black uppercase text-graphite">Скидка 10%</p>
            <p className="mt-2 text-lg font-black text-graphite/62">на первый заказ</p>
            <div className="mt-7 w-full max-w-md">
              <p className="mb-2 text-left text-xs font-black uppercase text-graphite/45">Промокод</p>
              <div className="flex items-center gap-3">
                <button type="button" onClick={copyPromo} className="min-h-14 min-w-0 flex-1 rounded-full bg-pinkSoft px-6 py-4 text-center font-display text-2xl font-black uppercase text-pinkBrand">
                  НАШИ10
                </button>
                <button
                  type="button"
                  onClick={copyPromo}
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-graphite text-white shadow-paper transition hover:bg-pinkBrand"
                  aria-label="Скопировать промокод"
                >
                  <Copy size={20} />
                </button>
              </div>
              {copied && <p className="mt-3 text-left text-sm font-black uppercase text-pinkBrand">Скопировано</p>}
            </div>
          </motion.div>

          <AnimatePresence>
            {!unlocked && (
              <motion.div
                className="absolute inset-0 z-30 grid place-items-center bg-pinkBrand"
                exit={{ y: "-105%", rotate: -2, opacity: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute inset-x-8 top-8 h-4 overflow-hidden rounded-full bg-white/30 shadow-paper sm:inset-x-12">
                  <motion.div
                    className="h-full rounded-full bg-white"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.18 }}
                  />
                </div>
                <div className="pointer-events-none absolute inset-0">
                  {[
                    { show: progress >= 15, className: "left-[30%] top-[34%] h-28 rotate-[24deg]" },
                    { show: progress >= 30, className: "left-[48%] top-[28%] h-36 rotate-[-18deg]" },
                    { show: progress >= 45, className: "left-[58%] top-[47%] h-32 rotate-[38deg]" },
                    { show: progress >= 60, className: "left-[40%] top-[55%] h-40 rotate-[-42deg]" },
                    { show: progress >= 75, className: "left-[68%] top-[30%] h-24 rotate-[74deg]" },
                    { show: progress >= 90, className: "left-[24%] top-[58%] h-24 rotate-[112deg]" }
                  ].map((crack) => (
                    <span
                      key={crack.className}
                      className={`absolute w-1 origin-top rounded-full bg-white shadow-paper transition duration-200 ${crack.show ? "scale-y-100 opacity-90" : "scale-y-0 opacity-0"} ${crack.className}`}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.88, rotate: -2 }}
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                    onClick={() => setClicks((value) => Math.min(targetClicks, value + 1))}
                    className="min-h-24 rounded-full bg-white px-14 py-7 font-display text-5xl font-black uppercase text-pinkBrand shadow-paper sm:px-16 sm:py-8"
                  >
                    Подарок
                  </motion.button>
                  <p className="mt-7 font-display text-4xl font-black text-white">{progress}%</p>
                  <div className="mx-auto mt-4 grid max-w-xs grid-cols-10 gap-1">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <span
                        key={index}
                        className={`h-2 rounded-full transition ${progress >= (index + 1) * 10 ? "bg-white" : "bg-white/28"}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}

function EmotionReasons() {
  const items = [
    ["Сначала идея", "Вы приносите фото, файл или задачу."],
    ["Потом оформление", "Мы подбираем формат, бумагу и детали печати."],
    ["И хочется сохранить", "Получается заказ, который приятно подарить, вручить или оставить себе."]
  ] as const;

  return (
    <section className="mx-auto max-w-7xl px-4 py-[clamp(3.5rem,12vw,5rem)] sm:px-6 lg:px-8 lg:py-20">
      <div className="rounded-[1.8rem] bg-graphite p-5 text-white shadow-paper sm:p-9 lg:rounded-[2.5rem]">
        <p className="font-black uppercase text-pinkSoft">Печать с вниманием</p>
        <h2 className="mt-2 max-w-4xl font-display text-4xl font-black uppercase sm:text-6xl">Не просто печать. А аккуратный результат, который приятно получить.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map(([title, text], index) => (
            <motion.div key={title} whileHover={{ y: -10, rotate: index % 2 ? 2 : -2 }} className="peeled min-h-64 rounded-[2rem] bg-white p-6 text-graphite shadow-sticker">
              <div className="mb-10 grid h-16 w-16 place-items-center rounded-full bg-pinkBrand text-white">
                {index === 0 ? <Heart fill="currentColor" /> : index === 1 ? <Sparkles /> : <Gift />}
              </div>
              <p className="font-display text-3xl font-black uppercase">{title}</p>
              <p className="mt-4 font-bold leading-relaxed text-graphite/62">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompactFAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="mx-auto max-w-4xl px-4 py-[clamp(3.5rem,12vw,5rem)] sm:px-6 lg:px-8 lg:py-20">
      <h2 className="font-display text-4xl font-black uppercase sm:text-6xl">Коротко</h2>
      <div className="mt-8 space-y-3">
        {faqItems.map(([question, answer], index) => (
          <div key={question} className="rounded-[1.5rem] bg-white shadow-paper">
            <button onClick={() => setOpen(open === index ? -1 : index)} className="flex min-h-16 w-full items-center justify-between gap-4 p-5 text-left font-display text-lg font-black uppercase sm:text-xl">
              {question}
              <motion.span animate={{ rotate: open === index ? 180 : 0 }} className="text-pinkBrand">
                <ChevronDown />
              </motion.span>
            </button>
            <AnimatePresence>
              {open === index && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-5 pb-5 font-bold text-graphite/65">
                  {answer}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contacts() {
  const items = [
    {
      label: "ВКонтакте",
      value: "Открыть сообщество",
      href: "https://vk.com/nasha_pechat",
      icon: ExternalLink,
      external: true
    },
    {
      label: "Телефон",
      value: "8 923 527 37 38",
      href: "tel:+79235273738",
      icon: Phone,
      external: false
    },
    {
      label: "Почта",
      value: "Написать на почту",
      href: "mailto:korewkov.des@gmail.com",
      icon: Mail,
      external: false
    }
  ] as const;

  return (
    <footer id="ver2-contacts" className="bg-graphite px-4 pb-28 pt-12 text-white sm:px-6 sm:pt-16 lg:px-8 lg:pb-12 lg:pt-20">
      <div className="mx-auto max-w-7xl rounded-[1.8rem] border border-white/10 bg-white p-5 text-graphite shadow-paper sm:p-8 lg:rounded-[2.5rem]">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="font-black uppercase text-pinkBrand">Контакты</p>
            <h2 className="mt-2 font-display text-4xl font-black uppercase sm:text-6xl">Напишите нам</h2>
            <p className="mt-4 max-w-xl text-lg font-bold leading-relaxed text-graphite/65">
              Напишите нам — подскажем по формату, цене и подготовке файлов.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  className="group rounded-[1.35rem] border border-white/10 bg-white p-4 text-graphite shadow-paper transition hover:border-pinkBrand hover:bg-pinkSoft"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-pinkBrand text-white shadow-sticker">
                    {item.label === "ВКонтакте" ? <span className="text-sm font-black">VK</span> : <Icon size={20} />}
                  </span>
                  <span className="mt-4 block text-xs font-black uppercase text-graphite/50">{item.label}</span>
                  <span className="mt-1 block whitespace-nowrap text-[clamp(0.82rem,2.6vw,1rem)] font-black text-graphite">{item.value}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

function QuickOrder({
  builder,
  price,
  copiedToForm
}: {
  builder: BuilderState;
  price: number;
  copiedToForm: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const quantityUnit = builder.service === "Раскраска по фото" ? "фото" : "шт.";
  const summary = useMemo(
    () => {
      const details =
        builder.service === "Визитки"
          ? `${builder.format}, ${builder.quantity} шт., ${builder.sides}, ${builder.paper === "плотная матовая" ? "плотная бумага" : "стандартная бумага"}`
          : builder.service === "Открытки"
            ? `${builder.format}, ${builder.quantity} шт., ${builder.sides}, ${builder.paper === "плотная матовая" ? "плотная бумага" : "стандартная бумага"}, ${builder.postcardDesign}${builder.hasEnvelope ? ", конверт" : ""}`
            : builder.service === "Документы"
              ? `${builder.documentJob}, ${builder.printColor}, ${builder.quantity} стр.`
              : builder.service === "Макеты"
                ? `${builder.layoutType}, ${builder.layoutPurpose}`
                : `${builder.format}, ${builder.quantity} ${quantityUnit}`;

      return `${builder.product}, ${details}, ${builder.extras.length ? builder.extras.join(", ") : "без доп. опций"}`;
    },
    [builder, quantityUnit]
  );

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = {
      name: String(form.get("name") || ""),
      phone: String(form.get("contact") || ""),
      messenger: String(form.get("contact") || ""),
      service: builder.service,
      format: builder.format,
      quantity: builder.quantity,
      paper: builder.paper,
      extras: builder.extras,
      hasDesign: "нет",
      urgency: builder.extras.includes("срочность") ? "срочно" : "стандартно",
      description: String(form.get("idea") || ""),
      estimatedPrice: price,
      promoCode: String(form.get("promoCode") || ""),
      comment: [`Ver2: ${summary}`, String(form.get("comment") || "")]
        .filter(Boolean)
        .join("\n"),
      consent: true,
      website: ""
    };
    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const result = await response.json();
    setStatus(response.ok && result.ok ? "success" : "error");
    setMessage(
      response.ok && result.ok
        ? "Заявка принята в печать. Скоро свяжемся."
        : result.error ?? "Не получилось отправить. Попробуйте ещё раз."
    );
  }

  return (
    <section id="ver2-order" className="mx-auto grid max-w-7xl gap-8 px-4 py-[clamp(3.5rem,12vw,5rem)] sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-20">
      <div className="rounded-[1.8rem] bg-graphite p-5 text-white shadow-paper sm:p-7 lg:rounded-[2.5rem]">
        <p className="font-black uppercase text-pinkSoft">Форма заявки</p>
        <h2 className="mt-3 font-display text-4xl font-black uppercase sm:text-5xl">Оставить заявку</h2>
        <p className="mt-6 text-lg font-bold text-white/70">
          Не знаете формат и бумагу? Ничего страшного. Напишите идею — подскажем лучший вариант.
        </p>
        <p className="mt-4 text-sm font-bold leading-relaxed text-white/55">
          Фото можно передать через Telegram, MAX, ВКонтакте или отправить на электронную почту. После заявки мы подскажем самый удобный способ.
        </p>
        <motion.div animate={copiedToForm ? { scale: [1, 1.04, 1], rotate: [-1, 2, 0] } : {}} className="peeled mt-8 rounded-3xl bg-pinkBrand p-5 shadow-sticker">
          <p className="text-sm font-black uppercase">Из конструктора</p>
          <p className="mt-2 font-display text-2xl font-black uppercase">{summary}</p>
          <p className="mt-3 font-display text-4xl font-black">{formatRub(price)}</p>
        </motion.div>
      </div>
      <form onSubmit={submit} className="rounded-[1.8rem] bg-white p-5 shadow-paper sm:p-7 lg:rounded-[2.5rem]">
        <div className="grid gap-4 md:grid-cols-2">
          <input name="name" required minLength={2} className="field" placeholder="Имя" />
          <input name="contact" required minLength={6} className="field" placeholder="Телефон / мессенджер" />
        </div>
        <textarea name="idea" required minLength={8} className="field mt-4 min-h-32 resize-y" placeholder="Что хотите сделать?" />
        <input name="promoCode" className="field mt-4" placeholder="Введите промокод, если есть" />
        <textarea name="comment" className="field mt-4 min-h-24 resize-y" placeholder="Комментарий, срок, пожелания" />
        <button className="magnetic mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-pinkBrand px-7 py-4 font-black uppercase text-white shadow-sticker md:w-auto">
          <Send size={20} /> Отправить заявку
        </button>
        <AnimatePresence>
          {status !== "idle" && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="peeled mt-6 rounded-3xl bg-milk p-5 font-black text-graphite">
              <p className="font-display text-2xl uppercase">{status === "success" ? "Заявка принята в печать" : "Нужна проверка"}</p>
              <p className="mt-2 text-graphite/65">{message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </section>
  );
}

function BuilderGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 sm:mt-8">
      <p className="mb-3 text-sm font-black uppercase text-graphite/55">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      className={`min-h-11 rounded-full border px-4 py-2.5 text-sm font-black uppercase transition sm:px-5 sm:py-3 ${
        active ? "border-pinkBrand bg-pinkBrand text-white shadow-sticker" : "border-graphite/10 bg-white text-graphite shadow-paper"
      }`}
    >
      {active && <Check className="mr-2 inline" size={16} />}
      {children}
    </motion.button>
  );
}

function MobileBottomCTA() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-[90] grid grid-cols-3 gap-2 rounded-[1.25rem] border border-white bg-white p-2 shadow-paper md:hidden mobile-safe-cta">
      <a href="#ver2-builder" className="flex min-h-12 flex-col items-center justify-center rounded-2xl bg-pinkBrand px-2 text-[11px] font-black uppercase text-white">
        <ShoppingBag size={18} />
        Заказать
      </a>
      <a href="#ver2-products" className="flex min-h-12 flex-col items-center justify-center rounded-2xl bg-pinkSoft px-2 text-[11px] font-black uppercase text-pinkBrand">
        <Rows3 size={18} />
        Услуги
      </a>
      <a href="#ver2-order" className="flex min-h-12 flex-col items-center justify-center rounded-2xl bg-graphite px-2 text-[11px] font-black uppercase text-white">
        <Wrench size={18} />
        Заявка
      </a>
    </nav>
  );
}
