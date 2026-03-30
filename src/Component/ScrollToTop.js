// ./Component/ScrollToTop.js
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function ScrollToTop() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ If scrollToStore flag is present
    if (location.state?.scrollToStore) {
      const storeSection = document.getElementById("store");

      if (storeSection) {
        storeSection.scrollIntoView({ behavior: "smooth" });
      }

      // ✅ Clean state properly (React way)
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      // ✅ Default: scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [location.pathname, location.state, navigate]);

  return null;
}