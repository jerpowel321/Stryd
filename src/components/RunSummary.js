import React from 'react';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { FormControl, Select, MenuItem, Grid, FormControlLabel, } from '@material-ui/core';

import { activityApi, userToken } from '../api'


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#004159'
    },
  },
});

class Runsummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      runData: {},
      runTitle: "",
      durationType: "",
      duration: "",
      distanceType: "miles",
      distance: "",
      avgPace: 0,
      avgPower: 0,
      dataLoaded: false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  // buttonClick = (event) => {
  //   let { name } = event.target;
  //   this.setState({
  //     [name]: !this.state[name],
  //     updateChart: false,
  //   }, () => {
  //     this.showData(this.state.mergeData, this.state.selectedState)
  //   });
  // }

  componentDidMount() {
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

  findAvgPower(powerData) {
    let powerSum = 0;
    for (let i = 0; i < powerData.length; i++) {
      powerSum += powerData[1]
    }
    let powerAvg = powerSum / powerData.length
    console.log("This is the powerAvg in Watts ", powerAvg)
    return powerAvg
  }


  findAvgPace(speedData) {
    console.log("this is the duration", this.state.duration)
    console.log("this is the speed data ", speedData)
    let speed;
    let hms = this.state.duration;
    let a = hms.split(':');
    let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    speed = ((seconds / 60) / this.state.distance)
    speed = speed.toFixed(4)
    hms = this.convertToHMS(speed * 60)
    console.log(speed);
    console.log(this.convertToHMS(speed * 60))
    console.log("seconds ", seconds);
    console.log(this.state.distance)
    console.log(speed + " " + this.state.durationType + " minute per "+ this.state.distanceType )
    console.log("this is the average pace ", hms)
    this.setState({
      avgPace: hms
    })
    return hms
  }

  // Assuming distance is in yards
  findRunDistance(distance) {
    console.log(distance)
    if (this.state.distanceType === "miles") {
      return this.convertToMiles(distance)
    }
    else {
      return this.convertToKilometers(distance)
    }
  }
  convertToMiles(distance) {
    let miles = distance / (1760)
    miles = miles.toFixed(2)
    console.log("this is the miles ", miles)
    this.setState({
      distance: miles
    })
    return miles
  }
  convertToKilometers(distance) {
    let kilometers = distance / (1093.613298)
    kilometers = kilometers.toFixed(2)
    console.log("this is the kilometers", kilometers)
    this.setState({
      distance: kilometers
    })
    return kilometers
  }
  findRunDuration(timestamp, powerList) {
    let duration;
    let startTime = timestamp[0];
    let endTime = timestamp[timestamp.length - 1]
    let diff = endTime - startTime
    if (this.state.durationType === "elapsed") {
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
      diff +=  - missingDataPoints - secondsNotMoving
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
      ret += (hrs < 10 ? `0${hrs}`: hrs) + ":" + (mins < 10 ? "0" : "");
    }
    if (hrs === 0) {
      ret += "00:" +(mins< 10 ? "0" : "");
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
    return (
      <ThemeProvider theme={theme}>
        <div>
          {this.state.dataLoaded === true ? <div>
            <div className="container">
              <Grid container spacing={1}>
                <h1 >Run Summary</h1>
                <h2>Run Title {this.state.runTitle}</h2>
                <h1>Run Distance {this.state.distance}{this.state.distanceType}</h1>
                <h1>Average {this.state.durationType} Pace {this.state.avgPace} per {this.state.distanceType}</h1>
              </Grid>
            </div>
          </div>
            :
            null
          }
        </div>
      </ThemeProvider >
    );
  }
}

export default Runsummary;
