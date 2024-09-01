import React, { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Profile from "./pages/profile";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "./store/reducers/userSlice";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";

const PrivateRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.userSlice.userInfo ?? {});
  const isAuthenticated = !!(Object.keys(userInfo).length > 0);
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.userSlice.userInfo ?? {});
  // console.log('userInfo', userInfo)
  const isAuthenticated = !!(Object.keys(userInfo).length > 0);
  // console.log("isAuthenticated", isAuthenticated);
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  const userInfo = useSelector((state) => state.userSlice.userInfo ?? {});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const getUserData = async () => {
    try {
      const res = await apiClient.get(GET_USER_INFO, { withCredentials: true });
      if (res.status === 202 && res.data.id) {
        dispatch(setUserInfo(res.data));
      } else {
        dispatch(setUserInfo(""));
      }
    } catch (error) {
      dispatch(setUserInfo(""));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object?.keys(userInfo)?.length === 0) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo]);
  if (loading) {
    return <div>loading...</div>;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
