import {useState} from 'react';
import {Link} from 'react-router';

/**
 * @param {{
 *   product: any;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductGridItem({product, loading}) {
  const [selectedColor, setSelectedColor] = useState(null);
  const images = product.images?.edges || product.images || [];
  const firstImage = images[0]?.node || images[0];
  const secondImage = images[1]?.node || images[1];

  // Get color variants from product options
  const options = Array.isArray(product.options) ? product.options : [];
  const colorOption = options.find(opt =>
    opt.name && (
      opt.name.toLowerCase() === 'color' ||
      opt.name.toLowerCase() === 'kolor' ||
      opt.name.toLowerCase() === 'colour'
    )
  );

  // Get variants for color-based image switching
  const variants = Array.isArray(product.variants?.edges) ? product.variants.edges : [];

  // Find the current image to display based on selected color
  const getCurrentImages = () => {
    // Always use second image from product.images as secondary (for hover)
    const secondary = secondImage;
    if (!selectedColor || variants.length === 0) {
      return { primary: firstImage, secondary };
    }
    // Find variant matching selected color
    const matchingVariant = variants.find(({node}) =>
      node.selectedOptions?.some(opt =>
        (opt.name.toLowerCase() === 'color' ||
         opt.name.toLowerCase() === 'kolor') &&
        opt.value.toLowerCase() === selectedColor.toLowerCase()
      )
    );
    if (matchingVariant?.node.image) {
      return {
        primary: matchingVariant.node.image,
        secondary
      };
    }
    return { primary: firstImage, secondary };
  };

  const currentImages = getCurrentImages();

  return (
    <div className="shop-product-item">
      <Link
        to={`/products/${product.handle}`}
        prefetch="intent"
        className="shop-product-link"
      >
        <div className="shop-product-image-wrapper">
          {currentImages.primary && (
            <img
              src={currentImages.primary.url}
              alt={currentImages.primary.altText || product.title}
              className="shop-product-image shop-product-image-primary"
              loading={loading}
            />
          )}
          {currentImages.secondary && (
            <img
              src={currentImages.secondary.url}
              alt={currentImages.secondary.altText || product.title}
              className="shop-product-image shop-product-image-secondary"
              loading="lazy"
            />
          )}
        </div>
      </Link>
      <div className="shop-product-details">
        <div className="shop-product-left">
          {/* Color variants */}
          {colorOption && colorOption.values.length > 0 && (
            <div className="shop-product-colors">
              {colorOption.values.map((color) => (
                <div
                  key={color}
                  className={`color-swatch ${selectedColor === color ? 'color-swatch-active' : ''}`}
                  style={{backgroundColor: color.toLowerCase()}}
                  title={color}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColor(color);
                  }}
                />
              ))}
            </div>
          )}
          {/* Product title */}
          <Link to={`/products/${product.handle}`} className="shop-product-title-link">
            <h3 className="shop-product-title">{product.title}</h3>
          </Link>
        </div>
        <div className="shop-product-right">
          {/* Price */}
          <p className="shop-product-price">
            {parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
            {product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount && (
              <> - {parseFloat(product.priceRange.maxVariantPrice.amount).toFixed(2)}</>
            )}
            {' '}{product.priceRange.minVariantPrice.currencyCode}
          </p>
          {/* Add to cart button */}
          <button className="shop-add-to-cart">DO KOSZYKA</button>
        </div>
      </div>
    </div>
  );
}
