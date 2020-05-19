import React, { useState } from "react";
import UserPreferences from "./components/UserPreferences";
import Navbar from "./components/Navbar";
import RunSummary from "./components/RunSummary";
import Footer from "./components/Footer";
import { Grid } from '@material-ui/core';

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
    if (newValue === "Miles" || newValue === "Kilometers") {
      setUnitPref(newValue);
      console.log(unitPref)
    }
    else if (newValue === "Elapsed" || newValue === "Moving") {
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
      <Grid container wrap="wrap"  style={{ marginTop: "20px" }}>
        <Grid item xs={4} style={{ marginTop: "20px" }}>
          <UserPreferences value={value} onChange={handleChange} />
        </Grid>
        <Grid item xs={6} style={{ marginTop: "20px" }}>
        </Grid>
        <Grid item sm={12} md={2}  style={{ marginTop: "20px" }}>
          <RunSummary
            unitPref={unitPref}
            durationPref={durationPref}
            lapTableViewPref={lapTableViewPref}
          />
        </Grid>

      </Grid>

      {/* </div> */}
      {/* <Footer /> */}

    </main>
  );
};

export default App;

