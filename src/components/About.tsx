"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SectionEntrance } from "@/components/MotionSection";
import { staggerContainer, staggerItem } from "@/lib/motion";

const WHY_KEYS = ["why1", "why2", "why3", "why4", "why5", "why6"] as const;
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
            className="grid grid-cols-1 overflow-hidden rounded-card border border-border-default lg:grid-cols-2"
          >
            <div className="order-2 flex h-full flex-col justify-center border-t border-border-default bg-premium-slate/80 px-6 py-10 text-center text-body text-text-secondary sm:px-10 sm:py-12 lg:order-none lg:border-t-0 lg:px-8 lg:py-6 lg:text-body-sm xl:text-body">
              <div className="mx-auto max-w-2xl space-y-4 lg:space-y-3 xl:space-y-4">
                <p>{t("intro1")}</p>
                <p>{t("intro2")}</p>
                <p className="font-medium text-text-primary">{t("belief")}</p>
                <p>{t("offer")}</p>
              </div>
            </div>

            <div className="relative order-1 bg-white lg:order-none lg:border-l lg:border-border-default">
              <div className="aspect-[24/17]" aria-hidden />
              <Image
                src="/certificate.webp"
                alt="Level 5 Certificate in Cleaning awarded to Alen Stermecki"
                fill
                className="object-cover object-center"
                sizes="(min-width: 1024px) 36rem, 100vw"
              />
            </div>

            <div className="relative order-3 border-t border-border-default bg-black lg:order-none">
              <div className="aspect-[24/17]" aria-hidden />
              <Image
                src="/certificate2.webp"
                alt="CarShine Factory detailing and polishing training completed by Alen Stermecki"
                fill
                className="object-cover object-center"
                sizes="(min-width: 1024px) 36rem, 100vw"
              />
            </div>

            <section
              className="order-4 flex h-full flex-col justify-center border-t border-border-default bg-premium-slate/80 px-6 py-10 text-center sm:px-10 sm:py-12 lg:order-none lg:border-l lg:px-8 lg:py-3"
              aria-labelledby="about-why-heading"
            >
              <h3
                id="about-why-heading"
                className="mb-6 text-h3 text-text-primary lg:mb-3 lg:text-h4 xl:text-h3"
              >
                {t("whyHeading")}
              </h3>
              <ul
                className="mx-auto inline-block space-y-3 text-left lg:space-y-2"
                role="list"
              >
                {WHY_KEYS.map((key) => (
                  <li
                    key={key}
                    className="flex max-w-xl items-start gap-3 text-body text-text-secondary lg:text-body-sm xl:text-body"
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-premium-accent/20 text-body-sm font-semibold text-premium-accent lg:h-5 lg:w-5 xl:h-6 xl:w-6"
                      aria-hidden
                    >
                      ✓
                    </span>
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
              <p className="mx-auto mt-6 max-w-xl text-body-sm font-medium leading-relaxed text-premium-accent lg:mt-3">
                {t("whyTagline")}
              </p>
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
