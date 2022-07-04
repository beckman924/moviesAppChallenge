import React, { useReducer, createContext, useContext } from "react";

const initialState = {
  movies: [],
  apiCase: "home",
  hasMore: true,
  query: "",
  pageNro: 1,
  total_pages: null,
  rating: null,
  minRating: 0,
  movieId: null,
  movieDetails: [],
  modal: false,
};

const AppContextInit = createContext();

export const useAppContext = () => {
  return useContext(AppContextInit);
};

const reducer = (state, action) => {
  switch (action.type) {
    case "GET_MOVIES":
      return {
        ...state,
        movies: action.value,
      };

    case "NEW_MOVIES":
      return {
        ...state,
        movies: [...state.movies, ...action.value],
      };

    case "SEARCH":
      return {
        ...state,
        apiCase: "search",
        movies: action.value[0].moviesResults,
        total_pages: action.value[0].total_pages,
      };

    case "API_CASE":
      return {
        ...state,
        apiCase: action.value,
      };

    case "QUERY":
      return {
        ...state,
        query: action.value,
      };

    case "SET_PAGE_NUMBER":
      return {
        ...state,
        pageNro: action.value,
      };

    case "SEARCH_RESULTS":
      return {
        ...state,
        movies: action.value,
      };

    case "RATING_FILTER":
      return {
        ...state,
        movies: action.value,
      };

    case "SET_RATING":
      return {
        ...state,
        rating: action.value,
      };

    case "MIN_RATING":
      return {
        ...state,
        minRating: action.value,
      };

    case "PAGE_RATING":
      return {
        ...state,
        total_pages: action.value,
      };

    case "HAS_MORE":
      return {
        ...state,
        hasMore: action.value,
      };

    case "MOVIE_ID":
      return {
        ...state,
        movieId: action.value,
      };

    case "SET_MOVIE_DETAILS":
      return {
        ...state,
        movieDetails: action.value,
      };

    case "SET_MODAL":
      return {
        ...state,
        modal: action.value,
      };

    default:
      return state;
  }
};

export const AppContext = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContextInit.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </AppContextInit.Provider>
  );
};
