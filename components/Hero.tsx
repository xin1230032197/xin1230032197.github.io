"use client";

import { motion } from "framer-motion";
import { siteContent } from "@/data/siteContent";

export function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-background" aria-hidden="true" />
      <div className="hero-shade" aria-hidden="true" />
      <motion.h1
        id="hero-title"
        initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {siteContent.hero.title}
      </motion.h1>
    </section>
  );
}
