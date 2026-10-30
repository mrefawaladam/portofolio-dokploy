"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Check,
  Copy,
  PlusCircle,
  Sparkles,
  AlertCircle,
  FileArchive,
  FileSpreadsheet,
} from "lucide-react";

export interface UploadedFile {
  originalName: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  isImage: boolean;
}

interface FileUploadZoneProps {
  adminKey: string;
  onFilesUploaded?: (files: UploadedFile[]) => void;
  onInsertMarkdown?: (markdownSnippet: string) => void;
  onSetCover?: (url: string) => void;
  currentCoverUrl?: string;
  className?: string;
}

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export default function FileUploadZone({
  adminKey,
  onFilesUploaded,
  onInsertMarkdown,
  onSetCover,
  currentCoverUrl,
  className = "",
}: FileUploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "x-admin-key": adminKey,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload file(s)");
      }

      const newFiles: UploadedFile[] = data.files || [];
      setUploadedFiles((prev) => [...newFiles, ...prev]);

      if (onFilesUploaded) {
        onFilesUploaded(newFiles);
      }

      // If user hasn't set a cover yet and the first uploaded file is an image, offer or auto-set
      if (!currentCoverUrl && onSetCover) {
        const firstImg = newFiles.find((f) => f.isImage);
        if (firstImg) {
          onSetCover(firstImg.url);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const getMarkdownSnippet = (file: UploadedFile) => {
    if (file.isImage) {
      return `\n![${file.originalName}](${file.url})\n`;
    }
    return `\n[📥 Download ${file.originalName}](${file.url})\n`;
  };

  const handleCopyMarkdown = (file: UploadedFile, index: number) => {
    const md = getMarkdownSnippet(file);
    navigator.clipboard.writeText(md.trim());
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition ${
          dragActive
            ? "border-blue-500 bg-blue-50/70"
            : "border-slate-200 bg-slate-50/50 hover:border-blue-400 hover:bg-slate-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          accept="image/*,application/pdf,.zip,.md,.txt"
        />

        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:scale-105 group-hover:bg-blue-100">
          <UploadCloud size={20} className={uploading ? "animate-bounce" : ""} />
        </div>

        <div className="mt-2 text-xs font-bold text-slate-800">
          {uploading ? (
            <span className="text-blue-600 animate-pulse">Uploading files to server...</span>
          ) : (
            <>
              Click to select or drag & drop files{" "}
              <span className="font-normal text-slate-400">(Multiple supported)</span>
            </>
          )}
        </div>
        <p className="mt-0.5 text-[11px] text-slate-400">
          Images (PNG, JPG, WEBP, SVG) or Documents (PDF, ZIP, MD). Max 25MB.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-2.5 text-xs text-red-600">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {/* Uploaded Files Manager */}
      {uploadedFiles.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Uploaded Files ({uploadedFiles.length})
            </span>
            <span className="text-[10px] text-slate-400">Click actions to insert/copy</span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {uploadedFiles.map((file, idx) => {
              const isCurrentCover = currentCoverUrl === file.url;
              return (
                <div
                  key={file.filename}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-2 text-xs transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {file.isImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={file.url}
                        alt={file.originalName}
                        className="h-8 w-8 rounded-md object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="grid h-8 w-8 place-items-center rounded-md bg-blue-100 text-blue-700">
                        {file.type.includes("pdf") ? (
                          <FileText size={16} />
                        ) : file.type.includes("zip") ? (
                          <FileArchive size={16} />
                        ) : (
                          <FileSpreadsheet size={16} />
                        )}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="font-semibold text-slate-800 truncate max-w-[150px] sm:max-w-[200px]">
                        {file.originalName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {formatBytes(file.size)}
                        {isCurrentCover && (
                          <span className="ml-2 font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                            Cover
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {file.isImage && onSetCover && (
                      <button
                        type="button"
                        onClick={() => onSetCover(file.url)}
                        className={`rounded-md px-2 py-1 text-[10px] font-semibold transition ${
                          isCurrentCover
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                        title="Set as Cover Image"
                      >
                        {isCurrentCover ? "Active Cover" : "Set Cover"}
                      </button>
                    )}

                    {onInsertMarkdown && (
                      <button
                        type="button"
                        onClick={() => onInsertMarkdown(getMarkdownSnippet(file))}
                        className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                        title="Insert into Markdown Editor"
                      >
                        <PlusCircle size={11} /> Insert MD
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCopyMarkdown(file, idx)}
                      className="rounded-md bg-white border border-slate-200 p-1 text-slate-500 hover:text-blue-600 transition"
                      title="Copy Markdown code"
                    >
                      {copiedIndex === idx ? (
                        <Check size={13} className="text-emerald-500" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
