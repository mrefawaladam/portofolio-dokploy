-- ==============================================================================
-- DATABASE SCHEMA: refa_portfolio
-- Comprehensive Native PostgreSQL Schema for Portfolio & Dokploy Production
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. TABLE: projects (Showcase Project & Arsitektur)
-- ==============================================================================
DROP TABLE IF EXISTS public.projects CASCADE;

CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'Full Stack',
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    demo_url TEXT,
    github_url TEXT,
    metrics VARCHAR(100),
    featured BOOLEAN DEFAULT false,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ==============================================================================
-- 2. TABLE: products (Katalog Produk Digital & SaaS)
-- ==============================================================================
DROP TABLE IF EXISTS public.products CASCADE;

CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    headline VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Live', -- 'Live', 'Beta', 'In Development', 'Concept'
    pricing_type VARCHAR(50) DEFAULT 'Free', -- 'Free', 'Freemium', 'Open Source', 'Commercial'
    product_url TEXT,
    github_url TEXT,
    badge VARCHAR(50),
    icon_name VARCHAR(50) DEFAULT 'Boxes',
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ==============================================================================
-- 3. TABLE: news_articles (Berita, Devlog, & Update Teknis)
-- ==============================================================================
DROP TABLE IF EXISTS public.news_articles CASCADE;

CREATE TABLE public.news_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT,
    category VARCHAR(100) DEFAULT 'Engineering',
    cover_image TEXT,
    read_time VARCHAR(50) DEFAULT '3 min read',
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ==============================================================================
-- 4. TABLE: experiences (Riwayat Karir & Jabatan)
-- ==============================================================================
DROP TABLE IF EXISTS public.experiences CASCADE;

CREATE TABLE public.experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    period VARCHAR(100) NOT NULL,
    company VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    detail TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    url TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ==============================================================================
-- 5. TABLE: educations (Riwayat Pendidikan)
-- ==============================================================================
DROP TABLE IF EXISTS public.educations CASCADE;

CREATE TABLE public.educations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    period VARCHAR(100) NOT NULL,
    detail TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ==============================================================================
-- 6. TABLE: tech_stacks (Toolkit & Kategori Keahlian)
-- ==============================================================================
DROP TABLE IF EXISTS public.tech_stacks CASCADE;

CREATE TABLE public.tech_stacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    icon_name VARCHAR(50) DEFAULT 'ServerCog',
    note TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    grid_span VARCHAR(50) DEFAULT 'lg:col-span-3',
    order_index INT DEFAULT 0
);

-- ==============================================================================
-- 7. TABLE: impact_metrics (Highlight Metrik Pencapaian)
-- ==============================================================================
DROP TABLE IF EXISTS public.impact_metrics CASCADE;

CREATE TABLE public.impact_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    detail TEXT NOT NULL,
    order_index INT DEFAULT 0
);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Projects
INSERT INTO public.projects (slug, title, tagline, description, category, tags, demo_url, github_url, metrics, featured, order_index) VALUES
(
    'nexmedis-healthcare-ai',
    'Nexmedis Healthcare AI Platform',
    'AI-driven healthcare platform & patient room transfer workflow',
    'Developed backend services using Golang and Node.js, designed gRPC inter-service communication and RabbitMQ event-driven workflows, and optimized hospital operational efficiency with Redis caching and CI/CD pipelines.',
    'Backend',
    ARRAY['Golang', 'Node.js', 'gRPC', 'RabbitMQ', 'Redis', 'Docker', 'CI/CD'],
    'https://nexmedis.com/',
    NULL,
    'Room Transfer Flow',
    true,
    1
),
(
    'rschooltoday-enterprise',
    'rSchoolToday Enterprise Platform',
    'Activity & school management system migration',
    'Built and maintained end-to-end web applications with Symfony/Laravel backend and Next.js frontend. Implemented RabbitMQ event-driven synchronization reducing latency by 35%, deployed on AWS (EC2, S3) and Docker.',
    'Full Stack',
    ARRAY['Next.js', 'Symfony', 'Laravel', 'RabbitMQ', 'AWS', 'Docker'],
    'https://rschooltoday.com',
    NULL,
    '-35% Latency',
    true,
    2
),
(
    'monolith-revamp-ddd-nextjs',
    'Legacy Monolith Modernization to Next.js & DDD',
    'Monolith revamp to Domain-Driven Design architecture',
    'Revamped legacy PHP monolithic codebase into Domain-Driven Design (DDD), migrated Blade templates into a modern Next.js SPA consuming REST APIs, normalized databases, and integrated Redis caching — achieving up to 70% system performance improvement.',
    'Architecture',
    ARRAY['Next.js', 'PHP', 'DDD', 'Redis', 'Docker', 'FrankenPHP', 'CI/CD'],
    NULL,
    'https://github.com/mrefawaladam',
    '+70% Speed',
    true,
    3
),
(
    'ecommerce-digital-wallet-backend',
    'Digital Wallet & E-Commerce Core Backend',
    'High-throughput transaction processing & payment gateway',
    'Led backend development for e-commerce and digital wallet platforms. Improved transaction throughput by 40% through backend performance optimization and relational database tuning.',
    'Backend',
    ARRAY['Team Lead', 'E-Commerce', 'Digital Wallet', 'Database Tuning', 'REST APIs'],
    NULL,
    'https://github.com/mrefawaladam',
    '+40% Throughput',
    false,
    4
),
(
    'school-payment-billing-system',
    'School Payment & Billing System',
    'Full school payment automation & billing pipeline',
    'Engineered a comprehensive school payment system using Laravel, handling billing, transaction flows, and reconciliation with enhanced maintainability through clean architecture refactoring.',
    'Backend',
    ARRAY['Laravel', 'Livewire', 'MySQL', 'Docker', 'Billing Automation'],
    NULL,
    'https://github.com/mrefawaladam',
    'Auto Reconciliation',
    false,
    5
),
(
    'sme-laundry-management',
    'SME Laundry Management System',
    'Operations & POS management for SME businesses',
    'Developed enterprise applications for small and medium businesses including a laundry management system, improving daily operational efficiency by 30%.',
    'Full Stack',
    ARRAY['Full Stack', 'SME Operations', 'MySQL', 'Productivity'],
    NULL,
    'https://github.com/mrefawaladam',
    '+30% Efficiency',
    false,
    6
);

-- Products
INSERT INTO public.products (slug, name, headline, description, status, pricing_type, product_url, github_url, badge, icon_name, order_index) VALUES
(
    'event-flow-toolkit',
    'EventFlow Toolkit',
    'Lightweight RabbitMQ event-driven orchestrator',
    'A standardized boilerplate and event-bus orchestrator for microservices communication, retry policies, and dead-letter handling.',
    'Live',
    'Open Source',
    NULL,
    'https://github.com/mrefawaladam',
    'v1.2',
    'Network',
    1
),
(
    'simrs-bridge',
    'SIMRS Bridge API Gateway',
    'Healthcare interoperability integration service',
    'High-throughput bridge microservice connecting hospital clinical systems with external insurance and AI processing nodes.',
    'Beta',
    'Free',
    NULL,
    'https://github.com/mrefawaladam',
    'New',
    'Cpu',
    2
),
(
    'ddd-skeleton-kit',
    'Clean DDD Laravel-Go Scaffold',
    'Pragmatic Domain-Driven Design starter template',
    'Production-ready folder architecture and aggregate root templates designed for teams transitioning from MVC to modular services.',
    'Live',
    'Open Source',
    NULL,
    'https://github.com/mrefawaladam',
    'Popular',
    'Layers3',
    3
);

-- News Articles
INSERT INTO public.news_articles (slug, title, excerpt, content, category, read_time, tags, published) VALUES
(
    'modernizing-legacy-monolith-to-nextjs-and-ddd',
    'How We Reduced Latency by 35% with RabbitMQ & DDD',
    'A deep dive into migrating legacy monolithic services into event-driven architecture and Next.js frontend.',
    'Full article case study on refactoring domain boundaries and implementing asynchronous event processing...',
    'Architecture',
    '4 min read',
    ARRAY['Architecture', 'RabbitMQ', 'Next.js', 'DDD'],
    true
),
(
    'optimizing-database-throughput-40-percent',
    'Tuning Relational Databases for 40% Higher Transaction Throughput',
    'Practical lessons in database normalization, query profiling, and Redis caching under real-world traffic.',
    'Key strategies for identifying indexing bottlenecks and caching strategies that moved the needle...',
    'Engineering',
    '3 min read',
    ARRAY['PostgreSQL', 'Redis', 'Database Tuning', 'Performance'],
    true
),
(
    'building-dependable-backend-ai-healthcare',
    'Engineering AI-Driven Backend Workflows for Hospital Operations',
    'Insights into building reliable gRPC services and automated pipelines for clinical decision workflows.',
    'Architectural overview of handling patient room transfers and dependable AI inference pipelines...',
    'Milestone',
    '5 min read',
    ARRAY['Golang', 'gRPC', 'Healthcare AI', 'CI/CD'],
    true
);

-- Experiences
INSERT INTO public.experiences (period, company, brand, role, detail, tags, url, order_index) VALUES
(
    'MAR 2025 — APR 2026',
    'PT Ekosistem Kesehatan Indonesia',
    'Nexmedis · Full-time',
    'Backend Developer',
    'Developed backend services for AI-driven healthcare platforms using Golang and Node.js. Designed gRPC-based inter-service communication and RabbitMQ event-driven workflows. Optimized performance with Redis caching and CI/CD pipelines, directly contributing to a patient room transfer system.',
    ARRAY['Golang', 'Node.js', 'gRPC', 'RabbitMQ', 'Redis', 'Docker', 'CI/CD', 'Healthcare AI'],
    'https://nexmedis.com/',
    1
),
(
    'JUN 2022 — JAN 2025',
    'PT Visi Multi Media Aditama',
    'rSchoolToday · Remote, Contract',
    'Full Stack Engineer',
    'Built and maintained end-to-end web applications using Symfony/Laravel and Next.js. Migrated legacy architectures to modern stacks, cutting latency by 35% through RabbitMQ event synchronization. Designed REST APIs and managed Docker and AWS (EC2, S3) deployments.',
    ARRAY['Next.js', 'Symfony', 'Laravel', 'RabbitMQ', 'AWS (EC2, S3)', 'Docker', 'REST APIs'],
    'https://rschooltoday.com',
    2
),
(
    'APR 2023 — AUG 2025',
    'PT NICE Media Technology',
    'Product & Engineering · Remote, Full-time',
    'IT Product Manager',
    'Managed full product lifecycles for education technology platforms. Collaborated closely with backend and frontend engineering teams to define system architecture, technical scope, and aligned product goals with high-availability scalability.',
    ARRAY['Product Lifecycle', 'Architecture Strategy', 'EdTech', 'Team Leadership'],
    NULL,
    3
),
(
    'MAY 2021 — APR 2023',
    'PT NICE Media Technology',
    'Engineering · Remote, Full-time',
    'Senior Full Stack Engineer',
    'Led development of multiple production systems using Laravel, Livewire, Docker, and relational databases. Designed scalable backend structures, collaborated on frontend features, and mentored junior engineers with code reviews.',
    ARRAY['Laravel', 'Livewire', 'Docker', 'Relational Databases', 'Mentoring'],
    NULL,
    4
),
(
    'SEP 2019 — MAY 2021',
    'PT NICE Media Technology',
    'Engineering · Remote, Full-time',
    'Full Stack Engineer',
    'Developed a comprehensive school payment system using Laravel, handling high-volume billing and financial transaction flows while improving system maintainability through refactoring.',
    ARRAY['Laravel', 'School Payment', 'Billing Pipelines', 'Refactoring'],
    NULL,
    5
),
(
    'OCT 2021 — APR 2022',
    'PT IGRA Solusi Kreatif',
    'Fintech & E-Commerce · Contract',
    'Team Lead Backend Developer',
    'Led backend engineering for e-commerce and digital wallet platforms. Improved transaction throughput by 40% through backend optimization and database tuning.',
    ARRAY['Team Lead', 'E-Commerce', 'Digital Wallet', '+40% Throughput', 'Database Tuning'],
    NULL,
    6
),
(
    'DEC 2021 — APR 2023',
    'PT Atlas Global Teknologi',
    'Enterprise Solutions · Part-time',
    'Part-Time Full Stack Developer',
    'Developed SME enterprise applications including a laundry management system, improving operational efficiency and daily tracking by 30%.',
    ARRAY['Full Stack', 'SME Operations', 'Operational Efficiency', 'MySQL'],
    NULL,
    7
),
(
    'JAN 2019 — DEC 2020',
    'PT. INOSOFT TRANS SISTEM',
    'Surabaya · Internship',
    'Software Engineer Intern',
    'Contributed to developing and maintaining client-facing web and desktop applications utilizing Laravel, CodeIgniter, and .NET.',
    ARRAY['Laravel', 'CodeIgniter', '.NET', 'Desktop & Web Apps'],
    NULL,
    8
);

-- Educations
INSERT INTO public.educations (institution, degree, period, detail, order_index) VALUES
(
    'Politeknik Negeri Malang',
    'Bachelor in Applied Informatics Engineering (D4 Teknik Informatika)',
    'January 2020 — December 2024',
    'Specialized in software engineering, distributed application architecture, and database systems.',
    1
),
(
    'SMK PGRI 2 Ponorogo',
    'High School in Software Engineering (Rekayasa Perangkat Lunak)',
    'January 2017 — December 2020',
    'Foundation in algorithms, object-oriented programming, and web development fundamentals.',
    2
);

-- Tech Stacks
INSERT INTO public.tech_stacks (title, icon_name, note, tags, grid_span, order_index) VALUES
(
    'Backend engineering',
    'ServerCog',
    'High-concurrency logic, robust business rules, and high-performance server-side services.',
    ARRAY['Golang (Gin, Echo)', 'PHP (Laravel, Symfony)', 'Node.js', 'Python', 'REST & gRPC APIs'],
    'lg:col-span-3',
    1
),
(
    'Frontend systems',
    'Braces',
    'Modern, reactive user interfaces that make complex enterprise products intuitive.',
    ARRAY['Next.js', 'React.js', 'Vue.js', 'Livewire', 'Tailwind CSS'],
    'lg:col-span-3',
    2
),
(
    'Architecture & systems',
    'Network',
    'Engineered for real-world load, domain clarity, and scalable multi-service workflows.',
    ARRAY['Distributed Systems', 'Microservices', 'Event-Driven', 'DDD', 'Multitenant'],
    'lg:col-span-2',
    3
),
(
    'Messaging & data',
    'Database',
    'Reliable async pipelines, caching strategies, and normalized data stores.',
    ARRAY['RabbitMQ', 'Redis', 'PostgreSQL', 'MySQL', 'MongoDB'],
    'lg:col-span-2',
    4
),
(
    'Cloud, DevOps & tools',
    'Workflow',
    'Containerized environments, automated pipelines, and operational developer tools.',
    ARRAY['Docker', 'FrankenPHP', 'AWS (EC2, S3)', 'CI/CD', 'Git', 'Jira', 'n8n'],
    'lg:col-span-2',
    5
);

-- Impact Metrics
INSERT INTO public.impact_metrics (metric, title, detail, order_index) VALUES
(
    '+70%',
    'System performance boost',
    'Revamped monolithic legacy PHP into Domain-Driven Design (DDD), modern Next.js frontend, and Redis caching.',
    1
),
(
    '-35%',
    'Lower processing latency',
    'Implemented RabbitMQ-powered event-driven data synchronization at rSchoolToday.',
    2
),
(
    '+40%',
    'Transaction throughput',
    'Optimized backend queries and relational database tuning for e-commerce and digital wallet systems at PT IGRA.',
    3
),
(
    '+30%',
    'SME operational efficiency',
    'Delivered enterprise SME management systems (e.g. Laundry Management) to streamline daily workflows.',
    4
);
