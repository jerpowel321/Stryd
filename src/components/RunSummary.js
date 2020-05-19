import React from 'react';
import { FormControl, Select, MenuItem, Grid, FormControlLabel, } from '@material-ui/core';

import { activityApi, userToken } from '../api'
import { withStyles } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';

const accent = amber[800];
// const useStyles = makeStyles({
//   root: {
//     display: "block",
//     width: "300px",
//     margin: "auto",
//     border: "1px solid gainsboro",
//     padding: "30px 20px",
//     color: "white"
//   },
//   div: {
//     background: "white"
//   },
//   grid: {
//     flexGrow: 1,
//   },
//   grid2:{
//     alignItems: "center"
//   },
//   h2: {
//     margin: "auto"
//   },
//   p: {
//     display: "inline",
//     fontSize: "22px",
//     alignContent: "right",
//     textShadow: "2px 2px black"
//   },
//   icon: {
//     paddingTop: "2px",
//     paddingRight: "5px",
//     color: "black"
//   },
//   select: {
//     fontSize: "16px",
//     height: "40px",
//     outline: "none"

//   },
//   option: {


//   },

// });
const useStyles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class Runsummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      runData: {},
      runTitle: "",
      durationPref: this.props.durationPref,
      duration: "",
      unitPref: this.props.unitPref,
      distance: "",
      avgPace: 0,
      avgPower: 0,
      dataLoaded: false,
      lapTableViewPref: this.props.lapTableViewPref,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    console.log("This is the props for run Summary")
    console.log(this.props.durationPref)
    console.log(this.props.unitPref)
    console.log("=================================")

    console.log("Rum Summary did mount")
    fetch(activityApi, {
      method: "GET",
      withCredentials: true,
      headers: {
        "Authorization": `Bearer ${userToken}`,
      }
    })
      .then(resp => resp.json())
      .then((data) => {
        console.log(data)
        this.findRunDuration(data.timestamp_list, data.total_power_list)
        this.findRunDistance(data.distance_list[data.distance_list.length - 1])
        this.setState({
          runData: data,
          runTitle: data.name
        },
          () =>
            this.setState({
              dataLoaded: true
            },
              () => {
                this.findAvgPace(data.speed_list)
                this.findAvgPower(data.total_power_list)
              },
              () => this.setState({
                dataLoaded: false
              })
            )
        )
      })
  }

  componentWillReceiveProps({ unitPref }) {
    console.log(" Updating child Props")
    console.log({ unitPref })
    console.log(this.state.runData)
    this.setState({ ...this.state, unitPref },
      () => {
    this.findRunDuration(this.state.runData.timestamp_list, this.state.runData.total_power_list)
    this.findRunDistance(this.state.runData.distance_list[this.state.runData.distance_list.length - 1])
      },
      () => this.setState({
        dataLoaded: true
      })
    
      ,
      () => {
        this.findAvgPace(this.state.runData.speed_list)
        this.findAvgPower(this.state.runData.total_power_list)
      },
      () => this.setState({
        dataLoaded: false
      })
      )

  }

  findAvgPower(powerData) {
    let powerSum = 0;
    let powerAvg;
    for (let i = 0; i < powerData.length; i++) {
      if (powerData[1] > 0) {
        powerSum += powerData[1]
      }
    }
    let seconds = this.getSeconds(this.state.duration)
    powerAvg = (powerSum / seconds).toFixed(0)
    console.log("this is the calculated power Avg ", powerAvg)
    this.setState({
      avgPower: powerAvg
    })

    return powerAvg
  }

  getSeconds(hms) {
    let a = hms.split(':');
    let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    return seconds
  }

  findAvgPace(speedData) {
    let speed;
    let seconds = this.getSeconds(this.state.duration)
    speed = ((seconds / 60) / this.state.distance)
    speed = speed.toFixed(2)
    let hms = this.convertToHMS(speed * 60)
    console.log("this is the duration", this.state.duration)
    console.log("this is the speed", speed);
    console.log("speed converted to hms ", this.convertToHMS(speed * 60))
    console.log("This is the seconds ", seconds);
    console.log("This is the distance ", this.state.distance)
    console.log("This is how many minutes per " + this.state.unitPref + " : " + speed + " " + this.state.durationPref)
    console.log("this is the average pace ", hms)
    this.setState({
      avgPace: hms
    })
    return hms
  }

  // Assuming distance is in yards
  findRunDistance(distance) {
    console.log("Distance in meters", distance)
    if (this.state.unitPref === "Miles") {
      return this.convertToMiles(distance)
    }
    else {
      return this.convertToKilometers(distance)
    }
  }
  convertToKilometers(distanceInMeters){
    let kilometers = distanceInMeters / 1000;
    kilometers = kilometers.toFixed(2)
    console.log("this is the kilometers", kilometers)
    this.setState({
      distance: kilometers
    })
    return kilometers
  }
  convertToMiles(distanceInMeters) {
    let miles = distanceInMeters / 1609;
    miles = miles.toFixed(2)
    console.log("this is the miles ", miles)
    this.setState({
      distance: miles
    })
    return miles
  }

  findRunDuration(timestamp, powerList) {
    let duration;
    let startTime = timestamp[0];
    let endTime = timestamp[timestamp.length - 1]
    let diff = endTime - startTime
    if (this.state.durationPref === "Elapsed") {
      duration = this.convertToHMS(diff)
      console.log("Elapsed Duration: ", duration)
    }
    else {
      // Assuming that the user was not moving when they paused their recording
      let missingDataPoints = diff - timestamp.length;
      console.log(missingDataPoints)
      let secondsNotMoving = 0;
      // Iterate through the powerList array, a power value of 0, indicates that the user was not moving.
      for (let i = 0; i < powerList.length; i++) {
        for (let j = 0; j < timestamp.length; j++) {
          if (powerList[i] === 0) {
            secondsNotMoving++
          }
        }
      }
      diff += - missingDataPoints - secondsNotMoving
      duration = this.convertToHMS(diff)
      console.log("Moving Duration: ", duration)
    }
    this.setState({
      duration: duration
    })
  }
  convertToHMS(time) {
    let hrs = ~~(time / 3600);
    let mins = ~~((time % 3600) / 60);
    let secs = ~~time % 60;

    let ret = "";
    if (hrs > 0) {
      ret += (hrs < 10 ? `0${hrs}` : hrs) + ":" + (mins < 10 ? "0" : "");
    }
    if (hrs === 0) {
      ret += "00:" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }


  handleChange = (event) => {
    this.setState({
      selectedState: event.target.value,
      updateChart: false
    });
    this.showData(this.state.mergeData, event.target.value)
  };


  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className="hero">

          {this.state.dataLoaded === true ? <div>
            <div className="container">
              <Grid container alignContent="center" align="center" alignItems="stretch" justify="center" >
                {/* <h1 >Run Summary</h1>
              <h2>Run Title {this.state.runTitle}</h2>
              <h1>Run Distance {this.state.distance}{this.state.unitPref}</h1>
              <h1>Average {this.state.durationPref} Pace {this.state.avgPace} per {this.state.unitPref}</h1>
              <h1>This is the duration Preference{this.state.durationPref}</h1>
              <h1>This is the unit Preference{this.state.unitPref}</h1> */}

                <Grid item alignItems="stretch">
                  <div style={{ backgroundColor: "#001a33", padding: "20px 10px", margin: "10px 20px", width: "180px", borderRadius: "10px", boxShadow: "0px 3px 15px rgba(0,0,0,0.2)", minHeight: "180px" }}>
                    <div style={{ minHeight: "100px" }}>
                      <img style={{ paddingTop: "20px" }} src="https://img.icons8.com/dusk/64/000000/clock.png" />
                    </div>
                    <h3 style={{ fontFamily: "'Lato', sans-serif", margin: "2px", fontSize: "22px", color: "white" }}>{this.state.durationPref} Duration</h3>
                    <p style={{ fontFamily: "'Roboto Slab', serif", fontSize: "18px", margin: "10px", color: "white" }}>{this.state.duration} </p>
                  </div>
                </Grid>
                <Grid item >
                  <div style={{ backgroundColor: "#001a33", padding: "20px 10px", margin: "10px 20px", width: "180px", borderRadius: "10px", boxShadow: "0px 3px 15px rgba(0,0,0,0.2)", minHeight: "180px" }}>
                    <div style={{ minHeight: "100px" }}>
                      <img src="https://img.icons8.com/ios-filled/100/000000/speedometer.png" width="80px" />
                    </div>
                    <h3 style={{ fontFamily: "'Lato', sans-serif", margin: "2px", fontSize: "22px", color: "white" }}>Distance</h3>
                    <p style={{ fontFamily: "'Roboto Slab', serif", fontSize: "18px", margin: "10px", color: "white" }}>{this.state.distance} {this.state.unitPref}</p>
                  </div>
                </Grid>
                <Grid item >
                  <div style={{ backgroundColor: "#001a33", padding: "20px 5px", margin: "10px 20px", width: "180px", borderRadius: "10px", boxShadow: "0px 3px 15px rgba(0,0,0,0.2)", minHeight: "180px" }}>
                    <div style={{ minHeight: "100px" }}>
                      <img width="80px" style={{ paddingTop: "10px" }} src="https://img.icons8.com/plasticine/100/000000/running.png" />
                    </div>
                    <h3 style={{ fontFamily: "'Lato', sans-serif", margin: "2px", fontSize: "22px", color: "white" }}>Average Pace</h3>
                    <p style={{ fontFamily: "'Roboto Slab', serif", fontSize: "18px", margin: "10px", color: "white" }}>{this.state.avgPace}</p>
                  </div>
                </Grid>
                <Grid item >
                  <div style={{ backgroundColor: "#001a33", padding: "20px 5px", margin: "10px 20px", width: "180px", borderRadius: "10px", boxShadow: "0px 3px 15px rgba(0,0,0,0.2)", minHeight: "180px" }}>
                    <div style={{ minHeight: "100px" }}>
                      <img width="60px" style={{ paddingTop: "20px" }} src="https://img.icons8.com/officel/80/000000/reflector-bulb.png" />
                    </div>
                    <h3 style={{ fontFamily: "'Lato', sans-serif", margin: "2px", fontSize: "22px", color: "white" }}>Average Power</h3>
                    <p style={{ fontFamily: "'Roboto Slab', serif", fontSize: "18px", margin: "10px", color: "white" }}>{this.state.avgPower} Watts (W)</p>
                  </div>

                </Grid>
              </Grid>
            </div>
          </div>
            :
            null
          }
        </div>
      </div>
    );
  }
}




export default Runsummary;
