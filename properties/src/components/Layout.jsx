import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <NavBar />
      <main style={{ flex: 1 }}>{children}</main>
      <div className="d-none d-md-block">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
