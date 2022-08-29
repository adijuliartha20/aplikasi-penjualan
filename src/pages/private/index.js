import React from 'react';
import {Switch, Route} from 'react-router-dom';

//komponen
import Pengaturan from './pengaturan';
import Produk from './produk';
import Transaksi from './transaksi';
import Home from './home';//saat tidak ada slash maka yang dirender komponen Home

function Private(){
    return(
        <Switch>
            <Route path="/pengaturan" component={Pengaturan} />
            <Route path="/produk" component={Produk} />
            <Route path="/transaksi" component={Transaksi} />
            <Route component={Home} />
        </Switch>
    )
}

export default Private;