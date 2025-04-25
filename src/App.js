import React from "react";
import DoctorListing from "./DoctorListing";

function App() {
  return (
    <div className="App">
      <h1 style={{ textAlign: "center", margin: "2rem 0" }}>Doctor Finder</h1>
      <DoctorListing />
    </div>
  );
}

export default App;
