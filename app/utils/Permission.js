/*
   npm install --save 'react-native-geolocation-service'
*/
import { Platform, PermissionsAndroid } from 'react-native'
import GeoLocation from '@react-native-community/geolocation'

export const getUserLocation = async (successCallback, errorCallBack, options) => {

    GeoLocation.setRNConfiguration({ authorizationLevel: "whenInUse" });

    let geolocationConroller
    if (Platform.OS == 'android') {
        geolocationConroller = GeoLocation
        const alreadyGranted = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        let granted = alreadyGranted
        
        if (!granted) {
            const permissionResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            granted = permissionResult === PermissionsAndroid.RESULTS.GRANTED
        }
        if (!granted) { return;  }
    } else {
        // iOS Platform
        geolocationConroller = GeoLocation
        geolocationConroller.requestAuthorization()
    }

    console.log("android permission is granted")
    geolocationConroller.getCurrentPosition(successCallback, errorCallBack, options)

}

export const GoogleMapiAPIKey = "";

export const requestStoragePermission = async() => {
    if(Platform.OS == "ios") {
        return true;
    } else {
        try {
            const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: "Storage Permission",
                message: "requires Storage Permission",
                buttonNegative: "Cancel",
                buttonPositive: "OK",
            },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    }
}

