import React, { useState }  from "react";
import UserPreferences from "./components/UserPreferences";
import Navbar from "./components/Navbar";
import RunSummary from "./components/RunSummary";
import Footer from "./components/Footer";

const App = () => {
  const [value, setValue] = React.useState("");
  const [unitPref, setUnitPref] = useState("Miles");
  const [durationPref, setDurationPref] = useState("Elapsed");
  const [lapTableViewPref, setLapTableViewPref] = useState("Manual Splits");
 
  function handleChange(newValue) {
    console.log("======= Parent handle change")
    console.log("In the parent handle Change function ")
    console.log(newValue)
    // setValue(newValue);
    if (newValue === "Miles" || newValue === "Kilometers"){
      setUnitPref(newValue);
      console.log(unitPref)
    }
    else if (newValue === "Elapsed" || newValue === "Moving"){
      setDurationPref(newValue);
      console.log(durationPref)
    }
    else {
      setLapTableViewPref(newValue);
      console.log(lapTableViewPref)
    }
  }


  return (
    <main>
      <Navbar />
      <p>I'm in the parent!!!</p>
      {unitPref ? <p>{unitPref}</p> : null}
      {durationPref ? <p>{durationPref}</p> : null}
      {lapTableViewPref ? <p>{lapTableViewPref}</p> : null}
      <div id="forestImg">
      <UserPreferences value={value} onChange={handleChange}/>
      <RunSummary
      unitPref={unitPref}
      durationPref={durationPref}
      lapTableViewPref={lapTableViewPref}
      />
      </div>
      {/* <Footer /> */}

    </main>
  );
};

export default App;

