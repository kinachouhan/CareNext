import { useEffect } from "react";
import { useLocation, Outlet } from "react-router";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

 
  return <Outlet />;
};

export default ScrollToTop;