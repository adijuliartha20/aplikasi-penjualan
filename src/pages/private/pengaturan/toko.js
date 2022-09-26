import React, {useState, useEffect} from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import useStyles from './styles/toko';

//validator
import isURL from 'validator/lib/isURL';

import { useFirebase } from '../../../components/FirebaseProvider';

import {useSnackbar} from 'notistack';

import AppPageLoading from '../../../components/AppPageLoading';


//load data dari firebase
import {useDocument} from 'react-firebase-hooks/firestore';

//react router => mencegah pindah halaman padahal ada perubahan

import {Prompt} from 'react-router-dom';


function Toko(){
	const classes = useStyles();
	
	const {firestore, user} = 	useFirebase();
	
	const tokoDoc =  firestore.doc(`toko/${user.uid}`);//disini set collection dan referencenya pakai user id
	const {enqueueSnackbar} = useSnackbar();
	
	//ambil data
	const [snapshot, loading] = useDocument(tokoDoc);
	
	const [form, setForm] = useState({
		nama: '',
		alamat : '',
		telepon : '',
		website:''
	})
	
	const [isSomethingChange, setSomethingChange] = useState(false);
	
	const handleChange = e => {
		setForm({
			...form,
			[e.target.name] : e.target.value
		})
		
		setError({
			[e.target.name] : ''		
		});
		
		setSomethingChange(true);
		
	}
	const [isSubmitting, setSubmitting] = useState(false)
	
	const [error, setError] = useState({
		nama : '',
		alamat: '',
		telepon:'',
		website:''
	})
	
	//load data
	useEffect(()=>{
		if(snapshot){
			setForm(snapshot.data());
		}
	},[snapshot]);
	
	
	//buat validasi
	const validate = () =>{
		const newError = { ...error };
		
		if(!form.nama){
			newError.nama = 'Nama wajib diisi';
		}
		
		if(!form.alamat){
			newError.alamat = 'Alamat wajib diisi';
		}
		
		if(!form.telepon){
			newError.telepon = 'Telepon wajib diisi';
		}
	
		if(!form.website){
			newError.website = 'Website wajib diisi';
		}else if(!isURL(form.website)){
			newError.website = 'URL tidak valid';
		}
		
		return newError;
	}

	
	const handleSubmit = async e => {
		e.preventDefault();
		
		const findErrors = validate();
		
		if(Object.values(findErrors).some(err=> err != '')){
			setError(findErrors);
		}else{
			console.log('masuk ini');
			setSubmitting(true);
			try{
				await tokoDoc.set(form,{merge:true});
				setSomethingChange(false);
				enqueueSnackbar('Data toko berhasil disimpan', {variant:'success'});
			}
			catch(e){
				enqueueSnackbar(e.message, {variant:'error'});
			}
			setSubmitting(false);
			
			
		}
	}
	
	if(loading){
		return <AppPageLoading />
	}
	
	return <div className={classes.pengaturanToko}>
		<form onSubmit={handleSubmit} noValidate>
			<TextField 			
				id="nama"
				name="nama"
				label="Nama"
				margin="normal"
				fullWidth
				required
				value={form.nama}
				onChange={handleChange}
				disabled = {isSubmitting}
				error = {error.nama? true:false}
				helperText = {error.nama}
			/>
			<TextField 
				id="alamat"
				name="alamat"
				label="Alamat Toko"
				margin="normal"
				fullWidth
				multiline
				required
				rowsMax={3}
				value={form.alamat}
				onChange={handleChange}
				disabled ={isSubmitting}
				error ={error.alamat? true : false}
				helperText ={error.alamat}
			/>
			<TextField 
				id="telepon"
				name="telepon"
				label="No Telepon Toko"
				margin="normal"
				fullWidth
				required
				value={form.telepon}
				onChange = {handleChange}
				disabled={isSubmitting}
				error = {error.telepon? true:false}
				helperText = {error.telepon}
			/>
			<TextField 
				id="website"
				name="website"
				label="Url website"
				margin="normal"
				fullWidth
				required
				value={form.website}
				onChange={handleChange}
				disabled={isSubmitting}
				error={error.website? true:false}
				helperText={error.website}
			/>
			<Button
				className={classes.actionButton}
				variant="contained"
				color="primary"
				disabled={isSubmitting || !isSomethingChange}
				type="submit"
			>
				Simpan
			</Button>
		</form>
		
		<Prompt 
			when={isSomethingChange}
			message="Terdapat perubahan yang belum disimpan, apalah anda yakin  ingin meninggalkan halaman ini?"
		/>
	</div>
}

export default Toko;