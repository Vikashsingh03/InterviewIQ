import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import PracticeQuestion from "./Pages/PracticeQuestion";
import Auth from "./Pages/Auth";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";
import InterviewPage from "./Pages/InterviewPage";
import AptitudePage from "./Pages/AptitudePage";
import InterviewHistory from "./Pages/InterviewHistory";
import Pricing from "./Pages/Pricing";
import InterviewReport from "./Pages/InterviewReport";
import Analytics from "./Pages/Analytics";
import PracticeHub from "./Pages/PracticeHub";
import ProtectedRoute from "./components/ProtectedRoute";

export const ServerUrl = import.meta.env.DEV ? "http://localhost:8000" : "https://interviewiq-backend-61bf.onrender.com";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/user/current-user", {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      }
    };

    getUser();
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/interview"
        element={
          <ProtectedRoute>
            <InterviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aptitude"
        element={
          <ProtectedRoute>
            <AptitudePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <InterviewHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pricing"
        element={
          <ProtectedRoute>
            <Pricing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report/:id"
        element={
          <ProtectedRoute>
            <InterviewReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/practice"
        element={
          <ProtectedRoute>
            <PracticeHub />
          </ProtectedRoute>
        }
      />
      <Route
        path="/practice/:type/:id"
        element={
          <ProtectedRoute>
            <PracticeQuestion />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;