import {Await, useLoaderData, Link} from 'react-router';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';
import {FeaturedProducts} from '~/components/FeaturedProducts';
import {CompanyLogos} from '~/components/SlidingLogos';
import {FEATURED_PRODUCTS_QUERY, COMPANY_LOGOS_QUERY} from '~/lib/fragments';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

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
  const [{collections}, {products: featuredProducts}, companyLogos] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(FEATURED_PRODUCTS_QUERY),
    context.storefront.query(COMPANY_LOGOS_QUERY, {
      variables: {
        mentionedHandle: 'mentioned-logos-rrrsubfh',
        partnerHandle: 'partner-logos-fccgdtgo', // Zmień na prawdziwy handle z Shopify
      },
    }).catch(() => ({mentionedLogos: null, partnerLogos: null})),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
    featuredProducts: featuredProducts.nodes,
    companyLogos,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  
  // Hero image URL from Shopify Files
  const heroImageUrl = 'https://cdn.shopify.com/s/files/1/0784/6769/4845/files/01.png?v=1761929735';
  
  // Process company logos data
  // Each metaobject has multiple fields, each field is a logo
  const processLogos = (metaobject) => {
    if (!metaobject?.fields) return [];
    
    // Filter only fields that have MediaImage references
    return metaobject.fields
      .filter(field => field.reference?.__typename === 'MediaImage')
      .map(field => ({
        id: field.reference.id,
        image: field.reference.image,
        title: field.key, // Use field key as title (e.g., "vogue", "ad", "beta")
      }));
  };

  const mentionedLogos = processLogos(data.companyLogos?.mentionedLogos);
  const partnerLogos = processLogos(data.companyLogos?.partnerLogos);
  
  // Temporary mock data for testing if no real data exists
  const mockLogos = [
    {
      id: 'mock-1',
      image: {
        url: 'https://via.placeholder.com/150x60/000000/FFFFFF?text=Logo+1',
        altText: 'Test Logo 1',
        width: 150,
        height: 60
      },
      title: 'Test Company 1'
    },
    {
      id: 'mock-2', 
      image: {
        url: 'https://via.placeholder.com/150x60/000000/FFFFFF?text=Logo+2',
        altText: 'Test Logo 2',
        width: 150,
        height: 60
      },
      title: 'Test Company 2'
    },
    {
      id: 'mock-3',
      image: {
        url: 'https://via.placeholder.com/150x60/000000/FFFFFF?text=Logo+3', 
        altText: 'Test Logo 3',
        width: 150,
        height: 60
      },
      title: 'Test Company 3'
    },
    {
      id: 'mock-4',
      image: {
        url: 'https://via.placeholder.com/150x60/000000/FFFFFF?text=Logo+4', 
        altText: 'Test Logo 4',
        width: 150,
        height: 60
      },
      title: 'Test Company 4'
    }
  ];

  // Use mock data if no real data exists
  const finalMentionedLogos = mentionedLogos.length > 0 ? mentionedLogos : mockLogos;
  const finalPartnerLogos = partnerLogos.length > 0 ? partnerLogos : mockLogos;
  
  return (
    <div className="home">
      <HeroSection imageUrl={heroImageUrl} />
      <FeaturedProducts products={data.featuredProducts} />
      <CompanyLogos mentionedLogos={finalMentionedLogos} partnerLogos={finalPartnerLogos} />
      {/* Featured collection removed to show hero image */}
      {/* <RecommendedProducts products={data.recommendedProducts} /> */}
    </div>
  );
}

/**
 * @param {{
 *   imageUrl: string;
 * }}
 */
function HeroSection({imageUrl}) {
  if (!imageUrl) return null;
  return (
    <div className="hero-section">
      <img src={imageUrl} alt="Hero" />
    </div>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery | null>;
 * }}
 */
function RecommendedProducts({products}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
