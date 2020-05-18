import React from "react";
import UserPreferences from "./components/UserPreferences";
import Navbar from "./components/Navbar";
import RunSummary from "./components/RunSummary";
import Footer from "./components/Footer";

const App = () => {
  return (
    <main>
      <Navbar />
      <div id="forestImg">
      <UserPreferences />
      <RunSummary/>
      </div>
      <Footer />

    </main>
  );
};

export default App;
