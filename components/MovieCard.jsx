import { React } from "react";
import Image from "next/image";
import PosterNotAvailable from "../public/no-poster-available.jpg";

function MovieCard({ movie }) {
  const imgPath = "https://image.tmdb.org/t/p/original" + movie.poster_path;

  return (
    <div className="group overflow-hidden relative">
      <Image
        src={movie.poster_path ? imgPath : PosterNotAvailable}
        width={400}
        height={600}
        alt="Movie Image"
        layout="responsive"
        priority
        className="bg-cover bg-center transition-all"
        // placeholder="blur"
        // blurDataURL={blurImg}
      />
      <div className="opacity-0 group-hover:opacity-100 transition-all absolute duration-300 left-0 right-0 bottom-0 flex flex-col justify-center items-center bg-black bg-opacity-80 text-center text-white">
        <h5 className="truncate text-lg my-2 w-[95%] font-medium">
          {movie.title}
        </h5>
        <p className="font-light">{movie.overview}</p>
      </div>
    </div>
  );
}

export default MovieCard;
