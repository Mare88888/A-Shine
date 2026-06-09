"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SectionEntrance } from "@/components/MotionSection";
import { staggerContainer, staggerItem } from "@/lib/motion";

const WHY_KEYS = ["why1", "why2", "why3", "why4", "why5"] as const;
const COMMITMENT_KEYS = ["commitment1", "commitment2", "commitment3"] as const;

export default function About() {
  const t = useTranslations("about");

  return (
    <SectionEntrance
      id="about"
      className="section-padding bg-premium-black scroll-mt-20"
      aria-labelledby="about-heading"
    >
      <div className="container-narrow">
        <header className="text-center mb-12 sm:mb-16">
          <p className="text-premium-accent text-overline uppercase mb-2">
            {t("overline")}
          </p>
          <h2 id="about-heading" className="text-h2 text-text-primary">
            {t("heading")}
          </h2>
        </header>

        <motion.div
          className="space-y-10 sm:space-y-12"
          variants={staggerContainer}
          initial="visible"
          animate="visible"
        >
          <motion.div
            variants={staggerItem}
            className="overflow-hidden rounded-card border border-border-default"
          >
            <section className="grid lg:grid-cols-2 items-stretch">
              <div className="bg-premium-slate/80 px-6 py-10 text-center sm:px-10 sm:py-12 lg:px-12 text-body text-text-secondary flex flex-col justify-center">
                <div className="mx-auto max-w-2xl space-y-4">
                  <p>{t("intro1")}</p>
                  <p>{t("intro2")}</p>
                  <p className="text-text-primary font-medium">{t("belief")}</p>
                  <p>{t("offer")}</p>
                </div>
              </div>
              <div className="border-t lg:border-t-0 lg:border-l border-border-default flex items-center justify-center">
                <Image
                  src="/certificate.webp"
                  alt="A-Shine certificate"
                  width={0}
                  height={0}
                  sizes="(min-width: 1024px) 320px, 60vw"
                  className="w-full h-auto"
                />
              </div>
            </section>

            <div className="border-t border-border-default" />

            <section
              className="grid lg:grid-cols-2 items-stretch"
              aria-labelledby="about-why-heading"
            >
              <div className="order-last lg:order-first relative min-h-64 border-t lg:border-t-0 lg:border-r border-border-default">
                <Image
                  src="/certificate2.webp"
                  alt="A-Shine certificate"
                  width={0}
                  height={0}
                  className="w-full h-auto"
                  sizes="(min-width: 1024px) 320px, 60vw"
                />
              </div>
              <div className="order-first lg:order-last bg-premium-slate/80 px-6 py-10 text-center sm:px-10 sm:py-12 lg:px-12">
                <h3
                  id="about-why-heading"
                  className="text-h3 text-text-primary mb-6"
                >
                  {t("whyHeading")}
                </h3>
                <ul
                  className="mx-auto inline-block space-y-3 text-left"
                  role="list"
                >
                  {WHY_KEYS.map((key) => (
                    <li
                      key={key}
                      className="text-body text-text-secondary flex max-w-xl items-start gap-3"
                    >
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-premium-accent/20 text-premium-accent text-body-sm font-semibold"
                        aria-hidden
                      >
                        ✓
                      </span>
                      <span>{t(key)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 max-w-xl mx-auto text-body-sm text-premium-accent font-medium leading-relaxed">
                  {t("whyTagline")}
                </p>
              </div>
            </section>
          </motion.div>

          <motion.section
            variants={staggerItem}
            className="relative overflow-hidden rounded-card border border-border-default bg-premium-slate/80 px-6 py-6 sm:px-10 sm:py-7"
            aria-labelledby="about-commitment-heading"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-premium-accent to-transparent"
            />
            <div>
              <header className="text-center mb-5">
                <h3
                  id="about-commitment-heading"
                  className="text-h3 text-text-primary"
                >
                  {t("commitmentHeading")}
                </h3>
              </header>
              <ul className="space-y-3" role="list">
                {COMMITMENT_KEYS.map((key) => (
                  <li
                    key={key}
                    className="flex items-start gap-3.5 text-left"
                  >
                    <span
                      className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-premium-accent"
                      aria-hidden
                    />
                    <p className="text-body text-text-secondary leading-relaxed">
                      {t(key)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </SectionEntrance>
  );
}
