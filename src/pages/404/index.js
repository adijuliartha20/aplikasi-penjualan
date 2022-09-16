import React from 'react';

//component material ui
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TypoGraphy from '@material-ui/core/TypoGraphy';

//import react router dom
import {Link} from 'react-router-dom';

//import style
import useStyles from './styles';

function NotFound(){
	const classes = useStyles();
    return (
		<Container maxWidth="xs">
			<Paper className={classes.paper}>
				<TypoGraphy variant="subtitle1">Halaman Tidak Ditemukan</TypoGraphy>
				<TypoGraphy variant="h3">404</TypoGraphy>
				<TypoGraphy component={Link} to="/">Kembali ke Beranda</TypoGraphy>
			</Paper>
		</Container>
	)
}

export default NotFound;