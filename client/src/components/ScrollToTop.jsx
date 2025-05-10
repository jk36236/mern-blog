import { useEffect } from "react"
import { useLocation } from "react-router-dom"


//whenever path chnages on iur website ,on the next page we automatically get on top
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default ScrollToTop