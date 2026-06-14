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
  Minus,
  PackageCheck,
  Play,
  Plus,
  Printer,
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
const extraOptions: ExtraOption[] = ["ламинация", "резка", "упаковка", "разработка макета", "срочность"];
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
  extras: ["резка"]
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
};

function optimizedWorkImage(path: string) {
  return path.replace("/works/", "/works/optimized/");
}

export default function Ver2Landing() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
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

      gsap.to(".process-tape", {
        width: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: processRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true
        }
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

  function toggleExtra(extra: ExtraOption) {
    setBuilder((current) => ({
      ...current,
      extras: current.extras.includes(extra)
        ? current.extras.filter((item) => item !== extra)
        : [...current.extras, extra]
    }));
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
      <motion.div
        className="cursor-glow pointer-events-none fixed left-0 top-0 z-[80] hidden h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl lg:block"
        animate={{ x: cursor.x, y: cursor.y }}
        transition={{ type: "spring", stiffness: 90, damping: 24, mass: 0.35 }}
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
        toggleExtra={toggleExtra}
        passToForm={passToForm}
      />
      <ProcessTape processRef={processRef} />
      <StickerBenefits />
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
          Вертикальные ролики без звука: печать, резка, сборка, упаковка.
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
        Ролики проигрываются без звука и показывают процесс создания заказа.
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
      <nav className="relative z-30 mx-auto flex max-w-7xl items-center justify-between rounded-full bg-white/82 px-4 py-3 shadow-paper backdrop-blur">
        <a href="/" className="relative h-10 w-44 overflow-hidden" aria-label="Наша печать">
          <Image src="/brand/logos/logo-main.png" alt="Наша печать" fill className="object-contain object-left" priority />
        </a>
        <div className="hidden gap-6 text-sm font-black uppercase text-graphite/60 md:flex">
          <a href="#ver2-products">Что печатаем</a>
          <a href="#ver2-gallery">Работы</a>
          <a href="#ver2-builder">Собрать</a>
        </div>
      </nav>

      <div className="relative z-20 mx-auto flex min-h-[calc(100vh-6.5rem)] max-w-7xl items-center justify-center py-20 text-center">
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
  const mouseRef = useRef({ x: -999, y: -999, active: false });
  const [blobs, setBlobs] = useState<CloudItem[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let rafId = 0;

    const seed = () => {
      const rect = container.getBoundingClientRect();
      const next = cloudLabels.map((label, index) => {
        const w = index % 2 ? 196 : 220;
        const h = 92;
        return {
          id: index,
          label,
          x: 40 + ((index * 181) % Math.max(240, rect.width - w - 80)),
          y: 130 + ((index * 113) % Math.max(220, rect.height - h - 190)),
          vx: (index % 2 ? 0.34 : -0.3) + index * 0.025,
          vy: (index % 3 ? -0.24 : 0.28),
          w,
          h,
          dragging: false
        };
      });
      blobsRef.current = next;
      setBlobs(next);
    };

    const tick = () => {
      const rect = container.getBoundingClientRect();
      const items = blobsRef.current;
      for (const item of items) {
        if (!item.dragging) {
          item.x += item.vx;
          item.y += item.vy;
          item.vx *= 0.997;
          item.vy *= 0.997;
          if (Math.abs(item.vx) < 0.12) item.vx += item.id % 2 ? 0.018 : -0.018;
          if (Math.abs(item.vy) < 0.1) item.vy += item.id % 3 ? -0.014 : 0.014;
        }

        if (item.x < 16 || item.x + item.w > rect.width - 16) {
          item.vx *= -0.92;
          item.x = Math.max(16, Math.min(rect.width - item.w - 16, item.x));
        }
        if (item.y < 84 || item.y + item.h > rect.height - 28) {
          item.vy *= -0.92;
          item.y = Math.max(84, Math.min(rect.height - item.h - 28, item.y));
        }

        if (mouseRef.current.active && !item.dragging) {
          const cx = item.x + item.w / 2;
          const cy = item.y + item.h / 2;
          const dx = cx - mouseRef.current.x;
          const dy = cy - mouseRef.current.y;
          const distance = Math.max(22, Math.hypot(dx, dy));
          if (distance < 190) {
            const force = (190 - distance) / 190;
            item.vx += (dx / distance) * force * 0.9;
            item.vy += (dy / distance) * force * 0.9;
          }
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
            a.vx += nx * push * 0.42;
            a.vy += ny * push * 0.42;
            b.vx -= nx * push * 0.42;
            b.vy -= ny * push * 0.42;
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
    <div
      ref={containerRef}
      className="absolute inset-0 z-10 hidden overflow-hidden lg:block"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true };
      }}
      onPointerLeave={() => {
        mouseRef.current.active = false;
      }}
    >
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          drag
          dragMomentum={false}
          whileHover={{ scale: 1.08 }}
          onDragStart={() => updateBlob(blob.id, { dragging: true })}
          onDrag={(_, info) => {
            const current = blobsRef.current.find((item) => item.id === blob.id) ?? blob;
            updateBlob(blob.id, {
              x: current.x + info.delta.x,
              y: current.y + info.delta.y,
              vx: info.delta.x * 0.35,
              vy: info.delta.y * 0.35
            });
          }}
          onDragEnd={(_, info) => {
            updateBlob(blob.id, {
              dragging: false,
              vx: Math.max(-5, Math.min(5, info.velocity.x * 0.008)),
              vy: Math.max(-5, Math.min(5, info.velocity.y * 0.008))
            });
          }}
          className="cloud-blob absolute grid cursor-grab place-items-center bg-white px-8 text-center text-sm font-black uppercase text-graphite transition-colors hover:bg-pinkSoft active:cursor-grabbing"
          style={{ x: blob.x, y: blob.y, width: blob.w, height: blob.h }}
        >
          <span className="relative z-10 pointer-events-none">{blob.label}</span>
        </motion.div>
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
  const [position, setPosition] = useState(54);

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
      <div className="self-center">
        <p className="font-black uppercase text-pinkBrand">Фото → раскраска</p>
        <h2 className="mt-3 font-display text-4xl font-black uppercase sm:text-6xl">Из фото — в личную раскраску</h2>
        <p className="mt-5 text-lg font-bold leading-relaxed text-graphite/65">Проведите ползунок. Идея становится подарком.</p>
        <a href="#ver2-order" className="magnetic mt-7 inline-flex rounded-full bg-pinkBrand px-7 py-4 font-black uppercase text-white shadow-sticker">
          Хочу такую раскраску
        </a>
      </div>
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-4 shadow-paper">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
          <Image src="/works/optimized/coloring-2.jpg" alt="Фото до превращения в раскраску" fill className="object-cover" />
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
            <Image src="/works/optimized/coloring-2.jpg" alt="Контурная версия раскраски" fill className="object-cover grayscale contrast-200 brightness-125" />
            <div className="absolute inset-0 bg-white/35 mix-blend-screen" />
          </div>
          <div className="absolute inset-y-0 w-1 bg-pinkBrand shadow-sticker" style={{ left: `${position}%` }} />
          <input
            aria-label="Сравнить фото и раскраску"
            type="range"
            min={12}
            max={88}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            className="absolute inset-x-6 bottom-6 accent-pinkBrand"
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
  toggleExtra,
  passToForm
}: {
  builder: BuilderState;
  price: number;
  updateBuilder: (next: Partial<BuilderState>) => void;
  chooseProduct: (product: keyof typeof serviceMap) => void;
  toggleExtra: (extra: ExtraOption) => void;
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
        <BuilderGroup title="Дополнительно">
          {extraOptions.map((item) => (
            <Chip key={item} active={builder.extras.includes(item)} onClick={() => toggleExtra(item)}>
              {item}
            </Chip>
          ))}
        </BuilderGroup>
      </div>

      <aside className="sticky top-6 h-fit overflow-hidden rounded-[2.5rem] bg-graphite p-6 text-white shadow-paper">
        <div className="relative h-64 overflow-hidden rounded-[2rem]">
          <Image src="/generated/optimized/order-stack.jpg" alt="Превью заказа" fill className="object-cover" />
        </div>
        <div className="mt-6 min-h-48 rounded-[2rem] bg-white p-5 text-graphite">
          <p className="font-black uppercase text-pinkBrand">Чек печатается</p>
          <p className="mt-3 font-display text-3xl font-black uppercase">{builder.product}</p>
          <p className="mt-2 font-bold text-graphite/60">{builder.format} / {builder.quantity} шт.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <AnimatePresence>
              {builder.extras.map((extra) => (
                <motion.span key={extra} initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: -3 }} exit={{ scale: 0 }} className="rounded-full bg-pinkSoft px-3 py-2 text-xs font-black uppercase text-pinkBrand">
                  {extra}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
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

function ProcessTape({ processRef }: { processRef: React.RefObject<HTMLDivElement | null> }) {
  const steps = [
    ["Вы пишете", Send],
    ["Мы уточняем", FileImage],
    ["Печатаем", Printer],
    ["Упаковываем", PackageCheck],
    ["Вы забираете", Sparkles]
  ] as const;

  return (
    <section ref={processRef} className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="max-w-3xl font-display text-4xl font-black uppercase sm:text-6xl">Как идея становится заказом</h2>
      <div className="relative mt-14">
        <div className="absolute left-0 top-10 h-3 w-full rounded-full bg-pinkSoft" />
        <div className="process-tape absolute left-0 top-10 h-3 w-0 rounded-full bg-pinkBrand" />
        <div className="grid gap-5 md:grid-cols-5">
          {steps.map(([title, Icon], index) => (
            <motion.div key={title} whileHover={{ y: -10, rotate: index % 2 ? 3 : -3 }} className="relative rounded-[1.5rem] bg-white p-5 shadow-paper">
              <div className="mb-12 grid h-16 w-16 place-items-center rounded-full bg-pinkBrand text-white">
                <Icon />
              </div>
              <h3 className="font-display text-xl font-black uppercase">{title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StickerBenefits() {
  const items = ["Смело", "Аккуратно", "С заботой", "Понятно"];
  return (
    <section className="paper-grid mx-auto max-w-7xl rounded-[2.5rem] bg-white px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="font-display text-4xl font-black uppercase sm:text-6xl">Почему с нами легко</h2>
      <div className="mt-10 grid gap-5 md:grid-cols-4">
        {items.map((item, index) => (
          <motion.div key={item} whileHover={{ rotate: index % 2 ? -6 : 6, y: -10 }} className="peeled min-h-48 rounded-[1.5rem] bg-pinkBrand p-6 text-white shadow-sticker">
            <p className="font-display text-3xl font-black uppercase">{item}</p>
            <p className="mt-5 font-bold text-white/78">{["Ярко выделяем", "Следим за деталями", "Делаем как для себя", "Объясняем просто"][index]}</p>
          </motion.div>
        ))}
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
