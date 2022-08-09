import { generateDate } from "./package-service";
import { firebaseConfig } from "./firebaseconfig";

export function superadminPackageRunnerPairing(runnerId, currentPackage) {
    let pickupTime = generateDate()
    return fetch(`${firebaseConfig.databaseURL}/Csomagok/${currentPackage.id}.json`, {
        method: "PATCH",
        body: JSON.stringify({
                status: "szállítás alatt",
                runner: runnerId,
                pickedUpAt: pickupTime
            }
        )
    })
    .then(resp => resp.json())
    .then(() => {
        return fetch(`${firebaseConfig.databaseURL}/Futarok/${runnerId}/packages/${currentPackage.id}.json`, {
            method: "PATCH",
            body: JSON.stringify({
                packageId: currentPackage.id
            })
        })
        .then(resp => resp.json())
        .then(() => {
            return fetch(`${firebaseConfig.databaseURL}/Felhasznalok/${currentPackage.user}/packages/${currentPackage.id}.json`, {
                method: "PATCH",
                body: JSON.stringify({
                    
                    category: currentPackage.category,
                    createdAt: currentPackage.createdAt,
                    senderAddress: currentPackage.senderAddress,
                    receiverAddress: currentPackage.receiverAddress,
                    senderCoordinates: currentPackage.senderCoordinates,
                    receiverCoordinates: currentPackage.receiverCoordinates,
                    status: "szállítás alatt",
                    runner: runnerId,
                    pickedUpAt: pickupTime
                })
            })
        })
        .then(resp => resp.json())
    })
    .then(() => {
        console.log("Lefutott a service, true-val.")
        return true;
    })
    .catch((error) => {
        console.log("Hibára futottunk!");
        return false;
    });
    

}


export function superadminPackageShipped(currentPackage, runnerId) {
    return fetch(`${firebaseConfig.databaseURL}/Csomagok/${currentPackage.id}.json`, {
        method: "PATCH",
        body: JSON.stringify({
            status: "leadott"
            })
        })
        .then(resp => resp.json())
        .then(() => {
            return fetch(`${firebaseConfig.databaseURL}/Futarok/${runnerId}/packages/${currentPackage.id}.json`, {
                method: "DELETE"
            })
        .then(resp => resp.json())
        .then(() => {
            return fetch(`${firebaseConfig.databaseURL}/Felhasznalok/${currentPackage.user}/packages/${currentPackage.id}.json`, {
                method: "PATCH",
                body: JSON.stringify({
                    status: "leadott"
                })
            })
            })
            .then(() => {
                console.log("Lefutott a saservice, true-val.")
                return true;
            })
            .catch((error) => {
                console.log("Hibára futottunk!");
                return false;
            });
        }
        
        );
}