import React, { useState } from "react";
import { Grid } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import SettingsIcon from '@material-ui/icons/Settings';
import TimerIcon from '@material-ui/icons/Timer';
import BarChartIcon from '@material-ui/icons/BarChart';
import FilterHdrIcon from '@material-ui/icons/FilterHdr';


const useStyles = makeStyles({
  root: {
    display: "block",
    maxWidth: "450px",
    border: "1px solid gainsboro",
    padding: "30px 10px",
    color: "white",
    backgroundColor: "#001a33",
    justifyItems: "center",
    margin: "auto",
    marginTop: "20px", 
  },
  grid: {
    flexGrow: 1,
  },
  grid2:{
    alignItems: "center",
    paddingTop: "10px",
    justify: "center",
  },
  h2: {
    display: "inline",
    verticalAlign: "middle",
  },
  div: {
    padding: "20px 0px"
  },
  p: {
    display: "inline",
    fontSize: "22px",
    verticalAlign: "middle"
  },
  icon: {
    display: "inline",
    paddingTop: "2px",
    paddingRight: "7px",
    color: "white",
    width: "35px",
    fontSize: "30px",
    verticalAlign: "middle"
  },
  select: {
    fontSize: "16px",
    height: "40px",
    outline: "none",
    width: "140px",
    
  },
  selectFocused: {
    minWidth: "140px",
    width: "auto",
    margin: "10px",
    outlineColor: "yellow",
    outlineStyle: "outset",
    outlineWidth: "thin",
  },
  options: {

  }
 


});

const UserPreferences = props => {
  const classes = useStyles();
  const [unitPref, setUnitPref] = useState("Kilometers");
  const [durationPref, setDurationPref] = useState("Elapsed");
  const [lapTableViewPref, setLapTableViewPref] = useState("Manual Splits");
  const [peakPowerViewPref, setPeakPowerViewPref] = useState("Bar Chart");



  function handleChange(event) {
    console.log("=======Child handle change")
    console.log(event)
    // Invoke the callback with the new value
    props.onChange(event.target.value);
  }

  return (
    <Grid item className={classes.root} justify="center" xs={10} sm={8} md={3} >
      <div align="center" className={classes.div}>
      <SettingsIcon className={classes.icon}/>
        <h2 align="center" className={classes.h2}>
        User Settings</h2>
      </div>
      <Grid style={{margin: "auto"}} container className={classes.grid} spacing={2}>
        <Grid item xs={12}>
          <Grid container className={classes.grid2}>
            <Grid item xs={6} >
              <DirectionsRunIcon className={classes.icon}/>
              <p className={classes.p}> 
              Unit</p>
            </Grid>
            <Grid item xs={6} align="center">
                <select
                  className={classes.select}
                  classes={{ focused: classes.selectFocused}}
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
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container className={classes.grid2}>
            <Grid item xs={6}>
              <TimerIcon className={classes.icon}/>
              <p className={classes.p}>Duration</p>
            </Grid>
            <Grid item xs={6} align="center">
              <select
                className={classes.select}
                classes={{ focused: classes.selectFocused}}
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
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container className={classes.grid2}>
            <Grid item xs={6}>
              <BarChartIcon className={classes.icon}/>
            <p className={classes.p}> Lap Table View</p>
            </Grid>
            <Grid item xs={6} align="center">
            <select
            className={classes.select}
            classes={{ focused: classes.selectFocused}}
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
              </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container className={classes.grid2}>
            <Grid item xs={7}>
              <FilterHdrIcon className={classes.icon}/>
            <p className={classes.p}> Peak Powers View</p>
            </Grid>
            <Grid item xs={4} align="center">
            <select
            className={classes.select}
            classes={{ focused: classes.selectFocused}}
            id={"lap-table-type-selector"}
            onChange={event => {
              setPeakPowerViewPref(event.target.value);
              handleChange(event)
            }}
            value={peakPowerViewPref}
          >
            <option>Bar Chart</option>
            <option>Line Chart</option>
          </select>
              </Grid>
          </Grid>
        </Grid>

      </Grid>     
    </Grid>
  );
};

export default UserPreferences;
