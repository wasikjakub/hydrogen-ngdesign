/**
 * Sliding Logos Section Component
 * Displays sliding logos with configurable title
 * @param {Object} logos - Array of logo objects from Shopify Metaobjects
 * @param {string} title - Section title (e.g., "Mentioned in:" or "Partners")
 * @param {boolean} reverse - If true, logos slide in reverse direction
 */
export function SlidingLogos({logos, title, reverse = false}) {
  if (!logos || logos.length === 0) {
    return null; // Don't render if no logos
  }

  // Duplikujemy loga wielokrotnie dla płynnej animacji bez przerw
  const duplicateCount = 8; // Zwiększona ilość kopii dla płynniejszego resetu
  const duplicatedLogos = Array(duplicateCount).fill(logos).flat();

  return (
    <section className="sliding-logos-section">
      <div className="sliding-logos-container">
        <h2 className="sliding-logos-title">{title}</h2>
        <div className="sliding-logos-track">
          <div className={reverse ? "sliding-logos-wrapper-reverse" : "sliding-logos-wrapper"}>
            {duplicatedLogos.map((logo, index) => (
              <div key={`${logo.id || logo.title}-copy-${index}`} className="sliding-logo-item">
                {logo.image && (
                  <img
                    src={logo.image.url}
                    alt={logo.title || logo.image.altText || 'Company logo'}
                    className="sliding-logo-image"
                    loading="eager"
                    decoding="async"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Combined Component for "Mentioned in:" and "Partners" sections
 * @param {Object} mentionedLogos - Logos for "Mentioned in:" section
 * @param {Object} partnerLogos - Logos for "Partners" section
 */
export function CompanyLogos({mentionedLogos, partnerLogos}) {
  return (
    <>
      {mentionedLogos && mentionedLogos.length > 0 && (
        <SlidingLogos logos={mentionedLogos} title="Mentioned in:" reverse={false} />
      )}
      {partnerLogos && partnerLogos.length > 0 && (
        <SlidingLogos logos={partnerLogos} title="Partners:" reverse={true} />
      )}
    </>
  );
}