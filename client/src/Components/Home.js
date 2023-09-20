import React from "react";
import Button from "@mui/material/Button";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import Nav from "./Nav";
import { Paper } from "@mui/material";
import "./Home.css";
import TopSection from "./TopSection";
import CalendarCo from "./CalendarCo";

const Home = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const location = useLocation();
  const signOut = () => {
    removeCookie("Name");
    removeCookie("Email");
    removeCookie("AuthToken");
    window.location.reload();
  };

  return (
    <section className="home-container">
      <Nav signOut={signOut} />
      <div className="home-content-container">
        <div className="top-section">
          <TopSection />
        </div>
        <div className="middle-section">
          <Paper className="mario box-2" elevation={7}>
            <CalendarCo email={cookies.Email} />
          </Paper>
        </div>
      </div>
    </section>
  );
};

export default Home;
