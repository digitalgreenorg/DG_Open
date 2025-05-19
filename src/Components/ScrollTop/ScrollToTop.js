import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { goToTop } from "../../Utils/Common";

const ScrollToTop = () => {
  // Extracts pathname property(key) from an object
  const { pathname } = useLocation();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    setTimeout(() => {
      // window.scrollTo(0, 0);
      goToTop(0);
    }, 0);
  }, [pathname]);
  return <></>;
};

export default ScrollToTop;
