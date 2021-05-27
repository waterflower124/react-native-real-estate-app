
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
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

var TAG = "SignUpScreen";

export default class SignUpScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            user_type: "owner", //owner, renter
            register_full_name: "",
            register_id_iqama: "",
            register_phone_number: "",
            register_password: "",
            register_hide_password: true,
        }
    }

    UNSAFE_componentWillMount() {

    }

    sendPhoneNumber = async() => {
        try {
            if(this.state.register_full_name.length < 3) {
                Alert.alert(strings.warnning, strings.name_length_error);
                return;
            }
            if(this.state.register_id_iqama.length == 0) {
                Alert.alert(strings.warnning, strings.id_iqama_length_error);
                return;
            }
            if(this.state.register_phone_number.length != 10) {
                Alert.alert(strings.warnning, strings.phone_number_error);
                return;
            }
            if(this.state.register_password.length < 6) {
                Alert.alert(strings.warnning, strings.password_error);
                return;
            }
            
            this.setState({
                loading: true,
            });
            var uri = Global.BASE_URL + "/api/getOTP";
            let params = new FormData();
            params.append("phone", this.state.register_phone_number);
            params.append("type", 'register');

            console.log(TAG + " callSendPhoneNumberAPI uri " + uri);
            console.log(TAG + " callSendPhoneNumberAPI params " + JSON.stringify(params));

            WebService.callServicePost(uri, params, this.handleSendPhoneNumberAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
            });
        }
    }

    handleSendPhoneNumberAPI = async(response, isError) => {
        console.log(TAG + " callSendPhoneNumberAPI Response " + JSON.stringify(response));
        console.log(TAG + " callSendPhoneNumberAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    // Alert.alert("Success!", "signup success");
                    var register_data = {
                        "name": this.state.register_full_name,
                        "person_id": this.state.register_id_iqama,
                        "phone": this.state.register_phone_number,
                        "password": this.state.register_password
                    }
                    if(this.state.user_type == "owner") {
                        register_data.type = "OWNER";
                    } else {
                        register_data.type = "RENTER";
                    }
                    this.props.navigation.navigate("VerifyPhoneScreen", {data: register_data})
                } else {
                    Alert.alert("Warning!", "signup response error");
                }
            } else {
                Alert.alert("Warning!", "signup error");
            }
        } catch(error) {
            console.log("signup catch error", error);
        }
        this.setState({
            loading: false
        })
    }


    render() {
        return (
            <View style = {{flex: 1, backgroundColor: Colors.main}}>
            {
                this.state.loading &&
                <ProgressIndicator/>
            }
                <View style = {{position: 'absolute', width: '100%', top: StaticSafeAreaInsets.safeAreaInsetsBottom + 10, left: 0, zIndex: 5, elevation: 5}}>
                    <TouchableOpacity style = {{width: 30, height: 30, marginHorizontal: 20, justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.props.navigation.goBack()}>
                        <Image style = {{width: 25, height: 25, resizeMode: 'contain'}} source = {require('../assets/images/navbar_back.png')}></Image>
                    </TouchableOpacity>
                </View>
                <View style = {{width: '100%', height: '25%', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <View style = {{width: '40%', aspectRatio: 1}}>
                        <Image style = {{width: '100%', height: '100%', resizeMode: 'contain', tintColor: Colors.white}} source = {require("../assets/images/logo_signin.png")}></Image>
                    </View>
                </View>
                <View style = {{flex: 1, width: '100%'}}>
                    <View style = {{width: '100%', marginVertical: 20, alignItems: 'center'}}>
                        <Text style = {[{fontSize: 32, color: Colors.white}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.signup}</Text>
                    </View>
                    <View style = {{flex: 1, width: '100%', marginTop: 48, zIndex: 4, elevation: 0.01, backgroundColor: Colors.main_bg_color, borderTopRightRadius: 25, borderTopLeftRadius: 25}}>
                        <KeyboardAwareScrollView style = {{flex: 1, width: '100%'}} enableOnAndroid = {true}>
                            <View style = {{flex: 1, width: '100%', alignItems: 'center'}}>
                                <View style = {{width: '100%', justifyContent: 'center', marginVertical: 20, flexDirection: 'row'}}>
                                    <TouchableOpacity style = {[styles.owner_rent_button, {marginRight: 15, backgroundColor: this.state.user_type == "owner" ? Colors.button_bg_color : Colors.main}]} onPress = {() => this.setState({user_type: "owner"})}>
                                        <Text style = {[styles.common_text_style, {color: Colors.main_bg_color}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.owner}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {[styles.owner_rent_button, {marginLeft: 15, backgroundColor: this.state.user_type == "renter" ? Colors.button_bg_color : Colors.main}]} onPress = {() => this.setState({user_type: "renter"})}>
                                        <Text style = {[styles.common_text_style, {color: Colors.main_bg_color}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.renter}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style = {styles.input_component}>
                                    <Text style = {[styles.common_text_style, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.full_name}</Text>
                                    <TextInput style = {[styles.input_box, styles.common_text_style, stylesGlobal.font_GESndBook]} placeholder = {strings.full_name} onChangeText = {(text) => this.setState({register_full_name: text})}>{this.state.register_full_name}</TextInput>
                                </View>
                                <View style = {styles.input_component}>
                                    <Text style = {[styles.common_text_style, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.id_iqama}</Text>
                                    <TextInput style = {[styles.input_box, styles.common_text_style, stylesGlobal.font_GESndBook]} placeholder = {strings.id_iqama} onChangeText = {(text) => this.setState({register_id_iqama: text})}>{this.state.register_id_iqama}</TextInput>
                                </View>
                                <View style = {styles.input_component}>
                                    <Text style = {[styles.common_text_style, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.phone_number}</Text>
                                    <TextInput style = {[styles.input_box, styles.common_text_style, stylesGlobal.font_GESndBook]} placeholder = {strings.phone_number} keyboardType = {'phone-pad'} onChangeText = {(text) => this.setState({register_phone_number: text})}>{this.state.register_phone_number}</TextInput>
                                </View>
                                <View style = {styles.input_component}>
                                    <Text style = {[styles.common_text_style, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.password}</Text>
                                    <View style = {{width: '100%', height: 40}}>
                                        <TextInput style = {[styles.input_box, styles.common_text_style, stylesGlobal.font_GESndBook]} placeholder = {strings.password} secureTextEntry = {this.state.register_hide_password} onChangeText = {(text) => this.setState({register_password: text})}>{this.state.register_password}</TextInput>
                                        <TouchableOpacity style = {{height: 40, width: 40, position: 'absolute', left: 0, top: 5, justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.setState({register_hide_password: !this.state.register_hide_password})}>
                                            <Image style = {{width: 20, height: 20, resizeMode: 'contain'}} source = {this.state.register_hide_password ? require("../assets/images/password_hide.png") : require("../assets/images/password_show.png")}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style = {{width: '100%', marginTop: 20, marginBottom: 30, alignItems: 'center'}}>
                                    <TouchableOpacity style = {{width: '80%', height: 40, borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.main,}} onPress = {() => this.sendPhoneNumber()}>
                                        <Text style = {[styles.common_text_style, {fontSize: 14, color: Colors.main_bg_color}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.register}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    newregister_button_style: {
        position: 'absolute',
        top: 0,
        left: Dimensions.get('window').width / 2 - 130 - 15,
        width: 130,
        height: 50,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.main_bg_color
    },
    signin_button_style: {
        position: 'absolute',
        top: 0,
        left: Dimensions.get('window').width / 2 + 15,
        width: 130,
        height: 50,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.main_bg_color
    },
    common_text_style: {
        fontSize: 12,
        color: Colors.text_main_color
    },
    owner_rent_button: {
        width: 130,
        height: 40,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input_component: {
        width: '90%',
        marginBottom: 15,
        alignItems: 'center'
    },
    input_box: {
        width: '100%',
        height: 40,
        backgroundColor: Colors.white,
        borderRadius: 15,
        textAlign: 'center',
        marginTop: 5
    }
})