import "../styles/main.scss";
import toggleAccordion from "./accordion";

// require.context() to make sure webpack picks up image files.
require.context("../images/", true, /\.(svg|gif|png|jp?g|webp)/i, "lazy");

const runOnPageLoad = () => {
  // Call all other scripts here
  toggleAccordion();
};

if (document.readyState !== "loading") {
  // Page was finished loading before we came to this line. Run whatever you like.
  runOnPageLoad();
} else {
  // Page was not finished loading yet, so we attach an event listener.
  window.addEventListener("DOMContentLoaded", () => {
    // Run this when page is finished loading.
    runOnPageLoad();
  });
}
