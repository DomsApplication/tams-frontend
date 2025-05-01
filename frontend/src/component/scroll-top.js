import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

//  on reload scroll to the top of the page
const ScrollTop = ({ children }) => {
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return children || null;
};

ScrollTop.propTypes = {
  children: PropTypes.node,
};

export default ScrollTop;
