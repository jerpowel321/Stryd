import React from 'react';
import { Line } from 'react-chartjs-2';


class LineChart extends React.Component {

    data = {
        labels: this.props.labels,
        datasets: [
            {
                label: this.props.label,
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: this.props.data
            }
        ],
    };
    render() {
        return (
            <div >
                <div style={{ textAlign: "center", padding: "10px 0px 20px 0px" }}>
                    <img style={{ paddingRight: "5px", verticalAlign: "middle" }} width="30px" src="https://img.icons8.com/cotton/64/000000/mountain.png" alt="Mountains" />
                    <h3 style={{ textAlign: "center", display: "inline", verticalAlign: "middle" }}>{this.props.title} Peak Powers</h3>
                </div>
                <Line data={this.data} />
            </div>
        );
    }
};

export default LineChart