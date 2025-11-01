import {useLoaderData, Link} from 'react-router';

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context}) {
  const [{products}] = await Promise.all([
    context.storefront.query(ALL_PRODUCTS_QUERY, {
      variables: {
        first: 250, // Załaduj wszystkie produkty naraz (do 250)
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {products};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData() {
  return {};
}

export default function Collections() {
  /** @type {LoaderReturnData} */
  const {products} = useLoaderData();

  return (
    <div className="shop-page">
      <div className="shop-products-grid">
        {products.edges.map(({node: product}, index) => (
          <ProductGridItem
            key={product.id}
            product={product}
            loading={index < 6 ? 'eager' : undefined}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * @param {{
 *   product: ProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
function ProductGridItem({product, loading}) {
  const firstImage = product.images.edges[0]?.node;
  const secondImage = product.images.edges[1]?.node;
  
  // Get color variants from product options
  const colorOption = product.options.find(opt => 
    opt.name.toLowerCase() === 'color' || 
    opt.name.toLowerCase() === 'kolor' ||
    opt.name.toLowerCase() === 'colour'
  );

  return (
    <div className="shop-product-item">
      <Link
        to={`/products/${product.handle}`}
        prefetch="intent"
        className="shop-product-link"
      >
        <div className="shop-product-image-wrapper">
          {firstImage && (
            <img
              src={firstImage.url}
              alt={firstImage.altText || product.title}
              className="shop-product-image shop-product-image-primary"
              loading={loading}
            />
          )}
          {secondImage && (
            <img
              src={secondImage.url}
              alt={secondImage.altText || product.title}
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
                  className="color-swatch"
                  style={{backgroundColor: color.toLowerCase()}}
                  title={color}
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
            {parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)} {product.priceRange.minVariantPrice.currencyCode}
          </p>
          {/* Add to cart button */}
          <button className="shop-add-to-cart">DO KOSZYKA</button>
        </div>
      </div>
    </div>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  fragment ProductGridItem on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      name
      values
    }
    images(first: 2) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int!
  ) @inContext(country: $country, language: $language) {
    products(first: $first) {
      edges {
        node {
          ...ProductGridItem
        }
      }
    }
  }
`;

/** @typedef {import('./+types/collections._index').Route} Route */
/** @typedef {import('storefrontapi.generated').ProductGridItemFragment} ProductFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
