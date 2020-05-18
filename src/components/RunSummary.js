import React from 'react';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { FormControl, Select, MenuItem, Grid, } from '@material-ui/core';

import { activityApi, userToken } from '../api'


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#004159'
    },

  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      runData: {},
      runTitle: "",
      durationType: "elapsed",
      duration: "",
      distanceType: "miles",
      distance: "",
      avgPace: 0,
      avgPower: 0,
      dataLoaded: false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  buttonClick = (event) => {
    let { name } = event.target;
    this.setState({
      [name]: !this.state[name],
      updateChart: false,
    }, () => {
      this.showData(this.state.mergeData, this.state.selectedState)
    });
  }

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
        this.findRunDuration(data.timestamp_list, data.total_power_list)
        this.findRunDistance(data.distance_list[data.distance_list.length - 1])
        this.findAvgPace(data.speed_list)
        this.setState({
            runData: data,
            runTitle: data.name
          },
          () =>
            this.setState({
              dataLoaded: true
            },
              () => console.log(this.state)
            )
        )
      })
  }
  // Assuming speed is in yards/second
  findAvgPace(speed) {
    if (this.state.durationType === "elapse") {

    }
    else {

    }

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
    return miles
  }
  convertToKilometers(distance) {
    let kilometers = distance / (1093.613298)
    kilometers = kilometers.toFixed(2)
    console.log("this is the kilometers", kilometers)
    return kilometers
  }
  findRunDuration(timestamp, powerList) {
    let duration;
    let startTime = timestamp[0];
    let endTime = timestamp[timestamp.length - 1]

    if (this.state.durationType === "elapsed") {
      let diff = endTime - startTime
      duration = this.getTotalElapsedTime(diff)
      console.log("Elapsed Duration: ", duration)
    }
    else {
      let secondsNotMoving = 0;
      for (let i = 0; i < powerList.length; i++) {
        for (let j = 0; j < timestamp.length; j++) {
          if (powerList[i] === 0) {
            secondsNotMoving++
          }
        }
      }
      let diff = endTime - startTime - secondsNotMoving
      duration = this.getTotalElapsedTime(diff)
      console.log("Moving Duration: ", duration)

    }
    this.setState({
      duration: duration
    })
  }
  getTotalElapsedTime(time) {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    // Output example "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
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

export default App;
