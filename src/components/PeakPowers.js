import React from 'react';
import { Grid, } from '@material-ui/core';
import Barchart from './Barchart'
import Linechart from './Linechart'


class PeakPowers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            runData: {},
            lapTableViewPref: this.props.lapTableViewPref,
            unitPref: this.props.unitPref,
            peakPowerViewPref: this.props.peakPowerViewPref,
            durationPref: this.props.durationPref,
        }
    }

    componentWillReceiveProps({ unitPref, durationPref, lapTableViewPref, peakPowerViewPref, runData }) {
        console.log(" Peak Powers UPDATING================================>")
        console.log(" Updating child Props")
        console.log({ unitPref })
        console.log({ durationPref })
        console.log({ lapTableViewPref })
        console.log({ peakPowerViewPref })
        console.log({ runData })
        this.setState({
            ...this.state, unitPref, durationPref, lapTableViewPref, peakPowerViewPref, runData
        },
            () => { this.manipulateData() }
        )
    }
    manipulateData = () => {
        console.log("Decorating Data")
        let peakPowers = [
            this.getPeakPowers(10, "s"),
            this.getPeakPowers(3, "m"),
            this.getPeakPowers(5, "m"),
            this.getPeakPowers(10, "m"),
            this.getPeakPowers(30, "m"),
            this.getPeakPowers(60, "m")
        ]
        let labels = [
            "10 sec", 
            "3 mins", 
            "5 mins", 
            "10 mins", 
            "30 mins", 
            "60 mins"
        ]
        this.setState({
            peakPowers: peakPowers,
            peakPowersLabels: labels
        })
        console.log("PeakPowers", peakPowers)
    }


    getAvg(arr) {
        let total = 0;
        for (let i = 0; i < arr.length; i++) {
            total += arr[i];
        }
        return (total / arr.length);
    }

    getPeakPowers(length, time) {
        let seconds = (time === "s") ? length : length * 60
        let arr = this.state.runData.total_power_list;
        let peak = 0;
        for (let i = 0; i <= (arr.length - seconds); i++) {
            let new_arr = arr.slice(i, (i + seconds))
            let avgPower = this.getAvg(new_arr);
            avgPower = avgPower.toFixed(0)
            if (avgPower > peak) {
                peak = avgPower
            }
        }
        return peak
    }


    render() {
        return (
            <Grid container >
                <Grid item xs={12} style={{ margin: "auto", maxWidth: "90%", }}>
                    <div style={{ margin: "auto", marginTop: "40px", marginBottom: "40px", backgroundColor: "white",padding: "40px"}}>
                        {this.state.peakPowers !== undefined && this.state.peakPowerViewPref === "Bar Chart" ?
                            <Barchart
                                title={this.state.runData.name}
                                label="Best Average Power in Watts"
                                data={this.state.peakPowers}
                                labels={this.state.peakPowersLabels}
                            />
                            : null
                        }
                        {this.state.peakPowers !== undefined && this.state.peakPowerViewPref === "Line Chart" ?
                            <Linechart
                                title={this.state.runData.name}
                                label="Best Average Power in Watts"
                                data={this.state.peakPowers}
                                labels={this.state.peakPowersLabels}
                            />
                            : null
                        }
                    </div>
                </Grid>
            </Grid>
        );
    }
}

export default PeakPowers;
