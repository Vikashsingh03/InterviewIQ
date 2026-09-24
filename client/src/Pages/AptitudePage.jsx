import React from "react";
import { useNavigate } from "react-router-dom";
import AptitudeRound from "../components/AptitudeRound";

function AptitudePage() {
  const navigate = useNavigate();
  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };
  return <AptitudeRound onExit={goBack} />;
}

export default AptitudePage;
