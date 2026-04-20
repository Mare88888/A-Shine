"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslations, useMessages } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { SectionEntrance } from "@/components/MotionSection";
import { ease } from "@/lib/motion";
const EXTERIOR_KEYS = [
  "detailingExterior1",
  "detailingExterior2",
  "detailingExterior3",
  "detailingExterior4",
  "detailingExterior5",
  "detailingExterior6",
  "detailingExterior7",
  "detailingExterior8",
] as const;
const INTERIOR_KEYS = [
  "detailingInterior1",
  "detailingInterior2",
  "detailingInterior3",
  "detailingInterior4",
  "detailingInterior5",
  "detailingInterior6",
] as const;

type PricingPackagesMessages = Record<string, { features?: string[] }>;

export interface PricingPackage {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
}

export const carCleaningPackages: PricingPackage[] = [
  { id: "cleaning-basic", name: "", price: "", description: "", features: [] },
  { id: "cleaning-full", name: "", price: "", description: "", features: [] },
  {
    id: "cleaning-premium",
    name: "",
    price: "",
    description: "",
    features: [],
  },
];

export const carDetailingPackages: PricingPackage[] = [
  { id: "detail-standard", name: "", price: "", description: "", features: [] },
  {
    id: "detail-deepshine",
    name: "",
    price: "",
    description: "",
    features: [],
  },
  { id: "detail-showroom", name: "", price: "", description: "", features: [] },
];

const FEATURED_IDS = new Set(["detail-showroom", "cleaning-premium"]);

function useTranslatedPackages(
  packages: PricingPackage[],
  t: (key: string) => string,
  packagesMessages: PricingPackagesMessages,
): PricingPackage[] {
  return useMemo(
    () =>
      packages.map((pkg) => {
        const msg = packagesMessages[pkg.id];
        return {
          ...pkg,
          name: t(`packages.${pkg.id}.name`),
          price: t(`packages.${pkg.id}.price`),
          description: t(`packages.${pkg.id}.description`),
          features: Array.isArray(msg?.features) ? msg.features : [],
        };
      }),
    [packages, t, packagesMessages],
  );
}

function PackageCard({ pkg, index }: { pkg: PricingPackage; index: number }) {
  const isFeatured = FEATURED_IDS.has(pkg.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      transition={{ duration: 0.28, delay: index * 0.07, ease }}
      className={`relative flex flex-col overflow-hidden rounded-card border transition-shadow duration-300 ${isFeatured
        ? "border-premium-accent bg-premium-accent-muted shadow-[0_0_48px_-8px_rgba(0,184,219,0.3)]"
        : index === 1
          ? "border-premium-graphite bg-premium-charcoal/80 shadow-md shadow-black/60 hover:shadow-lg hover:shadow-black/70"
          : "border-border-default bg-premium-slate/80 hover:border-premium-graphite"
        }`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 ${isFeatured
          ? "h-[2px] bg-gradient-to-r from-transparent via-premium-accent to-transparent"
          : "h-px bg-border-default"
          }`}
      />

      <div className="p-5 sm:p-6 pb-0">
        <h3 className="text-h4 text-text-primary font-semibold leading-snug">
          {pkg.name}
        </h3>
      </div>

      <div
        className={`mx-5 sm:mx-6 mt-4 rounded-sharp px-4 py-3 ${isFeatured
          ? "bg-premium-accent/10 border border-premium-accent/25"
          : "bg-black/25 border border-border-default"
          }`}
      >
        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-premium-accent">
          {pkg.price}
        </p>
        <p className="mt-1 text-body-sm text-text-secondary leading-relaxed">
          {pkg.description}
        </p>
      </div>

      <ul className="p-5 sm:p-6 pt-4 mt-auto space-y-2.5" role="list">
        {pkg.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-body-sm text-text-secondary"
          >
            <span
              className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${isFeatured ? "bg-premium-accent" : "bg-premium-accent/50"}`}
              aria-hidden
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export default function Pricing() {
  const t = useTranslations("pricing");
  const messages = useMessages() as {
    pricing?: { packages?: PricingPackagesMessages };
  };
  const packagesMessages = messages?.pricing?.packages ?? {};

  const [activeTab, setActiveTab] = useState<"detailing" | "cleaning">(
    "detailing",
  );

  const translatedDetailing = useTranslatedPackages(
    carDetailingPackages,
    t,
    packagesMessages,
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const tab = (e as CustomEvent).detail;
      if (tab === "detailing" || tab === "cleaning") setActiveTab(tab);
    };
    window.addEventListener("pricing-tab", handler);
    return () => window.removeEventListener("pricing-tab", handler);
  }, []);

  const scrollToContact = useCallback(() => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const tabs = [
    { id: "detailing", label: t("detailingHeading") },
    { id: "cleaning", label: t("cleaningHeading") },
  ] as const;

  return (
    <SectionEntrance
      id="pricing"
      className="section-padding bg-premium-black scroll-mt-20"
      aria-labelledby="pricing-heading"
    >
      <div className="container-narrow">
        <header className="text-center mb-10">
          <p className="text-premium-accent text-overline uppercase mb-2">
            {t("overline")}
          </p>
          <h2 id="pricing-heading" className="text-h2 text-text-primary">
            {t("heading")}
          </h2>
          <p className="mt-3 text-body text-text-secondary max-w-xl mx-auto">
            {t("subheading")}
          </p>
        </header>

        <div
          className="flex justify-center mb-8"
          role="tablist"
          aria-label="Service type"
        >
          <div className="flex rounded-card border border-border-default overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 text-body-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-premium-accent focus-visible:ring-inset ${activeTab === tab.id
                  ? "bg-premium-accent text-premium-black"
                  : "bg-premium-slate/80 text-text-secondary hover:text-text-primary"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "detailing" ? (
            <motion.div
              key="detailing"
              id="panel-detailing"
              role="tabpanel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease }}
            >
              <div className="text-center mb-6">
                <p className="text-body-sm text-text-secondary mb-2.5">
                  {t("detailingIntro")}{" "}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {translatedDetailing.map((pkg, i) => (
                  <PackageCard key={pkg.id} pkg={pkg} index={i} />
                ))}
              </div>

              <div className="text-center mt-8">
                <motion.button
                  type="button"
                  onClick={scrollToContact}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary inline-flex items-center justify-center px-7 py-3.5"
                >
                  {t("detailingCta")}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="cleaning"
              id="panel-cleaning"
              role="tabpanel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease }}
            >
              <div className="text-center mb-6 space-y-2.5">
                <p className="text-body-sm text-text-secondary">
                  {t("cleaningIntroLine2")}
                </p>
              </div>

              <div className="rounded-card border border-border-default overflow-hidden mb-8 bg-premium-charcoal">
                <div className="border-b border-border-default/80 bg-gradient-to-r from-premium-black via-premium-charcoal to-premium-black px-4 py-2.5 text-center text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-text-secondary">
                  {t("detailingExteriorHeading")} &amp; {t("detailingInteriorHeading")}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-default">
                  <div className="p-4 sm:p-5">
                    <h4 className="text-[0.75rem] font-semibold text-text-primary mb-3 uppercase tracking-[0.18em]">
                      {t("detailingExteriorHeading")}
                    </h4>
                    <ul className="space-y-1.5 text-body-sm leading-relaxed text-text-secondary" role="list">
                      {EXTERIOR_KEYS.map((key) => {
                        const raw = t(key)
                        const [service, price] = raw.split("–").map((part) => part.trim())
                        return (
                          <li
                            key={key}
                            className="flex items-baseline justify-between gap-4 border-b border-border-default/40 py-1.5 last:border-0 last:pb-0"
                          >
                            <span className="text-text-secondary">{service}</span>
                            {price && (
                              <span className="text-body-sm font-medium text-premium-accent text-right shrink-0">
                                {price}
                              </span>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h4 className="text-[0.75rem] font-semibold text-text-primary mb-3 uppercase tracking-[0.18em]">
                      {t("detailingInteriorHeading")}
                    </h4>
                    <ul className="space-y-1.5 text-body-sm leading-relaxed text-text-secondary" role="list">
                      {INTERIOR_KEYS.map((key) => {
                        const raw = t(key)
                        const [service, price] = raw.split("–").map((part) => part.trim())
                        return (
                          <li
                            key={key}
                            className="flex items-baseline justify-between gap-4 border-b border-border-default/40 py-1.5 last:border-0 last:pb-0"
                          >
                            <span className="text-text-secondary">{service}</span>
                            {price && (
                              <span className="text-body-sm font-medium text-premium-accent text-right shrink-0">
                                {price}
                              </span>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <motion.button
                  type="button"
                  onClick={scrollToContact}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary inline-flex items-center justify-center px-7 py-3.5"
                >
                  {t("cleaningCta")}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionEntrance>
  );
}
