/**
 * ProductDescription component
 * Parses and styles product description sections
 */
export function ProductDescription({descriptionHtml, language = 'EN', sections = ['opis', 'material', 'wymiary', 'kolor', 'personalizacja', 'uwagi']}) {
  const parsedSections = parseProductDescription(descriptionHtml, language);
  
  return (
    <div className="product-description">
      {sections.includes('opis') && parsedSections.opis.length > 0 && (
        <div className="product-description-section product-description-opis">
          {parsedSections.opis.map((html, index) => (
            <p key={`opis-${index}`} dangerouslySetInnerHTML={{__html: html}} />
          ))}
        </div>
      )}
      
      {sections.includes('material') && parsedSections.material.length > 0 && (
        <div className="product-description-section product-description-material">
          {parsedSections.material.map((html, index) => (
            <p key={`material-${index}`} dangerouslySetInnerHTML={{__html: html}} />
          ))}
        </div>
      )}
      
      {sections.includes('wymiary') && parsedSections.wymiary.length > 0 && (
        <div className="product-description-section product-description-wymiary">
          {parsedSections.wymiary.map((html, index) => (
            <p key={`wymiary-${index}`} dangerouslySetInnerHTML={{__html: html}} />
          ))}
        </div>
      )}
      
      {sections.includes('kolor') && parsedSections.kolor.length > 0 && (
        <div className="product-description-section product-description-kolor">
          {parsedSections.kolor.map((html, index) => (
            <p key={`kolor-${index}`} dangerouslySetInnerHTML={{__html: html}} />
          ))}
        </div>
      )}
      
      {sections.includes('personalizacja') && parsedSections.personalizacja.length > 0 && (
        <div className="product-description-section product-description-personalizacja">
          {parsedSections.personalizacja.map((html, index) => (
            <p key={`personalizacja-${index}`} dangerouslySetInnerHTML={{__html: html}} />
          ))}
        </div>
      )}
      
      {sections.includes('uwagi') && parsedSections.uwagi.length > 0 && (
        <div className="product-description-section product-description-uwagi">
          {parsedSections.uwagi.map((html, index) => (
            <p key={`uwagi-${index}`} dangerouslySetInnerHTML={{__html: html}} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Parse product description HTML and return sections
 */
export function parseProductDescription(descriptionHtml, language = 'EN') {
  const sections = {
    opis: [],
    material: [],
    wymiary: [],
    kolor: [],
    personalizacja: [],
    uwagi: []
  };
  
  // Define keywords based on language
  const keywords = language === 'PL' ? {
    material: /^Materiał:\s*$/i,
    wymiary: /^Wymiary:\s*$/i,
    kolor: /^Kolor:\s*$/i,
    personalizacja: /^Personalizacja:\s*$/i,
    uwagi: /^Uwagi:\s*$/i,
  } : {
    material: /^Material:\s*$/i,
    wymiary: /^Dimensions:\s*$/i,
    kolor: /^Color:\s*$/i,
    personalizacja: /^(Personalization|Customization):\s*$/i,
    uwagi: /^(Notes|Remarks):\s*$/i,
  };
  
  // Clean the HTML and split into lines/paragraphs
  let cleanHtml = descriptionHtml.replace(/<br\s*\/?>/gi, '\n');
  // Split by paragraph tags and filter truly empty ones
  const paragraphs = cleanHtml.split(/<\/?p[^>]*>/gi)
    .map(p => p.trim())
    .filter(p => p && p.replace(/&nbsp;/g, '').trim());
  
  let currentSection = 'opis';
  
  paragraphs.forEach((content) => {
    // Get text without HTML tags for matching
    const text = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    
    if (!text) return;
    
    // Check if this line is ONLY a section header (with colon and nothing after)
    if (text.match(keywords.material)) {
      currentSection = 'material';
      return; // Don't add the header itself
    } else if (text.match(keywords.wymiary)) {
      currentSection = 'wymiary';
      return;
    } else if (text.match(keywords.kolor)) {
      currentSection = 'kolor';
      return;
    } else if (text.match(keywords.personalizacja)) {
      currentSection = 'personalizacja';
      return;
    } else if (text.match(keywords.uwagi)) {
      currentSection = 'uwagi';
      return;
    }
    
    // Add content to current section
    sections[currentSection].push(content);
  });
  
  return sections;
}
