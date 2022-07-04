import React from "react";
import { HomeAlt, Search, User } from "@styled-icons/boxicons-regular/";

function Footer() {
  return (
    <div className="fixed bottom-[5px] left-[10px] right-[10px] flex justify-around text-white">
      <button>
        <HomeAlt color="white" size={30} title="Home Button" />
      </button>
      <button>
        <Search color="white" size={30} title="Search Icon" />
      </button>
      <button>
        <User color="white" size={30} title="About Button" />
      </button>
    </div>
  );
}

export default Footer;
