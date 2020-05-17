import React from "react";
import UserPreferences from "./components/UserPreferences";
import Navbar from "./components/Navbar";
const App = () => {
  return (
    <main>
      <Navbar />
      <div id="forestImg">
      <UserPreferences />

      </div>
    </main>
  );
};

export default App;
