export default function MapEmbed({ className = '' }: { className?: string }) {
  // Using OpenStreetMap embed — no API key, no iframe policy blocks, always reliable.
  // Coordinates: 17.5918° N, 78.3873° E — MLR Institute of Technology, Dundigal.
  return (
    <div className={`rounded-2xl overflow-hidden border border-border shadow-card-soft ${className}`}>
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=78.3823%2C17.5868%2C78.3923%2C17.5968&layer=mapnik&marker=17.5918%2C78.3873"
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
