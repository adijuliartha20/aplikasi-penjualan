import React, {useState, useEffect} from "react";

//material ui
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';

//icons
import DeleteIcon from '@material-ui/icons/Delete';
import ViewIcon from '@material-ui/icons/Visibility';


import { useFirebase } from '../../../components/FirebaseProvider';
import { useCollection } from 'react-firebase-hooks/firestore';

import { currency } from '../../../utils/formatter';
import format from 'date-fns/format';

import AppPageLoading from '../../../components/AppPageLoading';
import DetailsDialog from './details';
import useStyles from './styles';
function Transaksi(){
	const {firestore, user} = useFirebase();
	const transaksiCol = firestore.collection(`toko/${user.uid}/transaksi`);
	
	const [snapshot, loading] = useCollection(transaksiCol);
	const [transaksiItems, setTransaksiItems] = useState([]);
	
	const classes = useStyles();
	
	useEffect(()=>{
		if(snapshot){
			setTransaksiItems(snapshot.docs);
		}
	},[snapshot]);
	
	const handleDelete = transaksiDoc => async e => {
		if(window.confirm('Apakah anda yakin ingin menghapus  transaksi ini?')){
			await transaksiDoc.ref.delete();
		}
	}
	
	//detail transaksi
	const [details, setDetails] = useState({
		open:false,
		transaksi:{}
	});
	
	const handleCloseDetails = (e) => {
		setDetails({
			open:false,
			transaksi: {}
		});
	}
	
	const handleOpenDetails = transaksiDoc => e => {
		setDetails({
			open:true,
			transaksi: transaksiDoc.data()
		});
	}
	
	if(loading){
		return <AppPageLoading />
	}

    return <>
		<Typography component="h1" variant="h5" paragraph>Daftar Transaksi</Typography>
		{
			transaksiItems.length <= 0 && 
			<Typography>Belum ada data transaksi</Typography>
		}
		
		<Grid container spacing={5}>
			{
				transaksiItems.map(transaksiDoc => {
					const transaksiData = transaksiDoc.data();
					return <Grid item key={transaksiDoc.id} xs={12} sm={12} md={6} lg={4}>
						<Card className={classes.card}>
							<CardContent className={classes.transaksiSummary}>
								<Typography variant="h5" noWrap>{transaksiData.no}</Typography>
								<Typography>Total: {currency(transaksiData.total)}</Typography>
								<Typography>Tanggal: {format(new Date(transaksiData.timestamp), 'DD-MM-YYYY-HH:mm')}</Typography>
							</CardContent>
							<CardActions className={classes.transaksiActions}>
								<IconButton onClick={handleOpenDetails(transaksiDoc)}><ViewIcon/></IconButton>
								<IconButton onClick={handleDelete(transaksiDoc)}><DeleteIcon/></IconButton>
							</CardActions>
						</Card>
					</Grid>					
				})
			}		
		</Grid>
		<DetailsDialog open={details.open} handleClose={handleCloseDetails} transaksi={details.transaksi} />
		
	</>
}

export default Transaksi;