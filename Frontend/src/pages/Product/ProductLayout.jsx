import React from "react";
import ProductSearchBar from "../../components/product/ProductSearchBar.jsx";
import { Outlet } from "react-router";


export default function ProductLayout(){

    return(
        <>
            <ProductSearchBar/>
            <Outlet/>
        </>
    )
}