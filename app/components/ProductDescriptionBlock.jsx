import React from 'react';

/**
 * ProductDescriptionBlock
 * Renders a product description block with semantic structure and styling.
 * @param {Object} props
 * @param {string} [props.html] - HTML string for the product description (from Shopify or static file)
 */
export default function ProductDescriptionBlock({html}) {
  if (!html) return null;
  return (
    <div className="product-description-block" dangerouslySetInnerHTML={{__html: html}} />
  );
}
