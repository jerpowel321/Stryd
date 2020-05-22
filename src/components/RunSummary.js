import React from 'react';
import { Grid, duration } from '@material-ui/core';
import { activityApi, userToken } from '../api'
import { withStyles } from '@material-ui/styles';
import Cards from "./Card";

const styles = theme => ({
  h1: {
    color: "white",
    backgroundColor: "#001a33",
    padding: "10px 20px",
    margin: "auto",
    marginBottom: "10px"
  },
});

class Runsummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      runData: this.props.runData,
      unitPref: this.props.unitPref,
      durationPref: this.props.durationPref,
      runTitle: "",
      duration: "",
      distance: "",
      avgPace: 0,
      avgPower: 0,
      dataLoaded: false,
    }
  }

  componentDidMount() {
    // console.log("Rum Summary did mount")
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
        this.setState({
          runData: data,
        })
        this.passDataToParent(data)
        let duration = this.findRunDuration()
        let distance = this.findRunDistance(data.distance_list[data.distance_list.length - 1])
        let avgPace = this.findAvgPace(data.speed_list, duration, distance)
        let avgPower = this.findAvgPower(data.total_power_list, duration)
        this.setState({
          runTitle: data.name,
          duration: duration,
          distance: distance,
          avgPace: avgPace,
          avgPower: avgPower,
          dataLoaded: true
        })
      })
  }

  componentWillReceiveProps({ unitPref, durationPref }) {
    this.setState({
      ...this.state, unitPref, durationPref
    },
      () => {
            let duration = (this.findRunDuration(this.state.runData.timestamp_list, this.state.runData.total_power_list))
            let distance = (this.findRunDistance(this.state.runData.distance_list[this.state.runData.distance_list.length - 1]))
            let avgPace = (this.findAvgPace(this.state.runData.speed_list, duration, distance))
            let avgPower = (this.findAvgPower(this.state.runData.total_power_list, duration))
            this.setState({
              duration: duration,
              distance: distance,
              avgPace: avgPace,
              avgPower: avgPower
            })
          },
        )
  }

  findAvgPower(powerData, duration) {
    let powerSum = 0;
    let powerAvg;
    for (let i = 0; i < powerData.length; i++) {
      if (powerData[1] > 0) {
        powerSum += powerData[1]
      }
    }
    let seconds = this.getSeconds(duration)
    powerAvg = (powerSum / seconds).toFixed(0)
    return powerAvg
  }

  getSeconds(hms) {
    let a = hms.split(':');
    let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    return seconds
  }

  findAvgPace(speedData, duration, distance) {
    // console.log("Finding the average pace =======")
    let speed;
    let seconds = this.getSeconds(duration)
    speed = ((seconds / 60) / distance)
    speed = speed.toFixed(2)
    let hms = this.convertToHMS(speed * 60)
    this.setState({
      avgPace: hms
    })
    return hms
  }

  findRunDistance(meters) {
    // console.log("Distance in meters", distance)
    let distance = (this.state.unitPref==="Miles"? this.convertToMiles(meters): this.convertToKilometers(meters))
    return distance
  }
  convertToKilometers(distanceInMeters) {
    let kilometers = distanceInMeters / 1000;
    kilometers = kilometers.toFixed(2)
    // console.log("this is the kilometers", kilometers)
    this.setState({
      distance: kilometers
    })
    return kilometers
  }
  convertToMiles(distanceInMeters) {
    let miles = distanceInMeters / 1609;
    miles = miles.toFixed(2)
    // console.log("this is the miles ", miles)
    this.setState({
      distance: miles
    })
    return miles
  }

  findRunDuration() {
    let timestamp = this.state.runData.timestamp_list
    let powerList = this.state.runData.total_power_list
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
      console.log("This is the missing seconds" , missingDataPoints)
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
    return duration
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


  passDataToParent(runData) {
    // console.log("=======Child handle change")
    // Invoke the callback with the new value
    this.props.onChange(runData);
  }


  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className="hero"> </div>
        {this.state.dataLoaded === true ? <div>
          <div className="container" >
            <h1 align="center" className={classes.h1}>{this.state.runTitle}</h1>
            <Grid container alignContent="center" align="center" alignItems="stretch" justify="center" >
              <Cards
                title={`${this.state.durationPref} Duration`}
                p={this.state.duration}
                src="https://img.icons8.com/dusk/64/000000/clock.png"
                alt="Clock"
              />
              <Cards
                title="Distance"
                p={`${this.state.distance} ${this.state.unitPref}`}
                src="https://img.icons8.com/color/96/000000/ruler.png"
                alt="Ruler"
                imgWidth="60px"
              />
              <Cards
                title="Average Pace"
                p={this.state.avgPace}
                src="https://img.icons8.com/plasticine/100/000000/running.png"
                alt="Runner"
                imgWidth="80px"
              />
              <Cards
                title="Average Power"
                p={`${this.state.avgPower} Watts (W)`}
                src="https://img.icons8.com/officel/80/000000/reflector-bulb.png"
                alt="Light Bulb"
                imgWidth="60px"
              />
            </Grid>
          </div>
        </div>
          :
          null
        }

      </div>
    );
  }
}



export default withStyles(styles)(Runsummary);
