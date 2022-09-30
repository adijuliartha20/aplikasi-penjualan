import React, { useState , useEffect } from 'react';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import ImageIcon from '@material-ui/icons/Image';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';


import useStyles from './styles/grid';

//import component
import AddDialog from './add';
import AppPageLoading from '../../../components/AppPageLoading';
import { currency } from '../../../utils/formatter';

//firebase
import { useFirebase } from '../../../components/FirebaseProvider';
import { useCollection } from 'react-firebase-hooks/firestore';


import { Link } from 'react-router-dom';

function GridProduk(){
	const clasess = useStyles();
	
	const {firestore, storage, user} = useFirebase();
	
	const produkCol = firestore.collection(`toko/${user.uid}/produk`);
	
	const [snapshot, loading] = useCollection(produkCol);
	
	const [produkItems, setProdukItems] = useState([]);
	
	useEffect(()=>{
		if(snapshot){
			setProdukItems(snapshot.docs);
		}	
	},[snapshot])	
	
	

	const [openAddDialog, setOpenAddDialog] = useState(false);
	
	if(loading){
		return <AppPageLoading />
	}
	
	const handleDelete = produkDoc=> async (e) => {
		if(window.confirm('Anda yakin menghapus produk ini?')){
			await produkDoc.ref.delete();
			const fotoURL = produkDoc.data().foto;
			if(fotoURL){
				await storage.refFromURL(fotoURL).delete();
			}
		}
	}
	
    return   <>
					<Typography variant="h5" component="h1" paragraph>Daftar Produk</Typography>
					{ produkItems.length <= 0 &&
						<Typography>Belum ada data produk</Typography>
					}
					
					<Grid container spacing={5}>
						{
							produkItems.map((produkDoc)=>{
								const produkData = produkDoc.data();
								return 	<Grid key={produkDoc.id} item={true} xs={12} sm={12} md={6} lg={4}>
												<Card className={clasess.card}>
													{ produkData.foto &&
														<CardMedia className={clasess.foto} image={produkData.foto} title={produkData.nama} />
													}
													{ !produkData.foto &&
														<div className={clasess.fotoPlaceholder}>
															<ImageIcon size="large" color="disabled" />
														</div>
													}
													<CardContent className={clasess.produkDetails}>
														<Typography variant="h5" noWrap>{produkData.nama}</Typography>
														<Typography variant="subtitle1">Harga: {currency(produkData.harga)}</Typography>
														<Typography>Stok: {produkData.stok}</Typography>
													</CardContent>
													<CardActions className={clasess.produkActions}>
														<IconButton component={Link} to={`/produk/edit/${produkDoc.id}`}>
															<EditIcon />
														</IconButton>
														<IconButton onClick={handleDelete(produkDoc)}>
															<DeleteIcon />
														</IconButton>
													</CardActions>
												</Card>
											</Grid>
							})						
						}
					</Grid>
					
					
					
					<Fab 
						className={clasess.fab}
						color="primary"
						onClick={(e)=>{
							setOpenAddDialog(true);
						}}
					>
						<AddIcon />					
					</Fab>
					
					<AddDialog 
						open={openAddDialog} 
						handleClose={() => {
							setOpenAddDialog(false);
						}}
					/>
				</>
}

export default GridProduk;