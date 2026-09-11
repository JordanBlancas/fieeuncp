'use client';

import { useEffect, useRef } from 'react';

const videoSource = '/api/video';
const videoPoster = 'https://drive.google.com/thumbnail?id=12S9lMxww4VVE4welFqDN01xeLQTRrIqy&sz=w1600';

export function FacultyVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startPreload = () => {
      const video = videoRef.current;
      if (!video) return;
      video.preload = 'auto';
      video.load();
    };

    const schedulePreload = () => window.setTimeout(startPreload, 1500);
    if (document.readyState === 'complete') {
      schedulePreload();
    } else {
      window.addEventListener('load', schedulePreload, { once: true });
    }

    return () => window.removeEventListener('load', schedulePreload);
  }, []);

  return (
    <video
      ref={videoRef}
      src={videoSource}
      poster={videoPoster}
      title="Video de la Facultad de Ingeniería Eléctrica"
      className="h-full w-full object-contain"
      controls
      controlsList="nodownload noplaybackrate"
      preload="metadata"
      playsInline
    />
  );
}
