"use client";

import { useState } from "react";
import Benefits from "@/components/Benefits";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Hero from "@/components/Hero";
import OrderForm from "@/components/OrderForm";
import OrderSteps from "@/components/OrderSteps";
import PriceCalculator from "@/components/PriceCalculator";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";
import WorksGallery from "@/components/WorksGallery";
import type { ExtraOption, PaperType, PrintFormat, ServiceType } from "@/config/pricing.config";

export type CalculatorState = {
  service: ServiceType;
  format: PrintFormat;
  quantity: number;
  paper: PaperType;
  extras: ExtraOption[];
  total: number;
};

export default function LandingPage() {
  const [calculator, setCalculator] = useState<CalculatorState>({
    service: "Раскраска по фото",
    format: "A5",
    quantity: 5,
    paper: "плотная матовая",
    extras: ["резка"],
    total: 0
  });

  return (
    <main>
      <Hero />
      <Services />
      <WorksGallery />
      <PriceCalculator value={calculator} onChange={setCalculator} />
      <OrderSteps />
      <Benefits />
      <Reviews />
      <FAQ />
      <OrderForm calculator={calculator} />
      <FinalCTA />
    </main>
  );
}
