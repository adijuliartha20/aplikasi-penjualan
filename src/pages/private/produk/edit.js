import React,{useState, useEffect} from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import UploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/Save';

import { useFirebase } from '../../../components/FirebaseProvider';
import { useDocument } from 'react-firebase-hooks/firestore/';

import AppPageLoading from '../../../components/AppPageLoading';

import {useSnackbar} from 'notistack';

import useStyles from './styles/edit';

import {Prompt} from 'react-router-dom';

function EditProduk({match}){
	const classes = useStyles();
	
	const { firestore, storage, user } = useFirebase();
	
	const {enqueueSnackbar} =  useSnackbar();
	
	const produkDoc = firestore.doc(`toko/${user.uid}/produk/${match.params.produkId}`);
	
	const produkStorageRef = storage.ref(`toko/${user.uid}/produk`);
	

	const [snapshot, loading]= useDocument(produkDoc);


	const [form, setForm] = useState({
		nama : '',
		sku:'',
		harga:0,
		stok:0,
		deksripsi:''
	});
	
	const [error, setError] = useState({
			nama : '',
			sku:'',
			harga:'',
			stok:'',
			deksripsi:''
	})
	
	const [isSubmitting, setSubmitting] = useState(false);
	
	const [isSomethingChange, setSomethingChange] = useState(false);
	
	useEffect(()=>{
		if(snapshot){
			setForm(currentForm=>({
				...currentForm,
				...snapshot.data()
			}));
		}	
	},[snapshot]);

	const handleChange = e => {
		setForm({
			...form,
			[e.target.name] : e.target.value		
		});
		
		setError({
			...error,
			[e.target.name] : ''
		});
		
		setSomethingChange(true);
	}
	
	const validate = ()=>{
		const newError = {...error};
		
		if(!form.nama){
			newError.nama = 'Nama wajib diisi';
		}
		if(!form.harga){
			newError.harga = 'Harga wajib diisi';
		}
		if(!form.stok){
			newError.stok = 'Stok wajib diisi';
		}
		return newError;
	}
	
	const handleSubmit = async e => {
		e.preventDefault();
		
		const findError = validate();
		if(Object.values(findError).some(err => err !=='')){
			setError(findError);
		}else{
			setSubmitting(true);
			try{
				await produkDoc.set(form, {merge: true});
				enqueueSnackbar('Data produk berhasil disimpan', {variant:'success'});
				setSomethingChange(false);
			}catch(e){
				enqueueSnackbar(e.message, {variant:'error'});
			}
			setSubmitting(false);
		}
	}
	
	const handleUploadFile = async (e) => {
		const file = e.target.files[0];
				
		if(!['image/png','image/jpeg'].includes(file.type)){
			setError(e=>({
				...error,
				foto: `Tipe file tidak didukung: ${file.type}`
			}));
		}else if(file.size >= 512000){
			setError(e=>({
				...error,
				foto: `Ukuran file terlalu besar > 500KB`
			}));
		}else{
			const reader = new FileReader();
			
			// saat proses load dibatalkan
			reader.onabort = () => {
				setError(e=>({
					...error,
					foto: `Proses pembacaan file dibatalkan`
				}));
			}
			//saat proses terjadi error
			reader.onerror = () => {
				setError(e=>({
					...error,
					foto: `File tidak bisa dibaca`
				}));
			}
			
			reader.onload = async () => {//saat berhasil diload upload ke
				setError(e=>({
					...error,
					foto: ``
				}));
				
				setSubmitting(true);
				try{
					const fotoExt = file.name.substring(file.name.lastIndexOf('.'));
					
					const fotoRef = produkStorageRef.child(`${match.params.produkId}${fotoExt}`);
					
					const fotoSnapshot = await fotoRef.putString(reader.result,'data_url');
					
					const fotoUrl = await fotoSnapshot.ref.getDownloadURL();
					
					setForm(currentForm=>({
						...currentForm,
						foto:fotoUrl
					}));
					
					setSomethingChange(true);
				}catch(e){
					console.log(e)
					setError(e=>({
						...error,
						foto: e.message
					}));
				}
				setSubmitting(false);
			}
			
			reader.readAsDataURL(file);
			
			
		}		
	}
	
	if(loading){
		return <AppPageLoading />
	}
	
	
    return 	<div>
					<Typography variant="h5" component="h1">Edit Produk: {form.nama}</Typography>
					<Grid container alignItems="center" justify="center">
						<Grid item xs={12} sm={6}>
							<form id="produk-form" onSubmit={handleSubmit} noValidate>
								<TextField 
									id="nama"
									name="nama"
									label="Nama"
									margin="normal"
									required
									fullWidth
									value={form.nama}
									onChange={handleChange}
									error = {error.nama? true:false}
									helperText = {error.nama}
									disabled={isSubmitting}
								/>
								<TextField 
									id="sku"
									name="sku"
									label="SKU"
									margin="normal"
									fullWidth
									value={form.sku}
									onChange={handleChange}
									error = {error.sku? true:false}
									helperText = {error.sku}
									disabled={isSubmitting}
								/>
								<TextField 
									id="harga"
									name="harga"
									label="Harga"
									margin="normal"
									type="number"
									required
									fullWidth
									value={form.harga}
									onChange={handleChange}
									error = {error.harga? true:false}
									helperText = {error.harga}
									disabled={isSubmitting}
								/>
								<TextField 
									id="stok"
									name="stok"
									label="Stok"
									margin="normal"
									type="number"
									required
									fullWidth
									value={form.stok}
									onChange={handleChange}
									error = {error.stok? true:false}
									helperText = {error.stok}
									disabled={isSubmitting}
								/>
								
								<TextField 
									id="deksripsi"
									name="deksripsi"
									label="Deksripsi"
									margin="normal"
									fullWidth
									multiline
									rowMax={3}
									value={form.deksripsi}
									onChange={handleChange}
									error = {error.deksripsi? true:false}
									helperText = {error.deksripsi}
									disabled={isSubmitting}
								/>
							</form>
						</Grid>
						<Grid item xs={12} sm={6}>
							<div className={classes.uploadFotoProduk}>
								{form.foto &&
									<img src={form.foto} className={classes.previewFotoProduk} alt={`Foto Produk ${form.nama}`} />									
								}								
								<input 
									className={classes.hideInputFile}
									type="file"
									id="upload-foto-produk"
									accept="image/jpeg, image/png"
									onChange={handleUploadFile}
								/>
								<label htmlFor="upload-foto-produk">
									<Button
										disabled={isSubmitting}
										variant="outlined"
										component="span"
									>
										Upload Foto<UploadIcon className={classes.iconRight} />
									</Button>
								</label>
								{error.foto &&
									<Typography color="error">
										{error.foto}
									</Typography>
								}
							</div>
						</Grid>
						<Grid item xs={12}>
							<div className={classes.actionButtons}>
								<Button 
									form="produk-form"
									type="submit"
									color="primary" 
									variant="contained"
									disabled={isSubmitting || !isSomethingChange }
								>
									<SaveIcon className={classes.iconLeft} />Simpan 
								</Button>				
							</div>
						</Grid>
					</Grid>
					<Prompt 
						when={isSomethingChange}
						message="Terdapat perubahan yang belum disimpan, apakah anda yakin ingin meninggalkan halaman ini?"
					/>
				</div>
}

export default EditProduk;