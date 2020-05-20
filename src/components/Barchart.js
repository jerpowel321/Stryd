import React from 'react';
import { Bar } from 'react-chartjs-2';
import Grid from '@material-ui/core/Grid'


export default class Barchart extends React.Component {
    render() {
        const data = {
            labels: this.props.labels,
            datasets: [
                {
                    label: this.props.label,
                    backgroundColor: 'pink',
                    hoverBackgroundColor: 'pink',
                    hoverBorderColor: 'black',
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
                        // display: false
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display: false,
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

