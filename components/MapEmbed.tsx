export default function MapEmbed({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl overflow-hidden border border-border shadow-card-soft ${className}`}>
      <iframe
        src="https://maps.google.com/maps?q=MLR+Institute+of+Technology+Dundigal+Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '320px', display: 'block' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="MLR Institute of Technology — Dundigal, Hyderabad"
      />
    </div>
  );
}
