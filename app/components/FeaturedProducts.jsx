import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';

/**
 * Featured Products Section Component
 * Displays 3 products: 1 large on right, 2 stacked on left
 * @param {Object} products - Array of 3 products from Shopify
 */
export function FeaturedProducts({products}) {
  if (!products || products.length < 3) {
    return null; // Don't render if we don't have enough products
  }

  const [leftProduct1, leftProduct2, rightProduct] = products;

  return (
    <section className="featured-products-section">
      <div className="featured-products-container">
        <div className="featured-products-grid">
          {/* Left side - 2 products stacked */}
          <div className="left-products">
            <ProductCard product={leftProduct1} />
            <ProductCard product={leftProduct2} />
          </div>
          
          {/* Right side - 1 large product */}
          <div className="right-product">
            <ProductCard product={rightProduct} isLarge={true} />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Individual Product Card Component
 */
function ProductCard({product, isLarge = false}) {
  const firstVariant = product.variants?.nodes?.[0];
  const image = product.featuredImage;

  return (
    <Link 
      to={`/products/${product.handle}`}
      className={`product-card ${isLarge ? 'product-card-large' : ''}`}
    >
      <div className="product-image-container">
        {image && (
          <Image
            data={image}
            alt={product.title}
            className="product-image"
            sizes={isLarge ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
          />
        )}
        
        {/* Hover overlay with product info */}
        <div className="product-overlay">
          <div className="product-info">
            <h3 className="product-title">{product.title}</h3>
            {firstVariant?.price && (
              <div className="product-price">
                <Money data={firstVariant.price} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}