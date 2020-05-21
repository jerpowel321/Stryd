import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import { createMuiTheme } from '@material-ui/core/styles';
import { Grid, } from '@material-ui/core';


class LapsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            runData: {},
            lapTableViewPref: this.props.lapTableViewPref,
            unitPref: this.props.unitPref,
            durationPref: this.props.durationPref,
            durationArray: [],
            distanceArray: [],
            avgPowerArray: [],
            avgPaceArray: [],
            columnDefs: [
                {
                    headerName: 'Lap Number',
                    field: 'lapNumber',
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
                    headerName: 'Duration',
                    field: 'lapDuration',
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
                    headerName: 'Distance',
                    field: 'lapDistance',
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
                    headerName: 'Avg. Power of Lap',
                    field: 'lapAvgPower',
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
                    headerName: 'Avg. Pace of Lap',
                    field: 'lapAvgPace',
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

    componentWillReceiveProps({ unitPref, durationPref, lapTableViewPref, runData }) {
        console.log(" LAPS TABLE UPDATING================================>")
        console.log(" Updating child Props")
        console.log({ unitPref })
        console.log({ durationPref })
        console.log({ lapTableViewPref })
        console.log({ runData })

        this.setState({
            ...this.state, unitPref, durationPref, lapTableViewPref, runData
        },
            () => { this.manipulateData() }
        )
    }
    manipulateData = () => {
        console.log("Decorating Data")
        this.getLapDistance()
    }

    getLapDistance() {
        let lapData = this.state.runData.lap_timestamp_list;
        let timeStampData = this.state.runData.timestamp_list;
        let distanceData = this.state.runData.distance_list;
        let start = "";
        let end = "";
        let index = 0;
        let distanceArr = [];
        let sum = 0
        for (let i = 0; i < lapData.length; i++) {
            for (let j = 0; j < timeStampData.length; j++) {
                if (i === 0 && lapData[i] > timeStampData[j]) {
                    start = 0
                    end = distanceData[j]
                    index = j
                }
                if (i !== 0 && lapData[i] > timeStampData[j] && timeStampData[j] > start) {
                    end = distanceData[j]
                    index = j
                }
            }
            let diff = end - start
            if (this.state.unitPref === "Miles") {
                diff = this.convertToMiles(diff)
                console.log(typeof diff);
                diff = Math.round(diff * 100) / 100
                sum += diff
            }
            if (this.state.unitPref === "Kilometers") {
                diff = this.convertToKilometers(diff)
                console.log(typeof diff);
                diff = Math.round(diff * 100) / 100
                sum += diff
            }
            distanceArr.push(diff)
            start = distanceData[index]
        }
        console.log("This is the distance array for each lap ", distanceArr)
        console.log("Total Distance ", sum)

        let duration = [];
        if (this.state.durationPref === "Moving") {
            console.log("Moving Duration")
            duration = this.getLapMovingDuration()
        }
        if (this.state.durationPref === "Elapsed") {
            console.log("Elapsed Duration")
            duration = this.getLapElapsedDuration(distanceArr)
        }
        this.setState({
            durationArray: duration,
        },
            () => this.getLapData()
        )
        this.setState({
            distanceArray: distanceArr
        })

        return distanceArr
    }

    getLapData() {
        console.log("Building Lap data");
        let tableData = [];
        let durations = this.state.durationArray;
        let distances = this.state.distanceArray;
        let powers = this.state.avgPowerArray;
        let index = 1;
        for (let i = 0; i < this.state.runData.lap_timestamp_list.length; i++) {

            tableData.push({
                "lapNumber": index,
                "lapDuration": durations[i],
                "lapDistance": distances[i],
                "lapAvgPower": powers[i],
                "lapAvgPace": 0,
            })
            index++;
        }
        console.log(tableData);
        this.setState({
            rowData: tableData
        })
        return tableData;

    }
    getLapMovingDuration() {
        console.log("Get Lap Moving Duration")
        let lapData = this.state.runData.lap_timestamp_list;
        let timeStampData = this.state.runData.timestamp_list;
        let powerData = this.state.runData.total_power_list;
        let totalSeconds = 0
        let totalDuration = [];
        let totalAvgPower = [];
        for (let i = 0; i < lapData.length; i++) {
            let secondsPerLap = 0;
            let sumPower = 0;
            let count = 0;
            for (let j = 0; j < timeStampData.length; j++) {
                if (i === 0 && lapData[i] >= timeStampData[j] && this.state.runData.total_power_list[j] !== 0) {
                    secondsPerLap++
                    sumPower += powerData[j]
                    count++
                }
                if (lapData[i] >= timeStampData[j] && lapData[i - 1] < timeStampData[j] && this.state.runData.total_power_list[j] !== 0) {
                    secondsPerLap++
                    sumPower += powerData[j]
                    count++
                }
            }
            let hms = this.convertToHMS(secondsPerLap)
            totalDuration.push(hms)
            totalSeconds += secondsPerLap
            let avgPower = (sumPower / count).toFixed(0)
            totalAvgPower.push(avgPower)
        }
        console.log(totalDuration)
        console.log(" THIS IS THE TOTAL AVG POWER ", totalAvgPower)
        this.setState({
            avgPowerArray: totalAvgPower
        })
        return totalDuration
    }


    getLapElapsedDuration(distanceArr) {
        let lapData = this.state.runData.lap_timestamp_list;
        let timeStampData = this.state.runData.timestamp_list;
        let powerData = this.state.runData.total_power_list;
        let totalSeconds = 0
        let totalDuration = [];
        let startTime = "";
        let endTime = "";
        let totalAvgPower = [];
        let index;
        // Iterate through the lapData array find the duration of the lap
        for (let i = 0; i < lapData.length; i++) {
            index = i
            let endTimeIndex = 0
            let sumPower = 0;
            let count = 0
            for (let j = 0; j < timeStampData.length; j++) {
                if (i === 0) {
                    startTime = timeStampData[0];
                    if (lapData[i] >= timeStampData[j]) {
                        endTime = timeStampData[j]
                        sumPower += powerData[j]
                        count++
                    }
                }
                if (lapData[i] >= timeStampData[j] && timeStampData[j] > startTime) {
                    endTime = timeStampData[j]
                    endTimeIndex = j
                    sumPower += powerData[j]
                    count++
                }
            }
            let duration = endTime - startTime;
            let durationInHMS = this.convertToHMS(duration)
            totalDuration.push(durationInHMS);
            startTime = timeStampData[endTimeIndex]
            totalSeconds += duration
            if (this.state.unitPref === "Kilometers") {
                console.log(duration)
                console.log("This is the sum power ", sumPower)
                console.log("This is the distance ", distanceArr[0])
                let avgPower = (sumPower / duration).toFixed(0)
                console.log("This is the avgPower", avgPower)
                totalAvgPower.push(avgPower)
            }
            else {
                let avgPower = (sumPower / duration).toFixed(0)
                totalAvgPower.push(avgPower)
            }
        }
        console.log("This is elapsed duration ....")
        console.log(totalDuration)
        console.log(" THIS IS THE TOTAL AVG POWER ", totalAvgPower)
        this.setState({
            avgPowerArray: totalAvgPower
        })
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


    render() {

        return (

            // <Grid container style={{ justifyItems: "center" }} >
            <Grid item xs={12} style={{ margin: "20px 0px"}}>
                <div style={{padding: "0px 20px 20px 20px"}}> 
                    <h1 style={{ color: "white", textAlign: "center", paddingTop: "10px", paddingBottom: "10px", margin: "0px 0px 20px 0px" }} align="center">Laps Table
                    </h1>
                    <div style={{ height: 400, padding: "0px 20px 20px 20px" }} className="ag-theme-alpine">
                        <AgGridReact
                            style={{ zIndex: 2000 }}
                            columnDefs={this.state.columnDefs}
                            defaultColDef={this.state.defaultColDef}
                            rowData={this.state.rowData}
                            rowSelection='multiple'
                        />
                    </div>
                </div>
                <Grid />
            </Grid>
        );
    }
}

export default LapsTable;
