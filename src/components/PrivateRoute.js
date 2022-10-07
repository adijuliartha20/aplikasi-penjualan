import React from 'react';
import { Route, Redirect } from 'react-router-dom';

//import useFirebase
import { useFirebase } from './FirebaseProvider';


function PrivateRoute({ component: Component, ...restProps }) {
    //const user = {name:'adi'};//buat dummy dulu nanti kita integrasi dengan firebase
    const { user } = useFirebase();
    //console.log(user)
    return <Route
        {...restProps}

        render={props => {
            return user ?
                <Component {...props} />
                :
                <Redirect to={{
                    pathname: '/login',
					state: {
						from: props.location
					}
                }} />
        }
        }
    />
}

export default PrivateRoute;