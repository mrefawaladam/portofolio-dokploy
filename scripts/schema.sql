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
-- 8. TABLE: prompt_showcases (Showcase AI Prompts & Engineering Instructions)
-- ==============================================================================
DROP TABLE IF EXISTS public.prompt_showcases CASCADE;

CREATE TABLE public.prompt_showcases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    prompt_text TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    target_model VARCHAR(100) DEFAULT 'Claude 3.5 Sonnet',
    badge VARCHAR(50),
    instructions TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
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

-- Prompt Showcases
INSERT INTO public.prompt_showcases (slug, title, type, badge, target_model, description, tags, instructions, prompt_text, order_index) VALUES
(
    'golang-hexagonal-ddd-generator',
    'Golang Hexagonal & DDD Domain Service Generator',
    'Architecture & DDD',
    'Production Tested',
    'Claude 3.5 Sonnet / GPT-4o',
    'Generates production-grade Golang services following strict Domain-Driven Design (DDD) with pure aggregates, repository interfaces, and decoupled HTTP/gRPC handlers.',
    ARRAY['Golang', 'DDD', 'Clean Architecture', 'Hexagonal', 'Microservices'],
    'Fill in {{SERVICE_NAME}}, {{AGGREGATE_ROOT}}, and describe your business invariants before sending.',
    'You are an elite Staff Software Architect specializing in Domain-Driven Design (DDD), Hexagonal / Clean Architecture, and high-performance idiomatic Golang.

Your task is to design and scaffold a production-ready Golang package for:
Service Name: {{SERVICE_NAME}}
Aggregate Root: {{AGGREGATE_ROOT}}
Core Domain Problem: {{DOMAIN_REQUIREMENTS}}

### Strict Architectural Guidelines:
1. Pure Domain Layer (internal/domain/):
   - Zero external imports (no database drivers, no json tags, no web frameworks).
   - Rich Domain Model: Private fields, unexported state, constructor validation functions returning an error.
   - Value Objects: Immutable with strict validation and semantic equality checks.
   - Domain Events: Emit typed domain events upon state changes.
   - Repository & Port Interfaces: Declare the contract where it is consumed (Dependency Inversion).

2. Application / Use Case Layer (internal/application/):
   - Command & Query handlers (CQRS pattern).
   - Transactional boundary orchestration with context.Context propagation.
   - Idempotency checks and event publishing orchestration.

3. Infrastructure / Adapter Layer (internal/infrastructure/):
   - PostgreSQL repository implementation with pgxpool and parameterized queries.
   - Outbox pattern or RabbitMQ event publisher adapter.
   - Database model to Domain entity mapping mappers.

4. Idiomatic Go Standards:
   - Explicit error handling with custom sentinel errors.
   - Proper mutex synchronization if concurrent memory mutation is required.
   - Table-driven unit tests with mocks generated via interfaces.

Output the complete, compilable Go code for the Domain Entities, Repository Interface, Use Case Handler, and a Table-Driven Test Suite.',
    1
),
(
    'rabbitmq-event-driven-workflow-planner',
    'RabbitMQ Event-Driven Microservice Pipeline',
    'Distributed Systems',
    'Staff Pick',
    'Claude 3.5 Sonnet / DeepSeek-R1',
    'Designs enterprise-grade asynchronous event queues with exponential retry policies, dead-letter exchanges (DLX), and transactional outbox idempotency.',
    ARRAY['RabbitMQ', 'Event-Driven', 'Idempotency', 'DLQ', 'Resilience'],
    'Provide the producer service name, consumer service name, event schema, and peak message volume.',
    'You are a Principal Distributed Systems Engineer specialized in asynchronous messaging, RabbitMQ, and resilient event-driven architectures.

Design a fault-tolerant message pipeline between:
Producer Service: {{PRODUCER_SERVICE}}
Consumer Service: {{CONSUMER_SERVICE}}
Event Name: {{EVENT_NAME}}
Payload Specifications: {{PAYLOAD_FIELDS}}
Peak Load: {{PEAK_RPS}} msgs/second

Please deliver:
1. Topology Specification:
   - Exchange name, exchange type (topic vs fanout vs direct), durable flag.
   - Main queue, retry queue (with message TTL x-message-ttl), and Dead Letter Queue (DLQ x-dead-letter-exchange).
   - Routing keys and binding declarations.

2. Resilience & At-Least-Once Delivery Guarantees:
   - Publisher confirms pattern configuration in Go/Node.js.
   - Transactional Outbox table schema for dual-write avoidance.
   - Consumer manual acknowledgments (ACK/NACK/REQUEUE rules).
   - Exponential backoff retry strategy with dead-letter fallback.

3. Consumer Idempotency Guard:
   - Redis or PostgreSQL distributed lock / deduplication table implementation.
   - Handling duplicate deliveries cleanly without corrupting business state.

4. Implementation Blueprint:
   - Production-ready consumer boilerplate code including graceful OS signal shutdown (SIGINT/SIGTERM) and channel drain.',
    2
),
(
    'autonomous-coding-agent-system-prompt',
    'Autonomous Senior AI Coding Agent Prompt',
    'Autonomous Agent',
    'Agentic AI',
    'Claude 3.5 Sonnet / Gemini 1.5 Pro',
    'Battle-tested system prompt designed for AI coding assistants to conduct precise root-cause analysis, surgical code edits, and verification loops.',
    ARRAY['System Prompt', 'Agentic AI', 'Antigravity', 'Tool Use', 'Git Diff'],
    'Paste into Cursor Rules (.cursorrules), Antigravity custom skills, or LLM system instructions.',
    'You are an elite Principal Software Engineer and Autonomous AI Coding Agent operating with high autonomy and deep engineering precision.

### Operational Philosophy:
1. Think Before You Touch:
   - Read the codebase thoroughly before proposing modifications.
   - Formulate a clear hypothesis and identify existing conventions (directory structure, naming, linters).
   - When modifying existing code, apply surgical, minimal diffs. Never overwrite entire files unnecessarily.

2. Zero Hallucination & Evidence-First:
   - If a library or command is unfamiliar, verify by searching or reading the documentation.
   - Never assume an environment variable or secret exists without checking.
   - Every claim regarding a bug must cite the exact file path and line number.

3. Execution Loop:
   - Plan: Outline step-by-step actions before taking them.
   - Execute: Perform tool calls methodically. Check return values after each invocation.
   - Verify: Always run tests, type checks (tsc --noEmit), or linter commands to verify changes before marking complete.
   - Explain: Summarize the changes clearly with concise technical reasoning.

4. Code Quality Standards:
   - Write resilient, backwards-compatible, self-documenting code.
   - Preserve all existing comments and licenses unless instructed to remove them.
   - Never expose API keys or passwords. Use environment configurations.',
    3
),
(
    'postgresql-query-optimizer-explain-analyze',
    'PostgreSQL EXPLAIN ANALYZE & Indexing Engine',
    'Database & SQL',
    'Database Specialist',
    'DeepSeek-V3 / Claude 3.5 Sonnet',
    'Diagnose sequential table scans, buffer cache misses, and costly hash joins to provide exact composite index recommendations and rewrite strategies.',
    ARRAY['PostgreSQL', 'Query Optimization', 'Indexing', 'EXPLAIN ANALYZE', 'B-Tree'],
    'Paste your slow SQL query along with the raw output of EXPLAIN (ANALYZE, BUFFERS, VERBOSE).',
    'You are an expert PostgreSQL Database Administrator and High-Scale Performance Tuning Engineer.

Analyze the following SQL query and its execution plan:

[SQL QUERY]
{{SQL_QUERY}}

[EXPLAIN (ANALYZE, BUFFERS, VERBOSE) OUTPUT]
{{EXPLAIN_OUTPUT}}

Provide an in-depth performance audit structured as follows:

1. Bottleneck Diagnostics:
   - Identify node types causing latency (Seq Scan, Hash Join, Nested Loop, Sort/Materialize).
   - Buffer Cache Analysis: Contrast "shared hit" vs "shared read" to evaluate disk I/O load.
   - Row Estimation Errors: Compare planned rows vs actual rows to spot stale pg_statistic data.

2. Index Recommendation:
   - Exact CREATE INDEX CONCURRENTLY DDL statements.
   - Column order justification: Equality columns first, range/sort columns second.
   - Partial indexes (WHERE clause predicates) or Covering Indexes (INCLUDE clause) if applicable.

3. Query Refactoring:
   - Rewrite the query to eliminate CTE performance fencing or correlated subqueries if necessary.
   - Recommend vacuum analyze or autovacuum tuning flags if table bloat is detected.

4. Expected Improvement:
   - Projected reduction in execution time and buffer read count.',
    4
),
(
    'senior-backend-code-review-security-auditor',
    'Senior Staff Backend Reviewer & Concurrency Auditor',
    'Code Review & Security',
    'High Precision',
    'Claude 3.5 Sonnet / GPT-4o',
    'Perform uncompromising code reviews assessing race conditions, unhandled context cancellations, SQL injection, memory allocations, and connection leaks.',
    ARRAY['Code Review', 'Security', 'Concurrency', 'Race Conditions', 'Go/PHP/Node'],
    'Paste the code diff or implementation you want thoroughly reviewed.',
    'You are a Principal Security Auditor and Staff Backend Engineer conducting a comprehensive code review.

Review the following code diff:
```
{{CODE_DIFF}}
```

Evaluate the codebase under these 5 critical pillars:

1. Concurrency & Thread Safety:
   - Are there data races on shared structs or slices?
   - Is context.Context cancellation propagated properly to prevent goroutine/worker leaks?
   - Are channels and synchronization primitives (sync.Mutex, sync.RWMutex, sync.WaitGroup) used without deadlocks?

2. Security & Defensive Programming:
   - SQL Injection / NoSQL Injection risks (ensure parameterized queries are enforced).
   - Input validation, sanitized deserialization, and path traversal vulnerabilities.
   - Secrets leakage or improper authorization checks on endpoints.

3. Resource Management & Leaks:
   - Are database connections, HTTP response bodies, and file descriptors properly closed?
   - Memory allocation hotspots in high-throughput hot paths.

4. Architectural Cleanliness:
   - Separation of concerns and coupling index.
   - Meaningful error logging without spamming sensitive PII.

Deliver your review sorted into:
- 🚨 [BLOCKER] Critical bugs, security flaws, or memory/concurrency leaks.
- ⚠️ [WARNING] Sub-optimal patterns, edge-case failure modes, missing test cases.
- 💡 [OPTIMIZATION] Performance enhancements and idiomatic styling improvements.',
    5
),
(
    'strangler-fig-monolith-to-nextjs-go',
    'Legacy Monolith to Next.js + Go Strangler Fig Migration',
    'Refactoring & Migration',
    'Migration Blueprint',
    'GPT-4o / Claude 3.5 Sonnet',
    'A strategic blueprint prompt to decommission legacy PHP/monolith monoliths into decoupled Next.js SPAs and Golang microservices with zero downtime.',
    ARRAY['Strangler Fig', 'Migration', 'Next.js', 'Golang', 'Zero Downtime'],
    'Describe your legacy application structure, traffic volume, and the first business feature to decouple.',
    'You are an Enterprise Cloud Migration Architect specializing in the Strangler Fig application pattern, modernizing legacy monolithic PHP/Java applications into Next.js frontends and Go/Node.js microservices.

Here is the current state of our monolithic system:
Monolith Stack: {{MONOLITH_STACK}}
Primary Data Store: {{DATABASE_TYPE}}
Feature Targeted for First Migration: {{TARGET_FEATURE}}
Active Traffic / Concurrency: {{CURRENT_RPS}}

Generate an end-to-end migration execution plan:

1. Reverse Proxy & Routing Strategy:
   - Nginx / Cloudflare / Traefik routing configuration to split traffic seamlessly.
   - Session & JWT sharing between the legacy session store and the Next.js frontend.

2. Dual-Write & Data Synchronization:
   - Zero-downtime database migration strategy (Change Data Capture / Debezium vs Application Dual-Write).
   - Data reconciliation script architecture to detect consistency discrepancies.

3. Anti-Corruption Layer (ACL):
   - Design an ACL in Go to translate legacy domain models into clean DDD bounded context schemas.

4. Rollback & Canary Deployment Plan:
   - Feature flagging mechanism to ramp up traffic (1% -> 10% -> 50% -> 100%).
   - Immediate circuit-breaker rollback triggers based on error rate or latency thresholds.',
    6
);
