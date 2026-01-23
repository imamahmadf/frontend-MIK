"use client";

interface VideoSectionProps {
  // Untuk video tunggal: gunakan videoId
  videoId?: string;
  // Untuk playlist: gunakan playlistId
  playlistId?: string;
  // Untuk beberapa video individual: gunakan array videoIds
  videoIds?: string[];
  title?: string;
  description?: string;
}

export default function VideoSection({
  videoId = "JCg7fytT_Hc",
  playlistId,
  videoIds,
  title = "Video Profil",
  description = "Saksikan perjalanan dan kontribusi dalam sektor energi dan pengembangan berkelanjutan Indonesia",
}: VideoSectionProps) {
  // Fungsi untuk generate URL embed
  const getEmbedUrl = () => {
    // Jika ada playlistId, gunakan playlist
    if (playlistId) {
      return `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
    }
    // Default: video tunggal
    return `https://www.youtube.com/embed/${videoId}`;
  };

  // Jika ada multiple videoIds, tampilkan dalam grid
  if (videoIds && videoIds.length > 1 && !playlistId) {
    return (
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          {/* Grid untuk multiple videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoIds.map((id, index) => (
              <div
                key={index}
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-xl hover:shadow-2xl transition-shadow"
                  src={`https://www.youtube.com/embed/${id}`}
                  title={`YouTube video player ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ border: 0 }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Single video atau playlist
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-2xl"
            src={getEmbedUrl()}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ border: 0 }}
          />
        </div>
      </div>
    </section>
  );
}

