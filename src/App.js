import React, { useState } from "react";
import UserPreferences from "./components/UserPreferences";
import Navbar from "./components/Navbar";
import RunSummary from "./components/RunSummary";
import LapsTable from "./components/LapsTable";
import { Grid } from '@material-ui/core';

const App = () => {
  const [value, setValue] = React.useState("");
  const [unitPref, setUnitPref] = useState("Kilometers");
  const [durationPref, setDurationPref] = useState("Elapsed");
  const [lapTableViewPref, setLapTableViewPref] = useState("Manual Splits");
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
    else {
      setRunData(newValue);
      console.log(runData)
    }
  }



  return (
    <main>
      <Navbar />
      <Grid container wrap="wrap" style={{ marginTop: "20px" }}>
        <Grid item xs={3} style={{ marginTop: "20px" }}>
          <UserPreferences
            value={value}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6} style={{ marginTop: "20px" }}>
          <LapsTable
            lapTableViewPref={lapTableViewPref}
            unitPref={unitPref}
            durationPref={durationPref}
            runData={runData}
          />
        </Grid>
        <Grid item sm={12} md={3} style={{ marginTop: "20px" }}>
          <RunSummary
            value={value}
            onChange={handleChange}
            unitPref={unitPref}
            durationPref={durationPref}
          />
        </Grid>

      </Grid>

      {/* </div> */}

    </main>
  );
};

export default App;

