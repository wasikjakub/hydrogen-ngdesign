import {useLoaderData} from 'react-router';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [
    {title: `${data?.policy?.title ?? 'Regulamin'} | NG Design`},
    {description: 'Regulamin i polityka prywatności NG Design'},
  ];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: true,
      refundPolicy: false,
      language: context.storefront.i18n?.language,
    },
  });

  const policy = data.shop?.termsOfService;

  if (!policy) {
    throw new Response('Could not find the terms of service', {status: 404});
  }

  return {policy};
}

export default function RegulaminPage() {
  /** @type {LoaderReturnData} */
  const {policy} = useLoaderData();

  return (
    <div className="regulamin-page">
      <div className="regulamin-content">
        <h1>REGULAMIN SKLEPU INTERNETOWEGO NGDESIGN</h1>
        <div dangerouslySetInnerHTML={{__html: policy.body}} />
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
`;

/** @typedef {import('./+types/($locale).regulamin').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */