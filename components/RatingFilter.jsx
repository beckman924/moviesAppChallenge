import React, { useState, useEffect } from "react";
import { Star } from "@styled-icons/fa-solid/Star";
import { useAppContext } from "../Context/AppContext";
import axios from "axios";

function RatingFilter() {
  const [hover, setHover] = useState(null);
  const { dispatch, rating, minRating } = useAppContext();

  useEffect(() => {
    const filterByRating = async () => {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&sort_by=popularity.desc&vote_count.gte=10&vote_average.gte=${minRating}&vote_average.lte=${rating}&language=es-ES`
      );
      dispatch({ type: "RATING_FILTER", value: data.results });
      dispatch({ type: "API_CASE", value: "rating_filter" });
      dispatch({ type: "PAGE_RATING", value: data.total_pages });
      dispatch({ type: "QUERY", value: "" });
    };

    const defaultMovies = () => {
      dispatch({ type: "API_CASE", value: "home" });
      dispatch({ type: "QUERY", value: "" });
    };

    const calcMinRating = () => {
      switch (rating) {
        case null:
          dispatch({ type: "MIN_RATING", value: 0 });
          break;
        case 2:
          dispatch({ type: "MIN_RATING", value: 0 });
          break;
        case 4:
          dispatch({ type: "MIN_RATING", value: 2 });
          break;
        case 6:
          dispatch({ type: "MIN_RATING", value: 4 });
          break;
        case 8:
          dispatch({ type: "MIN_RATING", value: 6 });
          break;
        case 10:
          dispatch({ type: "MIN_RATING", value: 8 });
          break;
        default:
          dispatch({ type: "MIN_RATING", value: 0 });
      }
    };

    if (rating !== null) {
      calcMinRating();
      filterByRating();
    } else {
      defaultMovies();
    }
  }, [dispatch, minRating, rating]);

  return (
    <div className="flex flex-col items-center justify-center text-white font-medium text-lg mb-5">
      <p>Filtrar por rating:</p>

      <div className="flex gap-2 my-2">
        {[...Array(5)].map((star, index) => {
          const ratingValue = (index + 1) * 2;

          return (
            <label key={index}>
              <input
                type="radio"
                className="hidden"
                name="rating"
                value={ratingValue}
                onClick={async (e) => {
                  if (e.target.value == rating) {
                    dispatch({ type: "SET_RATING", value: null });
                    setHover(null);
                    dispatch({ type: "MIN_RATING", value: null });
                  } else {
                    dispatch({ type: "SET_RATING", value: ratingValue });
                    setHover(ratingValue);
                  }
                }}
              />
              <Star
                size={30}
                color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                className="cursor-pointer transition-all  active:scale-75"
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(null)}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default RatingFilter;
