import React, {useState} from 'react';
import PropTypes from 'prop-types' ;
//material ui
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import {useFirebase} from '../../../components/FirebaseProvider';

import {withRouter} from 'react-router-dom'; //untuk ambil history

function AddDialog({history, open, handleClose}){//karena menggunakan withRouter kita dapat props history
	//buat sub collection di bawah collection toko dengan referensi Id
	//ingat definisikan security rule untuk sub collection produk => firestore.rules
	//update file ke online 'firebase deploy --only firestore:rules'
	
	const { firestore, user } =  useFirebase();
	
	const produkCol =  firestore.collection(`toko/${user.uid}/produk`);

	const [nama, setNama] = useState();
	const[error, setError] = useState('');
	const[isSubmitting, setSubmitting] = useState(false);
	const handleSimpan = async e => {
		setSubmitting(true);
		try{
			if(!nama){
				throw new Error('Nama Produk wajib diisi');
			}
			//tambah data dan masukkan id produk baru
			const produkBaru = await produkCol.add({nama});
			
			history.push(`produk/edit/${produkBaru.id}`);
		}catch(e){
			console.log(e);
		
			setError(e.message);
		}
		setSubmitting(false); 
	}
	return <Dialog open={open} onClose={handleClose} disabled={isSubmitting}>
					<DialogTitle>Buat Produk Baru</DialogTitle>
					<DialogContent dividers>
						<TextField
							id="nama"
							label="Nama Produk"
							value = {nama}
							onChange = {(e)=>{
								setError('');
							
								setNama(e.target.value);
							}}
							helperText = {error}
							error = {error ? true : false}
							disabled={isSubmitting}
						/>
					</DialogContent>
					<DialogActions>
						<Button disabled={isSubmitting} onClick={handleClose}>Batal</Button>
						<Button disabled={isSubmitting} onClick={handleSimpan} color="primary">Simpan</Button>
					</DialogActions>
				</Dialog>
}


//saat dialog ini di buka harus memiliki props open dan handleClose
AddDialog.propTypes = {
	open : PropTypes.bool.isRequired,
	handleClose : PropTypes.func.isRequired
}

export default withRouter(AddDialog);