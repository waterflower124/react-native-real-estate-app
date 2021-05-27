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
import { ColorAndroid } from "react-native/Libraries/StyleSheet/PlatformColorValueTypesAndroid";

var TAG = "ContactUsScreen";

export default class ContactUsScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            message: ""
        }
    }

    UNSAFE_componentWillMount = async() => {
        
    }

    postMessage = () => {
        if(this.state.message == '') {
            Alert.alert(strings.warnning, strings.contactus_message_error);
            return;
        }

        try {
            this.setState({
                loading: true,
            });
            var uri = Global.BASE_URL + "/api/contact";
            let params = new FormData();
            params.append("message", this.state.message);

            console.log(TAG + " callPostMessageAPI uri " + uri);
            console.log(TAG + " callPostMessageAPI params " + JSON.stringify(params));

            WebService.callServicePost(uri, params, this.handlePostMessageAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
            });
        }
    }

    handlePostMessageAPI = async(response, isError) => {
        console.log(TAG + " callPostMessageAPI Response " + JSON.stringify(response));
        console.log(TAG + " callPostMessageAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    this.setState({
                        message: ''
                    })
                    Alert.alert(strings.notice, strings.contactus_message_success);
                } else {
                    Alert.alert(strings.warnning, strings.api_error);
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
                    {/* <TouchableOpacity onPress = {() => this.props.navigation.navigate("SettingsScreen")}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_setting.png')}></Image>
                    </TouchableOpacity> */}
                    <View></View>
                </View>
                <View style = {{flex: 1, width: '100%', alignItems: 'center'}}>
                    <View style = {{marginTop: 15}}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.contact_us}</Text>
                    </View>
                    <View style = {{width: '90%', height: 200, marginTop: 15}}>
                        <TextInput style = {[styles.commont_text, styles.input_style, stylesGlobal.font_GESndBook]} placeholder = {strings.type_message} multiline = {true} onChangeText = {(text) => this.setState({message: text})}>{this.state.message}</TextInput>
                    </View>
                    <TouchableOpacity style = {{width: '70%', height: 40, borderRadius: 20, backgroundColor: Colors.button_bg_color, justifyContent: 'center', alignItems: 'center', marginTop: 30}}
                        onPress = {() => this.postMessage()}
                    >
                        <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.save_changes}</Text>
                    </TouchableOpacity>
                    <View style = {{width: '100%', marginTop: 30,}}>
                        <View style = {{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                            <View style = {{flex: 1, height: 2, backgroundColor: Colors.button_bg_color}}></View>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESSTwoMedium_Medium, {marginHorizontal: 10}]}>{strings.follow_us}</Text>
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
    input_style: {
        width: '100%',
        height: '100%',
        borderColor: Colors.text_main_color,
        borderWidth: 1,
        backgroundColor: Colors.white,
        textAlignVertical: "top",
        borderRadius: 5,
        padding: 10
    }
   
})