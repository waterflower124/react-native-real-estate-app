/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
  I18nManager
} from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import 'react-native-gesture-handler';
import { strings } from "./app/strings";
import ProgressIndicator from "./app/components/ProgressIndicator";
import * as Global from "./app/global/Global";
import { Constants } from "./app/global/Constants";
import WebService from "./app/utils/WebService";
import AsyncStorage from '@react-native-async-storage/async-storage';

import RootNavigator from './app/screens/RootNavigator';

import OneSignal from 'react-native-onesignal';
import {languageSwitcher} from './app/utils/language';

import * as DrawerNavigation from './app/utils/ReactNavigation';
import { EventRegister } from 'react-native-event-listeners';

var TAG = "App.js";
export default class App extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            loading: true,
            signin_id_iqama: "",
            signin_password: "",
        }

        OneSignal.init("37d3344f-9349-4fa9-adeb-f7c9b36aae23");
    
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);

    }

    UNSAFE_componentWillMount() {
        OneSignal.inFocusDisplaying(2);
       
    }

    async componentDidMount() {

        const langCode = await languageSwitcher.getCurrentLanguageCode();
        await languageSwitcher.switchTo(langCode);

        setTimeout(function() {
            SplashScreen.hide();
        }, 1000);
        
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
    }

    onReceived(notification) {
        console.log("Notification received: ", JSON.stringify(notification));
        var notification_type = "";
        if(notification.payload.additionalData != null) {
            notification_type = notification.payload.additionalData.type;
        }
        if(notification_type == "profile") {
            var header = {
                'Authorization': 'Bearer ' + Global.API_TOKEN,
            }

            fetch(Global.BASE_URL + "/api/profile", {
                method: "GET",
                headers: header
            })
            .then(response => {
                return response.json();
            })
            .then(responseData => {
                console.log(responseData)
                if(responseData.status == "success") {
                    Global.FULLNAME = responseData.profile.name;
                    Global.PHONENUMBER = responseData.profile.phone;
                    Global.IDIQAMA = responseData.profile.person_id;
                    Global.AVATAR = responseData.profile.avatar;
                    EventRegister.emit(Constants.PROFILE_CHANGED, '');
                } else {
                    
                }
            })
            .catch(error => {
                console.log(error)
            });
        }
    }

    onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
        var notification_type = "";
        if(openResult.notification.payload.additionalData != null) {
            notification_type = openResult.notification.payload.additionalData.type;
        }
        if(notification_type == "news") {
            if(DrawerNavigation.getCurrentRoute() == "NewsDetailScreen") {
                EventRegister.emit("news_notification", openResult.notification.payload.additionalData.id);
            } else {
                DrawerNavigation.navigate('DrawerNavigator', {screen: 'NewsDetailScreen', params: {id: openResult.notification.payload.additionalData.id}});
            }
        } else if(notification_type == "profile") {
            
        } else if(notification_type == "chat") {
            if(DrawerNavigation.getCurrentRoute() != "CustomerSupportScreen") {
                DrawerNavigation.navigate('DrawerNavigator', {screen: 'CustomerSupportScreen'});
            }
        }
    }

    onIds(device) {
        console.log('Device info11111: ', device);
        Global.PUSH_TOKEN = device.userId;
    }

    render() {
        return (
            <View style={{ flex: 1, }}>
                <RootNavigator />
            </View>
        )
    }

}
