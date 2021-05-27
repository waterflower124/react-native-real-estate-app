
import React, { Component } from "react";
import { View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
    TextInput,
    Alert,
    Linking
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

var TAG = "SignInScreen";

export default class SignInScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            signin_id_iqama: "",
            signin_password: "",
            signin_hide_password: true,
            remember_me: true,
        }
    }

    UNSAFE_componentWillMount() {

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
                if(response.status == "success") {
                    if(this.state.remember_me) {
                        await AsyncStorage.setItem(Constants.KEY_USER_ID, this.state.signin_id_iqama);
                        await AsyncStorage.setItem(Constants.KEY_USER_PASSWORD, this.state.signin_password);
                    } else {
                        await AsyncStorage.setItem(Constants.KEY_USER_ID, "");
                        await AsyncStorage.setItem(Constants.KEY_USER_PASSWORD, "");
                    }
                    Global.USER_ID = response.user.id;
                    Global.API_TOKEN = response.token;
                    Global.FULLNAME = response.user.name;
                    Global.PHONENUMBER = response.user.phone;
                    Global.USERTYPE = response.user.type;
                    Global.IDIQAMA = response.user.person_id;
                    Global.AVATAR = response.user.avatar;
                    this.props.navigation.navigate("DrawerNavigator", {screen: 'HomeScreen', params: {user: response.user}});
                } else {
                    Alert.alert(strings.warnning, strings.id_passowrd_incorrect);
                }
            } else {
                Alert.alert(strings.warnning, strings.api_error);
            }
        } catch(error) {
            console.log("signin catch error", error);
            Alert.alert(strings.warnning, strings.network_error);
        }
        this.setState({
            loading: false
        })
    }

    social_link = (social_type) => {
        var link = "";
        if(social_type == "whatsapp") {
            link = Global.LINK_WHATSAPP;
        } else if(social_type == "twitter") {
            link = Global.LINK_TWITTER;
        } else if(social_type == "instagram") {
            link = Global.LINK_INSTAGRAM;
        }
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            } else {
                
            }
        });
    }

    render() {
        return (
            <View style = {{flex: 1, backgroundColor: Colors.main}}>
            {
                this.state.loading &&
                <ProgressIndicator/>
            }
                <View style = {{position: 'absolute', width: '100%', top: StaticSafeAreaInsets.safeAreaInsetsBottom + 10, left: 0, zIndex: 5, elevation: 5}}>
                    <TouchableOpacity style = {{width: 30, height: 30, marginHorizontal: 20, justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.props.navigation.navigate("IntroScreen")}>
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
                        <Text style = {[{fontSize: 32, color: Colors.white}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.signin}</Text>
                    </View>
                    <View style = {{flex: 1, width: '100%', marginTop: 48, zIndex: 4, elevation: 0.01, backgroundColor: Colors.main_bg_color, borderTopRightRadius: 25, borderTopLeftRadius: 25}}>
                        <KeyboardAwareScrollView style = {{flex: 1, width: '100%'}} enableOnAndroid = {true}>
                            <View style = {{flex: 1, width: '100%', alignItems: 'center', paddingTop: 40}}>
                                <View style = {styles.input_component}>
                                    <Text style = {[styles.common_text_style, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.id_iqama}</Text>
                                    <TextInput style = {[styles.input_box, styles.common_text_style, stylesGlobal.font_GESndBook]} placeholder = {strings.id_iqama} onChangeText = {(text) => this.setState({signin_id_iqama: text})}>{this.state.signin_id_iqama}</TextInput>
                                </View>
                                <View style = {styles.input_component}>
                                    <Text style = {[styles.common_text_style, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.password}</Text>
                                    <View style = {{width: '100%', height: 40}}>
                                        <TextInput style = {[styles.input_box, styles.common_text_style, stylesGlobal.font_GESndBook]} placeholder = {strings.password} secureTextEntry = {this.state.signin_hide_password} onChangeText = {(text) => this.setState({signin_password: text})}>{this.state.signin_password}</TextInput>
                                        <TouchableOpacity style = {{height: 40, width: 40, position: 'absolute', left: 0, top: 5, justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.setState({signin_hide_password: !this.state.signin_hide_password})}>
                                            <Image style = {{width: 20, height: 20, resizeMode: 'contain'}} source = {this.state.signin_hide_password ? require("../assets/images/password_hide.png") : require("../assets/images/password_show.png")}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style = {{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}>
                                    <TouchableOpacity style = {{flexDirection: 'row', alignItems: 'center'}} onPress = {() => this.setState({remember_me: !this.state.remember_me})}>
                                        <Image style = {{width: 20, height: 20, resizeMode: 'contain'}} source = {this.state.remember_me ? require("../assets/images/remember_select.png") : require("../assets/images/remember_unselect.png")}></Image>
                                        <Text style = {[{fontSize: 10, color: Colors.text_main_color, marginLeft: 10}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.remember_me}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {{flexDirection: 'row', alignItems: 'center'}} onPress = {() => this.props.navigation.navigate("EnterPhoneScreen")}>
                                        <Text style = {[{fontSize: 10, color: Colors.text_main_color}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.forgot_password}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style = {{width: '100%', marginTop: 20, marginBottom: 30, alignItems: 'center'}}>
                                    <TouchableOpacity style = {{width: '80%', height: 40, borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.main,}}  onPress = {() => this.user_signin()}>
                                        <Text style = {[styles.common_text_style, {fontSize: 14, color: Colors.main_bg_color}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.signin}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {{padding: 10, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10}}  onPress = {() => this.props.navigation.navigate("SignUpScreen")}>
                                        <Text style = {[styles.common_text_style, {fontSize: 14, color: Colors.text_main_color}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.new_user}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style = {{width: '100%', marginTop: 15, marginBottom: 30}}>
                                    <View style = {{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                                        <View style = {{flex: 1, height: 2, backgroundColor: Colors.button_bg_color}}></View>
                                        <Text style = {[styles.common_text_style, stylesGlobal.font_GESSTwoMedium_Medium, {marginHorizontal: 10}]}>{strings.follow_us}</Text>
                                        <View style = {{flex: 1, height: 2, backgroundColor: Colors.button_bg_color}}></View>
                                    </View>
                                    <View style = {{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 10}}>
                                        <TouchableOpacity style = {{width: 40, height: 40}} onPress = {() => this.social_link("whatsapp")}>
                                            <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {require("../assets/images/follow_whatsapp.png")}></Image>
                                        </TouchableOpacity>
                                        <TouchableOpacity style = {{width: 40, height: 40}} onPress = {() => this.social_link("twitter")}>
                                            <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {require("../assets/images/follow_twitter.png")}></Image>
                                        </TouchableOpacity>
                                        <TouchableOpacity style = {{width: 40, height: 40}} onPress = {() => this.social_link("instagram")}>
                                            <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {require("../assets/images/follow_instagram.png")}></Image>
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