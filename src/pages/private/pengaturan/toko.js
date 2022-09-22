import React, {useState} from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import useStyles from './styles/toko';

//validator
import isURL from 'validator/lib/isURL';

import { useFirebase } from '../../../components/FirebaseProvider';

function Toko(){
	const classes = useStyles();
	
	const {firestore, user} = 	useFirebase();
	
	const tokoDoc =  firestore.doc(`toko/${user.uid}`);//disini set collection dan referencenya pakai user id
	
	const [form, setForm] = useState({
		nama: '',
		alamat : '',
		telepon : '',
		website:''
	})
	const handleChange = e => {
		setForm({
			...form,
			[e.target.name] : e.target.value
		})
	}
	const [isSubmitting, setSubmitting] = useState(false)
	
	const [error, setError] = useState({
		nama : '',
		alamat: '',
		telepon:'',
		website:''
	})
	
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
			setSubmitting(true);
			try{
				//await tokoDoc.set(form,{merge:true});
			}
			catch(e){
				console.log(e.message);
			}
			setSubmitting(false);
		}
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
				disabled={isSubmitting}
				type="submit"
			>
				Simpan
			</Button>
		</form>
	</div>
}

export default Toko;