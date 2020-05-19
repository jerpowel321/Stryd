import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { AppBar, Toolbar, Typography, Grid } from '@material-ui/core';
import amber from '@material-ui/core/colors/amber';

const primary = '#000000';
const accent = amber[800];

const useStyles = makeStyles({
    root: {
        backgroundColor: "#001a33",
    },
    button: {
        color: accent
    },
    list: {
        width: 250,
    },

});

export default function TemporaryDrawer() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        left: false,
        top: false,
        right: false,
        bottom: false,

    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <AppBar position="sticky" className={classes.root}>
            <Toolbar>
                <Grid container >
                    <Grid item xs={4}>
                        {['left'].map((anchor) => (
                            <React.Fragment key={anchor}>
                                <Button className={classes.button} onClick={toggleDrawer(anchor, true)}>Account</Button>
                                <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                                    {list(anchor)}
                                </Drawer>
                            </React.Fragment>
                        ))}
                    </Grid>
                    <Grid align="center" item xs={4}>
                        <Typography variant="h5" className="gradient-text">STRYD</Typography>
                    </Grid>
                    <Grid item align="right" xs={4}>
                        <Button className={classes.button}>Learn More</Button>
                        <Button className={classes.button}>Blog</Button>
                        <Button className={classes.button}>Contact</Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}