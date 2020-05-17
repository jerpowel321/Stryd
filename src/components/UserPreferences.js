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
    padding: "0px 10px 0px 0px"
  },
  select: {
    fontSize: "16px",
    padding: "20px",
    width: "150px",
    height: "40px",
    outline: accent
  },
  option: {
    width: 250,
  },

});

const UserPreferences = props => {
  const classes = useStyles();
  const [unitPref, setUnitPref] = useState("Kilometers");
  const [durationPref, setDurationPref] = useState("Moving");
  const [lapTableViewPref, setLapTableViewPref] = useState("Manual Splits");

  return (
    <section className={classes.root}>
      <h2 className={classes.h2}>User Settings</h2>
      <Box display="flex" flexWrap="wrap">
        <Box p={1} width={300} >
        <p className={classes.p}>Unit Preference:</p>
            <select
              className={classes.select}
              id={"unit-selector"}
              onChange={event => {
                setUnitPref(event.target.value);
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
