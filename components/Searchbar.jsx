import { React, useState, useEffect } from "react";
import axios from "axios";
import { Search } from "@styled-icons/boxicons-regular/";
import { CloseCircle } from "@styled-icons/remix-fill/CloseCircle";
import { useAppContext } from "../Context/AppContext";
import useDebounce from "../hooks/useDebounce.tsx";

function Searchbar() {
  const [input, setInput] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [results, setResults] = useState([]);
  const { dispatch, query } = useAppContext();
  const searchAPIDebounced = useDebounce(input, 500);

  useEffect(() => {
    // Debounced search to only make one API call after 500ms
    const searchAPI = async () => {
      dispatch({ type: "SET_RATING", value: null });
      dispatch({ type: "MIN_RATING", value: 0 });
      const results = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${
          process.env.TMDB_API_KEY
        }&language=es-ES&query=${encodeURIComponent(
          searchAPIDebounced
        )}&include_adult=false`
      );

      setResults([
        {
          moviesResults: results.data.results,
          total_pages: results.data.total_pages,
        },
      ]);
      setShowSearchResults(true);
    };

    if (searchAPIDebounced) searchAPI(searchAPIDebounced);
  }, [dispatch, searchAPIDebounced]);

  const showResults = async (e) => {
    e.preventDefault();
    if (results.length > 0 && searchAPIDebounced) {
      dispatch({ type: "QUERY", value: input }),
        dispatch({ type: "SEARCH", value: results });
      dispatch({ type: "SET_PAGE_NUMBER", value: 1 });
      dispatch({ type: "HAS_MORE", value: true });
      setShowSearchResults(false);
      setInput("");
    }
  };

  return (
    <form className="relative text-gray-300 w-max py-5" onSubmit={showResults}>
      <input
        type="text"
        name="search"
        value={input}
        placeholder={query}
        className={
          "font-semibold bg-[#323232] w-[18rem] md:w-[25rem] h-10 rounded-md text-sm transition-all text-center focus:outline-none hover:outline outline-2"
        }
        onChange={(e) => {
          setInput(e.target.value),
            dispatch({ type: "API_CASE", value: "search" });
        }}
        autoComplete="off"
      />
      <button className="absolute left-0 top-[1.6rem]">
        <Search size={30} color="#7F7F7F" className="px-1 mx-2" />
      </button>
      {input.length > 0 && (
        <button
          className="absolute right-0 top-[1.6rem] active:outline-none"
          onClick={() => {
            setInput(""),
              dispatch({ type: "PAGE_RATING", value: null }),
              dispatch({ type: "QUERY", value: "" });
          }}
          title="closeButton"
        >
          <CloseCircle size={30} color="#7F7F7F" className="px-1 mr-1" />
        </button>
      )}

      {/* Results menu appears when typing something */}
      {input.length > 0 && (
        <div className="-mt-[3px] rounded-b-md w-[18rem] md:w-[25rem] max-h-[13.5rem] bg-[#323232] z-10 shadow-2xl overflow-hidden overflow-y-auto absolute searchScrollbar transition-all delay-150">
          {results.length <= 0 ? null : results[0].moviesResults.length ===
            0 ? (
            <p className="first:border-t-[1px] border-[#7F7F7F] w-full h-[50px] flex items-center justify-center text-white hover:bg-[#d3d3d3] hover:text-black transition-all duration-300 overflow-hidden">
              No hay resultados
            </p>
          ) : (
            showSearchResults &&
            results[0].moviesResults.map((movie) => {
              return (
                <button
                  key={movie.id}
                  className="first:border-t-[1px] border-[#7F7F7F] w-full h-[50px] flex items-center justify-center text-white hover:bg-[#d3d3d3] hover:text-black transition-all duration-300"
                  onClick={(e) => {
                    e.preventDefault(),
                      dispatch({ type: "MOVIE_ID", value: movie.id }),
                      dispatch({ type: "SET_MODAL", value: true });
                  }}
                >
                  <p className="text-center text-sm truncate">{movie.title}</p>
                </button>
              );
            })
          )}
        </div>
      )}
    </form>
  );
}

export default Searchbar;
