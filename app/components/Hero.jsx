export function Hero() {
  return (
    <div className="mx-12 my-8">
      <div className="relative">
        <img
          src="/omega-hero.png"
          alt="Hero"
          className="w-full h-[30vh] object-cover rounded-xl"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Check out our newest release!
          </h2>
          <p className="text-lg max-w-2xl">
            ALECTO (<span className="text-gray-300">@stevenjavier</span>) just
            dropped his complete Production Suite featuring over 123+ sounds and
            drum loops inspired by your favorite Latin-Pop and Reggaeton
            production.
          </p>
        </div>

        {/*<div className="absolute inset-0 bg-black/40 rounded-xl" />*/}
      </div>
    </div>
  );
}
