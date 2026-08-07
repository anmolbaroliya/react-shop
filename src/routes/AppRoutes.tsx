import { Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";

import Layout from "../layout/Layout";

const Home = React.lazy(() => import("../pages/Home"));
const Cart = React.lazy(() => import("../pages/Cart"));

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<h2>Loading Home...</h2>}>
              <Home />
            </Suspense>
          }
        />

        <Route
          path="cart"
          element={
            <Suspense fallback={<h2>Loading Cart...</h2>}>
              <Cart />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
