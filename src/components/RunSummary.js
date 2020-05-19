import React from 'react';
import {Grid} from '@material-ui/core';
import { activityApi, userToken } from '../api'

class Runsummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      runData: this.props.runData,
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
    // this.handleChange = this.handleChange.bind(this);
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
        // console.log(data)
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
                this.passDataToParent(data)
              },
              () => this.setState({
                dataLoaded: false
              })
            )
        )
      })
  }

  componentWillReceiveProps({ unitPref, durationPref }) {
    // console.log("UPDATING================================>")
    // console.log(" Updating child Props")
    // console.log({ unitPref })
    // console.log({ durationPref })
    // console.log(this.state.runData)

    this.setState({
      ...this.state, unitPref, durationPref
    },
      () =>
        this.setState({
          dataLoaded: true
        },
          () => {
            this.findRunDuration(this.state.runData.timestamp_list, this.state.runData.total_power_list)
            this.findRunDistance(this.state.runData.distance_list[this.state.runData.distance_list.length - 1])
            this.findAvgPace(this.state.runData.speed_list)
            this.findAvgPower(this.state.runData.total_power_list)
          }
        )
    )

  }

  findAvgPower(powerData) {
    // console.log("FINDAVGPOWER")
    let powerSum = 0;
    let powerAvg;
    for (let i = 0; i < powerData.length; i++) {
      if (powerData[1] > 0) {
        powerSum += powerData[1]
      }
    }
    let seconds = this.getSeconds(this.state.duration)
    powerAvg = (powerSum / seconds).toFixed(0)
    // console.log("this is the calculated power Avg ", powerAvg)
    this.setState({
      avgPower: powerAvg
    })
    // console.log(powerAvg)
    return powerAvg
  }

  getSeconds(hms) {
    let a = hms.split(':');
    let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    return seconds
  }

  findAvgPace(speedData) {
    // console.log("Finding the average pace =======")
    let speed;
    let seconds = this.getSeconds(this.state.duration)
    speed = ((seconds / 60) / this.state.distance)
    speed = speed.toFixed(2)
    let hms = this.convertToHMS(speed * 60)
    // console.log("this is the duration", this.state.duration)
    // console.log("this is the speed", speed);
    // console.log("speed converted to hms ", this.convertToHMS(speed * 60))
    // console.log("This is the seconds ", seconds);
    // console.log("This is the distance ", this.state.distance)
    // console.log("This is how many minutes per " + this.state.unitPref + " : " + speed + " " + this.state.durationPref)
    // console.log("this is the average pace ", hms)
    this.setState({
      avgPace: hms
    })
    return hms
  }

  findRunDistance(distance) {
    // console.log("Distance in meters", distance)
    if (this.state.unitPref === "Miles") {
      return this.convertToMiles(distance)
    }
    else {
      return this.convertToKilometers(distance)
    }
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

  findRunDuration(timestamp, powerList) {
    let duration;
    let startTime = timestamp[0];
    let endTime = timestamp[timestamp.length - 1]
    let diff = endTime - startTime
    if (this.state.durationPref === "Elapsed") {
      duration = this.convertToHMS(diff)
      // console.log("Elapsed Duration: ", duration)
    }
    else {
      // Assuming that the user was not moving when they paused their recording
      let missingDataPoints = diff - timestamp.length;
      // console.log(missingDataPoints)
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
      // console.log("Moving Duration: ", duration)
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


  passDataToParent(runData) {
    // console.log("=======Child handle change")
    // console.log("RAWRRR")
    // console.log(runData)
    // Invoke the callback with the new value
    this.props.onChange(runData);
  }


  render() {

    return (
      <div>
        <div className="hero">

          {this.state.dataLoaded === true ? <div>
            <div className="container" >
              <h1 align="center" style={{ color: "white", backgroundColor: "#001a33", padding: "10px 10px", margin:"auto" }}>{this.state.runTitle}</h1>
              <Grid container alignContent="center" align="center" alignItems="stretch" justify="center" >
                {/* <h1 >Run Summary</h1>*/}

                <Grid item>
                  <div style={{ backgroundColor: "#001a33", padding: "10px 10px", margin: "20px 20px 10px 20px", width: "180px", borderRadius: "10px", boxShadow: "0px 3px 15px rgba(0,0,0,0.2)", minHeight: "180px" }}
                    className="hvr-grow ">
                    <div style={{ minHeight: "100px" }}>
                      <img style={{ paddingTop: "20px" }} src="https://img.icons8.com/dusk/64/000000/clock.png" alt="Clock" />
                    </div>
                    <h3 style={{ fontFamily: "'Lato', sans-serif", margin: "2px", fontSize: "22px", color: "white" }}>{this.state.durationPref} Duration</h3>
                    <p style={{ fontFamily: "'Roboto Slab', serif", fontSize: "18px", margin: "10px", color: "white" }}>{this.state.duration} </p>
                  </div>
                </Grid>
                <Grid item >
                  <div style={{ backgroundColor: "#001a33", padding: "10px 10px", margin: "10px 20px", width: "180px", borderRadius: "10px", boxShadow: "0px 3px 15px rgba(0,0,0,0.2)", minHeight: "180px" }}
                    className="hvr-grow">
                    <div style={{ minHeight: "100px" }}>
                      <img style={{ paddingTop: "20px" }} width="60px" src="https://img.icons8.com/color/96/000000/ruler.png" alt="Ruler" />
                    </div>
                    <h3 style={{ fontFamily: "'Lato', sans-serif", margin: "2px", fontSize: "22px", color: "white" }}>Distance</h3>
                    <p style={{ fontFamily: "'Roboto Slab', serif", fontSize: "18px", margin: "10px", color: "white" }}>{this.state.distance} {this.state.unitPref}</p>
                  </div>
                </Grid>
                <Grid item >
                  <div style={{ backgroundColor: "#001a33", padding: "10px 10px", margin: "10px 20px", width: "180px", borderRadius: "10px", boxShadow: "0px 3px 15px rgba(0,0,0,0.2)", minHeight: "180px" }}
                  className="hvr-grow">
                    <div style={{ minHeight: "100px" }}
                      className="hvr-grow" >
                      <img width="80px" style={{ paddingTop: "10px" }} src="https://img.icons8.com/plasticine/100/000000/running.png" alt="Runner" />
                    </div>
                    <h3 style={{ fontFamily: "'Lato', sans-serif", margin: "2px", fontSize: "22px", color: "white" }}>Average Pace</h3>
                    <p style={{ fontFamily: "'Roboto Slab', serif", fontSize: "18px", margin: "10px", color: "white" }}>{this.state.avgPace}</p>
                  </div>
                </Grid>
                <Grid item >
                  <div style={{ backgroundColor: "#001a33", padding: "10px 10px", margin: "10px 20px", width: "180px", borderRadius: "10px", boxShadow: "0px 3px 15px rgba(0,0,0,0.2)", minHeight: "180px" }}
                    className="hvr-grow">
                    <div style={{ minHeight: "100px" }}>
                      <img width="60px" style={{ paddingTop: "20px" }} src="https://img.icons8.com/officel/80/000000/reflector-bulb.png" alt="Light Bulb"/>
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
