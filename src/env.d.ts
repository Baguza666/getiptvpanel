/// <reference types="astro/client" />

interface Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
  getIptvTrack?: (eventName: string, properties?: Record<string, string | undefined>) => void;
}
