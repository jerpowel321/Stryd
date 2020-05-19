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
    rowData: null,
    sortedRunData: [],
    //   alarmSelected: true,
    //   durationSelected: true,
    //   selectedState: "Minneapolis",
    //   selectedFilter: "Select Filter",
    //   device_data: null,
    //   fault_data: null,
    //   mergeData: null,
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
 
      
       
  }
  componentWillReceiveProps({ unitPref, durationPref, lapTableViewPref, runData}) {
    console.log(" LAPSSSSS TABLEEE   UPDATING================================>")
    console.log(" Updating child Props")
    console.log({ unitPref })
    console.log({ durationPref })
    console.log({ lapTableViewPref})
    console.log({ runData})

    this.setState({
      ...this.state, unitPref, durationPref, lapTableViewPref, runData
    },
    () => this.decorateData()
    )
  }
  decorateData = () => {
    console.log("Decorating Data")
    // Lap Number, Duration of the Lap (Moving or Total), Total Distance covered during the lap, average power of the lap, (moving or total), the average pace of the lap, moving or total
    let rowData = {id: "", duration: "", distance: "", avgPower: "",avgPace: ""};
    let duration = [];
    console.log(this.state.durationPref, "EHHHHHH")
    if(this.state.durationPref === "Moving"){
        duration = this.getLapMovingDuration()
    }
    if(this.state.durationPref === "Elapsed"){
        duration = this.getLapElapsedDuration()
    }


   
   


    let mergeData = [];
    // for (let i = 0; i < this.state.fault_data.length; i++) {
    //   for (let j = 0; j < this.state.device_data.length; j++) {
    //     mergeData[i] = this.state.fault_data[i];
    //     mergeData[i]['duration_string'] = this.getDurationString(this.state.fault_data[i]['duration_seconds'])
    //     let device_id = this.state.fault_data[i]['device_id'];
    //     if (this.state.device_data[j]['id'] === device_id) {
    //       mergeData[i]['asset'] = this.state.device_data[j]['asset'];
    //       mergeData[i]['device_name'] = this.state.device_data[j]['device_name'];
    //     }
    //   }
    // }
    this.setState({
      mergeData: mergeData
    })
    this.showData(mergeData, this.state.selectedState)
  }

  getLapMovingDuration(){
      console.log("Get Lap Moving Duration")
    let lapData = this.state.runData.lap_timestamp_list;
    let timeStampData = this.state.runData.timestamp_list;
    let totalSeconds = 0
    let totalDuration = [];

    // Iterate through the lapData array find the duration of the lap
    for (let i=0; i<lapData.length; i++){
        let secondsPerLap = 0;
        for (let j=0; j<timeStampData.length; j++){
                if (i===0 && lapData[i]>=timeStampData[j]){
                    secondsPerLap ++
                }
                if(lapData[i]>=timeStampData[j] && lapData[i-1]<timeStampData[j]){
                    secondsPerLap ++
                }
            
        }
        console.log(secondsPerLap)
        let hms = this.convertToHMS(secondsPerLap)
        console.log(hms)
        totalDuration.push(hms)
        totalSeconds += secondsPerLap
    }
   
    console.log(totalSeconds)
    console.log(this.convertToHMS(totalSeconds))
    console.log("This is the total Moiving duration", totalDuration)

    return totalDuration

    }


    getLapElapsedDuration(){ 
    let lapData = this.state.runData.lap_timestamp_list;
    let timeStampData = this.state.runData.timestamp_list;
    let totalSeconds = 0
    let totalDuration = [];
    let startTime = "";
    let endTime = "";
    // Iterate through the lapData array find the duration of the lap
    for (let i=0; i<lapData.length; i++){
        let endTimeIndex = 0
        for (let j=0; j<timeStampData.length; j++){
                if (i===0){
                    startTime = timeStampData[0];
                    if(lapData[i]>=timeStampData[j]){
                    endTime = timeStampData[j]
                    }
                } 
                if (lapData[i]>=timeStampData[j] && timeStampData[j]>startTime){
                    endTime = timeStampData[j]
                    endTimeIndex = j
                }
        }
        let duration = endTime-startTime;
        let durationInHMS = this.convertToHMS(duration)
        totalDuration.push(durationInHMS);
        startTime = timeStampData[endTimeIndex]
        totalSeconds += duration
    }
    return totalDuration
}













  showData(data, state) {
    // let filteredData = []
    // for (let i = 0; i < data.length; i++) {
    //   if (state === "All") {
    //     filteredData.push(data[i])
    //   }
    //   else if (data[i]['asset'] === state) {
    //     filteredData.push(data[i])
    //   }
    // }
    // this.setState({
    //   rowData: filteredData
    // }, () => {
    //   if (this.state.alarmSelected === true && this.state.durationSelected === true) {
    //     this.showAlarmCodesDuration();
    //   }
    //   else if (this.state.alarmSelected === true && this.state.durationSelected === false) {
    //     this.showAlarmCodesFrequency();
    //   }
    //   else if (this.state.alarmSelected === false && this.state.durationSelected === true) {
    //     this.showCategoryDuration();
    //   }
    //   else if (this.state.alarmSelected === false && this.state.durationSelected === false) {
    //     this.showCategoryFrequency();
    //   }
    // });

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
    return (
      <ThemeProvider theme={theme}>
        <h1 style={{ paddingTop: '40px', paddingBottom: '40px' }} align="center">{this.state.selectedState}{this.state.alarmSelected ? " Alarms" : " Alarm Categories"}{this.state.durationSelected ? " by Duration" : " by Frequency"}
        </h1>
    
        <AgGridReact
              columnDefs={this.state.columnDefs}
              defaultColDef={this.state.defaultColDef}
              rowData={this.state.rowData}
              rowSelection='multiple'
            />
      </ThemeProvider >
    );
  }
}

export default LapsTable;
