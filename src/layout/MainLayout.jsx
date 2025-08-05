import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const MainLayout = () => {
  const location = useLocation();
  const hideLayout = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div>
      {!hideLayout && <Header />}
      <Outlet />
      {!hideLayout && <Footer />}
    </div>
  );
};

export default MainLayout;
