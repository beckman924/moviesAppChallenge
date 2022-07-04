import { React, useState, useEffect } from "react";
import axios from "axios";
import { Search } from "@styled-icons/boxicons-regular/";
import { CloseCircle } from "@styled-icons/remix-fill/CloseCircle";
import Router from "next/router";
import { useAppContext } from "../Context/AppContext";
import debounce from "lodash.debounce";

function Searchbar() {
  const [input, setInput] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [results, setResults] = useState([]);
  const { dispatch, apiCase } = useAppContext();

  const handleInputChanges = debounce(async (query) => {
    if (query.length > 0) {
      dispatch({ type: "SET_RATING", value: null });
      dispatch({ type: "MIN_RATING", value: 0 });
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&language=es-ES&query=${query}&include_adult=false`
      );

      setResults([
        {
          moviesResults: data.results,
          total_pages: data.total_pages,
        },
      ]);
      setShowSearchResults(true);
    }
  }, 500);

  const showResults = async (e) => {
    e.preventDefault();
    if (results.length > 0) {
      await dispatch({ type: "SEARCH", value: results });
      dispatch({ type: "SET_PAGE_NUMBER", value: 1 });
      dispatch({ type: "HAS_MORE", value: true });
      setShowSearchResults(false);
    }
  };

  useEffect(() => {
    if (input.length === 0 && apiCase !== "rating_filter") {
      setResults([]);
      dispatch({ type: "QUERY", value: input });
      dispatch({ type: "API_CASE", value: "home" });
    }
  }, [apiCase, dispatch, input]);

  return (
    <form className="relative text-gray-300 w-max py-5" onSubmit={showResults}>
      <input
        type="text"
        name="search"
        className={
          "font-semibold bg-[#323232] w-[18rem] md:w-[25rem] h-10 rounded-md text-sm transition-all text-center focus:outline-none hover:outline outline-2"
        }
        onChange={async (e) => {
          setInput(e.target.value),
            await dispatch({ type: "QUERY", value: input }),
            handleInputChanges(e.target.value);
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
            setInput(""), dispatch({ type: "PAGE_RATING", value: null });
          }}
          title="closeButton"
        >
          <CloseCircle size={30} color="#7F7F7F" className="px-1 mr-1" />
        </button>
      )}

      {input.length > 0 && (
        <div className="-mt-[3px] rounded-b-md w-[18rem] md:w-[25rem] max-h-[13.5rem] bg-[#323232] z-10 shadow-2xl overflow-hidden overflow-y-auto absolute searchScrollbar transition-all delay-150">
          {results.length <= 0 ? null : results[0].moviesResults.length ===
            0 ? (
            <p className="first:border-t-[1px] border-[#7F7F7F] w-full h-[50px] flex items-center justify-center text-white hover:bg-[#d3d3d3] hover:text-black transition-all duration-300 overflow-hidden">
              No hay resultados
            </p>
          ) : (
            showSearchResults &&
            results[0].moviesResults.map((e) => {
              return (
                <button
                  key={e.id}
                  className="first:border-t-[1px] border-[#7F7F7F] w-full h-[50px] flex items-center justify-center text-white hover:bg-[#d3d3d3] hover:text-black transition-all duration-300"
                  onClick={() => Router.push(`/movie/${e.id}`)}
                >
                  <p className="ml-5 text-sm truncate">{e.title}</p>
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
