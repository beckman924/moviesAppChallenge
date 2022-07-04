import React from "react";
import Searchbar from "./Searchbar";
import RatingFilter from "./RatingFilter";
import { Themoviedatabase } from "@styled-icons/simple-icons/Themoviedatabase";

function Navbar() {
  return (
    <div>
        <div className="grid place-content-center mt-5">
          <Themoviedatabase color="white" className="w-16"/>
        </div>
      <div className="top-0 flex items-center justify-center w-full">
        <Searchbar />
      </div>
      <RatingFilter />
    </div>
  );
}

export default Navbar;
