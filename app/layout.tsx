import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://mrefawm.my.id";

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammad Refa Walada Mushtofa — Backend Programmer & Full Stack Engineer | M. Refa",
    template: "%s | Muhammad Refa Walada Mushtofa",
  },
  description:
    "Portfolio resmi Muhammad Refa Walada Mushtofa (M. Refa). Senior Full Stack & Backend Programmer dengan spesialisasi Golang, PHP (Laravel, Symfony), Node.js, Next.js, RabbitMQ, distributed systems, dan enterprise architecture.",
  applicationName: "Muhammad Refa Portfolio",
  authors: [{ name: "Muhammad Refa Walada Mushtofa", url: siteUrl }],
  generator: "Next.js",
  keywords: [
    // Nama lengkap & variasi nama
    "Muhammad Refa Walada Mushtofa",
    "Muhammad Refa",
    "M Refa",
    "M. Refa",
    "Refa Walada",
    "Refa",
    "Refamaan",
    "mrefawaladam",
    
    // Target pencarian profesi
    "refa programmer",
    "backend refa",
    "refa backend",
    "refa backend developer",
    "refa software engineer",
    "refa full stack developer",
    "programmer backend refa",
    "programmer refa",
    
    // Keahlian & Teknologi
    "Backend Developer Indonesia",
    "Golang Developer Indonesia",
    "Laravel Developer Indonesia",
    "Distributed Systems Engineer",
    "System Architect Indonesia",
    "Next.js Developer Indonesia",
    "RabbitMQ Event-Driven Specialist",
    "Full Stack Engineer Ponorogo",
    "Software Engineer Ponorogo",
    "Politeknik Negeri Malang Software Engineer"
  ],
  creator: "Muhammad Refa Walada Mushtofa",
  publisher: "Muhammad Refa Walada Mushtofa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Muhammad Refa Walada Mushtofa — Backend Programmer & Full Stack Engineer",
    description:
      "Portfolio resmi Muhammad Refa Walada Mushtofa (M. Refa). Senior Backend Programmer berpengalaman 6+ tahun fokus pada Golang, Laravel, Next.js, and Distributed Systems.",
    url: siteUrl,
    siteName: "Muhammad Refa Walada Mushtofa Portfolio",
    images: [
      {
        url: "/refa-foto.png",
        width: 1200,
        height: 630,
        alt: "Muhammad Refa Walada Mushtofa — Full Stack & Backend Programmer",
      },
    ],
    locale: "id_ID",
    alternateLocale: ["en_US"],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Refa Walada Mushtofa — Backend Programmer & Full Stack Engineer",
    description:
      "Portfolio resmi Muhammad Refa Walada Mushtofa (M. Refa). Backend Programmer & Distributed Systems Specialist.",
    images: ["/refa-foto.png"],
    creator: "@mrefawaladam",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/faf-icon.png", type: "image/png" },
    ],
    shortcut: "/faf-icon.png",
    apple: "/faf-icon.png",
  },
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Muhammad Refa Walada Mushtofa",
      givenName: "Muhammad Refa",
      familyName: "Walada Mushtofa",
      additionalName: "Refa",
      alternateName: [
        "M. Refa",
        "M Refa",
        "Refa",
        "Refamaan",
        "mrefawaladam",
        "Refa Programmer",
        "Backend Refa",
        "Programmer Refa"
      ],
      jobTitle: "Senior Full Stack & Backend Programmer",
      description:
        "Full Stack & Backend Programmer with 6+ years of experience specializing in Golang, PHP (Laravel, Symfony), Node.js, Next.js, RabbitMQ, distributed systems, and system design.",
      url: siteUrl,
      image: `${siteUrl}/refa-foto.png`,
      email: "mailto:refa.main@gmail.com",
      telephone: "+6283848988030",
      sameAs: [
        "https://github.com/mrefawaladam",
        "https://www.linkedin.com/in/mrefawaladam"
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ponorogo",
        addressRegion: "Jawa Timur",
        addressCountry: "ID"
      },
      alumniOf: [
        {
          "@type": "EducationalOrganization",
          name: "Politeknik Negeri Malang"
        },
        {
          "@type": "EducationalOrganization",
          name: "SMK PGRI 2 Ponorogo"
        }
      ],
      knowsAbout: [
        "Backend Development",
        "Backend Programming",
        "System Architecture",
        "Distributed Systems",
        "Microservices Architecture",
        "Domain-Driven Design (DDD)",
        "Golang",
        "PHP",
        "Laravel",
        "Symfony",
        "Node.js",
        "Next.js",
        "React",
        "RabbitMQ",
        "Redis",
        "PostgreSQL",
        "MySQL",
        "Docker",
        "REST APIs",
        "gRPC"
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Muhammad Refa Walada Mushtofa — Official Portfolio",
      alternateName: [
        "Refa Portfolio",
        "M Refa Portfolio",
        "Refa Programmer Backend Website"
      ],
      description:
        "Official portfolio and engineering case studies of Muhammad Refa Walada Mushtofa (M. Refa).",
      publisher: {
        "@id": `${siteUrl}/#person`
      },
      inLanguage: ["id-ID", "en-US"]
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profilepage`,
      url: siteUrl,
      name: "Muhammad Refa Walada Mushtofa Profile",
      isPartOf: {
        "@id": `${siteUrl}/#website`
      },
      mainEntity: {
        "@id": `${siteUrl}/#person`
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
