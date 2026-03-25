"use client";
import React, { useEffect, useState } from "react";

interface UpcomingRelease {
  id: string;
  name: string;
  type: "single" | "ep" | "album";
  image: string;
  releaseDate: string;
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {releases.map((release) => (
          <div key={release.id} className="bg-[#0F0F0F] rounded-xl overflow-hidden border border-gray-800">
            <img src={release.image} alt={release.name} className="w-full h-52 object-cover" />
            <div className="p-4">
              <p className="text-xs uppercase tracking-wider text-gray-400">{release.type}</p>
              <p className="text-lg mt-1">{release.name}</p>
              <p className="text-sm text-gray-400 mt-2">
                Releases on {new Date(release.releaseDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UpcomingReleasesSection;
