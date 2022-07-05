import React from "react";
import Searchbar from "./Searchbar";
import RatingFilter from "./RatingFilter";
import { Themoviedatabase } from "@styled-icons/simple-icons/Themoviedatabase";
import { useAppContext } from "../Context/AppContext";

function Navbar() {
  const { dispatch } = useAppContext();
  return (
    <div>
      <div
        className="grid place-content-center mt-5"
        onClick={() => dispatch({ type: "DEFAULT_VALUES" })}
      >
        <Themoviedatabase color="white" className="w-16" />
      </div>
      <div className="top-0 flex items-center justify-center w-full">
        <Searchbar />
      </div>
      <RatingFilter />
    </div>
  );
}

export default Navbar;
