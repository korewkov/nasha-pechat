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
  FileImage,
  Gift,
  Heart,
  Minus,
  Play,
  Plus,
  Send,
  Sparkles
} from "lucide-react";
import {
  calculateOrderPrice,
  type ExtraOption,
  type PaperType,
  type PrintFormat,
  type ServiceType
} from "@/config/pricing.config";
import { works } from "@/config/works.config";
import { formatRub } from "@/lib/utils";

const products = [
  {
    short: "Раскраска",
    service: "Раскраска по фото",
    line: "Фото превращаем в книжку.",
    image: "/works/optimized/coloring-1.jpg",
    move: "group-hover:[transform:rotate(-3deg)_translateY(-10px)]"
  },
  {
    short: "Фото",
    service: "Фото на документы",
    line: "Ровно, чисто, по формату.",
    image: "/works/optimized/photo-1.jpg",
    move: "group-hover:brightness-110"
  },
  {
    short: "Стикеры",
    service: "Стикеры",
    line: "Для упаковки и подарков.",
    image: "/works/optimized/stickers-1.jpg",
    move: "group-hover:[transform:rotate(4deg)_scale(1.05)]"
  },
  {
    short: "Визитки",
    service: "Визитки",
    line: "Карточки, которые держат стиль.",
    image: "/works/optimized/business-1.jpg",
    move: "group-hover:[transform:translateX(10px)_rotate(2deg)]"
  },
  {
    short: "Открытки",
    service: "Открытки",
    line: "Спасибо, праздник, вау.",
    image: "/works/optimized/card-1.jpg",
    move: "group-hover:[transform:rotate(-2deg)_scale(1.04)]"
  },
  {
    short: "Документы",
    service: "Печать документов",
    line: "Печать, сборка, ламинация.",
    image: "/works/optimized/printing-1.jpg",
    move: "group-hover:[transform:translateY(-12px)]"
  }
] as const;

const serviceMap: Record<string, ServiceType> = {
  Раскраска: "Раскраска по фото",
  Фото: "Фото на документы",
  Стикеры: "Стикеры",
  Визитки: "Визитки",
  Открытки: "Открытки",
  Документы: "Печать документов"
};

const formatOptions: PrintFormat[] = ["A6", "A5", "A4", "10x15", "свой размер"];
const faqItems = [
  ["Можно одну штуку?", "Да. Печатаем маленькие заказы без неловкости."],
  ["Можно без макета?", "Да. Напишите идею, подскажем формат и подготовку."],
  ["Сколько стоит?", "Калькулятор даст ориентир. Точно скажем после проверки."],
  ["Как передать фото?", "Через Telegram, WhatsApp или ссылкой на облако."],
  ["Можно срочно?", "Если есть окно в графике, сделаем быстрее."]
] as const;

const reelVideos = [
  {
    title: "Рождение раскраски",
    caption: "Фото, линии, разворот",
    src: "/reels/optimized/process-1.mp4",
    poster: "/works/optimized/coloring-1.jpg"
  },
  {
    title: "Печать и сборка",
    caption: "Листы выходят красиво",
    src: "/reels/optimized/process-2.mp4",
    poster: "/works/optimized/printing-1.jpg"
  },
  {
    title: "Стикеры и резка",
    caption: "Отклеивается как надо",
    src: "/reels/optimized/process-3.mp4",
    poster: "/works/optimized/stickers-1.jpg"
  },
  {
    title: "Упаковка заказа",
    caption: "Важное внутри",
    src: "/reels/optimized/process-4.mp4",
    poster: "/works/optimized/packaging-1.jpg"
  },
  {
    title: "Готовая красота",
    caption: "Проверяем детали",
    src: "/reels/optimized/process-5.mp4",
    poster: "/works/optimized/card-1.jpg"
  }
] as const;

type BuilderState = {
  product: keyof typeof serviceMap;
  service: ServiceType;
  format: PrintFormat;
  quantity: number;
  paper: PaperType;
  extras: ExtraOption[];
};

const initialBuilder: BuilderState = {
  product: "Раскраска",
  service: "Раскраска по фото",
  format: "A5",
  quantity: 12,
  paper: "плотная матовая",
  extras: []
};

const cloudLabels = ["Раскраска", "Стикеры", "Визитки", "Открытки", "Фото", "Ламинация"] as const;

type CloudItem = {
  id: number;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  dragging: boolean;
  hovered: boolean;
  lastX: number;
  lastY: number;
  phase: number;
};

function optimizedWorkImage(path: string) {
  return path.replace("/works/", "/works/optimized/");
}

export default function Ver2Landing() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const [builder, setBuilder] = useState<BuilderState>(initialBuilder);
  const [copiedToForm, setCopiedToForm] = useState(false);
  const [cursor, setCursor] = useState({ x: -400, y: -400 });
  const price = calculateOrderPrice(builder);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

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

      gsap.to(".hero-depth", {
        y: 140,
        scale: 0.92,
        opacity: 0.72,
        ease: "none",
        scrollTrigger: { trigger: ".ver2-hero", start: "top top", end: "bottom top", scrub: true }
      });

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
    setBuilder((current) => ({ ...current, product, service: serviceMap[product] }));
  }

  function passToForm() {
    setCopiedToForm(true);
    document.querySelector("#ver2-order")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => setCopiedToForm(false), 1800);
  }

  return (
    <main
      className="relative max-w-[100vw] overflow-x-clip bg-gradient-to-br from-white via-milk to-pinkSoft/70 text-graphite"
      onPointerMove={(event) => setCursor({ x: event.clientX, y: event.clientY })}
    >
      <div
        className="cursor-glow pointer-events-none fixed left-0 top-0 z-[80] hidden h-72 w-72 rounded-full blur-xl lg:block"
        style={{ transform: `translate3d(${cursor.x - 144}px, ${cursor.y - 144}px, 0)` }}
      />
      <HeroScene />
      <ProductChooser chooseProduct={chooseProduct} active={builder.product} />
      <ColoringSlider />
      <ProcessReels />
      <HorizontalGallery galleryRef={galleryRef} trackRef={galleryTrackRef} />
      <OrderBuilder
        builder={builder}
        price={price.total}
        updateBuilder={updateBuilder}
        chooseProduct={chooseProduct}
        passToForm={passToForm}
      />
      <GiftMiniGame />
      <EmotionReasons />
      <CompactFAQ />
      <QuickOrder builder={builder} price={price.total} copiedToForm={copiedToForm} />
    </main>
  );
}

function ProcessReels() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-black uppercase text-pinkBrand">Процесс</p>
          <h2 className="font-display text-4xl font-black uppercase sm:text-6xl">
            Как это рождается
          </h2>
        </div>
        <p className="max-w-sm text-lg font-black text-graphite/60">
          Маленькая магия: из файла на экране рождается вещь, которую хочется держать в руках.
        </p>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-5">
        {reelVideos.map((video, index) => (
          <motion.article
            key={video.src}
            whileHover={{ y: -10, rotate: index % 2 ? 2 : -2 }}
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
            className="group relative aspect-[9/16] h-[560px] max-h-[78vh] min-h-[430px] w-[250px] shrink-0 overflow-hidden rounded-[2rem] bg-graphite shadow-paper sm:w-[315px]"
          >
            <video
              className="h-full w-full object-cover"
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
                reel {index + 1}
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-pinkBrand text-white shadow-sticker">
                <Play size={18} fill="currentColor" />
              </span>
            </div>
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-paper backdrop-blur">
              <h3 className="font-display text-xl font-black uppercase text-graphite">{video.title}</h3>
              <p className="mt-1 text-sm font-black text-graphite/75">{video.caption}</p>
            </div>
          </motion.article>
        ))}
      </div>
      <p className="mt-2 text-sm font-bold text-graphite/45">
        Наведите курсор на карточку — и процесс оживет.
      </p>
    </section>
  );
}

function HeroScene() {
  return (
    <section className="ver2-hero relative isolate min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <Image
        src="/generated/optimized/hero-print-products.jpg"
        alt="Печатные вещи Наша печать"
        fill
        className="hero-depth -z-20 object-cover opacity-70"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/95 via-white/68 to-pinkSoft/76" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-milk to-transparent" />
      <CloudPlayground />
      <nav className="relative z-50 mx-auto flex max-w-7xl items-center justify-between rounded-full bg-white/82 px-5 py-4 shadow-paper backdrop-blur">
        <a href="/" className="relative h-14 w-64 overflow-hidden" aria-label="Наша печать">
          <Image src="/brand/logos/logo-wide-alt.svg" alt="Наша печать" fill className="object-contain object-left" priority />
        </a>
        <div className="hidden gap-6 text-sm font-black uppercase text-graphite/60 md:flex">
          <a href="#ver2-products">Что печатаем</a>
          <a href="#ver2-gallery">Работы</a>
          <a href="#ver2-builder">Собрать</a>
        </div>
      </nav>

      <div className="relative z-20 mx-auto flex min-h-[calc(100vh-7.5rem)] max-w-7xl items-center justify-center py-20 text-center">
        <div className="pointer-events-none select-none">
          <div className="space-y-2 overflow-hidden font-display text-[clamp(3rem,7.6vw,7.4rem)] font-black uppercase leading-[0.88] tracking-normal">
            {["Печатаем смело.", "Делаем красиво."].map((line, index) => (
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
            Раскраски по фото, стикеры, открытки, визитки и печатные подарки.
          </motion.p>
          <motion.div className="pointer-events-auto mt-9 flex flex-col justify-center gap-3 sm:flex-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
            <a href="#ver2-builder" className="magnetic rounded-full bg-pinkBrand px-7 py-4 text-center font-black uppercase text-white shadow-sticker">
              Собрать заказ
            </a>
            <a href="#ver2-gallery" className="magnetic rounded-full border-2 border-graphite bg-white px-7 py-4 text-center font-black uppercase text-graphite">
              Смотреть работы
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CloudPlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<CloudItem[]>([]);
  const [blobs, setBlobs] = useState<CloudItem[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let rafId = 0;

    const seed = () => {
      const rect = container.getBoundingClientRect();
      const anchors = [
        [0.06, 0.2],
        [0.72, 0.18],
        [0.15, 0.68],
        [0.78, 0.62],
        [0.42, 0.24],
        [0.52, 0.73]
      ];
      const next = cloudLabels.map((label, index) => {
        const w = index % 2 ? 196 : 220;
        const h = 92;
        const [ax, ay] = anchors[index] ?? [0.5, 0.5];
        return {
          id: index,
          label,
          x: Math.max(18, Math.min(rect.width - w - 18, ax * (rect.width - w))),
          y: Math.max(92, Math.min(rect.height - h - 28, ay * (rect.height - h))),
          vx: (index % 2 ? 0.9 : -0.82) + index * 0.035,
          vy: (index % 3 ? -0.62 : 0.7),
          w,
          h,
          dragging: false,
          hovered: false,
          lastX: 0,
          lastY: 0,
          phase: index * 1.7
        };
      });
      blobsRef.current = next;
      setBlobs(next);
    };

    const tick = () => {
      const rect = container.getBoundingClientRect();
      const items = blobsRef.current;
      const time = performance.now() / 1000;
      for (const item of items) {
        if (!item.dragging) {
          item.vx += Math.sin(time * 0.9 + item.phase) * 0.006;
          item.vy += Math.cos(time * 0.75 + item.phase) * 0.006;
          item.x += item.vx;
          item.y += item.vy;
          item.vx *= 0.999;
          item.vy *= 0.999;
          if (Math.abs(item.vx) < 0.42) item.vx += item.id % 2 ? 0.03 : -0.03;
          if (Math.abs(item.vy) < 0.34) item.vy += item.id % 3 ? -0.026 : 0.026;
          item.vx = Math.max(-1.55, Math.min(1.55, item.vx));
          item.vy = Math.max(-1.25, Math.min(1.25, item.vy));
        }

        if (item.x < 16 || item.x + item.w > rect.width - 16) {
          item.vx *= -0.96;
          item.x = Math.max(16, Math.min(rect.width - item.w - 16, item.x));
        }
        if (item.y < 84 || item.y + item.h > rect.height - 28) {
          item.vy *= -0.96;
          item.y = Math.max(84, Math.min(rect.height - item.h - 28, item.y));
        }
      }

      for (let i = 0; i < items.length; i += 1) {
        for (let j = i + 1; j < items.length; j += 1) {
          const a = items[i];
          const b = items[j];
          const dx = a.x + a.w / 2 - (b.x + b.w / 2);
          const dy = a.y + a.h / 2 - (b.y + b.h / 2);
          const distance = Math.max(1, Math.hypot(dx, dy));
          const minDistance = (a.w + b.w) * 0.36;
          if (distance < minDistance) {
            const push = (minDistance - distance) / minDistance;
            const nx = dx / distance;
            const ny = dy / distance;
            a.vx += nx * push * 0.34;
            a.vy += ny * push * 0.34;
            b.vx -= nx * push * 0.34;
            b.vy -= ny * push * 0.34;
          }
        }
      }

      setBlobs(items.map((item) => ({ ...item })));
      rafId = requestAnimationFrame(tick);
    };

    seed();
    rafId = requestAnimationFrame(tick);
    window.addEventListener("resize", seed);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", seed);
    };
  }, []);

  function updateBlob(id: number, patch: Partial<CloudItem>) {
    blobsRef.current = blobsRef.current.map((item) => (item.id === id ? { ...item, ...patch } : item));
    setBlobs(blobsRef.current.map((item) => ({ ...item })));
  }

  return (
    <div ref={containerRef} className="absolute inset-0 z-40 hidden overflow-hidden lg:block">
      {blobs.map((blob) => (
        <div
          key={blob.id}
          onPointerEnter={() => updateBlob(blob.id, { hovered: true })}
          onPointerLeave={() => updateBlob(blob.id, { hovered: false })}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            updateBlob(blob.id, { dragging: true, lastX: event.clientX, lastY: event.clientY, hovered: true });
          }}
          onPointerMove={(event) => {
            const current = blobsRef.current.find((item) => item.id === blob.id);
            if (!current?.dragging) return;
            const dx = event.clientX - current.lastX;
            const dy = event.clientY - current.lastY;
            updateBlob(blob.id, {
              x: current.x + dx,
              y: current.y + dy,
              vx: Math.max(-3, Math.min(3, dx * 0.24)),
              vy: Math.max(-3, Math.min(3, dy * 0.24)),
              lastX: event.clientX,
              lastY: event.clientY
            });
          }}
          onPointerUp={(event) => {
            event.currentTarget.releasePointerCapture(event.pointerId);
            const current = blobsRef.current.find((item) => item.id === blob.id) ?? blob;
            updateBlob(blob.id, {
              dragging: false,
              vx: Math.max(-1.8, Math.min(1.8, current.vx || (blob.id % 2 ? 0.9 : -0.9))),
              vy: Math.max(-1.4, Math.min(1.4, current.vy || (blob.id % 3 ? -0.7 : 0.7)))
            });
          }}
          className="cloud-blob absolute grid cursor-grab place-items-center px-8 text-center text-sm font-black uppercase text-graphite transition-transform active:cursor-grabbing"
          style={{
            width: blob.w,
            height: blob.h,
            transform: `translate3d(${blob.x}px, ${blob.y}px, 0) scale(${blob.hovered ? 1.08 : 1})`
          }}
        >
          <span className="relative z-10 pointer-events-none">{blob.label}</span>
        </div>
      ))}
    </div>
  );
}

function ProductChooser({
  active,
  chooseProduct
}: {
  active: keyof typeof serviceMap;
  chooseProduct: (product: keyof typeof serviceMap) => void;
}) {
  return (
    <section id="ver2-products" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-4xl font-black uppercase sm:text-6xl">Что печатаем?</h2>
        <p className="max-w-md text-lg font-black text-graphite/60">Выберите вещь. Остальное подскажем.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {products.map((item) => (
          <button
            key={item.short}
            type="button"
            onClick={() => chooseProduct(item.short as keyof typeof serviceMap)}
            className={`group peeled min-h-[300px] overflow-hidden rounded-[2rem] border bg-white p-4 text-left shadow-paper transition ${
              active === item.short ? "border-pinkBrand ring-4 ring-pinkSoft" : "border-graphite/10"
            }`}
          >
            <div className="relative h-40 overflow-hidden rounded-[1.5rem] bg-pinkSoft">
              <Image src={item.image} alt={item.short} fill className={`object-cover transition duration-500 ${item.move}`} />
            </div>
            <h3 className="mt-5 font-display text-3xl font-black uppercase">{item.short}</h3>
            <p className="mt-2 font-bold text-graphite/62">{item.line}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function ColoringSlider() {
  const [position, setPosition] = useState(58);
  const mode = position < 50 ? "До" : "После";

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
      <div className="self-center">
        <p className="font-black uppercase text-pinkBrand">Фото → раскраска</p>
        <h2 className="mt-3 font-display text-4xl font-black uppercase sm:text-6xl">Из фото — в личную раскраску</h2>
        <p className="mt-5 text-lg font-bold leading-relaxed text-graphite/65">Переключите до/после. Так фотография становится личной раскраской.</p>
        <a href="#ver2-order" className="magnetic mt-7 inline-flex rounded-full bg-pinkBrand px-7 py-4 font-black uppercase text-white shadow-sticker">
          Хочу такую раскраску
        </a>
      </div>
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-4 shadow-paper">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
          <Image src="/works/optimized/coloring-2.jpg" alt="Фото до превращения в раскраску" fill className="object-cover" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <Image src="/works/optimized/coloring-2.jpg" alt="Контурная версия раскраски" fill className="object-cover grayscale contrast-200 brightness-125" />
            <div className="absolute inset-0 bg-white/35 mix-blend-screen" />
          </div>
          <div
            className="pointer-events-none absolute inset-y-5 z-10 w-1 rounded-full bg-pinkBrand shadow-sticker"
            style={{ left: `${position}%` }}
          >
            <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-pinkBrand text-lg font-black text-white shadow-sticker">
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
          <div className="absolute left-1/2 top-5 z-30 flex -translate-x-1/2 rounded-full bg-white/88 p-1 shadow-paper backdrop-blur">
            {(["До", "После"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPosition(item === "До" ? 10 : 90)}
                className={`rounded-full px-5 py-3 text-xs font-black uppercase transition ${
                  mode === item ? "bg-pinkBrand text-white shadow-sticker" : "text-graphite/60"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
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
  const cards = [
    { ...works[0], size: "h-[470px] w-[420px]" },
    { ...works[1], size: "h-[520px] w-[330px]" },
    { ...works[2], size: "h-[390px] w-[560px]" },
    { ...works[3], size: "h-[360px] w-[320px]" },
    { ...works[4], size: "h-[470px] w-[380px]" },
    { ...works[5], size: "h-[410px] w-[520px]" }
  ];

  return (
    <section id="ver2-gallery" ref={galleryRef} className="relative min-h-screen overflow-hidden bg-graphite py-16 text-white">
      <div className="px-4 sm:px-6 lg:px-8">
        <p className="font-black uppercase text-pinkSoft">Витрина работ</p>
        <h2 className="mt-2 font-display text-4xl font-black uppercase sm:text-6xl">Едут по печатной ленте</h2>
      </div>
      <div ref={trackRef} className="mt-12 flex w-max max-w-none items-end gap-5 px-4 sm:px-6 lg:px-8">
        {cards.map((work, index) => (
          <article key={`${work.title}-${index}`} className={`${work.size} peeled group shrink-0 overflow-hidden rounded-[2rem] bg-white p-3 text-graphite shadow-sticker`}>
            <div className="relative h-full overflow-hidden rounded-[1.5rem]">
              <Image src={optimizedWorkImage(work.image)} alt={work.title} fill className="object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/90 p-4 backdrop-blur">
                <p className="text-xs font-black uppercase text-pinkBrand">{work.category}</p>
                <h3 className="mt-1 font-display text-2xl font-black uppercase">{work.title}</h3>
                <a href="#ver2-order" className="mt-3 inline-flex rounded-full bg-pinkBrand px-4 py-2 text-xs font-black uppercase text-white">
                  Хочу так же
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function OrderBuilder({
  builder,
  price,
  updateBuilder,
  chooseProduct,
  passToForm
}: {
  builder: BuilderState;
  price: number;
  updateBuilder: (next: Partial<BuilderState>) => void;
  chooseProduct: (product: keyof typeof serviceMap) => void;
  passToForm: () => void;
}) {
  return (
    <section id="ver2-builder" className="mx-auto grid max-w-7xl gap-7 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <div>
        <p className="font-black uppercase text-pinkBrand">Конструктор заказа</p>
        <h2 className="mt-2 font-display text-4xl font-black uppercase sm:text-6xl">Соберите заказ</h2>
        <BuilderGroup title="Что делаем?">
          {Object.keys(serviceMap).map((item) => (
            <Chip key={item} active={builder.product === item} onClick={() => chooseProduct(item as keyof typeof serviceMap)}>
              {item}
            </Chip>
          ))}
        </BuilderGroup>
        <BuilderGroup title="Формат">
          {formatOptions.map((item) => (
            <Chip key={item} active={builder.format === item} onClick={() => updateBuilder({ format: item })}>
              {item}
            </Chip>
          ))}
        </BuilderGroup>
        <div className="my-8 rounded-[2rem] bg-white p-5 shadow-paper">
          <p className="text-sm font-black uppercase text-graphite/55">Количество</p>
          <div className="mt-4 flex items-center gap-4">
            <button className="grid h-14 w-14 place-items-center rounded-full bg-graphite text-white" onClick={() => updateBuilder({ quantity: Math.max(1, builder.quantity - 1) })}>
              <Minus />
            </button>
            <motion.div key={builder.quantity} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="font-display text-6xl font-black text-pinkBrand">
              {builder.quantity}
            </motion.div>
            <button className="grid h-14 w-14 place-items-center rounded-full bg-pinkBrand text-white" onClick={() => updateBuilder({ quantity: builder.quantity + 1 })}>
              <Plus />
            </button>
          </div>
        </div>
        <div className="mt-8 rounded-[2rem] bg-white/72 p-5 font-black text-graphite/60 shadow-paper backdrop-blur">
          Бумагу, резку, ламинацию и упаковку подберем сами под результат. Вам нужно только выбрать, что хочется получить.
        </div>
      </div>

      <aside className="sticky top-6 h-fit overflow-hidden rounded-[2.5rem] bg-graphite p-6 text-white shadow-paper">
        <div className="relative h-64 overflow-hidden rounded-[2rem]">
          <Image src="/generated/optimized/order-stack.jpg" alt="Превью заказа" fill className="object-cover" />
        </div>
        <div className="mt-6 min-h-48 rounded-[2rem] bg-white p-5 text-graphite">
          <p className="font-black uppercase text-pinkBrand">Чек печатается</p>
          <p className="mt-3 font-display text-3xl font-black uppercase">{builder.product}</p>
          <p className="mt-2 font-bold text-graphite/60">{builder.format} / {builder.quantity} шт.</p>
          <p className="mt-4 rounded-full bg-pinkSoft px-4 py-3 text-xs font-black uppercase text-pinkBrand">
            Остальное подберем под вау-эффект
          </p>
          <motion.p key={price} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-6 font-display text-5xl font-black text-pinkBrand">
            {formatRub(price)}
          </motion.p>
        </div>
        <button onClick={passToForm} className="magnetic mt-5 w-full rounded-full bg-pinkBrand px-7 py-4 font-black uppercase text-white shadow-sticker">
          Передать в заявку
        </button>
      </aside>
    </section>
  );
}

function GiftMiniGame() {
  const [clicks, setClicks] = useState(0);
  const targetClicks = 18;
  const progress = Math.min(100, Math.round((clicks / targetClicks) * 100));
  const unlocked = progress >= 100;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="font-black uppercase text-pinkBrand">Мини-игра</p>
        <h2 className="mt-2 font-display text-4xl font-black uppercase sm:text-6xl">Нажмите на вау</h2>
        <p className="mt-5 text-lg font-bold text-graphite/62">
          Добейте шкалу радости до конца — внутри спрятан подарок для первого заказа.
        </p>
      </div>
      <div className="relative min-h-[540px] overflow-hidden rounded-[2.75rem] bg-pinkBrand p-5 shadow-sticker sm:p-8">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="7" fill="none" stroke="rgba(255,255,255,.34)" strokeWidth="1.8" />
          <motion.rect
            x="2"
            y="2"
            width="96"
            height="96"
            rx="7"
            fill="none"
            stroke="white"
            strokeWidth="1.8"
            pathLength="100"
            strokeDasharray="100"
            animate={{ strokeDashoffset: 100 - progress }}
            transition={{ duration: 0.22 }}
          />
        </svg>

        <div className="relative grid min-h-[480px] place-items-center overflow-hidden rounded-[2.1rem] bg-white">
          <motion.div
            initial={false}
            animate={unlocked ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0.22 }}
            className="relative z-10 grid place-items-center text-center"
          >
            <div className="relative grid h-48 w-52 place-items-center rounded-[2rem] bg-pinkBrand text-white shadow-sticker">
              <Gift size={82} />
              <div className="absolute left-1/2 top-0 h-full w-8 -translate-x-1/2 bg-white/25" />
              <div className="absolute left-0 top-1/2 h-8 w-full -translate-y-1/2 bg-white/25" />
            </div>
            <p className="mt-7 font-display text-4xl font-black uppercase text-graphite">Скидка 10%</p>
            <p className="mt-2 text-lg font-black text-graphite/62">на первый заказ</p>
            <p className="mt-5 rounded-full bg-pinkSoft px-6 py-3 font-display text-2xl font-black uppercase text-pinkBrand">
              Промокод: НАШИ10
            </p>
            <a href="#ver2-order" className="magnetic mt-6 rounded-full bg-graphite px-7 py-4 font-black uppercase text-white">
              Забрать подарок
            </a>
          </motion.div>

          <AnimatePresence>
            {!unlocked && (
              <>
                <motion.div
                  className="absolute inset-y-0 left-0 z-20 w-1/2 origin-left bg-pinkBrand"
                  exit={{ x: "-115%", rotate: -9, opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.div
                  className="absolute inset-y-0 right-0 z-20 w-1/2 origin-right bg-pinkBrand"
                  exit={{ x: "115%", rotate: 9, opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="absolute inset-0 z-30 grid place-items-center">
                  <div className="text-center">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.88, rotate: -2 }}
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                      onClick={() => setClicks((value) => Math.min(targetClicks, value + 1))}
                      className="rounded-full bg-white px-16 py-8 font-display text-5xl font-black uppercase text-pinkBrand shadow-paper"
                    >
                      Вау
                    </motion.button>
                    <p className="mt-7 font-display text-4xl font-black text-white">{progress}%</p>
                    <p className="mt-2 text-sm font-black uppercase tracking-normal text-white/78">
                      Нажмите еще {Math.max(0, targetClicks - clicks)} раз
                    </p>
                  </div>
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function EmotionReasons() {
  const items = [
    ["Сначала улыбка", "Человек видит себя, свою семью или свой бренд в настоящей вещи."],
    ["Потом вау", "Цвет, бумага, упаковка и детали собираются в аккуратный подарок."],
    ["И хочется сохранить", "Это не просто распечатка, а маленький момент, который остается."]
  ] as const;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[2.5rem] bg-graphite p-6 text-white shadow-paper sm:p-9">
        <p className="font-black uppercase text-pinkSoft">Не про печать. Про ощущение.</p>
        <h2 className="mt-2 max-w-4xl font-display text-4xl font-black uppercase sm:text-6xl">Почему это работает эмоционально</h2>
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
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="font-display text-4xl font-black uppercase sm:text-6xl">Коротко</h2>
      <div className="mt-8 space-y-3">
        {faqItems.map(([question, answer], index) => (
          <div key={question} className="rounded-[1.5rem] bg-white shadow-paper">
            <button onClick={() => setOpen(open === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-display text-xl font-black uppercase">
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
  const [fileName, setFileName] = useState("");
  const summary = useMemo(
    () => `${builder.product}, ${builder.format}, ${builder.quantity} шт., ${builder.extras.length ? builder.extras.join(", ") : "без доп. опций"}`,
    [builder]
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
      comment: [`Ver2: ${summary}`, String(form.get("comment") || ""), fileName ? `Файл: ${fileName}` : ""]
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
    <section id="ver2-order" className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <div className="rounded-[2.5rem] bg-graphite p-7 text-white shadow-paper">
        <p className="font-black uppercase text-pinkSoft">Форма заявки</p>
        <h2 className="mt-3 font-display text-5xl font-black uppercase">Что печатаем?</h2>
        <p className="mt-6 text-lg font-bold text-white/70">Не знаете формат и бумагу? Ничего страшного. Напишите идею — подскажем лучший вариант.</p>
        <motion.div animate={copiedToForm ? { scale: [1, 1.04, 1], rotate: [-1, 2, 0] } : {}} className="peeled mt-8 rounded-3xl bg-pinkBrand p-5 shadow-sticker">
          <p className="text-sm font-black uppercase">Из конструктора</p>
          <p className="mt-2 font-display text-2xl font-black uppercase">{summary}</p>
          <p className="mt-3 font-display text-4xl font-black">{formatRub(price)}</p>
        </motion.div>
      </div>
      <form onSubmit={submit} className="rounded-[2.5rem] bg-white p-5 shadow-paper sm:p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <input name="name" required minLength={2} className="field" placeholder="Имя" />
          <input name="contact" required minLength={6} className="field" placeholder="Телефон / Telegram / WhatsApp" />
        </div>
        <textarea name="idea" required minLength={8} className="field mt-4 min-h-32 resize-y" placeholder="Что хотите сделать?" />
        <label className="mt-4 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-pinkBrand/45 bg-pinkSoft/40 p-4 font-black text-pinkBrand">
          <span>{fileName || "Прикрепить файл / фото"}</span>
          <input type="file" className="hidden" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} />
          <FileImage />
        </label>
        <textarea name="comment" className="field mt-4 min-h-24 resize-y" placeholder="Комментарий, срок, пожелания" />
        <button className="magnetic mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-pinkBrand px-7 py-4 font-black uppercase text-white shadow-sticker md:w-auto">
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
    <div className="mt-8">
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
      className={`rounded-full border px-5 py-3 text-sm font-black uppercase transition ${
        active ? "border-pinkBrand bg-pinkBrand text-white shadow-sticker" : "border-graphite/10 bg-white text-graphite shadow-paper"
      }`}
    >
      {active && <Check className="mr-2 inline" size={16} />}
      {children}
    </motion.button>
  );
}
