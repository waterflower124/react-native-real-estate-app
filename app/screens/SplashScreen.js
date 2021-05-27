import React, { Component } from "react";
import { View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
    TextInput,
    Alert
 } from "react-native";

import { Colors } from '../utils/Colors';
import { strings } from "../strings";
import { stylesGlobal } from '../global/stylesGlobal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ProgressIndicator from "../components/ProgressIndicator";
import * as Global from "../global/Global";
import WebService from "../utils/WebService";
import { Constants } from "../global/Constants";
import AsyncStorage from '@react-native-async-storage/async-storage';

var TAG = "SignInScreen";

export default class SplashScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            signin_id_iqama: "",
            signin_password: "",
        }
    }

    async componentDidMount() {
        try {
            var user_id = await AsyncStorage.getItem(Constants.KEY_USER_ID);
            var user_password = await AsyncStorage.getItem(Constants.KEY_USER_PASSWORD);
            this.setState({
                signin_id_iqama: user_id,
                signin_password: user_password,
            }, () => {
                if(this.state.signin_id_iqama != null && this.state.signin_id_iqama != "" && this.state.signin_password != null && this.state.signin_password!= "") {
                    this.user_signin();
                } else {
                    this.props.navigation.reset({index: 0, routes: [{name: "IntroScreen"}]});
                }
            })
            
        } catch(error) {

        }
        
    }

    user_signin = async() => {
        try {
            if(this.state.signin_id_iqama.length == 0) {
                Alert.alert(strings.warnning, strings.id_iqama_length_error);
                return;
            }
            if(this.state.signin_password.length < 6) {
                Alert.alert(strings.warnning, strings.password_error);
                return;
            }
            this.setState({
                loading: true,
            });
            var uri = Global.BASE_URL + "/api/login";
            
            let params = new FormData();
            params.append("person_id", this.state.signin_id_iqama);
            params.append("password", this.state.signin_password);
            params.append("device_token", Global.PUSH_TOKEN);
                                    
            console.log(TAG + " callSignInAPI uri " + uri);
            console.log(TAG + " callSignInAPI params " + JSON.stringify(params));

            WebService.callServicePost(uri, params, this.handleSignInAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
            });
        }
    }

    handleSignInAPI = async(response, isError) => {
        console.log(TAG + " callSignInAPI Response " + JSON.stringify(response));
        console.log(TAG + " callSignInAPI isError " + isError);
        try {
            if(!isError) {
                // Global.API_TOKEN = response.token;
                // this.props.navigation.reset({index: 0, routes: [{name: "DrawerNavigator"}]});
                if(response.status == "success") {
                    Global.USER_ID = response.user.id;
                    Global.API_TOKEN = response.token;
                    Global.FULLNAME = response.user.name;
                    Global.PHONENUMBER = response.user.phone;
                    Global.USERTYPE = response.user.type;
                    Global.IDIQAMA = response.user.person_id;
                    Global.AVATAR = response.user.avatar;
                    
                    this.props.navigation.reset({index: 0, routes: [{name: "DrawerNavigator"}]});
                } else {
                    this.props.navigation.reset({index: 0, routes: [{name: "IntroScreen"}]});
                }
            } else {
                this.props.navigation.reset({index: 0, routes: [{name: "IntroScreen"}]});
            }
        } catch(error) {
            console.log("signin catch error", error);
        }
        this.setState({
            loading: false
        })
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.main}}>
            {
                this.state.loading &&
                <ProgressIndicator/>
            }
                <Image style = {{width: '50%', height: '100%', resizeMode: 'contain', tintColor: Colors.white}} source = {require('../assets/images/logo_splash.png')}/>
            </View>
        )
    }
}