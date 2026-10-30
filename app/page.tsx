"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Braces, Boxes, Database, Github, Linkedin,
  Menu, Network, RadioTower, ServerCog, Workflow, X, Zap, Layers3,
  GraduationCap, MapPin, Phone, Globe, Cpu,
  Clock, Send, MessageSquare, Shield, Download,
} from "lucide-react";
import { PortfolioData, NewsArticle } from "@/types/portfolio";
import {
  fallbackPortfolioData,
  fallbackProjects,
  fallbackProducts,
  fallbackPrompts,
  fallbackNews,
  fallbackExperiences,
  fallbackEducations,
  fallbackStacks,
  fallbackImpact,
} from "@/data/fallback-data";
import { getPortfolioData } from "@/lib/portfolio";
import TypewriterRole from "@/components/TypewriterRole";
import MarkdownViewer from "@/components/MarkdownViewer";
import PromptShowcaseCarousel from "@/components/PromptShowcaseCarousel";

const heroRoles = [
  "Backend Programmer & Full Stack Engineer",
  "Distributed Systems & Microservices",
  "Event-Driven Architecture (RabbitMQ)",
  "Domain-Driven Design (DDD) Specialist",
  "Golang · PHP · Node.js · Next.js",
];

const reveal = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const navItems = [
  ["Projects", "/#projects"],
  ["Products", "/#products"],
  ["Prompts", "/prompts"],
  ["News", "/news"],
  ["Toolkit", "/#expertise"],
  ["Experience", "/#experience"],
  ["Education", "/#education"],
  ["About", "/#about"],
  ["Contact", "/#contact"],
];

const categories = ["All", "Backend", "Architecture", "Full Stack"];

const ICON_MAP: Record<string, any> = {
  ServerCog,
  Braces,
  Network,
  Database,
  Workflow,
  Cpu,
  Boxes,
  Layers3,
};

function formatDisplayDate(val: any): string {
  if (!val) return "OCT 2026";
  if (val instanceof Date) {
    return val.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();
  }
  const str = String(val);
  // If ISO date string like "2026-10-30T..."
  if (str.includes("-") && !isNaN(Date.parse(str))) {
    try {
      return new Date(str).toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();
    } catch {
      return str;
    }
  }
  return str;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(fallbackPortfolioData);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // WhatsApp Contact Form State
  const [clientName, setClientName] = useState("");
  const [projectService, setProjectService] = useState("Backend Engineering & Architecture");
  const [clientMessage, setClientMessage] = useState("");

  useEffect(() => {
    getPortfolioData().then((data) => {
      setPortfolioData(data);
      setLoading(false);
    });
  }, []);

  const projects = portfolioData.projects?.length ? portfolioData.projects : fallbackProjects;
  const products = portfolioData.products?.length ? portfolioData.products : fallbackProducts;
  const prompts = portfolioData.prompts?.length ? portfolioData.prompts : fallbackPrompts;
  const news = portfolioData.news?.length ? portfolioData.news : fallbackNews;
  const experiences = portfolioData.experiences?.length ? portfolioData.experiences : fallbackExperiences;
  const educations = portfolioData.educations?.length ? portfolioData.educations : fallbackEducations;
  const stacks = portfolioData.stacks?.length ? portfolioData.stacks : fallbackStacks;
  const impact = portfolioData.impact?.length ? portfolioData.impact : fallbackImpact;

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter((p) => p.category === selectedCategory || p.tags?.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase())));

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = "6283848988030";
    const sender = clientName.trim() || "Rekan Kolaborasi";
    const service = projectService;
    const notes = clientMessage.trim() || "Saya tertarik mendiskusikan peluang proyek / kolaborasi arsitektur.";

    const text = `Halo Refa,\n\nNama: ${sender}\nKebutuhan: ${service}\n\nPesan:\n${notes}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="overflow-hidden bg-[#f4f7fb] text-[#10172a]">
      {/* HERO SECTION */}
      <section id="top" className="relative isolate overflow-hidden bg-[#f4f7fb]">
        <div className="hero-blue-gradient absolute inset-y-0 left-0 w-full md:w-[56%]" />
        <div className="absolute inset-y-0 right-0 hidden w-[51%] rounded-l-[36px] bg-[#fbfdff] md:block" />
        <div className="pointer-events-none absolute left-[18%] top-[10%] hidden h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl md:block" />
        <div className="pointer-events-none absolute right-[3%] top-[19%] hidden h-[390px] w-[390px] rounded-full border border-blue-200/80 md:block" />
        <div className="pointer-events-none absolute right-[2%] top-[17%] hidden h-[410px] w-[410px] rounded-full bg-gradient-to-br from-blue-100 via-sky-100 to-cyan-50 md:block" />

        <header className="relative z-40 flex h-[76px] items-center justify-between px-5 md:px-10 lg:px-14">
          <a href="#top" className="flex items-center transition hover:opacity-90">
            <Image
              src="/logo-light.png"
              alt="Muhammad Refa Walada Mushtofa (mrefawm)"
              width={140}
              height={46}
              priority
              className="h-8 md:h-9 w-auto object-contain"
            />
          </a>
          <nav className="hidden items-center gap-5 rounded-full bg-white/90 px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-slate-800 shadow-sm md:flex">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href} className="transition hover:text-blue-600">
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur transition hover:bg-white/20"
            >
              <Shield size={12} /> Admin
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/90 text-slate-900 shadow-sm md:hidden" aria-label="Toggle navigation" aria-expanded={menuOpen}>
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </header>

        {menuOpen && (
          <nav className="absolute right-4 top-[66px] z-50 flex min-w-44 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-xl md:hidden">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setMenuOpen(false)} className="py-1">
                {label}
              </Link>
            ))}
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="py-1 text-blue-600 font-bold flex items-center gap-1 border-t border-slate-100 pt-2">
              <Shield size={14} /> Admin Portal
            </Link>
          </nav>
        )}

        <div className="relative z-10 mx-auto grid min-h-0 max-w-[1440px] grid-cols-1 md:min-h-[650px] md:grid-cols-[54%_46%]">
          <div className="relative z-20 flex flex-col items-start px-6 pb-12 pt-12 text-white sm:px-9 md:min-h-[650px] md:justify-center md:px-10 md:pb-16 md:pt-0 lg:px-16">
            <p className="eyebrow mb-3 text-cyan-100 font-semibold tracking-wider">
              Muhammad Refa Walada Mushtofa (M. Refa)
            </p>
            <h1 className="max-w-full text-[clamp(4.3rem,10.2vw,9.4rem)] font-black uppercase leading-[.79] tracking-[-.095em]">
              Refa<span className="text-cyan-200">.</span>
            </h1>
            <div className="mt-2 text-xs font-bold uppercase tracking-widest text-cyan-200 sm:text-sm min-h-[1.75rem] flex items-center">
              <TypewriterRole words={heroRoles} />
            </div>
            <p className="mt-6 max-w-[360px] text-sm leading-6 text-blue-50">
              Specializing in backend development, distributed systems, and event-driven architecture for complex enterprise applications.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="#projects" className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3.5 text-[10px] font-bold uppercase tracking-wide text-slate-900 shadow-lg shadow-blue-950/10 transition hover:-translate-y-0.5 hover:bg-cyan-100">
                View selected work <ArrowUpRight size={15} />
              </a>
              <a
                href="/cv-refa.pdf"
                download="CV_Muhammad_Refa_Walada_Mushtofa.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <Download size={13} /> Download CV
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm transition hover:bg-white/20">
                Contact Me
              </a>
            </div>
            <div className="mt-10 hidden items-center gap-3 text-[10px] text-blue-50 md:flex">
              <div className="flex -space-x-2">
                <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-blue-600 bg-white font-bold text-blue-900">R</span>
                <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-blue-600 bg-cyan-100 font-bold text-blue-900">6+</span>
                <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-blue-600 bg-sky-200 font-bold text-blue-900">↗</span>
              </div>
              <span>6+ years engineering enterprise solutions (SIMRS, School, E-Commerce, ERP)</span>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden bg-[#fbfdff] md:min-h-0 md:bg-transparent">
            <div className="absolute right-[-18%] top-[9%] h-[290px] w-[290px] rounded-full bg-gradient-to-br from-blue-100 via-sky-100 to-cyan-50 md:hidden" />
            <div className="absolute right-[-9%] top-[12%] h-[320px] w-[320px] rounded-full border border-blue-200 md:hidden" />
            <div className="absolute right-6 top-8 z-30 max-w-[210px] text-right sm:right-8 md:right-10 md:top-[18%] lg:right-12">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <span>Available for Hire</span>
              </div>
              <h2 className="mt-2.5 text-2xl font-bold leading-tight tracking-[-.06em] text-slate-900 sm:text-3xl">
                Backend &<br />Architecture
              </h2>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Distributed systems &amp; event-driven workflows.
              </p>
              <div className="mt-3.5 flex justify-end">
                <a
                  href="/cv-refa.pdf"
                  download="CV_Muhammad_Refa_Walada_Mushtofa.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-600 hover:text-blue-600 hover:shadow-md"
                >
                  <Download size={12} className="text-blue-600" />
                  <span>Download CV</span>
                </a>
              </div>
            </div>
            <div className="absolute bottom-0 left-[-2%] z-10 h-full w-[84%] sm:left-[4%] sm:w-[72%] md:hidden">
              <Image src="/refa-foto.png" alt="Muhammad Refa Walada Mushtofa" fill priority sizes="(max-width: 768px) 84vw, 0px" className="object-contain object-bottom" />
            </div>
            <div className="absolute bottom-4 right-4 z-30 max-w-[200px] rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-soft sm:bottom-5 sm:right-6 sm:max-w-[230px] md:bottom-7 md:right-8">
              <span className="text-2xl font-black leading-none text-blue-600">“</span>
              <p className="mt-1 text-[10px] leading-4 text-slate-600">Good engineering makes complex systems feel simple, reliable, and ready to grow.</p>
              <p className="mt-3 text-[8px] font-bold uppercase tracking-wider text-slate-400">Refa · Engineering philosophy</p>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-0 left-[28%] z-10 hidden h-[92%] w-[48%] md:block">
            <Image src="/refa-foto.png" alt="Muhammad Refa Walada Mushtofa" fill priority sizes="(min-width: 768px) 48vw, 0px" className="object-contain object-bottom drop-shadow-2xl" />
          </div>
        </div>

        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 bg-[#fbfdff] px-6 py-4 text-[9px] uppercase tracking-[.16em] text-slate-500 md:hidden">
          <span>Ponorogo, Jawa Timur, ID</span><span>Backend · Architecture · Product</span>
        </div>
      </section>

      <div className="container-shell flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 py-5 text-[9px] uppercase tracking-[.16em] text-slate-500">
        <span>Distributed systems</span><span>RabbitMQ & Redis</span><span>Golang & PHP</span><span>Next.js & React</span><span>Enterprise Cloud</span>
      </div>

      {/* SECTION 01: PROJECTS SHOWCASE */}
      <section id="projects" className="container-shell py-20 md:py-28">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-blue-700">01 / Selected Works</p>
            <h2 className="section-title mt-4">Featured<br /><span className="text-slate-400">Projects.</span></h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="max-w-md text-sm leading-6 text-slate-600">
              A showcase of production systems, asynchronous architectures, and full stack solutions.
            </p>
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 rounded-xl bg-slate-100 p-1.5 border border-slate-200/80">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl border border-slate-200 bg-white/60 p-6 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((item, i) => (
              <motion.article
                key={item.id || item.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                variants={reveal}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >
                <div>
                  {item.image_url && (
                    <div className="-mx-6 -mt-6 mb-4 h-44 overflow-hidden border-b border-slate-100 bg-slate-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                      {item.category || "Full Stack"}
                    </span>
                    {item.metrics && (
                      <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-700">
                        {item.metrics}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition">
                    {item.title}
                  </h3>
                  {item.tagline && (
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {item.tagline}
                    </p>
                  )}
                  <p className="mt-3 text-xs leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {item.tags?.map((tag) => (
                      <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold">
                    {item.demo_url && (
                      <a
                        href={item.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 transition"
                      >
                        Live Demo <ArrowUpRight size={14} />
                      </a>
                    )}
                    {item.github_url && (
                      <a
                        href={item.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition"
                      >
                        <Github size={14} /> Repository
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 02: PRODUCTS & SAAS TOOLS */}
      <section id="products" className="container-shell py-20 md:py-28 border-t border-slate-200">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-blue-700">02 / Products & Solutions</p>
            <h2 className="section-title mt-4">Built to solve<br /><span className="text-slate-400">real problems.</span></h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-600">
            Open-source developer kits, architectural starter scaffolds, and modular SaaS tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {products.map((prod, i) => (
            <motion.article
              key={prod.id || prod.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={reveal}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                    {prod.pricing_type}
                  </span>
                  {prod.badge && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                      {prod.badge}
                    </span>
                  )}
                </div>

                <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
                  {prod.name}
                </h3>
                <p className="mt-1 text-xs font-semibold text-blue-600">{prod.headline}</p>
                <p className="mt-3 text-xs leading-6 text-slate-600">{prod.description}</p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <span className="inline-flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Status: {prod.status}
                </span>
                {prod.github_url && (
                  <a
                    href={prod.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 transition"
                  >
                    <Github size={14} /> Open Source ↗
                  </a>
                )}
                {prod.product_url && (
                  <a
                    href={prod.product_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 transition"
                  >
                    Visit Product <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* SECTION 03: PROMPT SHOWCASE & AI WORKFLOWS */}
      <section id="prompts" className="container-shell py-20 md:py-28 border-t border-slate-200">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={reveal}
          className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"
        >
          <div>
            <p className="eyebrow text-blue-700">03 / Prompt Engineering</p>
            <h2 className="section-title mt-4">
              AI &amp; System<br />
              <span className="text-slate-400">Prompt Showcase.</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="max-w-md text-sm leading-6 text-slate-600 md:text-right">
              A curated collection of production system prompts, architecture generators, and autonomous agent instructions with interactive tags, types, and carousel navigation.
            </p>
            <Link
              href="/prompts"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200/80 px-3.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition"
            >
              Open Dedicated Prompts Page <ArrowRight size={13} />
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="h-80 rounded-3xl border border-slate-200 bg-white/60 p-8 animate-pulse flex items-center justify-center">
            <span className="text-xs text-slate-400 font-mono">Loading prompt showcase...</span>
          </div>
        ) : (
          <PromptShowcaseCarousel prompts={prompts} />
        )}
      </section>

      {/* SECTION 04: NEWS & DEVLOG */}
      <section id="news" className="container-shell py-20 md:py-28 border-t border-slate-200">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-blue-700">04 / News & Devlog</p>
            <h2 className="section-title mt-4">Engineering<br /><span className="text-slate-400">Updates.</span></h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="max-w-sm text-sm leading-6 text-slate-600 md:text-right">
              Case studies, technical deep-dives, architectural postmortems, and latest milestones.
            </p>
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200/80 px-3.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition"
            >
              Explore All News &amp; Articles <ArrowRight size={13} />
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {news.map((item, i) => (
            <motion.article
              key={item.id || item.slug}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={reveal}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedArticle(item)}
              className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div>
                {item.cover_image && (
                  <div className="-mx-6 -mt-6 mb-4 h-44 overflow-hidden border-b border-slate-100 bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-blue-700">{item.category}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {item.read_time}</span>
                </div>

                <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition">
                  {item.title}
                </h3>
                <p className="mt-3 text-xs leading-6 text-slate-600 line-clamp-3">
                  {item.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {formatDisplayDate(item.published_at)}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 group-hover:translate-x-1 transition">
                  Read article <ArrowRight size={13} />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* SECTION 05: TOOLKIT */}
      <section id="expertise" className="container-shell py-20 md:py-28 border-t border-slate-200">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="eyebrow text-blue-700">05 / The toolkit</p><h2 className="section-title mt-4">Good tools.<br /><span className="text-slate-400">Better systems.</span></h2></div>
          <p className="max-w-sm text-sm leading-6 text-slate-600">Core technologies used to design resilient backend services, scalable data pipelines, and responsive web systems.</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {stacks.map((item, i) => {
            const IconComponent = (item.icon_name && ICON_MAP[item.icon_name]) ? ICON_MAP[item.icon_name] : ServerCog;
            const spanClass = item.grid_span || "lg:col-span-2";
            return (
              <motion.article
                key={item.id || item.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.12 }}
                variants={reveal}
                transition={{ delay: i * 0.04 }}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-300 ${spanClass}`}
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                    <IconComponent size={19} />
                  </div>
                  <span className="eyebrow text-slate-400">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-bold tracking-tight">{item.title}</h3>
                <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">{item.note}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags?.map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-200 px-3 py-1.5 text-[10px] text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* SECTION 06: MEASURABLE OUTCOMES */}
      <section id="impact" className="bg-gradient-to-br from-[#0b1535] via-[#10245e] to-[#0e7490] py-20 text-white md:py-28">
        <div className="container-shell">
          <div className="mb-10"><p className="eyebrow text-cyan-200">06 / Measurable outcomes</p><h2 className="section-title mt-4">Build with intent.<br /><span className="text-white/45">Measure the difference.</span></h2></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {impact.map((item, i) => (
              <motion.article
                key={item.id || item.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={reveal}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-white/15 bg-white/[.06] p-7 backdrop-blur-sm"
              >
                <div className="flex justify-between"><span className="eyebrow text-white/45">Impact 0{i + 1}</span><ArrowUpRight size={16} className="text-cyan-300" /></div>
                <p className="mt-9 text-5xl font-black tracking-[-.08em] text-cyan-300">{item.metric}</p>
                <h3 className="mt-4 text-base font-bold">{item.title}</h3>
                <p className="mt-3 text-xs leading-6 text-white/55">{item.detail}</p>
              </motion.article>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-[10px] leading-5 text-white/35">Metrics validated through production benchmarks across enterprise hospital AI, school management, and fintech applications.</p>
        </div>
      </section>

      {/* SECTION 07: EXPERIENCE */}
      <section id="experience" className="container-shell py-20 md:py-28 border-t border-slate-200">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} className="mb-14">
          <div>
            <p className="eyebrow text-blue-700">07 / Experience</p>
            <h2 className="section-title mt-4">
              A track record <br />
              of <span className="text-slate-400">building.</span>
            </h2>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-5 border-t border-slate-200/80 pt-6 md:flex-row md:items-end">
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
              6+ years delivering backend architectures, distributed event pipelines, and robust product engineering across healthcare, education, fintech, and SME platforms.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 transition shrink-0"
            >
              Discuss a project <ArrowRight size={15} />
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {experiences.map((job, i) => (
            <motion.article
              key={job.id || `${job.company}-${job.role}-${job.period}`}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={reveal}
              transition={{ delay: i * 0.04 }}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div>
                <p className="eyebrow text-blue-700 font-semibold">{job.period}</p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                  {job.role}
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {job.company} · {job.brand}
                </p>
                <p className="mt-3.5 text-xs leading-6 text-slate-600">
                  {job.detail}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                {job.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* SECTION 08: EDUCATION */}
      <section id="education" className="container-shell py-20 md:py-28 border-t border-slate-200">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-blue-700">08 / Education</p>
            <h2 className="section-title mt-4">Academic<br /><span className="text-slate-400">Foundation.</span></h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-600">
            Formal education in Software Engineering and Informatics, building strong fundamentals in algorithms, architecture, and system engineering.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {educations.map((edu, i) => (
            <motion.div
              key={edu.id || edu.institution}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={reveal}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-blue-300"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <span className="eyebrow text-blue-700">{edu.period}</span>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900">{edu.institution}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-800">{edu.degree}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{edu.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 09: ABOUT & PHILOSOPHY */}
      <section id="about" className="container-shell pb-20 md:pb-28">
        <div className="grid gap-4 md:grid-cols-5">
          <article className="rounded-2xl bg-[#1d4ed8] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 p-7 text-white shadow-sm md:col-span-3 md:p-10">
            <p className="eyebrow text-cyan-100">09 / Engineering philosophy · Muhammad Refa Walada Mushtofa</p>
            <h2 className="mt-8 max-w-lg text-4xl font-black leading-[.98] tracking-[-.07em] md:text-5xl">
              Good engineering is invisible when it works.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-6 text-blue-50">
              Saya Muhammad Refa Walada Mushtofa (dikenal sebagai Refa / M. Refa), seorang Backend Programmer &amp; Full Stack Engineer. Berfokus pada perancangan logika server-side yang skalabel, distributed systems, event-driven messaging (RabbitMQ), serta API performa tinggi (Golang, Laravel, Symfony, Node.js, Next.js) untuk enterprise applications seperti SIMRS, sistem pembayaran sekolah, e-commerce, dan ERP.
            </p>
            <div className="mt-8 border-t border-white/25 pt-5 text-[10px] font-bold uppercase tracking-wider">
              Clarity · Reliability · Pragmatic Trade-offs · Long-term Maintainability
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-7 md:col-span-2 md:p-8 flex flex-col justify-between">
            <div>
              <p className="eyebrow text-slate-500">Currently focused on</p>
              <div className="mt-6 space-y-4">
                {[
                  { icon: Boxes, text: "Distributed Systems & Concurrency" },
                  { icon: RadioTower, text: "RabbitMQ Event-Driven Workflows" },
                  { icon: Layers3, text: "Domain-Driven Design (DDD)" },
                  { icon: Cpu, text: "AI-driven Backend Services & gRPC" },
                  { icon: Zap, text: "Performance Tuning & Redis Caching" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm font-medium text-slate-800">
                    <Icon size={17} className="text-blue-700 shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">
              <div className="flex items-center gap-2 text-slate-700 font-semibold mb-1">
                <MapPin size={14} className="text-blue-600" />
                <span>Ponorogo, Jawa Timur, Indonesia</span>
              </div>
              Working remotely and seamlessly across global and regional time zones.
            </div>
          </article>
        </div>
      </section>

      {/* SECTION 10: CONTACT FORM & FOOTER */}
      <footer id="contact" className="bg-[#0b1020] text-white">
        <div className="container-shell py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr]">
            {/* Left: Contact Header & WhatsApp Form */}
            <div>
              <p className="eyebrow text-cyan-300">10 / Have a project or inquiry?</p>
              <h2 className="mt-4 text-4xl font-black leading-[.95] tracking-[-.08em] sm:text-5xl md:text-6xl">
                Let&apos;s build<br />
                <span className="bg-gradient-to-r from-blue-300 via-sky-200 to-cyan-300 bg-clip-text text-transparent">
                  something solid.
                </span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/60">
                Hubungi langsung melalui formulir WhatsApp interaktif di bawah ini untuk mendiskusikan arsitektur sistem, backend engineering, atau kolaborasi proyek.
              </p>

              {/* INTERACTIVE WHATSAPP CONTACT FORM */}
              <form onSubmit={handleWhatsAppRedirect} className="mt-8 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                      Nama Anda / Organisasi
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                      Kebutuhan / Layanan
                    </label>
                    <select
                      value={projectService}
                      onChange={(e) => setProjectService(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#141b30] px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    >
                      <option value="Backend Engineering & Architecture">Backend Engineering & Architecture</option>
                      <option value="Distributed Systems & RabbitMQ">Distributed Systems & RabbitMQ</option>
                      <option value="Full Stack Web & Next.js">Full Stack Web & Next.js</option>
                      <option value="Database Tuning & Performance">Database Tuning & Performance</option>
                      <option value="General Consultation / Other">General Consultation / Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Pesan / Ringkasan Kebutuhan
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ceritakan gambaran singkat kebutuhan atau sistem yang ingin dibangun..."
                    value={clientMessage}
                    onChange={(e) => setClientMessage(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110 active:scale-[0.99]"
                >
                  <Phone size={15} /> Chat via WhatsApp Langsung ↗
                </button>
              </form>
            </div>

            {/* Right: Direct Contacts & Channels */}
            <div className="flex flex-col justify-between space-y-10 lg:pl-8">
              <div className="space-y-6">
                <div>
                  <p className="eyebrow mb-2 text-white/45">Direct Inquiries</p>
                  <a className="block text-base font-semibold text-white/90 hover:text-cyan-300 transition" href="mailto:refa.main@gmail.com">
                    refa.main@gmail.com
                  </a>
                  <a className="mt-1 block text-sm text-white/80 hover:text-cyan-300 transition" href="tel:+6283848988030">
                    +62 838-4898-8030
                  </a>
                  <p className="mt-2 text-xs text-white/45 flex items-center gap-1.5">
                    <MapPin size={13} /> Ponorogo, Jawa Timur, Indonesia
                  </p>
                </div>

                <div>
                  <p className="eyebrow mb-3 text-white/45">Find me online</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="https://github.com/mrefawaladam"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs text-white/80 hover:border-cyan-300 transition"
                    >
                      <Github size={14} /> GitHub ↗
                    </a>
                    <a
                      href="https://www.linkedin.com/in/mrefawaladam"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs text-white/80 hover:border-cyan-300 transition"
                    >
                      <Linkedin size={14} /> LinkedIn ↗
                    </a>
                    <a
                      href="https://mrefawm.my.id"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs text-white/80 hover:border-cyan-300 transition"
                    >
                      <Globe size={14} /> mrefawm.my.id ↗
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Database &amp; Content Management</p>
                    <p className="text-[11px] text-white/50 mt-0.5">Kelola konten portfolio secara dinamis di Dokploy PostgreSQL.</p>
                  </div>
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-500 transition shrink-0"
                  >
                    <Shield size={13} /> Admin Portal ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-shell flex flex-col items-center justify-between gap-4 py-6 text-[10px] uppercase tracking-[.13em] text-white/40 sm:flex-row">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-light.png"
                alt="mrefawm logo"
                width={100}
                height={33}
                className="h-6 w-auto opacity-80 hover:opacity-100 transition"
              />
              <span>© {new Date().getFullYear()} Muhammad Refa Walada Mushtofa</span>
            </div>
            <span>Full Stack Engineer · Backend &amp; System Design</span>
            <div className="flex items-center gap-4">
              <Link href="/admin" className="hover:text-cyan-300 transition">Admin Portal</Link>
              <a href="#top" className="hover:text-cyan-300 transition">Back to top ↑</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ARTICLE READER MODAL WITH MARKDOWN VIEWER */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {selectedArticle.category}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                  <Clock size={12} /> {selectedArticle.read_time}
                </span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs text-slate-400">{formatDisplayDate(selectedArticle.published_at)}</span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Cover Image */}
            {selectedArticle.cover_image && (
              <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedArticle.cover_image}
                  alt={selectedArticle.title}
                  className="max-h-80 w-full object-cover"
                />
              </div>
            )}

            {/* Title & Excerpt */}
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-3">
              {selectedArticle.title}
            </h1>
            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6 pb-6 border-b border-slate-100">
              {selectedArticle.excerpt}
            </p>

            {/* Full Markdown Content */}
            <div className="mb-8">
              <MarkdownViewer content={selectedArticle.content || selectedArticle.excerpt} />
            </div>

            {/* Tags & Footer Navigation */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-slate-100">
              <div className="flex flex-wrap gap-1.5">
                {selectedArticle.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/news/${selectedArticle.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Dedicated Page <ArrowUpRight size={13} />
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  Close Reader
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
