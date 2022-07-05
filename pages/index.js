import Head from "next/head";
import Navbar from "../components/Navbar.jsx";
import MovieCard from "../components/MovieCard.jsx";
import MovieDetails from "../components/MovieDetails.jsx";
import { useRef, useEffect } from "react";
import { useAppContext } from "../Context/AppContext.jsx";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCircle } from "@styled-icons/ionicons-solid/RefreshCircle";
import { Spinner5 } from "@styled-icons/icomoon/Spinner5";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home(props) {
  const {
    movies,
    dispatch,
    apiCase,
    hasMore,
    query,
    pageNro,
    total_pages,
    minRating,
    rating,
    movieId,
    modal,
  } = useAppContext();

  const scrollableDiv = useRef();

  useEffect(() => {
    // Function to fetch data about an specific movie by his ID
    const getMovieDetails = async () => {
      const MovieID = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=633199921e65faa64644981287c9144f&language=es-ES&append_to_response=videos,images,release_dates`
      );
      await dispatch({ type: "SET_MOVIE_DETAILS", value: MovieID.data });
    };
    if (movieId !== null) {
      getMovieDetails();
    }
    // If "apiCase", "pageNro", "modal" variables are equal to this, then default popular movies will be render
    if (apiCase === "home" && pageNro === 1 && modal === false) {
      dispatch({ type: "GET_MOVIES", value: props.movies });
      dispatch({ type: "HAS_MORE", value: true });
    }
  }, [apiCase, dispatch, modal, movieId, pageNro, props, query]);

  // Function that will be trigger when "hasMore" variable is set to True
  // it will render movies in home according to "apiCase" value
  const getMoreMovies = async () => {
    switch (apiCase) {
      case "home":
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${
            process.env.TMDB_API_KEY
          }&language=es-ES&sort_by=popularity.desc&include_adult=false&page=${
            pageNro + 1
          }&append_to_response=videos`
        );
        dispatch({ type: "SET_PAGE_NUMBER", value: pageNro + 1 });

        if (pageNro === 10) {
          dispatch({ type: "HAS_MORE", value: false });
        }

        dispatch({ type: "NEW_MOVIES", value: data.results });
        break;

      case "search":
        if (pageNro === total_pages) {
          dispatch({ type: "HAS_MORE", value: false });
          break;
        } else {
          const { data } = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${
              process.env.TMDB_API_KEY
            }&language=es-ES&query=${query}&include_adult=false&page=${
              pageNro + 1
            }`
          );
          dispatch({ type: "SET_PAGE_NUMBER", value: pageNro + 1 });
          dispatch({ type: "NEW_MOVIES", value: data.results });
          break;
        }

      case "rating_filter":
        if (pageNro === total_pages) {
          dispatch({ type: "HAS_MORE", value: false });
          break;
        } else {
          const { data } = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${
              process.env.TMDB_API_KEY
            }&sort_by=popularity.desc&vote_count.gte=10&vote_average.gte=${minRating}&vote_average.lte=${rating}&language=es-ES&page=${
              pageNro + 1
            }`
          );
          dispatch({ type: "SET_PAGE_NUMBER", value: pageNro + 1 });
          dispatch({ type: "NEW_MOVIES", value: data.results });
          break;
        }

      default:
        dispatch({ type: "HAS_MORE", value: false });
    }
  };

  // Function to set all values to default and show default popular movies in home page
  // const getDefaultMovies = () => {
  //   dispatch({ type: "API_CASE", value: "home" });
  //   dispatch({ type: "GET_MOVIES", value: props.movies });
  //   dispatch({ type: "HAS_MORE", value: true });
  //   dispatch({ type: "QUERY", value: "" });
  //   dispatch({ type: "SET_PAGE_NUMBER", value: 1 });
  //   dispatch({ type: "PAGE_RATING", value: null });
  // };

  return (
    <div>
      <Head>
        <title>Movies App</title>
        <meta name="description" content="Movies App Challenge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav>
        <Navbar />
      </nav>

      <main className="text-white">
        {/* Infinite scroll component will trigger function hasMore when "hasMore" variable set to True */}
        <InfiniteScroll
          dataLength={movies.length}
          next={getMoreMovies}
          hasMore={hasMore}
          loader={
            <div className="grid place-content-center animate-spin">
              <Spinner5 className="w-10" />
            </div>
          }
          // refreshFunction={getDefaultMovies}
          // pullDownToRefresh
          // pullDownToRefreshThreshold={50}
          // pullDownToRefreshContent={
          //   <div className="grid place-content-center animate-spin">
          //     <RefreshCircle className="w-10" />
          //   </div>
          // }
          // releaseToRefreshContent={
          //   <div className="grid place-content-center animate-spin">
          //     <Spinner5 className="w-10" />
          //   </div>
          // }
          className="homeCards px-5 overflow-y-visible last:mb-5"
        >
          {/* This will render all movies in home page */}

          {movies.map((movie) => {
            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1, y: -5 }}
                transition={{ delay: 0.2 }}
                onClick={() => (
                  dispatch({ type: "MOVIE_ID", value: movie.id }),
                  dispatch({ type: "SET_MODAL", value: true })
                )}
              >
                <MovieCard movie={movie} key={movie.id} />
              </motion.div>
            );
          })}
        </InfiniteScroll>

        <AnimatePresence
          initial={false}
          exitBeforeEnter={true}
          onExitComplete={() => null}
        >
          {modal && <MovieDetails />}
        </AnimatePresence>
      </main>
    </div>
  );
}

export const getStaticProps = async () => {
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=es-ES&sort_by=popularity.desc&include_adult=false`
  );
  const movies = data.results;

  return {
    props: { movies },
  };
};
