import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

//material ui
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


import Pengguna from './pengguna';
import Toko from './toko';

import useStyles from './styles';

function Pengaturan(props){
	const classes = useStyles();
	const {location, history} = props
	
	const handleOnChange = (event, value) => {
		history.push(value);
	}
	
    return (
		<Paper>
			<Tabs indicatorColor="primary" textColor="primary" value={location.pathname} onChange={handleOnChange} >
				<Tab label="Pengguna" value="/pengaturan/pengguna"></Tab>
				<Tab label="Toko" value="/pengaturan/toko" ></Tab>
			</Tabs>
			<div className={classes.tabContent}>
				<Switch>
					<Route path="/pengaturan/pengguna" component={Pengguna} />
					<Route path="/pengaturan/toko" component={Toko} />
					<Redirect to="/pengaturan/pengguna" />
				</Switch>
			</div>
			
		</Paper>
	
        
    );
}

export default Pengaturan;