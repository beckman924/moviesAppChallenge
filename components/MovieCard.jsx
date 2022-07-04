import { React } from "react";
import Image from "next/image";
import PosterNotAvailable from "../public/no-poster-available.jpg";
import { motion } from "framer-motion";

function MovieCard({ movie }) {
  const imgPath = "https://image.tmdb.org/t/p/original" + movie.poster_path;

  return (
    <div className="overflow-hidden relative">
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
      <motion.div
        className="absolute duration-300 left-0 right-0 bottom-0 flex flex-col justify-center items-center bg-black bg-opacity-80 text-center text-white"
        initial={{ opacity: 0, translateY: 0 }}
        whileHover={{ opacity: 1, translateY: 0 }}
      >
        <h5 className="truncate text-lg my-2 w-[95%] font-medium">
          {movie.title}
        </h5>
        <p className="font-light">{movie.overview}</p>
      </motion.div>
    </div>
  );
}

export default MovieCard;
