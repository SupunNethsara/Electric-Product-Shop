import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../HomeComponent/Home.jsx";


function UserInterFace() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />

        </Routes>
    );
}

export default UserInterFace;
