import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

export function Produced({produced}) {
  const header =
    produced?.fields.find((field) => field.key === 'header')?.value || '';
  const description =
    produced?.fields.find((field) => field.key === 'description')?.value || '';
  const spotifyUrlField =
    produced?.fields.find((field) => field.key === 'link')?.value || '';
  const spotifyUrl = JSON.parse(spotifyUrlField);

  // Convert the Spotify URL to the embed format
  const embedUrl = spotifyUrl.url.replace(
    'https://open.spotify.com/',
    'https://open.spotify.com/embed/',
  );

  return (
    <div className="mx-12 my-8">
      <Link to={spotifyUrl.url} target="_blank" className="block">
        <div className="relative">
          <Image
            src="/omega-hero-inverted.png"
            alt="Hero"
            className="w-full h-[30vh] object-cover rounded-xl"
            sizes="100vw"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/40 rounded-xl" />

          <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">{header}</h2>
            <p className="text-lg max-w-2xl">{description}</p>
          </div>
        </div>
      </Link>
      <div className="mt-4">
        <iframe
          // style={{borderRadius: '12px'}}
          className='rounded-xl'
          src={`${embedUrl}?utm_source=generator&theme=0`}
          width="100%"
          height="352"
          frameBorder="0"
          allowfullscreen=""
          allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
