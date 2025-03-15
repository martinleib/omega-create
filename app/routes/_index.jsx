import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {Hero} from '~/components/Hero';
import {Produced} from '~/components/Produced';
/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Omega-Create'}];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold.
 * @param {LoaderFunctionArgs}
 */
async function loadCriticalData({context}) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  const allProducts = context.storefront
    .query(ALL_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  const heroData = context.storefront
    .query(HERO_METAOBJECT_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  const producedData = context.storefront
    .query(PRODUCED_METAOBJECT_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    allProducts,
    hero: heroData,
    produced: producedData,
  };
}

export default function Homepage() {
  const data = useLoaderData();
  return (
    <div className="home">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data.hero}>
          {(heroData) => <Hero hero={heroData?.hero} />}
        </Await>
      </Suspense>
      <FeaturedCollection collection={data.featuredCollection} />
      <AllProducts products={data.allProducts} />
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data.produced}>
          {(producedData) => <Produced produced={producedData?.produced} />}
        </Await>
      </Suspense>
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
    <section className="mx-12 my-12">
      <Link
        className="featured-collection"
        to={`/collections/${collection.handle}`}
      >
        {image && (
          <div className="featured-collection-image">
            <Image data={image} sizes="100vw" />
          </div>
        )}
        <h1>Featured Products</h1>
      </Link>
    </section>
  );
}

/**
 * @param {{
 *   products: Promise<AllProductsQuery | null>;
 * }}
 */
function AllProducts({products}) {
  return (
    <section className="all-products mx-12">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="all-products-grid">
              {response?.collection?.products?.nodes.map((product) => (
                <Link
                  key={product.id}
                  className="all-product"
                  to={`/products/${product.handle}`}
                >
                  <Image
                    data={product.images.nodes[0]}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                  <h4 className="mt-2">{product.title}</h4>
                  <p className="vendor-name mt-0">{product.vendor}</p>
                  <small className="flex gap-2">
                    {product.compareAtPriceRange.minVariantPrice.amount >
                      product.priceRange.minVariantPrice.amount && (
                      <Money
                        className="line-through text-gray-500"
                        data={product.compareAtPriceRange.minVariantPrice}
                      />
                    )}
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                </Link>
              )) || null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </section>
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

const ALL_PRODUCTS_QUERY = `#graphql
  fragment ProductDetails on Product {
    id
    title
    handle
    vendor
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query CollectionProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: "show-on-home-page") {
      products(first: 50, sortKey: TITLE) {
        nodes {
          ...ProductDetails
        }
      }
    }
  }
`;

const HERO_METAOBJECT_QUERY = `#graphql
  query HeroMetaobject ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    hero: metaobject(handle: {
      handle: "newest-release-information-qs5zqkx4",
      type: "newest_release_information"
    }) {
      fields {
        key
        value
      }
    }
  }
`;

const PRODUCED_METAOBJECT_QUERY = `#graphql
  query ProducedByUsMetaobject ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    produced: metaobject(handle: {
      handle: "produced-by-omega-playlist-rntw8mza",
      type: "produced_by_omega_playlist"
    }) {
      fields {
        key
        value
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').AllProductsQuery} AllProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
