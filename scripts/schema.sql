-- ==============================================================================
-- DATABASE SCHEMA: refa_portfolio
-- Native PostgreSQL Schema for Projects, Products, and News/Devlog
-- ==============================================================================

-- 1. Create database if running manually:
-- CREATE DATABASE refa_portfolio;
-- \c refa_portfolio;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLE: projects (Showcase Project & Arsitektur)
-- ==============================================================================
DROP TABLE IF EXISTS public.projects CASCADE;

CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
-- 3. TABLE: products (Katalog Produk Digital & SaaS)
-- ==============================================================================
DROP TABLE IF EXISTS public.products CASCADE;

CREATE TABLE public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
-- 4. TABLE: news_articles (Berita, Devlog, & Update Teknis)
-- ==============================================================================
DROP TABLE IF EXISTS public.news_articles CASCADE;

CREATE TABLE public.news_articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
-- 5. INITIAL SEEDS (Data Awal Sesuai CV & Profil)
-- ==============================================================================

-- SEED: Projects
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

-- SEED: Products
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

-- SEED: News Articles
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
