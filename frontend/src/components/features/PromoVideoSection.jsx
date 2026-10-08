import React from 'react';

// Helper to extract embed url from YouTube, Vimeo, or direct video
export const getEmbedVideoInfo = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const url = rawUrl.trim();
  if (!url) return null;

  // 1. YouTube
  // Standard: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  // Short: https://youtu.be/dQw4w9WgXcQ
  // Shorts: https://www.youtube.com/shorts/dQw4w9WgXcQ
  // Embed: https://www.youtube.com/embed/dQw4w9WgXcQ
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1`,
      id: ytMatch[1],
    };
  }

  // 2. Vimeo
  // https://vimeo.com/123456789
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/i;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      id: vimeoMatch[1],
    };
  }

  // 3. Direct HTML5 Video (.mp4, .webm, .ogg)
  const isDirectVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
  if (isDirectVideo) {
    return {
      type: 'direct',
      videoUrl: url,
    };
  }

  // 4. If user already entered an iframe/embed URL
  if (url.includes('embed') || url.startsWith('http')) {
    return {
      type: 'generic_embed',
      embedUrl: url,
    };
  }

  return null;
};

const PromoVideoSection = ({
  videoUrl,
  title,
  titleEs,
  lang = 'es',
  className = '',
}) => {
  const videoInfo = getEmbedVideoInfo(videoUrl);
  if (!videoInfo) return null;

  const displayTitle = lang === 'es' && titleEs ? titleEs : (title || (lang === 'es' ? 'Video Oficial // Proyecto Tuning' : 'Official Video // Build Reveal'));

  return (
    <div className={`w-full py-8 md:py-12 bg-black/80 relative overflow-hidden border-y border-white/5 ${className}`}>
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
        {/* Header Badge & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-2 w-2 bg-primary rounded-full animate-ping" />
            <span className="text-[10px] sm:text-xs font-mono text-primary font-bold uppercase tracking-[0.25em]">
              [ BORDERBUILT // OFFICIAL MEDIA ]
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black italic uppercase tracking-wider text-white">
            {displayTitle}
          </h2>
        </div>

        {/* Video Player Card Container */}
        <div className="w-full relative group">
          {/* Subtle Outer Neon Border Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-emerald-500/20 to-primary/30 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition-opacity duration-700 -z-10" />

          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/15 shadow-2xl group-hover:border-primary/50 transition-colors">
            {videoInfo.type === 'direct' ? (
              <video
                src={videoInfo.videoUrl}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            ) : (
              <iframe
                src={videoInfo.embedUrl}
                title={displayTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoVideoSection;
