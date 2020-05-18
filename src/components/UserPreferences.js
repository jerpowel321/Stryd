import React, { useState } from "react";
import { Typography, Box } from "@material-ui/core"
import amber from '@material-ui/core/colors/amber';
import { makeStyles } from '@material-ui/core/styles';

const primary = '#000000';
const accent = amber[800];

const useStyles = makeStyles({
  root: {
    display: "block",
    width: "100%",
    margin: "auto",
    border: "1px solid gainsboro",
    padding: "30px 20px",
    color: "white"
  },
  h2: {
    display: "block"
  },
  p: {
    display: "inline",
    fontSize: "20px",
    padding: "0px 20px 0px 0px"
  },
  select: {
    fontSize: "16px",
    height: "40px",
    border: `3px solid ${accent}`,
    outline: "none"
    
  },
  option: {
    

  },

});

const UserPreferences = props => {
  const classes = useStyles();
  const [unitPref, setUnitPref] = useState("Miles");
  const [durationPref, setDurationPref] = useState("Elapsed");
  const [lapTableViewPref, setLapTableViewPref] = useState("Manual Splits");


  function handleChange(event) {
    console.log("=======Child handle change")
    console.log(event)
    // Invoke the callback with the new value
    props.onChange(event.target.value);
  }

  return (
    <section className={classes.root}>
      <p>{unitPref}</p>
      <p>{durationPref}</p>
      <p>{lapTableViewPref}</p>

      <h2 className={classes.h2}>User Settings</h2>
      <Box display="flex" flexWrap="wrap">
        <Box p={1} width={300} >
        <p className={classes.p}>Unit Preference:</p>
            <select
              className={classes.select}
              id={"unit-selector"}
              onChange={event => {
                setUnitPref(event.target.value);
                handleChange(event)
              }}
              value={unitPref}
            >
              <option>Kilometers</option>
              <option>Miles</option>
            </select>
        </Box>
        <Box p={1} width={350}>
        <p className={classes.p}>Duration Preference:</p>
            <select
              className={classes.select}
              id={"duration-type-selector"}
              onChange={event => {
                setDurationPref(event.target.value);
                handleChange(event)
              }}
              value={durationPref}
            >
              <option>Moving</option>
              <option>Elapsed</option>
            </select>
        </Box>
        <Box p={1} width={400}>
        <p className={classes.p}> Lap Table View Preference:</p>
            <select
              className={classes.select}
              id={"lap-table-type-selector"}
              onChange={event => {
                setLapTableViewPref(event.target.value);
                handleChange(event)
              }}
              value={lapTableViewPref}
            >
              <option>Manual Splits</option>
              <option>Distance Splits</option>
            </select>
        </Box>
      </Box>
    </section>
  );
};

export default UserPreferences;
