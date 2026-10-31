export default function MapEmbed({ className = '' }: { className?: string }) {
  // Google's keyless place embed labels the pin "MLR Institute of Technology".
  // OpenStreetMap has the grounds at 17.5944451° N, 78.4411892° E but names them
  // "Marri Laxman Reddy Institute of Technology", so an OSM marker reads as blank.
  return (
    <div className={`rounded-2xl overflow-hidden border border-border shadow-card-soft ${className}`}>
      <iframe
        src="https://www.google.com/maps?q=MLR+Institute+of+Technology+Dundigal+Hyderabad&z=16&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '320px', display: 'block' }}
        allowFullScreen
        loading="lazy"
        title="MLR Institute of Technology — Dundigal, Hyderabad"
      />
    </div>
  );
}
