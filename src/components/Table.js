import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
 root: {
     padding: "0px 20px 20px 20px",
     background: "#001a33"
    },
    h1: {
        color: "white", 
        textAlign: "center", 
        paddingTop: "10px", 
        paddingBottom: "10px", 
        margin: "0px 0px 20px 0px" 
    }
});
class Table extends React.Component{
    columnDefs = [
        {
            headerName: 'Lap Number',
            field: 'lapNumber',
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
            headerName: 'Duration',
            field: 'lapDuration',
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
            headerName: 'Distance',
            field: 'lapDistance',
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
            headerName: 'Avg. Power of Lap',
            field: 'lapAvgPower',
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
            headerName: 'Avg. Pace of Lap',
            field: 'lapAvgPace',
            sortable: true,
            filter: 'agTextColumnFilter',
            filterParams: {
                filterOptions: ['contains', 'notContains'],
                debounceMs: 0,
                caseSensitive: false,
                suppressAndOrCondition: true,
            },
        },

    ]
   defaultColDef = {
        flex: 1,
        sortable: true,
        filter: true,
        floatingFilter: true,
    }
    render(props) {
    const { classes } = this.props;
    return (
        <div className={classes.root}>
            <h1 align="center" className={classes.h1}>
                {this.props.title}
        </h1>
            <div style={{ height: 400, padding: "0px 20px 20px 20px" }} className="ag-theme-alpine">
                <AgGridReact
                    style={{ zIndex: 2000 }}
                    columnDefs={this.columnDefs}
                    defaultColDef={this.defaultColDef}
                    rowData={this.props.rowData}
                    rowSelection='multiple'
                />
            </div>
        </div>
    )
    }
}

export default withStyles(styles)(Table)