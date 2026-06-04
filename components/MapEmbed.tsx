export default function MapEmbed({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl overflow-hidden border border-border shadow-card-soft ${className}`}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3804.3836!2d78.38568!3d17.59185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91b48d0f3e9d%3A0x6e7e7c3b2d4f1a5c!2sMLR%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin"
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
