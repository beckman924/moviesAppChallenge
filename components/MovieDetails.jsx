import React from "react";
import { ArrowBackOutline } from "@styled-icons/evaicons-outline/ArrowBackOutline";
import Head from "next/head";
import { LineHorizontal1 } from "@styled-icons/fluentui-system-filled/LineHorizontal1";
import Image from "next/image";
import { Star } from "@styled-icons/fa-solid/Star";
import { Themoviedatabase } from "@styled-icons/simple-icons/Themoviedatabase";
import { motion } from "framer-motion";
import { useAppContext } from "../Context/AppContext";

const MovieDetails = () => {
  const { dispatch, movieDetails, movieId } = useAppContext();
  const [width, setWidth] = React.useState(window.innerWidth);
  const img = "https://image.tmdb.org/t/p/original";
  const companyImage = "https://image.tmdb.org/t/p/original";

  React.useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);

  if (movieDetails.length <= 0) {
    null;
  } else {
    movieDetails.poster_path ? (img += movieDetails.poster_path) : null;

    const renderTrailer = () => {
      const trailer = movieDetails.videos.results[0];

      return (
        <div className="h-[50vh] w-full">
          <iframe
            title="Movie trailer"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`}
            allow="autoplay; fullscreen"
            className="w-full h-full"
          ></iframe>
        </div>
      );
    };

    const minToHoursAndMin = () => {
      let num = movieDetails.runtime;
      let hours = num / 60;
      let rhours = Math.floor(hours);
      let minutes = (hours - rhours) * 60;
      let rminutes = Math.round(minutes);
      if (rhours === 0) {
        return rminutes + " min";
      } else {
        return rhours + " h " + rminutes + " min";
      }
    };

    const findCertification = () => {
      const certification = movieDetails.release_dates.results.filter(
        (cert) => {
          return cert.iso_3166_1 === "US";
        }
      );
      if (certification.length > 0) {
        const certUS = certification[0].release_dates.filter((certUS) => {
          return certUS.certification !== "";
        });
        if (certUS.length > 0) {
          switch (certUS[0].certification) {
            case "G":
              return "Apta para todo público";
            case "PG":
              return "10+";
            case "PG-13":
              return "13+";
            case "R":
              return "17+";
            case "NC-17":
              return "18+";
          }
        } else {
          return "Sin clasificación";
        }
      } else {
        return "Sin clasificación";
      }
    };

    const variants = {
      hidden: { x: 0, y: 800 },
      enter: { x: 0, y: 0, transition: { duration: 0.4 } },
      exit: { x: 0, y: 800, transition: { duration: 0.4 } },
    };

    return (
      <div className="inset-0 fixed grid place-content-center bg-[rgba(0,0,0,0.6)] overflow-y-auto z-50">
        <Head>
          <title>{movieDetails.title}</title>
          <meta name="description" content="Movie detail" />
        </Head>

        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0.5 }}
          dragElastic={{ top: 0, bottom: 0.5 }}
          dragMomentum={false}
          onDragEnd={() => dispatch({ type: "SET_MODAL", value: false })}
          key={movieId}
          variants={variants}
          initial="hidden"
          animate="enter"
          exit="exit"
          className="bg-[#181725] fixed left-auto right-auto top-auto bottom-0 pb-10 rounded-t-3xl sm:static sm:rounded-xl sm:w-[90vw] xl:w-[60vw]"
        >
          {width > 768 ? (
            <div className="flex justify-between items-center top-0">
              <button
                className="justify-start"
                onClick={() => dispatch({ type: "SET_MODAL", value: false })}
              >
                <ArrowBackOutline
                  color="white"
                  className="ml-5 w-[2rem] md:w-[2rem]"
                />
              </button>

              <Themoviedatabase
                className="w-[1.8rem] md:w-[2rem] mr-2"
                color="white"
              />
            </div>
          ) : (
            <div className="grid place-content-center max-h-7">
              <LineHorizontal1 className="w-16" />
            </div>
          )}

          {movieDetails.videos.results.length > 0 ? (
            renderTrailer()
          ) : (
            <div className="w-full h-[50vh] relative">
              <Image
                src={img}
                alt="Movie Poster"
                className=""
                width={475}
                height={420}
              />
              <p className="absolute left-1 right-0 bottom-6 opacity-90 w-[10rem] bg-black text-white text-opacity-70 text-center">
                Avance no disponible
              </p>
            </div>
          )}

          <div className="p-2 text-white">
            <h1 className="text-left text-2xl font-medium">
              {movieDetails.homepage.length > 0 ? (
                <a href={movieDetails.homepage}>{movieDetails.title}</a>
              ) : (
                movieDetails.title
              )}
            </h1>
            <span className="flex gap-2 py-3 justify-between">
              <span className="flex items-start justify-start self-start gap-2">
                <h3 className="font-light text-gray-300">
                  {movieDetails.release_date.substring(0, 4)}
                </h3>
                <h3 className="bg-[#333333] text-[#999999] rounded-sm px-1">
                  {findCertification()}
                </h3>
                <h3 className="font-light text-gray-400">
                  {minToHoursAndMin()}
                </h3>
                {movieDetails.production_companies.length > 0 ? (
                  <span className="flex items-start max-w-full max-h-5">
                    <Image
                      src={
                        (companyImage +=
                          movieDetails.production_companies[0].logo_path)
                      }
                      width="100"
                      height="25"
                      className="object-contain"
                      alt="Logo company"
                    />
                  </span>
                ) : null}
              </span>
              <span className="flex gap-1">
                <h3>{movieDetails.vote_average}</h3>
                <Star className="w-[0.85rem]" color="#ffc107" />
              </span>
            </span>
            <p>{movieDetails.overview}</p>
            {movieDetails.genres.length > 0 ? (
              <span className="mt-2 flex gap-1 max-w-[1rem] ">
                {movieDetails.genres.map((genre) => {
                  return (
                    <p
                      key={genre.name}
                      className="bg-[#333333] text-white font-thin text-opacity-80 rounded-sm px-1"
                    >
                      {genre.name}
                    </p>
                  );
                })}
              </span>
            ) : null}
          </div>
        </motion.div>
      </div>
    );
  }
};

export default MovieDetails;