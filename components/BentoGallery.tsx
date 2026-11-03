"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Bookmark,
  Sparkles,
} from "lucide-react";

export interface GalleryImage {
  src: string;
  alt: string;
}

interface BentoGalleryProps {
  images: GalleryImage[];
  className?: string;
}

export function BentoGallery({ images, className = "" }: BentoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => ((prev ?? 0) + 1) % images.length);
    }
  }, [lightboxIndex, images.length]);

  const showPrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) =>
        (prev ?? 0) - 1 < 0 ? images.length - 1 : (prev ?? 0) - 1
      );
    }
  }, [lightboxIndex, images.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, showNext, showPrev]);

  if (!images || images.length === 0) return null;

  const count = images.length;

  return (
    <>
      <div className={`my-5 select-none ${className}`}>
        {/* 1 Image Layout */}
        {count === 1 && (
          <div
            onClick={() => openLightbox(0)}
            className="group relative cursor-zoom-in overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-md transition hover:border-blue-500/50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[0].src}
              alt={images[0].alt || "Visual Showcase"}
              className="max-h-[460px] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="truncate font-medium drop-shadow-md">
                {images[0].alt || "Klik untuk memperbesar"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5 text-[11px] backdrop-blur-md">
                <Maximize2 size={12} /> Perbesar
              </span>
            </div>
          </div>
        )}

        {/* 2 Images Layout */}
        {count === 2 && (
          <div className="grid h-[240px] grid-cols-1 gap-1.5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-1 shadow-md sm:h-[300px] sm:grid-cols-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className="group relative h-full w-full cursor-zoom-in overflow-hidden rounded-xl bg-slate-900"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt || `Visual ${idx + 1}`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="truncate drop-shadow-md">{img.alt}</span>
                  <Maximize2 size={12} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3 Images Layout - ChatGPT Signature Bento Grid */}
        {count === 3 && (
          <div className="grid h-[340px] grid-cols-2 gap-1.5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-1 shadow-md sm:h-[400px] md:h-[440px]">
            {/* Left Column: 1 Tall Hero Image */}
            <div
              onClick={() => openLightbox(0)}
              className="group relative h-full w-full cursor-zoom-in overflow-hidden rounded-xl bg-slate-900"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[0].src}
                alt={images[0].alt || "Visual 1"}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {/* Floating bookmark icon like in ChatGPT screenshot */}
              <div className="absolute right-2.5 top-2.5 rounded-full bg-slate-950/60 p-1.5 text-slate-300 backdrop-blur-md transition hover:text-white">
                <Bookmark size={13} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="truncate font-medium drop-shadow-md">
                  {images[0].alt || "Hero visual"}
                </span>
                <Maximize2 size={12} />
              </div>
            </div>

            {/* Right Column: 2 Stacked Images */}
            <div className="grid h-full grid-rows-2 gap-1.5">
              {/* Top Right Image */}
              <div
                onClick={() => openLightbox(1)}
                className="group relative h-full w-full cursor-zoom-in overflow-hidden rounded-xl bg-slate-900"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[1].src}
                  alt={images[1].alt || "Visual 2"}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute right-2.5 top-2.5 rounded-full bg-slate-950/60 p-1.5 text-slate-300 backdrop-blur-md transition hover:text-white">
                  <Bookmark size={13} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="truncate font-medium drop-shadow-md">
                    {images[1].alt}
                  </span>
                  <Maximize2 size={12} />
                </div>
              </div>

              {/* Bottom Right Image */}
              <div
                onClick={() => openLightbox(2)}
                className="group relative h-full w-full cursor-zoom-in overflow-hidden rounded-xl bg-slate-900"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[2].src}
                  alt={images[2].alt || "Visual 3"}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Badge count / zoom indicator like in ChatGPT */}
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-slate-950/70 px-2 py-0.5 text-[10px] font-mono text-slate-200 backdrop-blur-md">
                  <Sparkles size={11} className="text-cyan-400" />
                  <span>3</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-2.5 left-2.5 right-12 flex items-center text-[11px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="truncate font-medium drop-shadow-md">
                    {images[2].alt}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4 Images Layout - 2x2 Grid */}
        {count === 4 && (
          <div className="grid h-[340px] grid-cols-2 grid-rows-2 gap-1.5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-1 shadow-md sm:h-[400px]">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className="group relative h-full w-full cursor-zoom-in overflow-hidden rounded-xl bg-slate-900"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt || `Visual ${idx + 1}`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="truncate drop-shadow-md">{img.alt}</span>
                  <Maximize2 size={12} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5+ Images Layout - Bento with +N Overlay */}
        {count >= 5 && (
          <div className="grid h-[340px] grid-cols-2 gap-1.5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-1 shadow-md sm:h-[400px] md:h-[440px]">
            {/* Left tall */}
            <div
              onClick={() => openLightbox(0)}
              className="group relative h-full w-full cursor-zoom-in overflow-hidden rounded-xl bg-slate-900"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[0].src}
                alt={images[0].alt || "Visual 1"}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="truncate font-medium">{images[0].alt}</span>
                <Maximize2 size={12} />
              </div>
            </div>

            {/* Right stacked */}
            <div className="grid h-full grid-rows-2 gap-1.5">
              <div
                onClick={() => openLightbox(1)}
                className="group relative h-full w-full cursor-zoom-in overflow-hidden rounded-xl bg-slate-900"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[1].src}
                  alt={images[1].alt || "Visual 2"}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Bottom right with count overlay */}
              <div
                onClick={() => openLightbox(2)}
                className="group relative h-full w-full cursor-zoom-in overflow-hidden rounded-xl bg-slate-900"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[2].src}
                  alt={images[2].alt || "Visual 3"}
                  className="h-full w-full object-cover blur-[1px] transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 text-white backdrop-blur-xs">
                  <span className="text-2xl font-black tracking-tight">
                    +{count - 2}
                  </span>
                  <span className="text-[11px] font-medium text-slate-300">
                    Lihat Semua
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
          {/* Top Bar Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="rounded-full bg-slate-800/90 px-3 py-1 text-slate-200 font-semibold">
                {lightboxIndex + 1} / {images.length}
              </span>
              <span className="hidden sm:inline truncate max-w-md text-slate-300">
                {images[lightboxIndex].alt}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={images[lightboxIndex].src}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-slate-800/90 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-slate-700 hover:text-white"
                title="Buka gambar resolusi asli"
              >
                <ExternalLink size={13} />
                <span className="hidden sm:inline">Buka Asli</span>
              </a>
              <button
                type="button"
                onClick={closeLightbox}
                className="rounded-full bg-slate-800/90 p-2 text-slate-300 transition hover:bg-red-600 hover:text-white"
                title="Tutup (Esc)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/80 p-3 text-white transition hover:bg-blue-600 hover:scale-110"
              title="Sebelumnya (Panah Kiri)"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Main Image in Lightbox */}
          <div
            className="max-h-[85vh] max-w-[92vw] overflow-hidden rounded-2xl shadow-2xl flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain drop-shadow-2xl"
            />
            {images[lightboxIndex].alt && (
              <p className="mt-3 text-center text-xs text-slate-400 max-w-xl truncate">
                {images[lightboxIndex].alt}
              </p>
            )}
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/80 p-3 text-white transition hover:bg-blue-600 hover:scale-110"
              title="Selanjutnya (Panah Kanan)"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}
    </>
  );
}

interface PillBadgesProps {
  badges: string[];
}

export function PillBadges({ badges }: PillBadgesProps) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 my-3">
      {badges.map((badge, idx) => {
        const text = badge.trim();
        if (!text) return null;

        const isPhase = /^(Fase|Phase)\s+\d+/i.test(text);
        const isLevel = /(Intermediate|Advanced|Beginner|Level:)/i.test(text);

        let style =
          "bg-slate-100 text-slate-700 border-slate-200/80"; // neutral default

        if (isPhase) {
          // Emerald pill like ChatGPT screenshot
          style =
            "bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100/70";
        } else if (isLevel) {
          // Sky/blue pill like ChatGPT screenshot
          style =
            "bg-blue-50 text-blue-800 border-blue-200/80 hover:bg-blue-100/70";
        }

        return (
          <span
            key={idx}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border transition shadow-2xs ${style}`}
          >
            {isPhase && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            )}
            {isLevel && (
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
            )}
            {text}
          </span>
        );
      })}
    </div>
  );
}
