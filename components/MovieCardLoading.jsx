import React from "react";

function MovieCardLoading() {
  let key = 0;
  return (
    <>
      {[...Array(20)].map(() => {
        key++;
        return (
          <div
            key={key}
            className="overflow-hidden animate-pulse w-[385px] md:w-[350px] h-[526px] bg-[#CBD5E1]"
          ></div>
        );
      })}
    </>
  );
}

export default MovieCardLoading;
