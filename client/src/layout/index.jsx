import React from "react";
import logo from "../assets/logo.png";

const AuthLayouts = ({ children }) => {
  return (
    <>
      <header className="flex justify-center items-center py-1 h-auto shadow-md bg-white"> {/* py-3 h-20 */}
          <img src={logo} width={80} height={60} className="" alt="logo" />
          <p className="font-bold text-2xl text-sky-500">CHAT APP</p>
      </header>
      {children}
    </>
  );
};
export default AuthLayouts;
