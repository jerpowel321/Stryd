import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import { createMuiTheme, ThemeProvider, duration } from '@material-ui/core/styles';
import { Grid, } from '@material-ui/core';
// import Barchart from './Components/BarChart';
// import Piechart from './Components/PieChart';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#004159'
        },
    },
});

class LapsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            runData: {},
            lapTableViewPref: this.props.lapTableViewPref,
            unitPref: this.props.unitPref,
            durationPref: this.props.durationPref,
            durationArray: [],
            // sortedRunData: [],
            distanceArray: [],
            avgPowerArray: [],
            avgPaceArray: [],
            rowData: null,
            //   barChartData: null,
            //   pieChartData: null,
            //   updateChart: false,
            //   chartTitle: "",
            columnDefs: [
                {
                    headerName: 'Lap Number',
                    field: 'device_name',
                    sortable: true,
                    filter: 'agTextColumnFilter',
                    filterParams: {
                        filterOptions: ['contains', 'notContains'],
                        debounceMs: 0,
                        caseSensitive: false,
                        suppressAndOrCondition: true,
                    },
                },
                {
                    headerName: 'Duration of Lap',
                    field: 'time_stamp',
                    sortable: true,
                    filter: 'agTextColumnFilter',
                    filterParams: {
                        filterOptions: ['contains', 'notContains'],
                        debounceMs: 0,
                        caseSensitive: false,
                        suppressAndOrCondition: true,
                    },
                },
                {
                    headerName: 'Total Distance',
                    field: 'duration_string',
                    sortable: true,
                    filter: 'agTextColumnFilter',
                    filterParams: {
                        filterOptions: ['contains', 'notContains'],
                        debounceMs: 0,
                        caseSensitive: false,
                        suppressAndOrCondition: true,
                    },
                },
                {
                    headerName: 'Average Power of Lap',
                    field: 'category',
                    sortable: true,
                    filter: 'agTextColumnFilter',
                    filterParams: {
                        filterOptions: ['contains', 'notContains'],
                        debounceMs: 0,
                        caseSensitive: false,
                        suppressAndOrCondition: true,
                    },
                },
                {
                    headerName: 'Average Pace of Lap',
                    field: 'code',
                    sortable: true,
                    filter: 'agTextColumnFilter',
                    filterParams: {
                        filterOptions: ['contains', 'notContains'],
                        debounceMs: 0,
                        caseSensitive: false,
                        suppressAndOrCondition: true,
                    },
                },

            ],
            defaultColDef: {
                flex: 1,
                sortable: true,
                filter: true,
                floatingFilter: true,
            },
            rowData: null,

        }
    }

    componentDidMount() {
     
        // {
        //     let durations = [[10, "s"],[3,"m"],[5,"m"],[10,"m"],[30,"m"],[60,"m"]]
        //     let maxAvgPower = 0; 
        //     for (let i=0; i<this.runData.timestamp_list.length; i++){
    
        //     }
        // }


    }
    componentWillReceiveProps({ unitPref, durationPref, lapTableViewPref, runData }) {
        console.log(" LAPSSSSS TABLEEE   UPDATING================================>")
        console.log(" Updating child Props")
        console.log({ unitPref })
        console.log({ durationPref })
        console.log({ lapTableViewPref })
        console.log({ runData })

        this.setState({
            ...this.state, unitPref, durationPref, lapTableViewPref, runData
        },
            () => {this.manipulateData()}
        )
    }
    manipulateData = () => {
        console.log("Decorating Data")
        // Lap Number, Duration of the Lap (Moving or Total), Total Distance covered during the lap, average power of the lap, (moving or total), the average pace of the lap, moving or total
        let rowData = { id: "", duration: "", distance: "", avgPower: "", avgPace: "" };
        let duration = [];
        let avgPower = [];
        this.getLapDistance()
 
        if (this.state.durationPref === "Moving") {
            console.log("Moving Duration")
            duration = this.getLapMovingDuration()
        }
        if (this.state.durationPref === "Elapsed") {
            console.log("Elapsed Duration")
            duration = this.getLapElapsedDuration()
        }
        this.setState({
            durationArray: duration,
        },
        () => console.log(this.state.rowData, this.state.durationArray, this.state.distanceArr)
        )
        // getPeakPowers()
        this.getPeakPowers([10, "s"])
    }

    getLapDistance(){
        let lapData = this.state.runData.lap_timestamp_list;
        let timeStampData = this.state.runData.timestamp_list;
        let distanceData = this.state.runData.distance_list;
        let start= "";
        let end = ""; 
        let index = 0;
        let distanceArr = [];
        let sum = 0
        for (let i=0; i<lapData.length; i++){
            for(let j=0; j<timeStampData.length; j++){
                if (i===0 && lapData[i]>timeStampData[j]){
                    start = 0
                    end = distanceData[j]
                    index = j
                }
                if (i !=0 && lapData[i]>timeStampData[j] && timeStampData[j]> start){
                    end = distanceData[j]
                    index = j
                }
            }
            let diff = end - start
            if(this.state.unitPref === "Miles"){
                diff = this.convertToMiles(diff)
                console.log(typeof diff);
                diff = Math.round(diff * 100) /100
                sum += diff
            }
            if(this.state.unitPref === "Kilometers"){
                diff = this.convertToKilometers(diff)
                console.log(typeof diff);
                diff = Math.round(diff * 100) /100
                sum += diff
            }
            distanceArr.push(diff)
            start = distanceData[index]
        }
        console.log("This is the distance array for each lap ",distanceArr)
        console.log("Total Distance ", sum)
        this.setState({
            distanceArray: distanceArr
        })

        return distanceArr
    }

    getLapMovingDuration() {
        console.log("Get Lap Moving Duration")
        let lapData = this.state.runData.lap_timestamp_list;
        let timeStampData = this.state.runData.timestamp_list;
        let powerData = this.state.runData.total_power_list;
        let totalSeconds = 0
        let totalDuration = [];
        let totalAvgPower = [];
        let ahh = 0
        for (let i = 0; i < lapData.length; i++) {
            let secondsPerLap = 0;
            let sumPower = 0;
            let count = 0;
            for (let j = 0; j < timeStampData.length; j++) {
                if (i === 0 && lapData[i] >= timeStampData[j] && this.state.runData.total_power_list[j] != 0) {
                    secondsPerLap++
                    sumPower += powerData[j]
                    count ++
                }
                if (lapData[i] >= timeStampData[j] && lapData[i - 1] < timeStampData[j] && this.state.runData.total_power_list[j] != 0) {
                    secondsPerLap++
                    sumPower += powerData[j]
                    count ++
                }
            }
            let hms = this.convertToHMS(secondsPerLap)
            totalDuration.push(hms)
            totalSeconds += secondsPerLap
            let avgPower = (sumPower/count).toFixed(0)
            totalAvgPower.push(avgPower)
            ahh += avgPower
        }
        console.log(totalDuration)
        console.log("this is a check ", ahh)
        console.log(" THIS IS THE TOTAL AVG POWER ", totalAvgPower)
        return totalDuration
    }


    getLapElapsedDuration() {
        let lapData = this.state.runData.lap_timestamp_list;
        let timeStampData = this.state.runData.timestamp_list;
        let powerData = this.state.runData.total_power_list;
        let totalSeconds = 0
        let totalDuration = [];
        let startTime = "";
        let endTime = "";
        let totalAvgPower = [];
        let ahh = 0
        let index;
        // Iterate through the lapData array find the duration of the lap
        for (let i = 0; i < lapData.length; i++) {
            index = i
            let endTimeIndex = 0
            let sumPower = 0;
            for (let j = 0; j < timeStampData.length; j++) {
                if (i === 0) {
                    startTime = timeStampData[0];
                    if (lapData[i] >= timeStampData[j]) {
                        endTime = timeStampData[j]
                        sumPower += powerData[j]
                    }
                }
                if (lapData[i] >= timeStampData[j] && timeStampData[j] > startTime) {
                    endTime = timeStampData[j]
                    endTimeIndex = j
                    sumPower += powerData[j]
                }
            }
            let duration = endTime - startTime;
            let durationInHMS = this.convertToHMS(duration)
            totalDuration.push(durationInHMS);
            startTime = timeStampData[endTimeIndex]
            totalSeconds += duration
            if (this.state.unitPref === "Kilometers"){
                console.log(this.state.distanceArray[0])
                console.log("This is the sum power ", sumPower)
                console.log(this.state.distanceArray[0])
                let avgPower = (sumPower/(this.state.distanceArray[i]))
                totalAvgPower.push(avgPower)
                ahh += avgPower
            }
            else {
                let avgPower = (sumPower/(this.state.distanceArray[i]))
                totalAvgPower.push(avgPower)
                ahh += avgPower
            }
            console.log(sumPower)
            console.log()
  
        }
        console.log("this is a check ", ahh)
        console.log( "This is elapsed duration ....")
        console.log(totalDuration)
        console.log(" THIS IS THE TOTAL AVG POWER ", totalAvgPower)
        return totalDuration
    }


    convertToKilometers(distanceInMeters) {
        let kilometers = distanceInMeters / 1000;
        kilometers = kilometers
        return kilometers
    }
    convertToMiles(distanceInMeters) {
        let miles = distanceInMeters / 1609;
        miles = miles
        console.log("this is the miles ", miles)
        return miles
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

    getPeakPowers([length, time]) {
        console.log("In the get peak powers")
        console.log("This is the length", length)
        console.log("This is the time")
        let seconds = (time === "s")? length :length*60
        console.log("this is the seconds",seconds)
        let maxAvg = 0;
        for(let i=0; i<this.state.runData.timestamp_list.length; i++){
            let sum = 0;
            let count = 0;
            for(let j=0; j<seconds; j++){
                console.log("this should be 10 ", seconds)
                if(i!=j && this.state.runData.timestamp_list[i]+1 === this.state.runData.timestamp_list[i+1]){
            
                    sum += this.state.runData.total_power_list[j]
                    count ++
                }
            }
            let avg = sum/count
            if(count === seconds && maxAvg <avg){
                maxAvg = avg
            }
            
        }
        console.log("This is the max Power Average" ,maxAvg)
        // if (x < 0) return;
        // if (x === 0) return 1;
        // return x * factorial(x - 1);
      }
    //   factorial([10,"s"]);

  

    render() {
        return (
            <ThemeProvider theme={theme}>
                <h1 style={{ paddingTop: '40px', paddingBottom: '40px' }} align="center">{this.state.selectedState}{this.state.alarmSelected ? " Alarms" : " Alarm Categories"}{this.state.durationSelected ? " by Duration" : " by Frequency"}
                </h1>
                {/* <div style={{backgroundColor: "white", zIndex: 2000}}> */}
                <AgGridReact
                style={{backgroundColor: "white", zIndex: 2000}}
                    columnDefs={this.state.columnDefs}
                    defaultColDef={this.state.defaultColDef}
                    rowData={this.state.rowData}
                    rowSelection='multiple'
                />
                {/* </div> */}
                
            </ThemeProvider >
        );
    }
}

export default LapsTable;
