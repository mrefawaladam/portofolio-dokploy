"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

function CodeBlock({ children, className }: { children: any; className?: string }) {
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, "");
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400">
        <span>{language ? language.toUpperCase() : "CODE"}</span>
        <button
          onClick={handleCopy}
          type="button"
          className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
        <pre>{children}</pre>
      </div>
    </div>
  );
}

export default function MarkdownViewer({ content, className = "" }: MarkdownViewerProps) {
  if (!content || !content.trim()) {
    return (
      <div className="text-xs text-slate-400 italic py-4">
        (No content provided)
      </div>
    );
  }

  return (
    <div className={`prose-container text-slate-700 leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mt-7 mb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mt-6 mb-2 pb-1.5 border-b border-slate-200/70">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg md:text-xl font-bold text-slate-800 mt-5 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-bold text-slate-800 mt-4 mb-1.5">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="my-3 text-sm md:text-[15px] leading-7 text-slate-600">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 my-3 space-y-1 text-sm md:text-[15px] text-slate-600">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 my-3 space-y-1 text-sm md:text-[15px] text-slate-600">
              {children}
            </ol>
          ),
          li: ({ children, className }: any) => {
            const isTaskList = className?.includes("task-list-item");
            return (
              <li
                className={`leading-relaxed ${
                  isTaskList
                    ? "list-none -ml-4 flex items-center gap-2.5 py-1 text-slate-700"
                    : ""
                }`}
              >
                {children}
              </li>
            );
          },
          input: ({ type, checked, ...props }: any) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="h-4 w-4 rounded-full border-slate-300 text-blue-600 accent-blue-600 focus:ring-blue-500 cursor-default shrink-0 inline-block align-middle"
                  {...props}
                />
              );
            }
            return <input type={type} checked={checked} {...props} />;
          },
          blockquote: ({ children }) => (
            <blockquote className="my-5 rounded-2xl border border-blue-200/90 bg-gradient-to-br from-blue-50/60 via-slate-50 to-indigo-50/30 p-5 text-slate-700 shadow-2xs">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-6 border-slate-200" />,
          a: ({ href, children }) => {
            // Check if href is an image URL (e.g. from OpenAI/ChatGPT search or ends with image extensions)
            const isImageLink =
              href &&
              (/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i.test(href) ||
                href.includes("images.openai.com") ||
                href.includes("purpose=inline"));

            if (isImageLink) {
              return (
                <span className="flex flex-col sm:flex-row sm:items-center gap-3.5 my-3.5 p-3 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-blue-400 hover:shadow-xs transition group max-w-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={href}
                    alt={typeof children === "string" ? children : "Visual preview"}
                    className="h-20 w-24 rounded-xl object-cover border border-slate-100 shrink-0 bg-slate-50"
                    loading="lazy"
                  />
                  <span className="min-w-0">
                    <span className="block text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                      {children}
                    </span>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-blue-600 group-hover:underline mt-1 font-semibold"
                    >
                      Buka Gambar Asli ↗
                    </a>
                  </span>
                </span>
              );
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600 hover:text-blue-800 underline decoration-blue-300 underline-offset-2 transition"
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => (
            <span className="block my-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt || "Gambar Ilustrasi"}
                className="max-h-[420px] w-auto max-w-full rounded-2xl object-contain border border-slate-200 bg-slate-50 shadow-xs transition hover:shadow-md"
                loading="lazy"
              />
              {alt && (
                <span className="block text-center text-xs text-slate-400 mt-1.5 italic">
                  {alt}
                </span>
              )}
            </span>
          ),
          table: ({ children }) => (
            <div className="my-5 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs md:text-sm border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100 bg-white">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50 transition">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 font-bold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-slate-600">{children}</td>
          ),
          code: ({ node, className, children, ...props }: any) => {
            const isMultiline = String(children).includes("\n");
            if (isMultiline) {
              return <CodeBlock className={className}>{children}</CodeBlock>;
            }
            return (
              <code
                className="rounded-md bg-blue-50 border border-blue-100 px-1.5 py-0.5 text-[12px] font-mono font-medium text-blue-700"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
