import React from 'react';
import {Route, Redirect} from 'react-router-dom';

function PrivateRoute({component: Component, ...restProps}){
    const user = {name:'adi'};//buat dummy dulu nanti kita integrasi dengan firebase

    return <Route 
        {...restProps}

        render = { props => {
                return user ?
                    <Component {...props} />
                    :
                    <Redirect to={{pathname:'/login'}} />
            }
        }
    />
}

export default PrivateRoute;