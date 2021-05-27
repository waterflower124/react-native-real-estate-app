
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

 import { Colors } from '../utils/Colors'
 import { strings } from "../strings";
 import { stylesGlobal } from '../global/stylesGlobal';
 import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
 import ProgressIndicator from "../components/ProgressIndicator";
import * as Global from "../global/Global";
import WebService from "../utils/WebService";
import { Constants } from "../global/Constants";
import { SafeAreaView } from 'react-native-safe-area-context';

var TAG = "ForgotPasswordScreen";

export default class ForgotPasswordScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            phone_number: this.props.route.params.phone,
            pin_code: "",
            password: "",
            confirm_password: "",
            password_hide: true,
            confirm_password_hide: true
        }
    }

    resendPhoneNumber = () => {
        try {
            this.setState({
                loading: true,
            });
            var uri = Global.BASE_URL + "/api/getOTP";
            let params = new FormData();
            params.append("phone", this.state.phone_number);
            params.append("type", 'forgot_password');

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
                    
                } else {
                    Alert.alert(strings.warnning, strings.otp_phone_number_error);
                }
            } else {
                Alert.alert(strings.warnning, strings.api_error);
            }
        } catch(error) {
            console.log("send phone number catch error", error);
            Alert.alert(strings.warnning, strings.network_error);
        }
        this.setState({
            loading: false,
        })
    }

    forgotPassword = () => {
        if(this.state.pin_code == "") {
            Alert.alert(strings.warnning, strings.pin_code_error);
            return;
        }
        if(this.state.password.length < 6) {
            Alert.alert(strings.warnning, strings.password_error);
            return;
        }
        if(this.state.password != this.state.confirm_password) {
            Alert.alert(strings.warnning, strings.confirm_password_error);
            return;
        }

        try {
            this.setState({
                loading: true,
            });
            var uri = Global.BASE_URL + "/api/forgotPassword";
            let params = new FormData();
            params.append("phone", this.state.phone_number);
            params.append("new_password", this.state.password);
            params.append("otp", this.state.pin_code);

            console.log(TAG + " callForgotPasswordAPI uri " + uri);
            console.log(TAG + " callForgotPasswordAPI params " + JSON.stringify(params));

            WebService.callServicePost(uri, params, this.handleForgotPasswordAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
            });
        }
    }

    handleForgotPasswordAPI = async(response, isError) => {
        console.log(TAG + " callForgotPasswordAPI Response " + JSON.stringify(response));
        console.log(TAG + " callForgotPasswordAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    Alert.alert(strings.notice, strings.update_password_success);
                    this.props.navigation.navigate("SignInScreen");
                } else {
                    Alert.alert(strings.warnning, strings.otp_confirm_error);
                }
            } else {
                Alert.alert(strings.warnning, strings.api_error);
            }
        } catch(error) {
            console.log("send phone number catch error", error);
            Alert.alert(strings.warnning, strings.network_error);
        }
        this.setState({
            loading: false,
        })
    }


    render() {
        return (
            <View style = {{flex: 1, backgroundColor: Colors.main}}>
            {
                this.state.loading &&
                <ProgressIndicator/>
            }
                <View style = {{width: '100%', height: '25%', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <View style = {{width: '40%', aspectRatio: 1}}>
                        <Image style = {{width: '100%', height: '100%', resizeMode: 'contain', tintColor: Colors.white}} source = {require("../assets/images/logo_signin.png")}></Image>
                    </View>
                </View>
                <View style = {{flex: 1, width: '100%'}}>
                    <View style = {{width: '100%', marginVertical: 20, alignItems: 'center'}}>
                        <Text style = {[{fontSize: 32, color: Colors.white}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.forgot_password}</Text>
                    </View>
                    <View style = {{width: '100%', alignItems: 'center', zIndex: 5, elevation: 0.1}}>
                        <View style = {{width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.main_bg_color, justifyContent: 'center', alignItems: 'center'}}>
                            <Image style = {{width: '40%', height: '40%', resizeMode: 'contain'}} source = {require("../assets/images/forgotpassword_lock.png")}></Image>
                        </View>
                    </View>
                    <View style = {{flex: 1, width: '100%', marginTop: -50, zIndex: 4, elevation: 0.01, backgroundColor: Colors.main_bg_color, borderTopRightRadius: 25, borderTopLeftRadius: 25, borderTopColor: Colors.black, borderWidth: 1}}>
                        <KeyboardAwareScrollView style = {{flex: 1, width: '100%'}} enableOnAndroid = {true}>
                            <View style = {{flex: 1, width: '100%', alignItems: 'center', marginTop: 40}}>
                                <View style = {styles.input_component}>
                                    <Text style = {[styles.common_text_style, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.pin_code}</Text>
                                    <TextInput style = {[styles.input_box, styles.common_text_style, stylesGlobal.font_GESndBook]} placeholder = {strings.pin_code} keyboardType = {'number-pad'} onChangeText = {(text) => this.setState({pin_code: text})}>{this.state.pin_code}</TextInput>
                                </View>
                                <View style = {{width: '100%', marginTop: 5, alignItems: 'flex-end'}}>
                                    <TouchableOpacity style = {{paddingHorizontal: Dimensions.get('screen').width * 0.05, paddingVertical: 10}} onPress = {() => this.resendPhoneNumber()}>
                                        <Text style = {[{fontSize: 10, color: Colors.text_main_color}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.resend}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style = {styles.input_component}>
                                    <Text style = {[styles.common_text_style, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.password}</Text>
                                    <View style = {{width: '100%', height: 40}}>
                                        <TextInput style = {[styles.input_box, styles.common_text_style, stylesGlobal.font_GESndBook]} placeholder = {strings.password} secureTextEntry = {this.state.password_hide} onChangeText = {(text) => this.setState({password: text})}>{this.state.password}</TextInput>
                                        <TouchableOpacity style = {{height: 40, width: 40, position: 'absolute', left: 0, top: 5, justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.setState({password_hide: !this.state.password_hide})}>
                                            <Image style = {{width: 20, height: 20, resizeMode: 'contain'}} source = {this.state.password_hide ? require("../assets/images/password_hide.png") : require("../assets/images/password_show.png")}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style = {styles.input_component}>
                                    <Text style = {[styles.common_text_style, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.confirm_password}</Text>
                                    <View style = {{width: '100%', height: 40}}>
                                        <TextInput style = {[styles.input_box, styles.common_text_style, stylesGlobal.font_GESndBook]} placeholder = {strings.confirm_password} secureTextEntry = {this.state.confirm_password_hide} onChangeText = {(text) => this.setState({confirm_password: text})}>{this.state.confirm_password}</TextInput>
                                        <TouchableOpacity style = {{height: 40, width: 40, position: 'absolute', left: 0, top: 5, justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.setState({confirm_password_hide: !this.state.confirm_password_hide})}>
                                            <Image style = {{width: 20, height: 20, resizeMode: 'contain'}} source = {this.state.confirm_password_hide ? require("../assets/images/password_hide.png") : require("../assets/images/password_show.png")}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                
                                <View style = {{width: '100%', marginTop: 40, marginBottom: 30, alignItems: 'center'}}>
                                    <TouchableOpacity style = {{width: '80%', height: 40, borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.main,}} 
                                        onPress = {() => this.forgotPassword()}
                                    >
                                        <Text style = {[styles.common_text_style, {fontSize: 14, color: Colors.main_bg_color}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.send}</Text>
                                    </TouchableOpacity>
                                    <View style = {{flexDirection: 'row', marginTop: 10}}>
                                        <Text style = {[styles.common_text_style, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.have_account}</Text>
                                        <TouchableOpacity style = {{paddingHorizontal: 20}} onPress = {() => this.props.navigation.navigate("SignInScreen")}>
                                            <Text style = {[styles.common_text_style, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.signin}</Text>
                                        </TouchableOpacity>
                                    </View>
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
        alignItems: 'center',
        marginTop: 20
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