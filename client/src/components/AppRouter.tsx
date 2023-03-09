import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
// import { Oval } from "react-loader-spinner";
import { Navigate, Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import { privateRoutes, publicRoutes, RouteNames } from "../routes";
import userState from "../store/userState";
import Loader from "./Loader";

const AppRouter = observer(() => {
  const [auth, setAuth] = useState<boolean>(userState.isLoggedIn);
  const [loading, setLoading] = useState<boolean>(userState.isLoading);

  useEffect(() => {
    setAuth(userState.isLoggedIn);
  }, [userState.isLoggedIn]);

  useEffect(() => {
    // console.log("loading", userState.isLoading);
    setLoading(userState.isLoading);
  }, [userState.isLoading]);

  return (
    <>
      <Routes>
        {auth ? (
          <>
            {privateRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.component />}
              />
            ))}
            <Route
              path="*"
              element={<Navigate replace to={RouteNames.CHAT} />}
            />
          </>
        ) : (
          <>
            {publicRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.component />}
              />
            ))}
            <Route
              path="*"
              element={<Navigate replace to={RouteNames.LOGIN} />}
            />
          </>
        )}
      </Routes>

      {loading && <Loader />}
    </>
  );
});

export default AppRouter;
