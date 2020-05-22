import React, { useState } from "react";
import UserPreferences from "./components/UserPreferences";
import Navbar from "./components/Navbar";
import RunSummary from "./components/RunSummary";
import LapsTable from "./components/LapsTable";
import { Grid } from '@material-ui/core';
import PeakPowers from "./components/PeakPowers";

const App = () => {
  const [value, setValue] = React.useState("");
  const [unitPref, setUnitPref] = useState("Kilometers");
  const [durationPref, setDurationPref] = useState("Elapsed");
  const [lapTableViewPref, setLapTableViewPref] = useState("Manual Splits");
  const [peakPowerViewPref, setpeakPowerViewPref] = useState("Bar Chart");
  const [runData, setRunData] = useState({});


  function handleChange(newValue) {
    console.log("======= Parent handle change")
    console.log("In the parent handle Change function ")
    console.log(newValue)
    // setValue(newValue);
    if (newValue === "Miles" || newValue === "Kilometers") {
      setUnitPref(newValue);
      console.log(unitPref)
    }
    else if (newValue === "Elapsed" || newValue === "Moving") {
      setDurationPref(newValue);
      console.log(durationPref)
    }
    else if (newValue === "Manual Splits" || newValue === "Distance Splits") {
      setLapTableViewPref(newValue);
      console.log(lapTableViewPref)
    }
    else if (newValue === "Bar Chart" || newValue === "Line Chart") {
      setpeakPowerViewPref(newValue);
      console.log(peakPowerViewPref)
    }
    else {
      setRunData(newValue);
      console.log(runData)
    }
  }



  return (
    <main>
      <Navbar />
      <Grid container wrap="wrap" style={{ marginTop: "20px" }}>
          <UserPreferences
            value={value}
            onChange={handleChange}
          />        
        <Grid item xs={12} md={6} style={{ marginTop: "20px", margin: "auto",   padding: "30px 10px", 
        // backgroundColor: "#001a33"
      }}
        >
          <LapsTable
            lapTableViewPref={lapTableViewPref}
            unitPref={unitPref}
            durationPref={durationPref}
            runData={runData}
          />
          <PeakPowers
            lapTableViewPref={lapTableViewPref}
            unitPref={unitPref}
            durationPref={durationPref}
            runData={runData}
            peakPowerViewPref={peakPowerViewPref}
          />
        </Grid>
        <Grid item sm={12} md={3} style={{ marginTop: "20px",   padding: "30px 10px", }}>
          <RunSummary
            value={value}
            onChange={handleChange}
            unitPref={unitPref}
            durationPref={durationPref}
          />
        </Grid>
      </Grid>
    </main>
  );
};

export default App;

