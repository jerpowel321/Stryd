import React from 'react';
import { Bar } from 'react-chartjs-2';
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

class Barchart extends React.Component {
    render() {
        const { classes } = this.props;
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
                <div classes={classes.div}>
                    <img classes={classes.img} width="30px" src="https://img.icons8.com/cotton/64/000000/mountain.png" alt="Mountains" />
                    <h3 classes={classes.h3}>{this.props.title} Peak Powers</h3>
                </div>
                <Bar data={data} options={options} />
                </div>
        );
    }
};

export default withStyles(styles)(Barchart);
