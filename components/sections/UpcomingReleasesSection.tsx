"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface UpcomingRelease {
  id: string;
  name: string;
  type: "single" | "ep" | "album";
  image: string;
  releaseDate: string;
  preSmartLinkUrl?: string | null;
  primaryArtist?: string | null;
  featureArtist?: string | null;
}

const UpcomingReleasesSection = () => {
  const [releases, setReleases] = useState<UpcomingRelease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await fetch("/api/upcoming-releases");
        if (response.ok) {
          const data = await response.json();
          setReleases(data);
        }
      } catch (error) {
        console.error("Error fetching upcoming releases:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReleases();
  }, []);

  if (loading) {
    return (
      <section className="px-4 sm:px-6 md:px-[10%] w-full mx-auto py-14 sm:py-20 md:py-24">
        <p className="text-3xl sm:text-4xl md:text-5xl tracking-tighter">Upcoming Releases</p>
        <p className="text-gray-400 mt-4">Loading upcoming releases...</p>
      </section>
    );
  }

  if (releases.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 md:px-[10%] w-full mx-auto py-14 sm:py-20 md:py-24">
      <p className="text-3xl sm:text-4xl md:text-5xl tracking-tighter">Upcoming Releases</p>
      <p className="text-muted-foreground mt-3">Stay tuned for what is dropping next.</p>

      <div className="mt-8 flex flex-wrap items-stretch gap-5">
        {releases.map((release) => {
          const href = release.preSmartLinkUrl?.trim();
          const shellClass =
            "flex w-72 min-w-0 flex-col rounded-2xl border border-gray-800 bg-[#0F0F0F] transition-opacity hover:opacity-95";
          const inner = (
            <>
              <div className="flex h-52 w-full shrink-0 items-center justify-center overflow-hidden rounded-t-2xl bg-black/50">
                <img
                  src={release.image}
                  alt={release.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-1.5 rounded-b-2xl p-4">
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  {release.type}
                </p>
                <p className="text-lg leading-snug break-words hyphens-auto">
                  {release.name}
                </p>
                {(release.primaryArtist?.trim() || release.featureArtist?.trim()) && (
                  <p className="text-sm leading-snug text-gray-300 break-words hyphens-auto">
                    {release.primaryArtist?.trim() ? (
                      <span>{release.primaryArtist?.trim()}</span>
                    ) : null}
                    {release.primaryArtist?.trim() && release.featureArtist?.trim() ? (
                      <span className="text-gray-500"> · </span>
                    ) : null}
                    {release.featureArtist?.trim() ? (
                      <span className="text-gray-400">feat. {release.featureArtist?.trim()}</span>
                    ) : null}
                  </p>
                )}
                <p className="text-sm leading-snug text-gray-400 break-words">
                  Releases on {new Date(release.releaseDate).toLocaleDateString()}
                </p>
                {href ? (
                  <p className="mt-1 text-xs leading-snug font-medium break-all text-white/70">
                    Pre-save →
                  </p>
                ) : null}
              </div>
            </>
          );
          return href ? (
            <a
              key={release.id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(shellClass, "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40")}
            >
              {inner}
            </a>
          ) : (
            <div key={release.id} className={shellClass}>
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default UpcomingReleasesSection;
