import React from 'react';
import { Line } from 'react-chartjs-2';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
  h3: {
    textAlign: "center", 
    display: "inline", 
    verticalAlign: "middle"
  },
  div: { 
    textAlign: "center", 
    padding: "10px 0px 20px 0px" 
  },
  img: {
    paddingRight: "5px", 
    verticalAlign: "middle"
  },

});

class LineChart extends React.Component {

    data = {
        labels: this.props.labels,
        datasets: [
            {
                label: this.props.label,
                fill: true,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 4,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderWidth: 1,
                pointHoverRadius: 7,
                pointHoverBackgroundColor: '#FF8E53',
                pointHoverBorderColor: 'black',
                pointHoverBorderWidth: 2,
                pointHitRadius: 10,
                data: this.props.data,
                pointRadius: 5,
                pointBorderColor: 'black',
                pointBackgroundColor: 'rgba(75,192,192,1)',
                tension: .9
            }
        ],
    }


    options = {
        scales: {
            xAxes: [{
                gridLines: {
                    display: false,
                },
                ticks: {
                    min: 0,
                    max: 10,
                    fontSize: 16
                    // display: false
                },
                scaleLabel: {
                    display: true,
                    labelString: "Time Intervals",
                    fontColor: "black",
                    fontSize: 18,
                }
            }],
            yAxes: [{
                gridLines: {
                    display: false,
                },
                scaleLabel: {
                    display: true,
                    labelString: "Average Power (W)",
                    fontColor: "black",
                    fontSize: 18,
                }
            }]
        },

    }
        render() {
            const { classes } = this.props;
            return (
                <div >
                    <div classes={classes.div}>
                        <img classes={classes.img} width="30px" src="https://img.icons8.com/cotton/64/000000/mountain.png" alt="Mountains" />
                        <h3 classes={classes.h3}>{this.props.title} Peak Powers</h3>
                    </div>
                    <Line data={this.data} options={this.options}/>
                </div>
            );
        }
    };

    export default withStyles(styles)(LineChart);