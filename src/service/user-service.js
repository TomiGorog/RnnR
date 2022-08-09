import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebaseconfig";
import { firebaseConfig } from "./firebaseconfig";

export function userReg(userDataObj) {
    const auth = getAuth(app);
    return createUserWithEmailAndPassword(auth, userDataObj.email, userDataObj.password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(userDataObj.email)
            userDataObj.uid = userCredential.user.uid;
            return fetch(`${firebaseConfig.databaseURL}/Felhasznalok/${userDataObj.userName}.json`, {
                method: "PUT",
                body: JSON.stringify(userDataObj)
            })
                .then(() => userDataObj)
        })
}

export function loadUserByUsername(username) {
    return fetch(`${firebaseConfig.databaseURL}/Felhasznalok/${username}.json`)
        .then(resp => resp.json())
}

export function loadAllUsers() {
    return fetch(`${firebaseConfig.databaseURL}/Felhasznalok.json`)
        .then(resp => resp.json())
}

export function findUserByUid(uid, users) {
    let userKey = Object.keys(users).find((key) => users[key].uid == uid)
    // console.log(users[userKey]);
    return users[userKey]
}

export function userListPackages(address) {
    console.log(address)
    return fetch(`${firebaseConfig.databaseURL}/Csomagok.json`)
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            let packagesArray = [];
            Object.keys(data).forEach(packages => {
                console.log(data[packages].receiverAddress)
                console.log(address)
                if (data[packages].receiverAddress == address) {

                    packagesArray.push({ id: packages, ...data[packages] })
                }
            })
            console.log(packagesArray)
            return packagesArray
        })

}

export function userEditDataDisplay(params) {
    console.log(`a komponensből átadott urlparam + ${JSON.stringify(params)}`)
    return fetch(`${firebaseConfig.databaseURL}/Felhasznalok/${params.username}.json`)
        .then(resp => resp.json())
}

export function userEdit(userDataObj) {
    return fetch(`${firebaseConfig.databaseURL}/Felhasznalok/${userDataObj.userName}.json`, {
        method: "PATCH",
        body: JSON.stringify(userDataObj)
    })
        .then(resp => resp.json())

}

export function packagesSentByUser(userName) {
    return fetch(`${firebaseConfig.databaseURL}/Felhasznalok/${userName}/packages.json`)
        .then(resp => resp.json())
        .then(data => {
            let packagesArray = [];
            Object.keys(data).forEach(packages => {
                console.log(data[packages].receiverAddress)
                packagesArray.push({ id: packages, ...data[packages] })
            })
            console.log(packagesArray)
            return packagesArray

        })
}