import {Link} from '@remix-run/react';

export function Hero({hero}) {
  const header =
    hero?.fields.find((field) => field.key === 'header')?.value || '';
  const description =
    hero?.fields.find((field) => field.key === 'description')?.value || '';
  const productUrlField =
    hero?.fields.find((field) => field.key === 'product_url')?.value || '';
  const productData = JSON.parse(productUrlField);

  return (
    <div className="mx-12 my-8">
      <Link to={productData.url} target='_blank' className="block">
        <div className="relative">
          <img
            src="/omega-hero.png"
            alt="Hero"
            className="w-full h-[30vh] object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-black/40 rounded-xl" />

          <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">{header}</h2>
            <p className="text-lg max-w-2xl">{description}</p>
            <span className="mt-4 inline-block px-6 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors w-fit">
              Shop Now
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
