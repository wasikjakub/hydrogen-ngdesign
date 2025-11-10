import {useLoaderData} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
// import {ProductDescription} from '~/components/ProductDescription';
import {AddToCartSection} from '~/components/AddToCartSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {parseDescription} from '~/lib/parseDescription';
import '~/styles/ProductSection.css';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
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
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData() {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product} = useLoaderData();
  // const rootData = useRouteLoaderData('root');
  // const language = rootData?.selectedLocale?.language || 'EN';

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;
  // Parse description into sections
  const descriptionSections = parseDescription(descriptionHtml);

  // Get all media images for the gallery, excluding the main variant image
  const galleryImages = product.media?.nodes?.filter(
    (media) => media.image?.url !== selectedVariant?.image?.url
  ) || [];

  return (
    <>
      <div className="product">
        <ProductImage image={selectedVariant?.image} />
        <div className="product-main">
          <div className="product-top-section">
            <h1>{title}</h1>
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
            {/* Opis (description) section directly under price */}
            {descriptionSections["Opis"] && (
              <div className="product-section product-section-opis">
                <p>{descriptionSections["Opis"]}</p>
                {descriptionSections["Materiał"] && (
                  <div className="opis-material-block">
                    <span className="opis-material-label">Materiał:</span>
                    <br />
                    <span className="opis-material-value">{descriptionSections["Materiał"]}</span>
                  </div>
                )}
                {/* Render Kolor from Shopify product options, not from descriptionSections */}
                {(() => {
                  // Find the color option in productOptions
                  const colorOption = productOptions.find(
                    (opt) => opt.name.toLowerCase() === 'kolor' || opt.name.toLowerCase() === 'color'
                  );
                  // Find the selected color value
                  const selectedColor = colorOption?.optionValues.find((v) => v.selected)?.name;
                  if (colorOption) {
                    return (
                      <div className="opis-color-block">
                        <span className="opis-color-label">Kolor:</span>
                        <br />
                        <div style={{display: 'flex', alignItems: 'center', marginTop: '0.5em', gap: '1em'}}>
                          {colorOption.optionValues.map((v, idx) => {
                            const isSelected = v.selected;
                            if (isSelected) {
                              return (
                                <span
                                  key={v.name}
                                  style={{
                                    fontWeight: 600,
                                    textDecoration: 'underline',
                                    cursor: 'default',
                                    color: '#222',
                                  }}
                                >
                                  {v.name}
                                </span>
                              );
                            } else {
                              return (
                                <a
                                  key={v.name}
                                  href={`?${v.variantUriQuery}`}
                                  style={{
                                    fontWeight: 400,
                                    textDecoration: 'none',
                                    color: '#666',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {v.name}
                                </a>
                              );
                            }
                          })}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
            <br />
            {/* Product options (variants) - WITHOUT add to cart */}
            <ProductForm
              productOptions={productOptions}
            />
            {/* Quantity and Add to Cart - AT THE TOP */}
            <AddToCartSection selectedVariant={selectedVariant} />
          </div>
          <div className="product-description-section-wrapper">
            {/* Render parsed description sections consistently (excluding Opis and duplicate Materiał) */}
            {descriptionSections["Wymiary"] && (
              <div className="product-section product-section-wymiary">
                <h4 style={{color: '#111', marginBottom: '0.5em'}}>Wymiary</h4>
                <div style={{color: '#888', fontSize: '0.92em', lineHeight: 1.7, whiteSpace: 'pre-line'}}>
                  {String(descriptionSections["Wymiary"]).replace(/cm(?!\w)/g, 'cm\n')}
                </div>
              </div>
            )}
            {descriptionSections["Personalizacja"] && (
              <div className="product-section product-section-personalizacja">
                <h4 style={{color: '#111', marginBottom: '0.5em'}}>Personalizacja</h4>
                <div style={{color: '#888', fontSize: '0.92em', lineHeight: 1.7, whiteSpace: 'pre-line'}}>
                  {String(descriptionSections["Personalizacja"])}
                </div>
              </div>
            )}
            {descriptionSections["Uwagi"] && (
              <div className="product-section product-section-uwagi">
                <h4 style={{color: '#111', marginBottom: '0.5em'}}>Uwagi</h4>
                <div style={{color: '#888', fontSize: '0.92em', lineHeight: 1.7, whiteSpace: 'pre-line'}}>
                  {String(descriptionSections["Uwagi"])}
                </div>
              </div>
            )}
            {/* Do NOT render Kolor/Color from descriptionSections to avoid duplicate */}
          </div>
        </div>
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant?.price.amount || '0',
                vendor: product.vendor,
                variantId: selectedVariant?.id || '',
                variantTitle: selectedVariant?.title || '',
                quantity: 1,
              },
            ],
          }}
        />
      </div>
      {galleryImages.length > 0 && (
        <div className="product-gallery">
          {galleryImages.map((media) => (
            <div key={media.id} className="product-gallery-item">
              <img
                src={`${media.image.url}&width=800`}
                alt={media.image.altText || product.title}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// Move PRODUCT_VARIANT_FRAGMENT above PRODUCT_FRAGMENT and PRODUCT_QUERY to avoid ReferenceError
const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    media(first: 20) {
      nodes {
        ... on MediaImage {
          id
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
