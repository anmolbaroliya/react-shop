import {Route,Routes}  from "react-router-dom";

import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Layout from "../layout/Layout";

function AppRoutes(){
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>}/>
                <Route path="cart" element={<Cart/>}/>
            </Route>
        </Routes>
    )
}

export default AppRoutes;