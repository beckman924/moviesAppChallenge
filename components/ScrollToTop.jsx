import { useEffect, useState } from "react";
import { ArrowUpCircleFill } from "@styled-icons/bootstrap/ArrowUpCircleFill";
import styles from "../styles/ScrollToTop.module.css";

function ScrollToTop() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className={styles.top_to_btm}>
      {showTopBtn && (
        <ArrowUpCircleFill
          className={styles.icon_style}
          onClick={() => goToTop()}
        />
      )}
    </div>
  );
}

export default ScrollToTop;
