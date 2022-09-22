import React, { useContext } from 'react';

//6. import firebase SDK
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

//7. inisialisasi firebase dengan config yang bisa didapatkan pada console.firebase.google,com
//8. Copy config di Project Settings => web app => config
//9. buat folder config => buat file firebase.js 

//10. import firebaseConfig
import firebaseConfig from '../config/firebase';

//12. gunakan fitur React Firebase Hook
import { useAuthState } from 'react-firebase-hooks/auth';


//11. inisialisasi firebase
firebase.initializeApp(firebaseConfig);

//1. buat contexts
const FirebaseContext = React.createContext();

//19. Buat custom hook di FirebaseProvider.js
export function useFirebase() {
    return useContext(FirebaseContext);
}

//2.buat komponen pembungkus
function FirebaseProvider(props) {
    //13. inisialisasi fitur auth firestore dan storage
    const auth = firebase.auth();
    const firestore = firebase.firestore();
    const storage = firebase.storage();
    //14. gunakan useAuthState. memiliki kita return value [user, loading, error]
    const [user, loading, error] = useAuthState(auth);
    //15. masukkan data ke share data context di value={{}}

    //4. kita gunakan FirebaseContext.Provider dan menggunakan props.children
    //5. set data yang akan kita share secara global set value={{}} di element FirebaseContext.Provider
    return <FirebaseContext.Provider value={{ auth, firebase, firestore, storage, user, loading, error }}>
        {props.children}
    </FirebaseContext.Provider>
}

//3.export komponen
export default FirebaseProvider;


//16. Gunakan FirebaseProvider di App.js
//17. import FirebaseProvider from './components/FirebaseProvider';
//18. Bungkus Router dengan FirebaseProvider


//20. di PrivateRoute.js kita import useFirebase
//21. ganti variable user dengan object distructer => const {user} = useFirebase();