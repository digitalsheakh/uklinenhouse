"use client";

import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Loader2, ChevronLeft, ChevronRight, Download, BookOpen } from "lucide-react";

type Dims = { w: number; h: number };

export default function BrochureFlipbook({ url }: { url: string }) {
  const [pages, setPages] = useState<string[]>([]);
  const [dims, setDims] = useState<Dims | null>(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  // react-pageflip forwards a ref exposing pageFlip().
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const doc = await pdfjs.getDocument({ url }).promise;
        if (cancelled) return;
        setProgress({ done: 0, total: doc.numPages });

        const imgs: string[] = [];
        for (let i = 1; i <= doc.numPages; i++) {
          if (cancelled) return;
          const pdfPage = await doc.getPage(i);
          const viewport = pdfPage.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await pdfPage.render({ canvasContext: ctx, viewport, canvas }).promise;

          if (i === 1) {
            const base = 540;
            setDims({ w: base, h: Math.round((base * canvas.height) / canvas.width) });
          }
          imgs.push(canvas.toDataURL("image/jpeg", 0.85));
          if (!cancelled) setProgress({ done: i, total: doc.numPages });
        }
        if (!cancelled) setPages(imgs);
      } catch (e) {
        if (!cancelled) setError((e as Error).message || "Could not load the brochure.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [url]);

  const flip = (dir: -1 | 1) => {
    const pf = bookRef.current?.pageFlip?.();
    if (!pf) return;
    dir === 1 ? pf.flipNext() : pf.flipPrev();
  };

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-grey-200 bg-white p-8 text-center">
        <BookOpen size={36} className="mx-auto text-grey-300" />
        <p className="mt-3 text-sm font-medium text-foreground">We couldn&apos;t open the brochure here.</p>
        <p className="mt-1 text-xs text-grey-500">{error}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Download size={16} /> Open the PDF
        </a>
      </div>
    );
  }

  if (!dims || pages.length === 0) {
    const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
    return (
      <div className="flex flex-col items-center justify-center py-24 text-grey-500">
        <Loader2 size={32} className="animate-spin" />
        <p className="mt-4 text-sm font-medium">Preparing your brochure…</p>
        {progress.total > 0 && (
          <div className="mt-3 h-1.5 w-48 overflow-hidden rounded-full bg-grey-200">
            <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="brochure-book-wrap w-full">
        {/* @ts-expect-error react-pageflip's types don't include className/children cleanly */}
        <HTMLFlipBook
          ref={bookRef}
          width={dims.w}
          height={dims.h}
          size="stretch"
          minWidth={300}
          maxWidth={640}
          minHeight={420}
          maxHeight={900}
          drawShadow
          maxShadowOpacity={0.5}
          showCover
          mobileScrollSupport
          flippingTime={700}
          className="mx-auto"
          onFlip={(e: { data: number }) => setPage(e.data)}
        >
          {pages.map((src, i) => (
            <div key={i} className="overflow-hidden bg-white shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Brochure page ${i + 1}`} className="h-full w-full object-contain" />
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={() => flip(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-grey-200 bg-white text-foreground shadow-sm transition hover:bg-grey-50"
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="min-w-[5.5rem] text-center text-sm font-medium text-grey-600">
          Page {Math.min(page + 1, pages.length)} / {pages.length}
        </span>
        <button
          onClick={() => flip(1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-grey-200 bg-white text-foreground shadow-sm transition hover:bg-grey-50"
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <p className="mt-3 text-xs text-grey-400">Tip: drag a page corner or use the arrows to turn pages.</p>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
      >
        <Download size={15} /> Download the PDF
      </a>
    </div>
  );
}
