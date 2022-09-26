import React,{useState} from 'react';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import useStyles from './styles/grid';

//import component
import AddDialog from './add';
function GridProduk(){
	const clasess = useStyles();

	const [openAddDialog, setOpenAddDialog] = useState(false);
    return   <><h1>Halaman Grid Produk</h1>
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
						handleClose={()=>{
							setOpenAddDialog(false);
						}}
					/>
				</>
}

export default GridProduk;