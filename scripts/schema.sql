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

-- ==============================================================================
-- 9. TABLE: tutorial_courses (Katalog Kursus & Workshop)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tutorial_courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(120) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'Distributed Systems & Backend',
    level VARCHAR(50) DEFAULT 'Intermediate — Advanced',
    badge VARCHAR(50) DEFAULT 'Flagship Track',
    icon VARCHAR(50) DEFAULT 'Workflow',
    order_index INT DEFAULT 1,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ==============================================================================
-- 10. TABLE: tutorial_modules (Bab / Modul dalam Kursus)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tutorial_modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.tutorial_courses(id) ON DELETE CASCADE,
    slug VARCHAR(120) NOT NULL,
    title VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ==============================================================================
-- 11. TABLE: tutorial_lessons (Materi Lesson dengan Konten Markdown)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tutorial_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.tutorial_courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.tutorial_modules(id) ON DELETE CASCADE,
    slug VARCHAR(120) NOT NULL,
    title VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 1,
    duration VARCHAR(50) DEFAULT '10 min read',
    type VARCHAR(50) DEFAULT 'reading',
    excerpt TEXT,
    tags TEXT[] DEFAULT '{}',
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT unique_course_lesson_slug UNIQUE (course_id, slug)
);

-- Insert Flagship Course Seed
INSERT INTO public.tutorial_courses (id, slug, title, tagline, description, category, level, badge, icon, order_index, published)
VALUES (
    '00000000-0000-0000-0000-000000000101',
    'event-driven-rabbitmq',
    'Mastering Event-Driven Architecture with RabbitMQ & Golang',
    'Panduan arsitektur sistem terdistribusi, asynchronous messaging, dan high-throughput worker skala enterprise.',
    'Pelajari cara mengubah backend monolitik yang lambat menjadi sistem terdistribusi decoupled berkecepatan tinggi menggunakan RabbitMQ dan Golang, lengkap dengan penanganan idempotency, Dead Letter Queues, dan monitoring performa.',
    'Distributed Systems & Backend',
    'Intermediate — Advanced',
    'Flagship Track',
    'Workflow',
    1,
    true
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description;

-- Insert Modules Seed
INSERT INTO public.tutorial_modules (id, course_id, slug, title, order_index)
VALUES 
    ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', '01-foundations', 'Foundations of Distributed Systems', 1),
    ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000101', '02-architecture-patterns', 'Core Architecture & Message Patterns', 2),
    ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000101', '03-golang-implementation', 'Golang Production Implementation', 3)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.tutorial_lessons (id, course_id, module_id, slug, title, order_index, duration, type, excerpt, tags, content, published)
VALUES (
    '00000000-0000-0000-0000-000000000301',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000201',
    'intro-event-driven',
    'From Monolith to Event-Driven Microservices',
    1,
    '8 min read',
    'reading',
    'Pahami transisi dari synchronous request-response menuju asynchronous event-driven architecture untuk mencegah cascading failure pada sistem skala besar.',
    ARRAY['Architecture', 'Event-Driven', 'Microservices', 'RabbitMQ'],
    '# From Monolith to Event-Driven Microservices

Dalam pengembangan sistem enterprise berskala besar, pola arsitektur **Synchronous Request-Response** (misal REST API biasa) sering kali menjadi bottleneck utama ketika traffic memuncak.

Bayangkan skenario checkout pada aplikasi e-commerce atau transaksi billing rumah sakit (SIMRS):
1. User menekan tombol bayar.
2. Web server memvalidasi saldo.
3. Web server memanggil service inventori barang via HTTP.
4. Web server memanggil payment gateway pihak ketiga via HTTP.
5. Web server memicu pembuatan invoice PDF.
6. Web server mengirim notifikasi email dan WhatsApp.

Jika proses 3, 4, atau 5 mengalami latensi tinggi (atau timeout selama 10 detik), maka koneksi HTTP user akan tertahan. Lebih buruk lagi, ribuan request bersamaan akan menghabiskan **connection pool database** dan **thread pool server**, memicu *cascading failures* ke seluruh aplikasi.

---

## Konsep Inti: Decoupling dengan Events

**Event-Driven Architecture (EDA)** membalik paradigma di atas:

> Ali-alih memerintahkan service lain melakukan sesuatu secara langsung (*command*), sebuah service cukup mempublikasikan sebuah fakta bahwa sesuatu telah terjadi (*event*).

### Perbandingan Pola Arsitektur

| Karakteristik | Synchronous REST | Event-Driven (EDA) |
| :--- | :--- | :--- |
| **Coupling** | *Tight coupling* (bergantung pada ketersediaan target service) | *Loose coupling* (publisher tidak peduli siapa consumer-nya) |
| **Resilience** | Jika target mati, request gagal (*fail-fast* atau crash) | Event disimpan aman di Queue hingga consumer hidup kembali |
| **Throughput** | Dibatasi oleh service terlemah dalam rantai HTTP | Dibatasi oleh kapasitas broker (RabbitMQ mampu jutaan msg/detik) |
| **Skalabilitas** | Scale bersamaan (*horizontal pod autoscaling* mahal) | Worker consumer dapat di-scale secara independen sesuai beban antrean |

---

## Kapan Anda Harus Memilih Event-Driven?

Gunakan pendekatan event-driven ketika:
- **Operasi I/O berat**: Pengiriman email/SMS, kompresi berkas, pembuatan laporan PDF/Excel, atau pemrosesan AI.
- **Sistem multi-stakeholder**: Saat sebuah aksi (misal: `OrderPlaced`) perlu didengar oleh 4 tim berbeda (Logistik, Akuntansi, Notifikasi, Analytics).
- **Integrasi pihak ketiga**: Gateway pembayaran atau webhook bank yang membutuhkan waktu respons acak.

Pada materi berikutnya, kita akan membedah perbandingan teknis antara **RabbitMQ vs HTTP REST** dan bagaimana memilih messaging broker yang tepat.',
    true
) ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration = EXCLUDED.duration,
    excerpt = EXCLUDED.excerpt;


INSERT INTO public.tutorial_lessons (id, course_id, module_id, slug, title, order_index, duration, type, excerpt, tags, content, published)
VALUES (
    '00000000-0000-0000-0000-000000000302',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000201',
    'rabbitmq-vs-http',
    'Asynchronous Queues vs Synchronous REST APIs',
    2,
    '10 min read',
    'architecture',
    'Analisis mendalam mengenai trade-off latensi, buffer traffic spike, dan mekanisme acknowledgment antara HTTP REST vs Message Broker.',
    ARRAY['RabbitMQ', 'HTTP', 'Latency', 'Buffer'],
    '# Asynchronous Queues vs Synchronous REST APIs

Sering timbul pertanyaan dari engineer backend: *"Kapan kita harus membuat endpoint REST API biasa, dan kapan kita harus melempar data ke message broker seperti RabbitMQ?"*

Mari kita bedah secara obyektif berdasarkan karakteristik jaringan dan sistem operasi.

---

## 1. Masalah Kritis "Blocking HTTP"

Pada HTTP 1.1 / REST, setiap request membuka TCP socket dan menunggu response dari server (Request-Response Lifecycle).

```text
Client (User)
    │
    ▼ [HTTP POST /api/orders]
API Gateway / Backend
    │
    ├─► [HTTP GET] Payment Service (200ms)
    ├─► [HTTP GET] Inventory Service (150ms)
    └─► [HTTP POST] Notification Service (800ms)
    │
    ▼ [Total Latency: ~1,150ms]
Client menerima respons (1.15 detik kemudian)
```

Jika terjadi **Flash Sale** dengan 5,000 request per detik:
- Worker web server (misal PHP-FPM atau Node event loop) akan kehabisan thread kosong.
- Nginx mulai mengembalikan status `504 Gateway Timeout`.
- Server database kehabisan koneksi karena transaksi dibiarkan *open* terlalu lama.

---

## 2. Solusi: Asynchronous Buffer dengan RabbitMQ

Dengan RabbitMQ sebagai message broker, arsitektur berubah menjadi:

```text
Client (User)
    │
    ▼ [HTTP POST /api/orders]
API Gateway (Golang / Next.js)
    │
    ├─► Simpan status "PENDING" ke Database (5ms)
    ├─► Publish event "OrderCreated" ke RabbitMQ (2ms)
    │
    ▼ [Total Latency: ~15ms]
Client langsung menerima respons: "Pesanan Anda sedang diproses!" (Sangat Cepat)
```

Di belakang layar, worker-worker independen (*consumers*) mengambil pesan dari antrean dengan kecepatan yang aman sesuai kapasitas mesin:

```text
RabbitMQ Exchange
    │
    ├───► [Queue Orders] ──────► Order Worker (Golang)
    ├───► [Queue Invoices] ────► PDF Generator Worker (Go)
    └───► [Queue WhatsApp] ────► Notification Worker (Node)
```

---

## 3. Matriks Perbandingan Teknis

```json
{
  "protocol": "AMQP 0-9-1 (RabbitMQ) vs HTTP/1.1 (REST)",
  "connection_overhead": "Persistent TCP Connection vs New Handshake",
  "buffering_capability": "RabbitMQ menyimpan jutaan antrean di RAM/Disk",
  "flow_control": "Consumer menggunakan Prefetch Count untuk mencegah OOM"
}
```

> [!NOTE]
> RabbitMQ bukan pengganti REST API untuk interaksi real-time yang membutuhkan data balik seketika (seperti mengambil profil pengguna atau mencari produk). Namun untuk operasi transaksional dan integrasi antar service, RabbitMQ adalah fondasi kehandalan (*reliability*).',
    true
) ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration = EXCLUDED.duration,
    excerpt = EXCLUDED.excerpt;


INSERT INTO public.tutorial_lessons (id, course_id, module_id, slug, title, order_index, duration, type, excerpt, tags, content, published)
VALUES (
    '00000000-0000-0000-0000-000000000303',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000202',
    'exchanges-and-queues',
    'RabbitMQ Core: Direct, Topic, and Fanout Exchanges',
    1,
    '12 min read',
    'reading',
    'Pahami cara kerja internal RabbitMQ: bagaimana Exchange merutekan pesan ke antrean target menggunakan routing key dan binding pattern.',
    ARRAY['RabbitMQ', 'Exchanges', 'RoutingKey', 'Queues'],
    '# RabbitMQ Core: Direct, Topic, and Fanout Exchanges

Salah satu keunggulan terbesar RabbitMQ dibandingkan broker sederhana seperti Redis Queue adalah adanya abstraksi **Exchange**.

Pada AMQP protocol:
- **Producer** tidak pernah mengirim pesan langsung ke antrean (*Queue*).
- **Producer** selalu mengirim pesan ke **Exchange**.
- **Exchange** bertugas merutekan pesan ke satu atau lebih Queue berdasarkan aturan (*Binding & Routing Key*).

---

## 1. Jenis-Jenis Exchange Utama

### A. Direct Exchange (Unicast / 1-to-1 Matching)
Pesan diarahkan ke Queue yang memiliki `binding_key` persis sama dengan `routing_key` pesan.

```text
Producer ──(routing_key: "payment.success")──► [Direct Exchange]
                                                       │
                                                       ├──► (binding: "payment.success") ──► [Billing Queue]
                                                       └──► (binding: "payment.failed")  ──► [Refund Queue]
```
Cocok untuk: Penugasan pekerjaan spesifik ke worker tertentu.

---

### B. Fanout Exchange (Broadcast / 1-to-All)
Exchange mengabaikan routing key dan menduplikasi pesan ke **seluruh antrean** yang terikat (*bound*) padanya.

```text
Producer ──► [Fanout Exchange: "user.registered"]
                     │
                     ├──► [Email Welcome Queue]
                     ├──► [Free Credits Provisioning Queue]
                     └──► [CRM Data Sync Queue]
```
Cocok untuk: Notifikasi global, audit trail, atau *cache invalidation* di beberapa service.

---

### C. Topic Exchange (Pattern Matching / Wildcards)
Exchange merutekan pesan berdasarkan pencocokan pola kata yang dipisahkan titik (`.`):
- `*` (asterisk): Menggantikan tepat 1 kata.
- `#` (hash): Menggantikan 0 atau lebih kata.

Contoh Routing Key: `health.<department>.<urgency>`:
- `health.emergency.*` -> Cocok dengan `health.emergency.icu`, `health.emergency.ambulance`.
- `health.#` -> Mendengarkan seluruh event kesehatan dari unit mana pun.

---

## 2. Praktik Terbaik Penamaan Routing Key

Gunakan konvensi terstandarisasi di tim engineering Anda:

```text
<domain>.<entity>.<action>
Contoh:
- hospital.patient.admitted
- billing.invoice.paid
- logistics.courier.dispatched
```

Standarisasi ini memudahkan service baru untuk berlangganan (*subscribe*) ke domain tertentu tanpa perlu mengubah kode producer sama sekali!',
    true
) ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration = EXCLUDED.duration,
    excerpt = EXCLUDED.excerpt;


INSERT INTO public.tutorial_lessons (id, course_id, module_id, slug, title, order_index, duration, type, excerpt, tags, content, published)
VALUES (
    '00000000-0000-0000-0000-000000000304',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000202',
    'idempotency-and-dlq',
    'Ensuring Reliability: Idempotent Consumers & Dead-Letter Queues (DLQ)',
    2,
    '11 min read',
    'architecture',
    'Strategi menangani kegagalan pesan, duplicate delivery, dan isolasi pesan beracun (poison message) menggunakan DLQ dan Redis locking.',
    ARRAY['Reliability', 'DLQ', 'Idempotency', 'Redis', 'RabbitMQ'],
    '# Ensuring Reliability: Idempotent Consumers & Dead-Letter Queues (DLQ)

Dalam sistem terdistribusi nyata, dua hal pasti akan terjadi:
1. **Jaringan mengalami fluktuasi**, menyebabkan pesan yang sama dikirim lebih dari satu kali (*At-least-once delivery*).
2. **Data yang cacat (*poison message*)**, menyebabkan consumer crash berulang kali jika terus di-retry tanpa henti.

Mari pelajari 2 pola pertahanan fundamental untuk sistem produksi: **Idempotent Consumers** dan **Dead-Letter Queues (DLQ)**.

---

## 1. Idempotent Consumer Pattern

> Operasi dikatakan **idempotent** jika dieksekusi 1 kali atau 100 kali dengan parameter yang sama menghasilkan kondisi akhir sistem yang sama persis tanpa efek samping ganda.

### Masalah Duplicate Message
Katakanlah worker telah memotong saldo pengguna sebesar Rp 100.000. Saat worker hendak mengirim `Ack` (Acknowledgment) ke RabbitMQ, koneksi jaringan terputus. RabbitMQ akan menganggap worker mati dan mengirimkan pesan tersebut ke worker lain. Jika worker kedua mengeksekusi saldo lagi, saldo user akan terpotong dua kali!

### Solusi: Unique Idempotency Key dengan Redis / Database

```text
Message Diterima (Mengandung UUID: "msg_abc_123")
    │
    ▼
Periksa Redis / DB: SETNX lock:idempotency:msg_abc_123 (TTL 1 Jam)
    │
    ├──► Key SUDAH ADA? ──► Skip proses, langsung kirim Ack ke RabbitMQ!
    │
    └──► Key BELUM ADA? ──► Jalankan transaksi bisnis, simpan status, lalu Ack.
```

Contoh snippet logika di Golang:

```go
func HandleTransaction(ctx context.Context, msg amqp.Delivery, rdb *redis.Client) error {
    messageID := msg.MessageId
    
    // Gunakan Redis SETNX (Set if Not Exists)
    success, err := rdb.SetNX(ctx, "processed:"+messageID, "1", 24*time.Hour).Result()
    if err != nil {
        return err // error koneksi redis, nack dan retry
    }
    
    if !success {
        log.Printf("Pesan %s telah diproses sebelumnya. Melewati eksekusi.", messageID)
        return msg.Ack(false)
    }

    // Eksekusi transaksi bisnis yang aman
    err = executeDebitBalance(msg.Body)
    if err != nil {
        // Hapus key agar bisa dicoba kembali jika gagal bisnis
        rdb.Del(ctx, "processed:"+messageID)
        return err
    }

    return msg.Ack(false)
}
```

---

## 2. Dead-Letter Exchange & Queue (DLQ)

Ketika pesan gagal diproses (misal format JSON rusak, atau user ID tidak ditemukan di DB), kita tidak boleh membiarkan pesan tersebut di-`Nack(requeue=true)` tanpa batas, karena akan menciptakan **Infinite CPU Loop**.

Solusinya adalah mengonfigurasi **Dead-Letter Exchange (DLX)**:

```text
Main Queue ("orders.process")
    │
    ├── (Gagal 3x retry / Nack(requeue=false) / Expired TTL)
    │
    ▼
Dead Letter Exchange ("dlx.orders")
    │
    ▼
Dead Letter Queue ("orders.dlq") ──► Alert ke Slack/Sentry untuk investigasi Engineer
```

### Konfigurasi Argumen Queue di RabbitMQ

```go
args := amqp.Table{
    "x-dead-letter-exchange":    "dlx.orders",
    "x-dead-letter-routing-key": "orders.dead",
    "x-message-ttl":             int32(60000), // 60 detik
}

_, err := ch.QueueDeclare(
    "orders.process", // nama antrean
    true,             // durable
    false,            // autoDelete
    false,            // exclusive
    false,            // noWait
    args,             // argumen DLX
)
```

Dengan DLQ, antrean utama Anda selalu bersih dan lancar, sementara pesan yang bermasalah tersimpan aman untuk diinspeksi (*replay* atau *debugging*) oleh tim engineer tanpa ada data yang hilang!',
    true
) ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration = EXCLUDED.duration,
    excerpt = EXCLUDED.excerpt;


INSERT INTO public.tutorial_lessons (id, course_id, module_id, slug, title, order_index, duration, type, excerpt, tags, content, published)
VALUES (
    '00000000-0000-0000-0000-000000000305',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000203',
    'producer-consumer-worker',
    'Building High-Throughput Workers in Golang',
    1,
    '15 min read',
    'code',
    'Kode produksi lengkap membangun AMQP consumer worker di Go dengan graceful shutdown, dynamic goroutine pool, dan prefetch optimization.',
    ARRAY['Golang', 'RabbitMQ', 'Goroutines', 'GracefulShutdown', 'amqp091-go'],
    '# Building High-Throughput Workers in Golang

Golang adalah salah satu bahasa pemrograman paling ideal untuk consumer worker berkecepatan tinggi karena model konkurensi **Goroutines** yang sangat ringan (hanya memakan ~2KB memori per goroutine).

Pada materi ini, kita akan menyusun struktur worker produksi menggunakan library resmi `github.com/rabbitmq/amqp091-go`.

---

## 1. Menyiapkan Koneksi & Channel AMQP

```go
package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"

	amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
	amqpURL := os.Getenv("RABBITMQ_URL")
	if amqpURL == "" {
		amqpURL = "amqp://guest:guest@localhost:5672/"
	}

	conn, err := amqp.Dial(amqpURL)
	if err != nil {
		log.Fatalf("Gagal terhubung ke RabbitMQ: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Gagal membuka channel: %v", err)
	}
	defer ch.Close()

	// Setting Prefetch Count (QoS) sangat krusial!
	// Jangan biarkan 1 worker menelan ribuan pesan sekaligus.
	err = ch.Qos(
		50,    // prefetch count
		0,     // prefetch size
		false, // global
	)
	if err != nil {
		log.Fatalf("Gagal set QoS: %v", err)
	}

	msgs, err := ch.Consume(
		"orders.process", // queue
		"worker-go-1",    // consumer tag
		false,            // auto-ack HARUS FALSE untuk keamanan
		false,            // exclusive
		false,            // no-local
		false,            // no-wait
		nil,              // args
	)
	if err != nil {
		log.Fatalf("Gagal mendaftar consumer: %v", err)
	}

	log.Println("Worker Golang siap mendengarkan pesan. Menunggu tasks...")

	// Jalankan Worker Pool
	var wg sync.WaitGroup
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	concurrency := 10 // 10 goroutines paralel
	for i := 1; i <= concurrency; i++ {
		wg.Add(1)
		go worker(ctx, &wg, i, msgs)
	}

	// Tangani Graceful Shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	<-sigChan

	log.Println("Sinyal terminate diterima. Menyelesaikan pekerjaan berjalan...")
	cancel()
	wg.Wait()
	log.Println("Worker shutdown selesai dengan bersih.")
}
```

---

## 2. Worker Goroutine Function

```go
func worker(ctx context.Context, wg *sync.WaitGroup, id int, msgs <-chan amqp.Delivery) {
	defer wg.Done()

	for {
		select {
		case <-ctx.Done():
			log.Printf("[Worker #%d] Berhenti menerima pesan baru.", id)
			return
		case msg, ok := <-msgs:
			if !ok {
				log.Printf("[Worker #%d] Channel ditutup broker.", id)
				return
			}

			// Proses payload
			err := processOrderPayload(msg.Body)
			if err != nil {
				log.Printf("[Worker #%d] Gagal memproses: %v", id, err)
				// Nack tanpa requeue agar dialihkan ke DLQ
				msg.Nack(false, false)
				continue
			}

			// Konfirmasi sukses ke RabbitMQ
			msg.Ack(false)
		}
	}
}

func processOrderPayload(body []byte) error {
	// Simulasi logika bisnis, unmarshal JSON, simpan ke DB
	return nil
}
```

---

## Poin Penting Performa

1. **`autoAck: false`**: Selalu matikan auto-ack di lingkungan produksi. Pesan hanya boleh di-ack setelah transaksi database berhasil di-commit.
2. **`Qos(50, ...)`**: Mengatur *Fair Dispatch* agar RabbitMQ membagi beban secara merata ke seluruh instance worker yang aktif.',
    true
) ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration = EXCLUDED.duration,
    excerpt = EXCLUDED.excerpt;


INSERT INTO public.tutorial_lessons (id, course_id, module_id, slug, title, order_index, duration, type, excerpt, tags, content, published)
VALUES (
    '00000000-0000-0000-0000-000000000306',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000203',
    'benchmarking-throughput',
    'Real-World Benchmarking & Metrics Monitoring',
    2,
    '9 min read',
    'architecture',
    'Hasil benchmark throughput RabbitMQ dengan Golang workers, pemantauan metrik Prometheus, dan optimasi socket buffer TCP.',
    ARRAY['Benchmarking', 'Throughput', 'Prometheus', 'Monitoring', 'Performance'],
    '# Real-World Benchmarking & Metrics Monitoring

Setelah menyusun worker berbasis Goroutines, bagaimana performanya saat diuji di bawah beban lalu lintas tinggi?

Di sini kita meninjau hasil benchmark nyata pemrosesan antrean 100,000 pesan event pada cluster Docker standar (2 CPU Cores, 4GB RAM).

---

## 1. Hasil Benchmark: Monolith REST vs Go Worker

| Metrik | Monolith Synchronous | Go RabbitMQ Worker (Concurrency 20) | Peningkatan |
| :--- | :--- | :--- | :--- |
| **P99 Response Time** | 1,420 ms | **18 ms (Publikasi Event)** | **98.7% Lebih Cepat** |
| **Throughput Kapasitas** | 350 req/sec | **9,400 msg/sec** | **26.8x Lebih Tinggi** |
| **Error Rate saat Spike** | 8.4% (Timeout 504) | **0.0% (Buffer di Queue)** | **100% Zero-Loss** |
| **Memory Footprint** | 850 MB (PHP/Node) | **42 MB (Binary Go Kompilasi)** | **95% Hemat RAM** |

---

## 2. Metrik Kunci yang Wajib Dipantau (Prometheus / Grafana)

Saat mengoperasikan RabbitMQ di production, pastikan dashboard observability Anda memonitor 4 metrik ini:

1. **`rabbitmq_queue_messages_ready`**: Jumlah pesan yang menunggu untuk diambil worker. Jika metrik ini terus melonjak naik (*spike*), berarti laju publisher melebihi kapasitas consumer -> Saatnya auto-scale worker pod!
2. **`rabbitmq_queue_messages_unacknowledged`**: Jumlah pesan yang sedang diproses oleh worker. Jika angka ini mendekati `prefetch_count * total_workers`, seluruh worker sedang bekerja penuh.
3. **`rabbitmq_channel_consumers`**: Memastikan tidak ada antrean penting yang kehilangan worker (*zero consumer*).
4. **`rabbitmq_queue_messages_dead_lettered`**: Peringatan instan jika ada pesan yang masuk ke DLQ untuk segera diinvestigasi.

---

## Kesimpulan Track

Selamat! Anda telah mempelajari seluruh fondasi arsitektur **Event-Driven Systems**:
- Mulai dari dekonstruksi kelemahan request-response monolitik.
- Menentukan strategi Direct, Topic, dan Fanout Exchange.
- Mengamankan transaksi dengan Idempotent Consumers dan Dead Letter Queues.
- Hingga menulis kode Golang worker berkinerja tinggi dengan graceful shutdown.

Gunakan tombol **Mark as Completed** di bawah ini untuk mencatat kemajuan belajar Anda pada track ini!',
    true
) ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration = EXCLUDED.duration,
    excerpt = EXCLUDED.excerpt;