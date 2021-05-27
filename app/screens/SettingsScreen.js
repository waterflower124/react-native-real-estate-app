import React, { Component } from "react";
import { View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
    TextInput,
    ScrollView,
    ImageBackground,
    FlatList,
    Alert,
    Linking
 } from "react-native";

import { Colors } from '../utils/Colors'
import { strings } from "../strings";
import { stylesGlobal } from '../global/stylesGlobal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context';
import StarRating from 'react-native-star-rating';
import ProgressIndicator from "../components/ProgressIndicator";
import * as Global from "../global/Global";
import WebService from "../utils/WebService";
import { Constants } from "../global/Constants";
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from '../components/react-native-actionsheet'

var TAG = "SettingsScreen";

export default class SettingsScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            id_iqama: Global.IDIQAMA,
            old_password: "",
            new_password: ""
        }
    }

    UNSAFE_componentWillMount = async() => {
        
    }

    resetPassword = () => {
        if(this.state.new_password.length < 6) {
            Alert.alert(strings.warnning, strings.password_error);
            return;
        }
        
        try {
            this.setState({
                loading: true,
            });
            var uri = Global.BASE_URL + "/api/resetPassword";
            let params = new FormData();
            params.append("person_id", this.state.id_iqama);
            params.append("password", this.state.old_password);
            params.append("new_password", this.state.new_password);

            console.log(TAG + " callRresetPasswordAPI uri " + uri);
            console.log(TAG + " callRresetPasswordAPI params " + JSON.stringify(params));

            WebService.callServicePost(uri, params, this.handleResetPasswordAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
            });
        }
    }

    handleResetPasswordAPI = async(response, isError) => {
        console.log(TAG + " callRresetPasswordAPI Response " + JSON.stringify(response));
        console.log(TAG + " callRresetPasswordAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    Alert.alert(strings.notice, strings.update_password_success);
                    await AsyncStorage.setItem(Constants.KEY_USER_PASSWORD, this.state.new_password);
                    this.setState({
                        old_password: '',
                        new_password: ''
                    })
                } else {
                    Alert.alert(strings.warnning, strings.reset_password_error);
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
            <SafeAreaView style = {{flex: 1, backgroundColor: Colors.main_bg_color, justifyContent: 'center', alignItems: 'center'}}>
            {
                this.state.loading &&
                <ProgressIndicator/>
            }
                <View style = {{width: '100%', height: 40, backgroundColor: Colors.main, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity onPress = {() => this.props.navigation.goBack()}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_back.png')}></Image>
                    </TouchableOpacity>
                    <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.menu_settings}</Text>
                    {/* <TouchableOpacity>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_setting.png')}></Image>
                    </TouchableOpacity> */}
                    <View></View>
                </View>
                <View style = {{flex: 1, width: '100%', alignItems: 'center'}}>
                    <View style = {[styles.component, {justifyContent: 'center'}]}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.password}</Text>
                    </View>
                    <View style = {[styles.component, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.white}]}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.old_password}</Text>
                        <TextInput style = {[styles.input_text, stylesGlobal.font_GESndBook]} textAlign = {'right'} placeholder = {strings.old_password} secureTextEntry = {true} onChangeText = {(text) => this.setState({old_password: text})}>{this.state.old_password}</TextInput>
                    </View>
                    <View style = {[styles.component, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.white}]}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.new_password}</Text>
                        <TextInput style = {[styles.input_text, stylesGlobal.font_GESndBook]} textAlign = {'right'}  placeholder = {strings.new_password} secureTextEntry = {true} onChangeText = {(text) => this.setState({new_password: text})}>{this.state.new_password}</TextInput>
                    </View>
                    <TouchableOpacity style = {[styles.component, {justifyContent: 'center'}]}
                        onPress = {() => {
                            Linking.canOpenURL("http://172.105.62.245/help").then(supported => {
                                if (supported) {
                                    Linking.openURL("http://172.105.62.245/help");
                                } else {
                                    // alert("asdfasdfas")
                                }
                            });
                        }}
                    >
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.help}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {[styles.component, {justifyContent: 'center'}]}
                        onPress = {() => {
                            Linking.canOpenURL("http://172.105.62.245/privacy-policy").then(supported => {
                                if (supported) {
                                    Linking.openURL("http://172.105.62.245/privacy-policy");
                                } else {
                                    // alert("asdfasdfas")
                                }
                            });
                        }}
                    >
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.privacy_policy}</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style = {[styles.component, {justifyContent: 'center'}]} onPress = {() => this.props.navigation.navigate("ContactUsScreen")}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.contact_us}</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style = {{width: '70%', height: 40, borderRadius: 20, backgroundColor: Colors.button_bg_color, justifyContent: 'center', alignItems: 'center', marginTop: 30}}
                        onPress = {() => this.resetPassword()}
                    >
                        <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.save_changes}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    nav_button: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    commont_text: {
        fontSize: 12, 
        color: Colors.text_main_color
    },
    input_text: {
        fontSize: 12, 
        color: Colors.text_main_color,
        flex: 1,
        marginHorizontal: 5
    },
    component: {
        width: '100%',
        height: 40,
        borderBottomColor: Colors.text_main_color,
        borderBottomWidth: 1,
        paddingHorizontal: 15
    }
   
})