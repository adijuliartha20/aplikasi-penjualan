import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Grid from './grid';
import EditProduk from './edit';

function Produk(){
    return (
        <Switch>
            <Route path="/produk/edit/:produkId" component={EditProduk} />
            <Route component={Grid} />
        </Switch>
    );
}

export default Produk;