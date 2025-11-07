import {useLoaderData} from 'react-router';

export async function loader({context}) {
  const {products} = await context.storefront.query(DEBUG_PRODUCTS_QUERY);
  return {products};
}

export default function DebugProducts() {
  const {products} = useLoaderData();
  
  return (
    <div style={{padding: '2rem', fontFamily: 'monospace'}}>
      <h1>All Products with IDs</h1>
      <p>Copy the IDs you want to use for featured products</p>
      <ul style={{listStyle: 'none', padding: 0}}>
        {products.nodes.map((product) => (
          <li key={product.id} style={{marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem'}}>
            <div><strong>Title:</strong> {product.title}</div>
            <div><strong>Handle:</strong> {product.handle}</div>
            <div style={{color: 'blue'}}><strong>ID:</strong> {product.id}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const DEBUG_PRODUCTS_QUERY = `#graphql
  query DebugProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 50) {
      nodes {
        id
        title
        handle
      }
    }
  }
`;
