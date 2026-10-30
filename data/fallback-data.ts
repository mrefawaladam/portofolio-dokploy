import {
  Project,
  Product,
  PromptShowcase,
  NewsArticle,
  Experience,
  Education,
  TechStack,
  ImpactMetric,
  PortfolioData,
} from "@/types/portfolio";

export const fallbackProjects: Project[] = [
  {
    id: "1",
    slug: "nexmedis-healthcare-ai",
    title: "Nexmedis Healthcare AI Platform",
    tagline: "AI-driven healthcare platform & patient room transfer workflow",
    description: "Developed backend services using Golang and Node.js, designed gRPC inter-service communication and RabbitMQ event-driven workflows, and optimized hospital operational efficiency with Redis caching and CI/CD pipelines.",
    category: "Backend",
    tags: ["Golang", "Node.js", "gRPC", "RabbitMQ", "Redis", "Docker", "CI/CD"],
    metrics: "Room Transfer Flow",
    featured: true,
    order_index: 1,
    demo_url: "https://nexmedis.com/",
  },
  {
    id: "2",
    slug: "rschooltoday-enterprise",
    title: "rSchoolToday Enterprise Platform",
    tagline: "Activity & school management system migration",
    description: "Built and maintained end-to-end web applications with Symfony/Laravel backend and Next.js frontend. Implemented RabbitMQ event-driven synchronization reducing latency by 35%, deployed on AWS (EC2, S3) and Docker.",
    category: "Full Stack",
    tags: ["Next.js", "Symfony", "Laravel", "RabbitMQ", "AWS", "Docker"],
    metrics: "-35% Latency",
    featured: true,
    order_index: 2,
    demo_url: "https://rschooltoday.com",
  },
  {
    id: "3",
    slug: "monolith-revamp-ddd-nextjs",
    title: "Legacy Monolith Modernization to Next.js & DDD",
    tagline: "Monolith revamp to Domain-Driven Design architecture",
    description: "Revamped legacy PHP monolithic codebase into Domain-Driven Design (DDD), migrated Blade templates into a modern Next.js SPA consuming REST APIs, normalized databases, and integrated Redis caching — achieving up to 70% system performance improvement.",
    category: "Architecture",
    tags: ["Next.js", "PHP", "DDD", "Redis", "Docker", "FrankenPHP", "CI/CD"],
    metrics: "+70% Speed",
    featured: true,
    order_index: 3,
    github_url: "https://github.com/mrefawaladam",
  },
  {
    id: "4",
    slug: "ecommerce-digital-wallet-backend",
    title: "Digital Wallet & E-Commerce Core Backend",
    tagline: "High-throughput transaction processing & payment gateway",
    description: "Led backend development for e-commerce and digital wallet platforms. Improved transaction throughput by 40% through backend performance optimization and relational database tuning.",
    category: "Backend",
    tags: ["Team Lead", "E-Commerce", "Digital Wallet", "Database Tuning", "REST APIs"],
    metrics: "+40% Throughput",
    featured: false,
    order_index: 4,
    github_url: "https://github.com/mrefawaladam",
  },
  {
    id: "5",
    slug: "school-payment-billing-system",
    title: "School Payment & Billing System",
    tagline: "Full school payment automation & billing pipeline",
    description: "Engineered a comprehensive school payment system using Laravel, handling billing, transaction flows, and reconciliation with enhanced maintainability through clean architecture refactoring.",
    category: "Backend",
    tags: ["Laravel", "Livewire", "MySQL", "Docker", "Billing Automation"],
    metrics: "Auto Reconciliation",
    featured: false,
    order_index: 5,
    github_url: "https://github.com/mrefawaladam",
  },
  {
    id: "6",
    slug: "sme-laundry-management",
    title: "SME Laundry Management System",
    tagline: "Operations & POS management for SME businesses",
    description: "Developed enterprise applications for small and medium businesses including a laundry management system, improving daily operational efficiency by 30%.",
    category: "Full Stack",
    tags: ["Full Stack", "SME Operations", "MySQL", "Productivity"],
    metrics: "+30% Efficiency",
    featured: false,
    order_index: 6,
    github_url: "https://github.com/mrefawaladam",
  },
];

export const fallbackProducts: Product[] = [
  {
    id: "p1",
    slug: "event-flow-toolkit",
    name: "EventFlow Toolkit",
    headline: "Lightweight RabbitMQ event-driven orchestrator",
    description: "A standardized boilerplate and event-bus orchestrator for microservices communication, retry policies, and dead-letter handling.",
    status: "Live",
    pricing_type: "Open Source",
    badge: "v1.2",
    icon_name: "Network",
    github_url: "https://github.com/mrefawaladam",
    order_index: 1,
  },
  {
    id: "p2",
    slug: "simrs-bridge",
    name: "SIMRS Bridge API Gateway",
    headline: "Healthcare interoperability integration service",
    description: "High-throughput bridge microservice connecting hospital clinical systems with external insurance and AI processing nodes.",
    status: "Beta",
    pricing_type: "Free",
    badge: "New",
    icon_name: "Cpu",
    github_url: "https://github.com/mrefawaladam",
    order_index: 2,
  },
  {
    id: "p3",
    slug: "ddd-skeleton-kit",
    name: "Clean DDD Laravel-Go Scaffold",
    headline: "Pragmatic Domain-Driven Design starter template",
    description: "Production-ready folder architecture and aggregate root templates designed for teams transitioning from MVC to modular services.",
    status: "Live",
    pricing_type: "Open Source",
    badge: "Popular",
    icon_name: "Layers3",
    github_url: "https://github.com/mrefawaladam",
    order_index: 3,
  },
];

export const fallbackNews: NewsArticle[] = [
  {
    id: "n1",
    slug: "modernizing-legacy-monolith-to-nextjs-and-ddd",
    title: "How We Reduced Latency by 35% with RabbitMQ & DDD",
    excerpt: "A deep dive into migrating legacy monolithic services into event-driven architecture and Next.js frontend.",
    category: "Architecture",
    read_time: "4 min read",
    tags: ["Architecture", "RabbitMQ", "Next.js", "DDD"],
    published: true,
    published_at: "OCT 2026",
  },
  {
    id: "n2",
    slug: "optimizing-database-throughput-40-percent",
    title: "Tuning Relational Databases for 40% Higher Transaction Throughput",
    excerpt: "Practical lessons in database normalization, query profiling, and Redis caching under real-world traffic.",
    category: "Engineering",
    read_time: "3 min read",
    tags: ["PostgreSQL", "Redis", "Database Tuning"],
    published: true,
    published_at: "SEP 2026",
  },
  {
    id: "n3",
    slug: "building-dependable-backend-ai-healthcare",
    title: "Engineering AI-Driven Backend Workflows for Hospital Operations",
    excerpt: "Insights into building reliable gRPC services and automated pipelines for clinical decision workflows.",
    category: "Milestone",
    read_time: "5 min read",
    tags: ["Golang", "gRPC", "Healthcare AI", "CI/CD"],
    published: true,
    published_at: "AUG 2026",
  },
];

export const fallbackExperiences: Experience[] = [
  {
    id: "e1",
    period: "MAR 2025 — APR 2026",
    company: "PT Ekosistem Kesehatan Indonesia",
    brand: "Nexmedis · Full-time",
    role: "Backend Developer",
    detail: "Developed backend services for AI-driven healthcare platforms using Golang and Node.js. Designed gRPC-based inter-service communication and RabbitMQ event-driven workflows. Optimized performance with Redis caching and CI/CD pipelines, directly contributing to a patient room transfer system.",
    tags: ["Golang", "Node.js", "gRPC", "RabbitMQ", "Redis", "Docker", "CI/CD", "Healthcare AI"],
    url: "https://nexmedis.com/",
    order_index: 1,
  },
  {
    id: "e2",
    period: "JUN 2022 — JAN 2025",
    company: "PT Visi Multi Media Aditama",
    brand: "rSchoolToday · Remote, Contract",
    role: "Full Stack Engineer",
    detail: "Built and maintained end-to-end web applications using Symfony/Laravel and Next.js. Migrated legacy architectures to modern stacks, cutting latency by 35% through RabbitMQ event synchronization. Designed REST APIs and managed Docker and AWS (EC2, S3) deployments.",
    tags: ["Next.js", "Symfony", "Laravel", "RabbitMQ", "AWS (EC2, S3)", "Docker", "REST APIs"],
    url: "https://rschooltoday.com",
    order_index: 2,
  },
  {
    id: "e3",
    period: "APR 2023 — AUG 2025",
    company: "PT NICE Media Technology",
    brand: "Product & Engineering · Remote, Full-time",
    role: "IT Product Manager",
    detail: "Managed full product lifecycles for education technology platforms. Collaborated closely with backend and frontend engineering teams to define system architecture, technical scope, and aligned product goals with high-availability scalability.",
    tags: ["Product Lifecycle", "Architecture Strategy", "EdTech", "Team Leadership"],
    order_index: 3,
  },
  {
    id: "e4",
    period: "MAY 2021 — APR 2023",
    company: "PT NICE Media Technology",
    brand: "Engineering · Remote, Full-time",
    role: "Senior Full Stack Engineer",
    detail: "Led development of multiple production systems using Laravel, Livewire, Docker, and relational databases. Designed scalable backend structures, collaborated on frontend features, and mentored junior engineers with code reviews.",
    tags: ["Laravel", "Livewire", "Docker", "Relational Databases", "Mentoring"],
    order_index: 4,
  },
  {
    id: "e5",
    period: "SEP 2019 — MAY 2021",
    company: "PT NICE Media Technology",
    brand: "Engineering · Remote, Full-time",
    role: "Full Stack Engineer",
    detail: "Developed a comprehensive school payment system using Laravel, handling high-volume billing and financial transaction flows while improving system maintainability through refactoring.",
    tags: ["Laravel", "School Payment", "Billing Pipelines", "Refactoring"],
    order_index: 5,
  },
  {
    id: "e6",
    period: "OCT 2021 — APR 2022",
    company: "PT IGRA Solusi Kreatif",
    brand: "Fintech & E-Commerce · Contract",
    role: "Team Lead Backend Developer",
    detail: "Led backend engineering for e-commerce and digital wallet platforms. Improved transaction throughput by 40% through backend optimization and database tuning.",
    tags: ["Team Lead", "E-Commerce", "Digital Wallet", "+40% Throughput", "Database Tuning"],
    order_index: 6,
  },
  {
    id: "e7",
    period: "DEC 2021 — APR 2023",
    company: "PT Atlas Global Teknologi",
    brand: "Enterprise Solutions · Part-time",
    role: "Part-Time Full Stack Developer",
    detail: "Developed SME enterprise applications including a laundry management system, improving operational efficiency and daily tracking by 30%.",
    tags: ["Full Stack", "SME Operations", "Operational Efficiency", "MySQL"],
    order_index: 7,
  },
  {
    id: "e8",
    period: "JAN 2019 — DEC 2020",
    company: "PT. INOSOFT TRANS SISTEM",
    brand: "Surabaya · Internship",
    role: "Software Engineer Intern",
    detail: "Contributed to developing and maintaining client-facing web and desktop applications utilizing Laravel, CodeIgniter, and .NET.",
    tags: ["Laravel", "CodeIgniter", ".NET", "Desktop & Web Apps"],
    order_index: 8,
  },
];

export const fallbackEducations: Education[] = [
  {
    id: "edu1",
    institution: "Politeknik Negeri Malang",
    degree: "Bachelor in Applied Informatics Engineering (D4 Teknik Informatika)",
    period: "January 2020 — December 2024",
    detail: "Specialized in software engineering, distributed application architecture, and database systems.",
    order_index: 1,
  },
  {
    id: "edu2",
    institution: "SMK PGRI 2 Ponorogo",
    degree: "High School in Software Engineering (Rekayasa Perangkat Lunak)",
    period: "January 2017 — December 2020",
    detail: "Foundation in algorithms, object-oriented programming, and web development fundamentals.",
    order_index: 2,
  },
];

export const fallbackStacks: TechStack[] = [
  {
    id: "s1",
    title: "Backend engineering",
    icon_name: "ServerCog",
    note: "High-concurrency logic, robust business rules, and high-performance server-side services.",
    tags: ["Golang (Gin, Echo)", "PHP (Laravel, Symfony)", "Node.js", "Python", "REST & gRPC APIs"],
    grid_span: "lg:col-span-3",
    order_index: 1,
  },
  {
    id: "s2",
    title: "Frontend systems",
    icon_name: "Braces",
    note: "Modern, reactive user interfaces that make complex enterprise products intuitive.",
    tags: ["Next.js", "React.js", "Vue.js", "Livewire", "Tailwind CSS"],
    grid_span: "lg:col-span-3",
    order_index: 2,
  },
  {
    id: "s3",
    title: "Architecture & systems",
    icon_name: "Network",
    note: "Engineered for real-world load, domain clarity, and scalable multi-service workflows.",
    tags: ["Distributed Systems", "Microservices", "Event-Driven", "DDD", "Multitenant"],
    grid_span: "lg:col-span-2",
    order_index: 3,
  },
  {
    id: "s4",
    title: "Messaging & data",
    icon_name: "Database",
    note: "Reliable async pipelines, caching strategies, and normalized data stores.",
    tags: ["RabbitMQ", "Redis", "PostgreSQL", "MySQL", "MongoDB"],
    grid_span: "lg:col-span-2",
    order_index: 4,
  },
  {
    id: "s5",
    title: "Cloud, DevOps & tools",
    icon_name: "Workflow",
    note: "Containerized environments, automated pipelines, and operational developer tools.",
    tags: ["Docker", "FrankenPHP", "AWS (EC2, S3)", "CI/CD", "Git", "Jira", "n8n"],
    grid_span: "lg:col-span-2",
    order_index: 5,
  },
];

export const fallbackImpact: ImpactMetric[] = [
  {
    id: "m1",
    metric: "+70%",
    title: "System performance boost",
    detail: "Revamped monolithic legacy PHP into Domain-Driven Design (DDD), modern Next.js frontend, and Redis caching.",
    order_index: 1,
  },
  {
    id: "m2",
    metric: "-35%",
    title: "Lower processing latency",
    detail: "Implemented RabbitMQ-powered event-driven data synchronization at rSchoolToday.",
    order_index: 2,
  },
  {
    id: "m3",
    metric: "+40%",
    title: "Transaction throughput",
    detail: "Optimized backend queries and relational database tuning for e-commerce and digital wallet systems at PT IGRA.",
    order_index: 3,
  },
  {
    id: "m4",
    metric: "+30%",
    title: "SME operational efficiency",
    detail: "Delivered enterprise SME management systems (e.g. Laundry Management) to streamline daily workflows.",
    order_index: 4,
  },
];

export const fallbackPrompts: PromptShowcase[] = [
  {
    id: "prompt-1",
    slug: "golang-hexagonal-ddd-generator",
    title: "Golang Hexagonal & DDD Domain Service Generator",
    type: "Architecture & DDD",
    badge: "Production Tested",
    target_model: "Claude 3.5 Sonnet / GPT-4o",
    description: "Generates production-grade Golang services following strict Domain-Driven Design (DDD) with pure aggregates, repository interfaces, and decoupled HTTP/gRPC handlers.",
    tags: ["Golang", "DDD", "Clean Architecture", "Hexagonal", "Microservices"],
    instructions: "Fill in {{SERVICE_NAME}}, {{AGGREGATE_ROOT}}, and describe your business invariants before sending.",
    prompt_text: `You are an elite Staff Software Architect specializing in Domain-Driven Design (DDD), Hexagonal / Clean Architecture, and high-performance idiomatic Golang.

Your task is to design and scaffold a production-ready Golang package for:
Service Name: {{SERVICE_NAME}}
Aggregate Root: {{AGGREGATE_ROOT}}
Core Domain Problem: {{DOMAIN_REQUIREMENTS}}

### Strict Architectural Guidelines:
1. Pure Domain Layer (internal/domain/):
   - Zero external imports (no database drivers, no json tags, no web frameworks).
   - Rich Domain Model: Private fields, unexported state, constructor validation functions returning an error.
   - Value Objects: Immutable with strict validation and semantic equality checks.
   - Domain Events: Emit typed domain events upon state changes (e.g. OrderPlacedEvent).
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
   - Explicit error handling with custom sentinel errors (ErrNotFound, ErrInvariantViolation).
   - Proper mutex synchronization if concurrent memory mutation is required.
   - Table-driven unit tests with mocks generated via interfaces.

Output the complete, compilable Go code for the Domain Entities, Repository Interface, Use Case Handler, and a Table-Driven Test Suite.`,
    order_index: 1,
  },
  {
    id: "prompt-2",
    slug: "rabbitmq-event-driven-workflow-planner",
    title: "RabbitMQ Event-Driven Microservice Pipeline",
    type: "Distributed Systems",
    badge: "Staff Pick",
    target_model: "Claude 3.5 Sonnet / DeepSeek-R1",
    description: "Designs enterprise-grade asynchronous event queues with exponential retry policies, dead-letter exchanges (DLX), and transactional outbox idempotency.",
    tags: ["RabbitMQ", "Event-Driven", "Idempotency", "DLQ", "Resilience"],
    instructions: "Provide the producer service name, consumer service name, event schema, and peak message volume.",
    prompt_text: `You are a Principal Distributed Systems Engineer specialized in asynchronous messaging, RabbitMQ, and resilient event-driven architectures.

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
   - Production-ready consumer boilerplate code including graceful OS signal shutdown (SIGINT/SIGTERM) and channel drain.`,
    order_index: 2,
  },
  {
    id: "prompt-3",
    slug: "autonomous-coding-agent-system-prompt",
    title: "Autonomous Senior AI Coding Agent Prompt",
    type: "Autonomous Agent",
    badge: "Agentic AI",
    target_model: "Claude 3.5 Sonnet / Gemini 1.5 Pro",
    description: "Battle-tested system prompt designed for AI coding assistants to conduct precise root-cause analysis, surgical code edits, and verification loops.",
    tags: ["System Prompt", "Agentic AI", "Antigravity", "Tool Use", "Git Diff"],
    instructions: "Paste into Cursor Rules (.cursorrules), Antigravity custom skills, or LLM system instructions.",
    prompt_text: `You are an elite Principal Software Engineer and Autonomous AI Coding Agent operating with high autonomy and deep engineering precision.

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
   - Never expose API keys or passwords. Use environment configurations.`,
    order_index: 3,
  },
  {
    id: "prompt-4",
    slug: "postgresql-query-optimizer-explain-analyze",
    title: "PostgreSQL EXPLAIN ANALYZE & Indexing Engine",
    type: "Database & SQL",
    badge: "Database Specialist",
    target_model: "DeepSeek-V3 / Claude 3.5 Sonnet",
    description: "Diagnose sequential table scans, buffer cache misses, and costly hash joins to provide exact composite index recommendations and rewrite strategies.",
    tags: ["PostgreSQL", "Query Optimization", "Indexing", "EXPLAIN ANALYZE", "B-Tree"],
    instructions: "Paste your slow SQL query along with the raw output of EXPLAIN (ANALYZE, BUFFERS, VERBOSE).",
    prompt_text: `You are an expert PostgreSQL Database Administrator and High-Scale Performance Tuning Engineer.

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
   - Projected reduction in execution time and buffer read count.`,
    order_index: 4,
  },
  {
    id: "prompt-5",
    slug: "senior-backend-code-review-security-auditor",
    title: "Senior Staff Backend Reviewer & Concurrency Auditor",
    type: "Code Review & Security",
    badge: "High Precision",
    target_model: "Claude 3.5 Sonnet / GPT-4o",
    description: "Perform uncompromising code reviews assessing race conditions, unhandled context cancellations, SQL injection, memory allocations, and connection leaks.",
    tags: ["Code Review", "Security", "Concurrency", "Race Conditions", "Go/PHP/Node"],
    instructions: "Paste the code diff or implementation you want thoroughly reviewed.",
    prompt_text: `You are a Principal Security Auditor and Staff Backend Engineer conducting a comprehensive code review.

Review the following code diff:
\`\`\`
{{CODE_DIFF}}
\`\`\`

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
   - Are database connections, HTTP response bodies, and file descriptors properly closed (defer resp.Body.Close())?
   - Memory allocation hotspots in high-throughput hot paths.

4. Architectural Cleanliness:
   - Separation of concerns and coupling index.
   - Meaningful error logging without spamming sensitive PII.

Deliver your review sorted into:
- 🚨 [BLOCKER] Critical bugs, security flaws, or memory/concurrency leaks.
- ⚠️ [WARNING] Sub-optimal patterns, edge-case failure modes, missing test cases.
- 💡 [OPTIMIZATION] Performance enhancements and idiomatic styling improvements.`,
    order_index: 5,
  },
  {
    id: "prompt-6",
    slug: "strangler-fig-monolith-to-nextjs-go",
    title: "Legacy Monolith to Next.js + Go Strangler Fig Migration",
    type: "Refactoring & Migration",
    badge: "Migration Blueprint",
    target_model: "GPT-4o / Claude 3.5 Sonnet",
    description: "A strategic blueprint prompt to decommission legacy PHP/monolith monoliths into decoupled Next.js SPAs and Golang microservices with zero downtime.",
    tags: ["Strangler Fig", "Migration", "Next.js", "Golang", "Zero Downtime"],
    instructions: "Describe your legacy application structure, traffic volume, and the first business feature to decouple.",
    prompt_text: `You are an Enterprise Cloud Migration Architect specializing in the Strangler Fig application pattern, modernizing legacy monolithic PHP/Java applications into Next.js frontends and Go/Node.js microservices.

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
   - Immediate circuit-breaker rollback triggers based on error rate or latency thresholds.`,
    order_index: 6,
  },
];

export const fallbackPortfolioData: PortfolioData = {
  projects: fallbackProjects,
  products: fallbackProducts,
  prompts: fallbackPrompts,
  news: fallbackNews,
  experiences: fallbackExperiences,
  educations: fallbackEducations,
  stacks: fallbackStacks,
  impact: fallbackImpact,
};
