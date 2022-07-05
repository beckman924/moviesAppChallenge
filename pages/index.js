import Head from "next/head";
import Navbar from "../components/Navbar.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import MovieCard from "../components/MovieCard.jsx";
import MovieCardLoading from "../components/MovieCardLoading.jsx";
import MovieDetails from "../components/MovieDetails.jsx";
import { Suspense, useEffect, useState } from "react";
import { useAppContext } from "../Context/AppContext.jsx";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCircle } from "@styled-icons/ionicons-solid/RefreshCircle";
import { Spinner5 } from "@styled-icons/icomoon/Spinner5";

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

  const getMoreMovies = async () => {
    switch (apiCase) {
      case "home":
        const res = await fetch(
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
        const resMovies = await res.json();
        const newMovies = resMovies.results;
        dispatch({ type: "NEW_MOVIES", value: newMovies });
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

  const getDefaultMovies = () => {
    dispatch({ type: "API_CASE", value: "home" });
    dispatch({ type: "GET_MOVIES", value: props.movies });
    dispatch({ type: "HAS_MORE", value: true });
    dispatch({ type: "QUERY", value: "" });
    dispatch({ type: "SET_PAGE_NUMBER", value: 1 });
    dispatch({ type: "PAGE_RATING", value: null });
  };

  useEffect(() => {
    const getMovieDetails = async () => {
      const MovieID = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=633199921e65faa64644981287c9144f&language=es-ES&append_to_response=videos,images,release_dates`
      );
      await dispatch({ type: "SET_MOVIE_DETAILS", value: MovieID.data });
    };
    if (movieId !== null) {
      getMovieDetails();
    }

    if (apiCase === "home" && pageNro === 1 && modal === false) {
      dispatch({ type: "GET_MOVIES", value: props.movies });
      dispatch({ type: "HAS_MORE", value: true });
    }
  }, [apiCase, dispatch, modal, movieId, pageNro, props, query]);

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
        {/* <div className="homeCards px-5 overflow-x-hidden last:mb-5"> */}
        <InfiniteScroll
          dataLength={movies.length}
          next={getMoreMovies}
          hasMore={hasMore}
          loader={<MovieCardLoading />}
          refreshFunction={getDefaultMovies}
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={
            <div className="grid place-content-center animate-spin">
              <RefreshCircle className="w-10" />
            </div>
          }
          releaseToRefreshContent={
            <div className="grid place-content-center animate-spin">
              <Spinner5 className="w-10" />
            </div>
          }
          className="homeCards px-5 overflow-x-hidden last:mb-5"
        >
          {movies.map((movie) => {
            return (
              <Suspense fallback={<MovieCardLoading />} key={movie.id}>
                <motion.div
                  // key={movie.id}
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
              </Suspense>
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
        {/* </div> */}
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
