import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles({
    h3: {
        fontFamily: "'Lato', sans-serif", 
        margin: "2px", 
        fontSize: "22px", 
        color: "white" 
      },
      p: {
        fontFamily: "'Roboto Slab', serif", 
        fontSize: "18px", 
        margin: "10px", 
        color: "white" 
      },
      div: { 
        backgroundColor: "#001a33", 
        padding: "10px 10px", 
        margin: "10px 20px", 
        width: "180px", 
        borderRadius: "10px", 
        boxShadow: "0px 3px 15px rgba(0,0,0,0.2)", 
        minHeight: "180px" 
      },
      div2: {
        minHeight: "100px" 
      },
      img: {
        paddingTop: "20px" 
      }
  
  });

const Cards = (props) => {
    const classes = useStyles();
	return (
     <Grid item>
        <div className={`${classes.div} hvr-grow`}>
          <div className={classes.div2}>
            <img className={classes.img} width={props.imgWidth} src={props.src} alt={props.alt} />
          </div>
          <h3 className={classes.h3}>{props.title}</h3>
          <p className={classes.p}>{props.p}</p>
        </div>
      </Grid>
	)
}

export default Cards