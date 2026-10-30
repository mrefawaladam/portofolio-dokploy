"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Braces, Boxes, Database, Github, Linkedin,
  Mail, Menu, Network, RadioTower, ServerCog, Workflow, X, Zap, Layers3,
  ExternalLink, GraduationCap, MapPin, Phone, Globe, Cpu, CheckCircle2,
  Newspaper, Calendar, Clock, Tag, Filter, Sparkles, FolderGit2,
  Download, FileText,
} from "lucide-react";
import { Project, Product, NewsArticle, PortfolioData } from "@/types/portfolio";
import { fallbackPortfolioData } from "@/data/fallback-data";
import { getPortfolioData } from "@/lib/portfolio";
import TypewriterRole from "@/components/TypewriterRole";

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
  ["Projects", "#projects"],
  ["Products", "#products"],
  ["News", "#news"],
  ["Toolkit", "#expertise"],
  ["Experience", "#experience"],
  ["Education", "#education"],
  ["About", "#about"],
  ["Contact", "#contact"],
];

const categories = ["All", "Backend", "Architecture", "Full Stack"];

const stacks = [
  {
    title: "Backend engineering",
    icon: ServerCog,
    note: "High-concurrency logic, robust business rules, and high-performance server-side services.",
    tags: ["Golang (Gin, Echo)", "PHP (Laravel, Symfony)", "Node.js", "Python", "REST & gRPC APIs"],
    span: "lg:col-span-3",
  },
  {
    title: "Frontend systems",
    icon: Braces,
    note: "Modern, reactive user interfaces that make complex enterprise products intuitive.",
    tags: ["Next.js", "React.js", "Vue.js", "Livewire", "Tailwind CSS"],
    span: "lg:col-span-3",
  },
  {
    title: "Architecture & systems",
    icon: Network,
    note: "Engineered for real-world load, domain clarity, and scalable multi-service workflows.",
    tags: ["Distributed Systems", "Microservices", "Event-Driven", "DDD", "Multitenant"],
    span: "lg:col-span-2",
  },
  {
    title: "Messaging & data",
    icon: Database,
    note: "Reliable async pipelines, caching strategies, and normalized data stores.",
    tags: ["RabbitMQ", "Redis", "PostgreSQL", "MySQL", "MongoDB"],
    span: "lg:col-span-2",
  },
  {
    title: "Cloud, DevOps & tools",
    icon: Workflow,
    note: "Containerized environments, automated pipelines, and operational developer tools.",
    tags: ["Docker", "FrankenPHP", "AWS (EC2, S3)", "CI/CD", "Git", "Jira", "n8n"],
    span: "lg:col-span-2",
  },
];

const impact = [
  {
    metric: "+70%",
    title: "System performance boost",
    detail: "Revamped monolithic legacy PHP into Domain-Driven Design (DDD), modern Next.js frontend, and Redis caching.",
  },
  {
    metric: "-35%",
    title: "Lower processing latency",
    detail: "Implemented RabbitMQ-powered event-driven data synchronization at rSchoolToday.",
  },
  {
    metric: "+40%",
    title: "Transaction throughput",
    detail: "Optimized backend queries and relational database tuning for e-commerce and digital wallet systems at PT IGRA.",
  },
  {
    metric: "+30%",
    title: "SME operational efficiency",
    detail: "Delivered enterprise SME management systems (e.g. Laundry Management) to streamline daily workflows.",
  },
];

const jobs = [
  {
    date: "MAR 2025 — APR 2026",
    company: "PT Ekosistem Kesehatan Indonesia",
    brand: "Nexmedis · Full-time",
    role: "Backend Developer",
    detail: "Developed backend services for AI-driven healthcare platforms using Golang and Node.js. Designed gRPC-based inter-service communication and RabbitMQ event-driven workflows. Optimized performance with Redis caching and CI/CD pipelines, directly contributing to a patient room transfer system.",
    tags: ["Golang", "Node.js", "gRPC", "RabbitMQ", "Redis", "Docker", "CI/CD", "Healthcare AI"],
    url: "https://nexmedis.com/",
  },
  {
    date: "JUN 2022 — JAN 2025",
    company: "PT Visi Multi Media Aditama",
    brand: "rSchoolToday · Remote, Contract",
    role: "Full Stack Engineer",
    detail: "Built and maintained end-to-end web applications using Symfony/Laravel and Next.js. Migrated legacy architectures to modern stacks, cutting latency by 35% through RabbitMQ event synchronization. Designed REST APIs and managed Docker and AWS (EC2, S3) deployments.",
    tags: ["Next.js", "Symfony", "Laravel", "RabbitMQ", "AWS (EC2, S3)", "Docker", "REST APIs"],
    url: "https://rschooltoday.com",
  },
  {
    date: "APR 2023 — AUG 2025",
    company: "PT NICE Media Technology",
    brand: "Product & Engineering · Remote, Full-time",
    role: "IT Product Manager",
    detail: "Managed full product lifecycles for education technology platforms. Collaborated closely with backend and frontend engineering teams to define system architecture, technical scope, and aligned product goals with high-availability scalability.",
    tags: ["Product Lifecycle", "Architecture Strategy", "EdTech", "Team Leadership"],
  },
  {
    date: "MAY 2021 — APR 2023",
    company: "PT NICE Media Technology",
    brand: "Engineering · Remote, Full-time",
    role: "Senior Full Stack Engineer",
    detail: "Led development of multiple production systems using Laravel, Livewire, Docker, and relational databases. Designed scalable backend structures, collaborated on frontend features, and mentored junior engineers with code reviews.",
    tags: ["Laravel", "Livewire", "Docker", "Relational Databases", "Mentoring"],
  },
  {
    date: "SEP 2019 — MAY 2021",
    company: "PT NICE Media Technology",
    brand: "Engineering · Remote, Full-time",
    role: "Full Stack Engineer",
    detail: "Developed a comprehensive school payment system using Laravel, handling high-volume billing and financial transaction flows while improving system maintainability through refactoring.",
    tags: ["Laravel", "School Payment", "Billing Pipelines", "Refactoring"],
  },
  {
    date: "OCT 2021 — APR 2022",
    company: "PT IGRA Solusi Kreatif",
    brand: "Fintech & E-Commerce · Contract",
    role: "Team Lead Backend Developer",
    detail: "Led backend engineering for e-commerce and digital wallet platforms. Improved transaction throughput by 40% through backend optimization and database tuning.",
    tags: ["Team Lead", "E-Commerce", "Digital Wallet", "+40% Throughput", "Database Tuning"],
  },
  {
    date: "DEC 2021 — APR 2023",
    company: "PT Atlas Global Teknologi",
    brand: "Enterprise Solutions · Part-time",
    role: "Part-Time Full Stack Developer",
    detail: "Developed SME enterprise applications including a laundry management system, improving operational efficiency and daily tracking by 30%.",
    tags: ["Full Stack", "SME Operations", "Operational Efficiency", "MySQL"],
  },
  {
    date: "JAN 2019 — DEC 2020",
    company: "PT. INOSOFT TRANS SISTEM",
    brand: "Surabaya · Internship",
    role: "Software Engineer Intern",
    detail: "Contributed to developing and maintaining client-facing web and desktop applications utilizing Laravel, CodeIgniter, and .NET.",
    tags: ["Laravel", "CodeIgniter", ".NET", "Desktop & Web Apps"],
  },
];

const educations = [
  {
    institution: "Politeknik Negeri Malang",
    degree: "Bachelor in Applied Informatics Engineering (D4 Teknik Informatika)",
    period: "January 2020 — December 2024",
    detail: "Specialized in software engineering, distributed application architecture, and database systems.",
  },
  {
    institution: "SMK PGRI 2 Ponorogo",
    degree: "High School in Software Engineering (Rekayasa Perangkat Lunak)",
    period: "January 2017 — December 2020",
    detail: "Foundation in algorithms, object-oriented programming, and web development fundamentals.",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(fallbackPortfolioData);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolioData().then((data) => {
      setPortfolioData(data);
      setLoading(false);
    });
  }, []);

  const projects = portfolioData.projects || [];
  const products = portfolioData.products || [];
  const news = portfolioData.news || [];

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter((p) => p.category === selectedCategory || p.tags?.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase())));

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
          <a href="#top" className="flex items-center gap-2 text-white">
            <span className="text-2xl font-black tracking-[-.12em]">↗</span>
            <span className="font-serif text-xl tracking-tight">Refamaan<span className="text-cyan-200">.</span></span>
          </a>
          <nav className="hidden items-center gap-5 rounded-full bg-white/90 px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-slate-800 shadow-sm md:flex">
            {navItems.map(([label, href]) => <a key={label} href={href} className="transition hover:text-blue-600">{label}</a>)}
          </nav>
          <button onClick={() => setMenuOpen(!menuOpen)} className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/90 text-slate-900 shadow-sm md:hidden" aria-label="Toggle navigation" aria-expanded={menuOpen}>
            {menuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </header>

        {menuOpen && (
          <nav className="absolute right-4 top-[66px] z-50 flex min-w-44 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-xl md:hidden">
            {navItems.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)} className="py-1">{label}</a>)}
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
            <div className="absolute right-5 top-7 z-30 flex flex-col items-end text-right sm:right-8 md:right-8 md:top-[16%] lg:right-10 lg:top-[18%]">
              <p className="eyebrow text-blue-700 font-semibold">Specialization <span className="text-cyan-500">●</span></p>
              <h2 className="mt-1.5 text-xl font-bold leading-tight tracking-[-.06em] sm:text-2xl text-slate-900">
                Backend &<br />Architecture
              </h2>

              {/* DOWNLOAD CV BUTTON */}
              <div className="mt-4 flex flex-col items-end gap-1.5">
                <a
                  href="/cv-refa.pdf"
                  download="CV_Muhammad_Refa_Walada_Mushtofa.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-blue-200/90 bg-white/95 px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-md"
                >
                  <Download size={14} className="text-blue-600 group-hover:text-white transition" />
                  <span>Download CV</span>
                </a>
                <span className="text-[9px] font-medium text-slate-400">PDF · Official Resume</span>
              </div>

              {/* QUICK HIGHLIGHT BADGE */}
              <div className="mt-3 hidden sm:flex flex-col items-end rounded-xl border border-blue-100 bg-white/85 p-2.5 shadow-xs backdrop-blur-xs max-w-[170px] text-right">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                  <FileText size={12} className="text-blue-600 shrink-0" />
                  <span>6+ Yrs Experience</span>
                </div>
                <p className="mt-0.5 text-[9px] leading-3.5 text-slate-500">
                  SIMRS, EdTech, Fintech &amp; ERP systems.
                </p>
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
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="eyebrow text-slate-400">Project 0{i + 1}</span>
                    {item.metrics && (
                      <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-800 border border-cyan-200/60">
                        {item.metrics}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition">
                    {item.title}
                  </h3>

                  {item.tagline && (
                    <p className="mt-1 text-xs font-medium text-blue-600">{item.tagline}</p>
                  )}

                  <p className="mt-3 text-xs leading-5 text-slate-600">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5 mb-5">
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

      {/* SECTION 03: NEWS & DEVLOG */}
      <section id="news" className="container-shell py-20 md:py-28 border-t border-slate-200">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-blue-700">03 / News & Devlog</p>
            <h2 className="section-title mt-4">Engineering<br /><span className="text-slate-400">Updates.</span></h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-600">
            Case studies, technical deep-dives, architectural postmortems, and latest milestones.
          </p>
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
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div>
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
                  {item.published_at}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 group-hover:translate-x-1 transition">
                  Read article <ArrowRight size={13} />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* SECTION 04: TOOLKIT */}
      <section id="expertise" className="container-shell py-20 md:py-28 border-t border-slate-200">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="eyebrow text-blue-700">04 / The toolkit</p><h2 className="section-title mt-4">Good tools.<br /><span className="text-slate-400">Better systems.</span></h2></div>
          <p className="max-w-sm text-sm leading-6 text-slate-600">Core technologies used to design resilient backend services, scalable data pipelines, and responsive web systems.</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {stacks.map((item, i) => {
            const Icon = item.icon;
            return <motion.article key={item.title} initial="hidden" whileInView="show" viewport={{ once: true, amount: .12 }} variants={reveal} transition={{ delay: i * .04 }} className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-300 ${item.span}`}>
              <div className="flex items-start justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon size={19} /></div><span className="eyebrow text-slate-400">0{i + 1}</span></div>
              <h3 className="mt-6 text-lg font-bold tracking-tight">{item.title}</h3><p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">{item.note}</p>
              <div className="mt-4 flex flex-wrap gap-2">{item.tags.map(tag => <span key={tag} className="rounded-full border border-slate-200 px-3 py-1.5 text-[10px] text-slate-600">{tag}</span>)}</div>
            </motion.article>;
          })}
        </div>
      </section>

      {/* SECTION 05: MEASURABLE OUTCOMES */}
      <section id="impact" className="bg-gradient-to-br from-[#0b1535] via-[#10245e] to-[#0e7490] py-20 text-white md:py-28">
        <div className="container-shell">
          <div className="mb-10"><p className="eyebrow text-cyan-200">05 / Measurable outcomes</p><h2 className="section-title mt-4">Build with intent.<br /><span className="text-white/45">Measure the difference.</span></h2></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {impact.map((item, i) => <motion.article key={item.title} initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} transition={{ delay: i * .05 }} className="rounded-2xl border border-white/15 bg-white/[.06] p-7 backdrop-blur-sm">
              <div className="flex justify-between"><span className="eyebrow text-white/45">Impact 0{i + 1}</span><ArrowUpRight size={16} className="text-cyan-300" /></div>
              <p className="mt-9 text-5xl font-black tracking-[-.08em] text-cyan-300">{item.metric}</p><h3 className="mt-4 text-base font-bold">{item.title}</h3><p className="mt-3 text-xs leading-6 text-white/55">{item.detail}</p>
            </motion.article>)}
          </div>
          <p className="mt-6 max-w-2xl text-[10px] leading-5 text-white/35">Metrics validated through production benchmarks across enterprise hospital AI, school management, and fintech applications.</p>
        </div>
      </section>

      {/* SECTION 06: EXPERIENCE (2-ROW HEADER & 2-COLUMN GRID) */}
      <section id="experience" className="container-shell py-20 md:py-28 border-t border-slate-200">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} className="mb-14">
          <div>
            <p className="eyebrow text-blue-700">06 / Experience</p>
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
              href="mailto:refa.main@gmail.com"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 transition shrink-0"
            >
              Discuss a project <ArrowRight size={15} />
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.map((job, i) => (
            <motion.article
              key={`${job.company}-${job.role}-${job.date}`}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={reveal}
              transition={{ delay: i * 0.04 }}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div>
                <p className="eyebrow text-blue-700 font-semibold">{job.date}</p>
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
                {job.tags.map((tag) => (
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

      {/* SECTION 07: EDUCATION */}
      <section id="education" className="container-shell py-20 md:py-28 border-t border-slate-200">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-blue-700">07 / Education</p>
            <h2 className="section-title mt-4">Academic<br /><span className="text-slate-400">Foundation.</span></h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-600">
            Formal education in Software Engineering and Informatics, building strong fundamentals in algorithms, architecture, and system engineering.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {educations.map((edu, i) => (
            <motion.div
              key={edu.institution}
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

      {/* SECTION 08: ABOUT & PHILOSOPHY */}
      <section id="about" className="container-shell pb-20 md:pb-28">
        <div className="grid gap-4 md:grid-cols-5">
          <article className="rounded-2xl bg-[#1d4ed8] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 p-7 text-white shadow-sm md:col-span-3 md:p-10">
            <p className="eyebrow text-cyan-100">08 / Engineering philosophy · Muhammad Refa Walada Mushtofa</p>
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

      {/* FOOTER & CONTACT */}
      <footer id="contact" className="bg-[#0b1020] text-white">
        <div className="container-shell grid gap-10 py-16 md:grid-cols-[1.2fr_.8fr] md:py-24">
          <div>
            <p className="eyebrow text-cyan-300">09 / Have a good problem?</p>
            <h2 className="mt-6 text-5xl font-black leading-[.9] tracking-[-.08em] md:text-7xl">
              Let&apos;s build<br />
              <span className="bg-gradient-to-r from-blue-300 via-sky-200 to-cyan-300 bg-clip-text text-transparent">
                something solid.
              </span>
            </h2>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="mailto:refa.main@gmail.com"
                className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3.5 text-xs font-bold text-slate-900 shadow-md transition hover:bg-cyan-100"
              >
                refa.main@gmail.com <ArrowUpRight size={15} />
              </a>
              <a
                href="https://wa.me/6283848988030"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3.5 text-xs font-bold text-white transition hover:border-cyan-300"
              >
                <Phone size={14} /> WhatsApp ↗
              </a>
            </div>
          </div>

          <div className="grid content-start gap-7 sm:grid-cols-2 md:grid-cols-1">
            <div>
              <p className="eyebrow mb-3 text-white/45">Direct Contact</p>
              <a className="block break-all text-sm text-white/80 hover:text-cyan-300 transition" href="mailto:refa.main@gmail.com">
                refa.main@gmail.com
              </a>
              <a className="mt-2 block text-sm text-white/80 hover:text-cyan-300 transition" href="tel:+6283848988030">
                +62 838-4898-8030
              </a>
              <p className="mt-2 text-sm text-white/45 flex items-center gap-1.5">
                <MapPin size={13} /> Ponorogo, Jawa Timur, ID
              </p>
            </div>

            <div>
              <p className="eyebrow mb-3 text-white/45">Find me online</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://github.com/mrefawaladam"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs text-white/80 hover:border-cyan-300 transition"
                >
                  <Github size={14} /> GitHub ↗
                </a>
                <a
                  href="https://www.linkedin.com/in/mrefawaladam"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs text-white/80 hover:border-cyan-300 transition"
                >
                  <Linkedin size={14} /> LinkedIn ↗
                </a>
                <a
                  href="https://mrefawm.my.id"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs text-white/80 hover:border-cyan-300 transition"
                >
                  <Globe size={14} /> mrefawm.my.id ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-shell flex flex-col justify-between gap-3 py-5 text-[9px] uppercase tracking-[.13em] text-white/35 sm:flex-row">
            <span>© {new Date().getFullYear()} Muhammad Refa Walada Mushtofa</span>
            <span>Full Stack Engineer · Backend & System Design</span>
            <a href="#top" className="hover:text-cyan-300 transition">Back to top ↑</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
