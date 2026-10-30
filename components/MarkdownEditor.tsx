"use client";

import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Eye,
  Edit3,
  Columns,
  UploadCloud,
} from "lucide-react";
import MarkdownViewer from "./MarkdownViewer";
import FileUploadZone, { UploadedFile } from "./FileUploadZone";

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  adminKey?: string;
  onSetCover?: (url: string) => void;
  currentCoverUrl?: string;
  minHeight?: string;
}

type ViewMode = "write" | "preview" | "split";

export default function MarkdownEditor({
  value,
  onChange,
  label = "Content (Markdown)",
  placeholder = "Write content in Markdown format...",
  required = false,
  adminKey,
  onSetCover,
  currentCoverUrl,
  minHeight = "min-h-[260px]",
}: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("write");
  const [showUploadZone, setShowUploadZone] = useState<boolean>(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to insert or wrap markdown at cursor position
  const insertFormatting = (prefix: string, suffix = "", defaultText = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = value || "";
    const selectedText = currentVal.substring(start, end) || defaultText;

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);

    onChange(newVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

  const handleInsertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    const currentVal = value || "";
    if (!textarea) {
      onChange(currentVal ? `${currentVal}\n${snippet}` : snippet);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newVal = currentVal.substring(0, start) + snippet + currentVal.substring(end);

    onChange(newVal);

    setTimeout(() => {
      textarea.focus();
      const nextPos = start + snippet.length;
      textarea.setSelectionRange(nextPos, nextPos);
    }, 10);
  };

  return (
    <div className="space-y-2">
      {/* Label & Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/80">
          <button
            type="button"
            onClick={() => setViewMode("write")}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
              viewMode === "write"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Edit3 size={12} /> Write
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
              viewMode === "preview"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye size={12} /> Preview
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`hidden sm:inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
              viewMode === "split"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Columns size={12} /> Split
          </button>

          {adminKey && (
            <button
              type="button"
              onClick={() => setShowUploadZone(!showUploadZone)}
              className={`ml-1 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                showUploadZone
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Toggle Multi-file Upload Zone"
            >
              <UploadCloud size={13} /> Uploads
            </button>
          )}
        </div>
      </div>

      {/* Formatting Toolbar (Visible in write and split modes) */}
      {viewMode !== "preview" && (
        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1.5 text-slate-700">
          <button
            type="button"
            onClick={() => insertFormatting("**", "**", "bold text")}
            className="rounded-lg p-1.5 hover:bg-white hover:text-blue-600 hover:shadow-xs transition"
            title="Bold (**text**)"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("*", "*", "italic text")}
            className="rounded-lg p-1.5 hover:bg-white hover:text-blue-600 hover:shadow-xs transition"
            title="Italic (*text*)"
          >
            <Italic size={14} />
          </button>
          <div className="h-4 w-px bg-slate-200 mx-0.5" />
          <button
            type="button"
            onClick={() => insertFormatting("\n## ", "\n", "Heading 2")}
            className="rounded-lg p-1.5 hover:bg-white hover:text-blue-600 hover:shadow-xs transition"
            title="Heading 2 (## Title)"
          >
            <Heading2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("\n### ", "\n", "Heading 3")}
            className="rounded-lg p-1.5 hover:bg-white hover:text-blue-600 hover:shadow-xs transition"
            title="Heading 3 (### Title)"
          >
            <Heading3 size={14} />
          </button>
          <div className="h-4 w-px bg-slate-200 mx-0.5" />
          <button
            type="button"
            onClick={() => insertFormatting("\n- ", "", "List item")}
            className="rounded-lg p-1.5 hover:bg-white hover:text-blue-600 hover:shadow-xs transition"
            title="Bullet List (- item)"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("\n1. ", "", "Ordered item")}
            className="rounded-lg p-1.5 hover:bg-white hover:text-blue-600 hover:shadow-xs transition"
            title="Numbered List (1. item)"
          >
            <ListOrdered size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("\n> ", "\n", "Quote content")}
            className="rounded-lg p-1.5 hover:bg-white hover:text-blue-600 hover:shadow-xs transition"
            title="Blockquote (> quote)"
          >
            <Quote size={14} />
          </button>
          <div className="h-4 w-px bg-slate-200 mx-0.5" />
          <button
            type="button"
            onClick={() => insertFormatting("\n```bash\n", "\n```\n", "echo 'Hello World'")}
            className="rounded-lg p-1.5 hover:bg-white hover:text-blue-600 hover:shadow-xs transition"
            title="Code Block (```)"
          >
            <Code size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("[", "](https://example.com)", "Link title")}
            className="rounded-lg p-1.5 hover:bg-white hover:text-blue-600 hover:shadow-xs transition"
            title="Insert Link [title](url)"
          >
            <LinkIcon size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("![", "](https://example.com/image.png)", "Image alt")}
            className="rounded-lg p-1.5 hover:bg-white hover:text-blue-600 hover:shadow-xs transition"
            title="Insert Image ![alt](url)"
          >
            <ImageIcon size={14} />
          </button>
          <button
            type="button"
            onClick={() =>
              handleInsertSnippet(
                "\n| Column 1 | Column 2 |\n| :--- | :--- |\n| Item A | Value 1 |\n| Item B | Value 2 |\n"
              )
            }
            className="rounded-lg p-1.5 hover:bg-white hover:text-blue-600 hover:shadow-xs transition"
            title="Insert Table"
          >
            <TableIcon size={14} />
          </button>
        </div>
      )}

      {/* Editor & Preview Area */}
      <div className="relative">
        {viewMode === "write" && (
          <textarea
            ref={textareaRef}
            rows={10}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={`w-full rounded-2xl border border-slate-200 bg-white p-4 font-mono text-xs text-slate-800 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed ${minHeight}`}
          />
        )}

        {viewMode === "preview" && (
          <div
            className={`w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-xs overflow-y-auto max-h-[500px] ${minHeight}`}
          >
            <MarkdownViewer content={value || "*Nothing to preview yet. Switch to Write mode.*"} />
          </div>
        )}

        {viewMode === "split" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <textarea
              ref={textareaRef}
              rows={12}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              required={required}
              className={`w-full rounded-2xl border border-slate-200 bg-white p-4 font-mono text-xs text-slate-800 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed max-h-[500px] ${minHeight}`}
            />
            <div
              className={`w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-5 shadow-xs overflow-y-auto max-h-[500px] ${minHeight}`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-200 pb-1">
                Live MD Preview
              </div>
              <MarkdownViewer content={value || "*Live preview output...*"} />
            </div>
          </div>
        )}
      </div>

      {/* Integrated Multi-File Upload Zone */}
      {adminKey && showUploadZone && (
        <div className="pt-2">
          <FileUploadZone
            adminKey={adminKey}
            onInsertMarkdown={handleInsertSnippet}
            onSetCover={onSetCover}
            currentCoverUrl={currentCoverUrl}
          />
        </div>
      )}
    </div>
  );
}
