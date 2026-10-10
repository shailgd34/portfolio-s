'use client';

import { useEffect, useRef } from 'react';
import styles from './BackgroundVideo.module.css';

export default function BackgroundVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');

      const startPlayback = () => {
        const promise = video.play();
        if (promise !== undefined) {
          promise.catch(() => {
            // If browser blocks immediate autoplay before user interaction:
            const onUserInteraction = () => {
              video.play().catch(() => {});
              window.removeEventListener('scroll', onUserInteraction);
              window.removeEventListener('click', onUserInteraction);
              window.removeEventListener('touchstart', onUserInteraction);
            };
            window.addEventListener('scroll', onUserInteraction, { once: true, passive: true });
            window.addEventListener('click', onUserInteraction, { once: true });
            window.addEventListener('touchstart', onUserInteraction, { once: true, passive: true });
          });
        }
      };

      startPlayback();
    }
  }, []);

  return (
    <div className={styles.videoContainer} aria-hidden="true">
      <video
        ref={videoRef}
        className={styles.videoElement}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/glitch-effect-12.mp4" type="video/mp4" />
        <source src="/noise.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
