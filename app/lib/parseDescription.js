// Parses a Shopify product description into sections for consistent rendering
// Accepts plain text or HTML (strips tags for parsing)

export function parseDescription(description) {
  const sections = {};
  if (!description) return sections;

  // 1. Extract paragraphs before the first <div class="product-description-material"> or <div class="product-description-details">
  //    as the "Opis" section (general description)
  let opis = '';
  const opisMatch = description.match(/<div class="product-description">([\s\S]*?)(<div class="product-description-material"|<div class="product-description-details"|<div class=|$)/i);
  if (opisMatch) {
    // Remove all tags except <p>
    opis = opisMatch[1]
      .replace(/<[^p][^>]*>/gi, '')
      .replace(/<p>/gi, '')
      .replace(/<\/p>/gi, '\n')
      .replace(/\n+/g, '\n')
      .trim();
    if (opis) sections["Opis"] = opis;
  }

  // 2. Extract all <span class="label">X:</span> <span class="value">Y</span> pairs
  //    from the HTML, including those inside nested divs
  const labelValueRegex = /<span class="label">\s*([^<:]+):\s*<\/span>\s*<span class="value">([\s\S]*?)<\/span>/gi;
  let match;
  while ((match = labelValueRegex.exec(description)) !== null) {
    const key = match[1].trim();
    // Replace <br> with newlines and trim
    const value = match[2].replace(/<br\s*\/?>(\s*)/gi, '\n').replace(/\s+/g, ' ').trim();
    sections[key] = value;
  }

  return sections;
}
