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
  Wrench
} from "lucide-react";
import {
  calculateOrderPrice,
  serviceFormatOptions,
  type ExtraOption,
  type PaperType,
  type PrintFormat,
  type ServiceType
} from "@/config/pricing.config";
import { formatRub } from "@/lib/utils";

const serviceMap: Record<string, ServiceType> = {
  Раскраска: "Раскраска по фото",
  Фото: "Фото на документы",
  Визитки: "Визитки",
  Открытки: "Открытки",
  Документы: "Документы"
};

const faqItems = [
  ["Можно одну штуку?", "Да. Печатаем маленькие заказы без неловкости."],
  ["Можно без макета?", "Да. Напишите идею, подскажем формат и подготовку."],
  ["Сколько стоит?", "Калькулятор даст ориентир. Точно скажем после проверки."],
  ["Как передать фото?", "Фото можно передать через Telegram, MAX, ВКонтакте или отправить на электронную почту. После заявки подскажем самый удобный способ и поможем с файлами."],
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
    title: "Фото на документы",
    caption: "Ровный размер и чистая печать",
    src: "/reels/optimized/process-3.mp4",
    poster: "/works/optimized/photo-1.jpg"
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
  quantity: 5,
  paper: "плотная матовая",
  extras: []
};

const cloudLabels = ["Раскраска", "Фото", "Визитки", "Открытки", "Документы", "Макеты"] as const;

const tapeCards = [
  {
    title: "Раскраска по фото",
    description: "Персональная раскраска по фотографиям ребёнка, семьи или любимого момента.",
    price: "от 1000 ₽",
    category: "Раскраски",
    image: "/images/tape/tape-coloring.jpeg"
  },
  {
    title: "Фото на документы",
    description: "Фото 3x4 и 3,5x4,5 для документов.",
    price: "от 300 ₽",
    category: "Фото",
    image: "/images/tape/tape-doc-photo.jpeg"
  },
  {
    title: "Визитки",
    description: "Аккуратные визитки для себя, мастера или малого бизнеса.",
    price: "от 500 ₽",
    category: "Визитки",
    image: "/images/tape/tape-business-cards.jpeg"
  },
  {
    title: "Открытки",
    description: "Открытки для подарков, праздников и тёплых слов.",
    price: "от 200 ₽",
    category: "Открытки",
    image: "/images/tape/tape-postcards.jpeg"
  },
  {
    title: "Документы",
    description: "Печать документов, анкет, файлов и учебных материалов.",
    price: "от 100 ₽",
    category: "Документы",
    image: "/images/tape/tape-documents.jpeg"
  }
] as const;

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
    setBuilder((current) => {
      const service = serviceMap[product];
      const availableFormats = serviceFormatOptions[service];
      return {
        ...current,
        product,
        service,
        format: availableFormats.includes(current.format) ? current.format : availableFormats[0],
        quantity: service === "Раскраска по фото" ? Math.max(5, current.quantity) : current.quantity
      };
    });
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
        className="cursor-glow pointer-events-none fixed left-0 top-0 z-[80] hidden h-72 w-72 rounded-full lg:block"
        style={{ transform: `translate3d(${cursor.x - 144}px, ${cursor.y - 144}px, 0)` }}
      />
      <HeroScene />
      <HorizontalGallery galleryRef={galleryRef} trackRef={galleryTrackRef} />
      <ColoringSlider />
      <ProcessReels />
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
          <p className="font-black uppercase text-pinkBrand">Процесс</p>
          <h2 className="font-display text-4xl font-black uppercase sm:text-6xl">
            Как это рождается
          </h2>
        </div>
        <p className="max-w-sm text-lg font-black text-graphite/60">
          Маленькая магия: из файла на экране рождается вещь, которую хочется держать в руках.
        </p>
      </div>
      <div className="mobile-snap flex gap-4 overflow-x-auto pb-5 sm:gap-5">
        {reelVideos.map((video, index) => (
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
              className="process-reel-video"
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
    <section className="ver2-hero relative isolate min-h-[92svh] overflow-hidden px-4 pb-20 pt-4 sm:px-6 lg:min-h-screen lg:px-8 lg:py-6">
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
      <div className="pointer-events-none absolute left-[7%] top-28 z-10 h-16 w-24 rotate-[-10deg] rounded-2xl bg-white shadow-paper md:hidden" />
      <div className="pointer-events-none absolute right-[-12px] top-48 z-10 h-24 w-20 rotate-[12deg] rounded-[1.5rem] bg-pinkSoft shadow-paper md:hidden" />
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

      <div className="relative z-20 mx-auto flex min-h-[calc(92svh-6rem)] max-w-7xl items-center justify-center py-[clamp(3.5rem,14vw,5rem)] text-center lg:min-h-[calc(100vh-7.5rem)] lg:py-20">
        <div className="select-none">
          <div className="space-y-2 overflow-hidden font-display text-[clamp(2.35rem,12.5vw,7.4rem)] font-black uppercase leading-[0.9] tracking-normal sm:text-[clamp(3rem,7.6vw,7.4rem)]">
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
            Раскраски по фото, фото на документы, визитки, открытки и печать документов.
          </motion.p>
          <motion.div className="pointer-events-auto mt-9 flex flex-col justify-center gap-3 sm:flex-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
            <a href="#ver2-builder" className="magnetic inline-flex min-h-12 items-center justify-center rounded-full bg-pinkBrand px-7 py-4 text-center font-black uppercase text-white shadow-sticker">
              Собрать заказ
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
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-40 hidden overflow-hidden lg:block">
      {blobs.map((blob) => (
        <div
          key={blob.id}
          onPointerEnter={() => updateBlob(blob.id, { hovered: true })}
          onPointerLeave={() => updateBlob(blob.id, { hovered: false })}
          onPointerDown={(event) => {
            event.preventDefault();
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
          onPointerCancel={() => {
            updateBlob(blob.id, {
              dragging: false,
              vx: blob.id % 2 ? 1 : -1,
              vy: blob.id % 3 ? -0.72 : 0.72
            });
          }}
          onLostPointerCapture={() => {
            const current = blobsRef.current.find((item) => item.id === blob.id) ?? blob;
            if (!current.dragging) return;
            updateBlob(blob.id, {
              dragging: false,
              vx: Math.abs(current.vx) < 0.35 ? (blob.id % 2 ? 1 : -1) : current.vx,
              vy: Math.abs(current.vy) < 0.28 ? (blob.id % 3 ? -0.72 : 0.72) : current.vy
            });
          }}
          className="cloud-blob pointer-events-auto absolute grid cursor-grab select-none place-items-center px-8 text-center text-sm font-black uppercase text-graphite transition-transform active:cursor-grabbing"
          style={{
            width: blob.w,
            height: blob.h,
            transform: `translate3d(${blob.x}px, ${blob.y}px, 0) scale(${blob.hovered ? 1.08 : 1})`,
            userSelect: "none",
            WebkitUserSelect: "none"
          }}
        >
          <span className="pointer-events-none relative z-10 select-none">{blob.label}</span>
        </div>
      ))}
    </div>
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
          <Image src="/works/optimized/coloring-2.jpg" alt="Фото до превращения в раскраску" fill className="object-cover" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <Image src="/works/optimized/coloring-2.jpg" alt="Контурная версия раскраски" fill className="object-cover grayscale contrast-200 brightness-125" />
            <div className="absolute inset-0 bg-white/35 mix-blend-screen" />
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
        <h2 className="mt-2 font-display text-4xl font-black uppercase sm:text-6xl">Едут по печатной ленте</h2>
        <p className="mt-4 max-w-xl text-lg font-black text-white/62">
          Листайте поток печатных вещей: видно, что заказать, как это выглядит и от какой цены стартует.
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
                <p className="text-[11px] font-black uppercase text-pinkBrand">{work.category}</p>
                <h3 className="mt-1 font-display text-2xl font-black uppercase leading-none">{work.title}</h3>
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
  const availableFormats = serviceFormatOptions[builder.service];
  const quantityLabel = builder.service === "Раскраска по фото" ? "Количество фото" : "Количество";
  const quantityUnit = builder.service === "Раскраска по фото" ? "фото" : "шт.";
  const helperText =
    builder.service === "Раскраска по фото"
      ? "В базу входят 5 фото. Сверх 5 фото добавляются к цене."
      : builder.service === "Фото на документы"
        ? "Для фото на документы доступны только 3x4 и 3,5x4,5."
        : "Бумагу, резку, ламинацию и упаковку подберем под результат.";

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
        <BuilderGroup title="Формат">
          {availableFormats.map((item) => (
            <Chip key={item} active={builder.format === item} onClick={() => updateBuilder({ format: item })}>
              {item}
            </Chip>
          ))}
        </BuilderGroup>
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
        </div>
        <div className="mt-5 rounded-[1.5rem] bg-white p-4 font-black text-graphite/60 shadow-paper sm:mt-8 sm:rounded-[2rem] sm:p-5">
          {helperText}
        </div>
      </div>

      <aside className="sticky top-4 h-fit overflow-hidden rounded-[1.8rem] bg-graphite p-4 text-white shadow-paper sm:p-6 lg:top-6 lg:rounded-[2.5rem]">
        <div className="relative h-36 overflow-hidden rounded-[1.35rem] sm:h-64 lg:rounded-[2rem]">
          <Image src="/generated/optimized/order-stack.jpg" alt="Превью заказа" fill className="object-cover" />
        </div>
        <div className="mt-4 rounded-[1.5rem] bg-white p-4 text-graphite sm:mt-6 sm:min-h-48 sm:rounded-[2rem] sm:p-5">
          <p className="font-black uppercase text-pinkBrand">Чек печатается</p>
          <p className="mt-3 font-display text-3xl font-black uppercase">{builder.product}</p>
          <p className="mt-2 font-bold text-graphite/60">{builder.format} / {builder.quantity} {quantityUnit}</p>
          <p className="mt-4 hidden rounded-full bg-pinkSoft px-4 py-3 text-xs font-black uppercase text-pinkBrand sm:block">
            Остальное подберем под вау-эффект
          </p>
          <motion.p key={price} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-4 font-display text-5xl font-black text-pinkBrand sm:mt-6">
            {formatRub(price)}
          </motion.p>
        </div>
        <button onClick={passToForm} className="magnetic mt-5 min-h-12 w-full rounded-full bg-pinkBrand px-7 py-4 font-black uppercase text-white shadow-sticker">
          Передать в заявку
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
        <h2 className="mt-2 font-display text-4xl font-black uppercase sm:text-6xl">Нажмите на вау</h2>
        <p className="mt-5 text-lg font-bold text-graphite/62">
          Добейте шкалу радости до конца — внутри спрятан подарок для первого заказа.
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
                    Вау
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
    ["Сначала улыбка", "Человек видит себя, свою семью или свой бренд в настоящей вещи."],
    ["Потом вау", "Цвет, бумага, упаковка и детали собираются в аккуратный подарок."],
    ["И хочется сохранить", "Это не просто распечатка, а маленький момент, который остается."]
  ] as const;

  return (
    <section className="mx-auto max-w-7xl px-4 py-[clamp(3.5rem,12vw,5rem)] sm:px-6 lg:px-8 lg:py-20">
      <div className="rounded-[1.8rem] bg-graphite p-5 text-white shadow-paper sm:p-9 lg:rounded-[2.5rem]">
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
      value: "vk.com/nasha_pechat",
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
      value: "korewkov.des@gmail.com",
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
                    <Icon size={20} />
                  </span>
                  <span className="mt-4 block text-xs font-black uppercase text-graphite/50">{item.label}</span>
                  <span className="mt-1 block break-words text-sm font-black text-graphite sm:text-base">{item.value}</span>
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
    () => `${builder.product}, ${builder.format}, ${builder.quantity} ${quantityUnit}, ${builder.extras.length ? builder.extras.join(", ") : "без доп. опций"}`,
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
