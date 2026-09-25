import React, { useEffect, useRef } from 'react';

const neuralVideo = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104303_0c6d60b2-9353-408e-9449-585108a22fb5.mp4';
const neuralPoster = 'https://d2ol7oe51mr4n9cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/130837c4-0244-4f37-9c61-8d801d93fd29.jpg';

export const PlanetaryAtmosphere: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!video || !media) return;
    const sync = () => {
      if (media.matches) video.pause();
      else video.play().catch(() => undefined);
    };
    sync();
    media.addEventListener?.('change', sync);
    return () => media.removeEventListener?.('change', sync);
  }, []);

  return (
    <div className="planetary-atmosphere" aria-hidden="true">
      <video ref={videoRef} className="planetary-atmosphere-video" autoPlay muted loop playsInline preload="auto" poster={neuralPoster} src={neuralVideo} />
      <div className="planetary-atmosphere-veil" />
      <div className="planetary-orbit-grid">
        <i /><i /><i /><i />
        <b className="planetary-orbit-core">BUSINESS&nbsp;OS</b>
      </div>
      <div className="planetary-edge-readout planetary-edge-readout-left">
        <span>PLANETARY FIELD</span><strong>LIVE / 3D / CONTINUOUS</strong>
      </div>
      <div className="planetary-edge-readout planetary-edge-readout-right">
        <span>DIGITAL TWIN</span><strong>1,482 NODES · L1—L5</strong>
      </div>
    </div>
  );
};
