import React from 'react';

/**
 * ProductMaterialBlock
 * Renders a material section for a product.
 * @param {Object} props
 * @param {string} [props.material] - Material string or HTML
 */
export default function ProductMaterialBlock({material}) {
  if (!material) return null;
  return (
    <div className="product-material-block">
      <div className="product-material-label">Materiał:</div>
      <div className="product-material-value">{material}</div>
    </div>
  );
}
