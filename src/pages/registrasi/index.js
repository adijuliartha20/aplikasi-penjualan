import React, {useState} from 'react';

import './index.css';

//import komponen material ui
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

//import style
import useStyle from './styles';

//import react router dom 
import {Link, Redirect} from 'react-router-dom';

//import validator
import isEmail from 'validator/lib/isEmail';


//import firebase hook
import {useFirebase} from '../../components/FirebaseProvider';

//import app loading component

import AppLoading from '../../components/AppLoading';

function Registrasi(){
    const classes = useStyle();
	
	//controll field dengan state
	const [form, setForm] = useState({
										email: "",
										password : "",
										ulangi_password : ""
											});
											
	//control error dengan state
	const [error, setError] = useState({
		email: "",
		password : "",
		ulangi_password : ""
	});
	
	//loading control
	const [isSubmitting, setSubmitting]  = useState(false);
	
	const {auth, user, loading} = useFirebase();
											
    //set form data											
	const handleChange = e=> {
		setForm({
			...form, 
			[e.target.name] : e.target.value
		})
		
		setError({
			...error,
			[e.target.name] : ''
		})
	}
	
	const validate = () => {
		const newError = {...error};
		
		if(!form.email){
			newError.email = 'Email wajib diisi';
		}else if(!isEmail(form.email)){
			newError.email = 'Email tidak valid';
		}
		
		if(!form.password){
			newError.password = 'Password wajib diisi';
		}
		
		if(!form.ulangi_password){
			newError.ulangi_password = 'Ulangi Password wajib diisi';
		}else if(form.ulangi_password!==form.password){
			newError.ulangi_password = 'Ulangi Password tidak sama dengan password';
		}
		
		return newError;
	}
	
	const handleSubmit = async e => {
		e.preventDefault();
		
		const findErrors = validate();
		
		if(Object.values(findErrors).some(err=>err!=='')){
			setError(findErrors);		
		}else{
			try{
				setSubmitting(true)
				await auth.createUserWithEmailAndPassword(form.email, form.password)
			}catch(e){
				const newError = {};
				
				switch(e.code){
					case 'auth/email-already-in-use':
						newError.email = 'Email sudah terdaftar';
					break;
					case 'auth/invalid-email':
						newError.email = 'Email tidak valid';
					break;
					case 'auth/weak-password':
						newError.password = 'Password lemah';
					break;
					case 'auth/operation-not-allowed':
						newError.email = 'Metode email dan password tidak didukung';
					break;
					default:
						newError.email = 'Terjadi kesalahan silahkan coba lagi';
					break;
					
				}
				
				setError(newError);
				setSubmitting(false);
			}
		}
	}
	
	console.log(user);
	
	if(loading){
		return <AppLoading />
	}
	
	if(user){
		return <Redirect to="/" />
		
	}
	
    return <Container maxWidth="xs">
                <Paper className={classes.paper}>
                    <Typography variant="h5" component="h1" className={classes.title}>Buat Akun Baru</Typography>
                    <form onSubmit={handleSubmit} noValidate>
                        <TextField 
							id="email" 
							type="email" 
							name="email" 
							margin="normal" 
							label="Alamat Email" 
							fullWidth 
							required  
							value={form.email}
							onChange={handleChange}
							helperText={error.email}
							error={error.email?true:false}
							disable={isSubmitting}
							/>
							
                        <TextField 
							id="password" 
							type="password" 
							name="password" 
							margin="normal" 
							label="Password"
							fullWidth required 
							value={form.password} 
							onChange={handleChange}
							helperText={error.password}
							error={error.password?true:false}
							disable={isSubmitting}
							/>
							
							
                        <TextField 
							id="ulangi_password" 
							type="password" 
							name="ulangi_password"
							margin="normal" 
							label="Ulangi Password" 
							fullWidth required 
							value={form.ulangi_password}
							onChange={handleChange}
							helperText={error.ulangi_password}	
							error={error.ulangi_password?true:false}
							disable={isSubmitting}
							/>

                        <Grid container className={classes.buttons}>
                            <Grid item xs>
                                <Button type="submit" color="primary" variant="contained" size="large" disable={isSubmitting}>Daftar</Button>
                            </Grid>
                            <Grid item>
                                <Button component={Link} variant="contained" size="large" to="/login" disable={isSubmitting}>Login</Button>
                            </Grid>
                        </Grid>
                    </form>       
                </Paper>
        </Container>
}

export default Registrasi;