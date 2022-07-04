import "../styles/globals.css";
import { AppContext } from "../Context/AppContext";
import { AnimatePresence } from "framer-motion";

const variants = {
  hidden: { opacity: 0, x: 0, y: 200 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
};

function MyApp({ Component, pageProps }) {
  return (
    <AppContext>
      <AnimatePresence
        exitBeforeEnter={true}
        variants={variants}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <Component {...pageProps} />
      </AnimatePresence>
    </AppContext>
  );
}

export default MyApp;
