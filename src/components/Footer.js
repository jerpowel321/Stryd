import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';


const useStyles = makeStyles({
  root: {
    width: "100%",
    position: "relative",
    bottom: "0px",
    backgroundColor: "black",
    height: "100px"
  },
});

export default function LabelBottomNavigation() {
  const classes = useStyles();


  return (
    <BottomNavigation className={classes.root}>
     
    </BottomNavigation>
  );
}