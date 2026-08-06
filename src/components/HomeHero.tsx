/** Abstract focus graphic — calm fairway geometry, not literal clip art. */
export function HomeHero() {
  return (
    <div className="home-hero" aria-hidden="true">
      <svg viewBox="0 0 320 160" className="home-hero__svg">
        <defs>
          <linearGradient id="heroGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B4332" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#C4B59A" stopOpacity="0.28" />
          </linearGradient>
        </defs>
        <rect width="320" height="160" rx="28" fill="url(#heroGlow)" />
        <circle
          cx="168"
          cy="82"
          r="54"
          fill="none"
          stroke="#1B4332"
          strokeOpacity="0.18"
          strokeWidth="1.5"
        />
        <circle
          cx="168"
          cy="82"
          r="34"
          fill="none"
          stroke="#1B4332"
          strokeOpacity="0.28"
          strokeWidth="1.5"
        />
        <circle cx="168" cy="82" r="8" fill="#1B4332" fillOpacity="0.85" />
        <path
          d="M48 118 C110 72, 190 52, 278 64"
          fill="none"
          stroke="#C4B59A"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M62 128 C120 90, 200 74, 268 86"
          fill="none"
          stroke="#1B4332"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.25"
        />
      </svg>
    </div>
  )
}
