import React from 'react';
import { Bar } from 'react-chartjs-2';


export default class Barchart extends React.Component {
    render() {
        const data = {
            labels: this.props.labels,
            datasets: [
                {
                    label: this.props.label,
                    backgroundColor: '#FF8E53',
                    borderWidth: 2,
                    borderColor: 'black',
                    hoverBackgroundColor: '#fecc91',
                    hoverBorderColor: 'black',
                    hoverBorderWidth: 1,
                    data: this.props.data,
                }
            ],
        };

        const options = {
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
            }
        }

        return (
            <div>
                <div style={{ textAlign: "center", padding: "10px 0px 20px 0px" }}>
                    <img style={{ paddingRight: "5px", verticalAlign: "middle" }} width="30px" src="https://img.icons8.com/cotton/64/000000/mountain.png" alt="Mountains" />
                    <h3 style={{ textAlign: "center", display: "inline", verticalAlign: "middle" }}>{this.props.title} Peak Powers</h3>
                </div>
                <Bar data={data} options={options} />
                </div>
        );
    }
};

