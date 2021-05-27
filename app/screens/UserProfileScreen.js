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
    Alert
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
import ActionSheet from '../components/react-native-actionsheet';
import { EventRegister } from 'react-native-event-listeners'

var TAG = "UserProfileScreen";

export default class UserProfileScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            user_avatar: '',
            full_name: '',
            id_iqama: '',
            phone_number: '',
            password: '',
            hide_password: true
        }
    }

    UNSAFE_componentWillMount = async() => {
        this.setState({
            user_avatar: Global.AVATAR,
            id_iqama: Global.IDIQAMA,
            full_name: Global.FULLNAME,
            phone_number: Global.PHONENUMBER
        })
    }

    edit_profile = async() => {
        
        try {
            if(this.state.full_name.length < 3) {
                Alert.alert(strings.warnning, strings.name_length_error);
                return;
            }
            if(this.state.id_iqama.length == 0) {
                Alert.alert(strings.warnning, strings.id_iqama_length_error);
                return;
            }
            if(this.state.phone_number.length != 10) {
                Alert.alert(strings.warnning, strings.phone_number_error);
                return;
            }
            if(this.state.password.length > 0 && this.state.password.length < 6) {
                Alert.alert(strings.warnning, strings.password_error);
                return;
            }
            this.setState({
                loading: true,
            });
            var uri = Global.BASE_URL + "/api/profile";
            
            let params = new FormData();
            params.append("name", this.state.full_name);
            params.append("person_id", this.state.id_iqama);
            params.append("phone", this.state.phone_number);
            params.append("password", this.state.password);
            if(this.state.user_avatar != Global.AVATAR) {
                let localUriTypePart = this.state.user_avatar.split('.');
                let fileType = localUriTypePart[localUriTypePart.length - 1];
                const newImage = {
                    uri: this.state.user_avatar,
                    name: "property_image.png",
                    type: `image/${fileType}`,
                }
                params.append("avatar", newImage);
            }
                                    
            console.log(TAG + " callEditProfile uri " + uri);
            console.log(TAG + " callEditProfile params " + JSON.stringify(params));

            WebService.callServicePost(uri, params, this.handleEditProfileAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
            });
        }
    }

    handleEditProfileAPI = async(response, isError) => {
        console.log(TAG + " callEditProfile Response " + JSON.stringify(response));
        console.log(TAG + " callEditProfile isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    Alert.alert(strings.warnning, strings.edit_profile_success);
                    Global.AVATAR = this.state.user_avatar;
                    Global.IDIQAMA = this.state.id_iqama;
                    Global.FULLNAME = this.state.full_name;
                    Global.PHONENUMBER = this.state.phone_number;
                    EventRegister.emit(Constants.PROFILE_CHANGED, '');
                } else {
                    Alert.alert(strings.warnning, strings.edit_profile_error);
                }
            } else {
                Alert.alert(strings.warnning, strings.api_error);
            }
        } catch(error) {
            console.log("signup catch error", error);
            Alert.alert(strings.warnning, strings.network_error);
        }
        this.setState({
            loading: false
        })
    }

    render() {
        return (
            <SafeAreaView style = {{flex: 1, backgroundColor: Colors.main_bg_color, justifyContent: 'center', alignItems: 'center'}}>
            {
                this.state.loading &&
                <ProgressIndicator/>
            }
                <ActionSheet
                    ref={o => this.SelectImageActionSheet = o}
                    title={strings.select_image}
                    options={[strings.take_photo, strings.open_library, strings.cancel]}
                    cancelButtonIndex={2}
                    // destructiveButtonIndex={1}
                    onPress={(index) => { 
                        if(index == 0) {
                            ImagePicker.openCamera({
                                cropping: false,
                            }).then(image => {
                                this.setState({
                                    user_avatar: image.path
                                })
                            });
                        } else if(index == 1) {
                            ImagePicker.openPicker({
                                cropping: false,
                                multiple: false
                            }).then(image => {
                                this.setState({
                                    user_avatar: image.path
                                })
                            });
                        }
                    }}
                />
                <View style = {{width: '100%', height: 40, backgroundColor: Colors.main, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity onPress = {() => this.props.navigation.goBack()}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_back.png')}></Image>
                    </TouchableOpacity>
                    <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.user_profile}</Text>
                    {/* <TouchableOpacity onPress = {() => this.props.navigation.navigate("SettingsScreen")}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_setting.png')}></Image>
                    </TouchableOpacity> */}
                    <View></View>
                </View>
                <View style = {{flex: 1, width: '100%'}}>
                    <KeyboardAwareScrollView style = {{flex: 1, width: '100%'}} enableOnAndroid = {true}>
                        <View style = {{flex: 1, width: '100%', alignItems: 'center'}}>
                            <View style = {{width: '100%', alignItems: 'center', padding: 20}}>
                                <View style = {{width: 100, height: 100, borderRadius: 50, overflow: 'hidden', borderWidth: 1, borderColor: Colors.black, justifyContent: 'center', alignItems: 'center'}}>
                                {
                                    (this.state.user_avatar == null || this.state.user_avatar == "") &&
                                    <Image style = {{width: '50%', height: '50%', resizeMode:'contain'}} source = {require('../assets/images/empty_user_dark.png')}></Image>
                                }
                                {
                                    this.state.user_avatar != null && this.state.user_avatar != "" &&
                                    <Image style = {{width: '100%', height: '100%', resizeMode:'cover'}} source = {{uri: this.state.user_avatar}}></Image>
                                }    
                                </View>
                                <TouchableOpacity style = {{width: 30, height: 30, borderRadius: 15, overflow: 'hidden', position: 'absolute', left: Dimensions.get('screen').width / 2 + 25, bottom: 20}}
                                    onPress = {() => this.SelectImageActionSheet.show()}
                                >
                                    <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {require('../assets/images/profile_camera.png')}></Image>
                                </TouchableOpacity>
                            </View>
                            <View style = {styles.input_component}>
                                <Text style = {[styles.common_text_style, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.full_name}</Text>
                                <TextInput style = {[styles.input_box, styles.common_text_style, stylesGlobal.font_GESndBook]} placeholder = {strings.full_name} onChangeText = {(text) => this.setState({full_name: text})}>{this.state.full_name}</TextInput>
                            </View>
                            <View style = {styles.input_component}>
                                <Text style = {[styles.common_text_style, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.id_iqama}</Text>
                                <TextInput style = {[styles.input_box, styles.common_text_style, stylesGlobal.font_GESndBook]} placeholder = {strings.id_iqama} editable = {false} onChangeText = {(text) => this.setState({id_iqama: text})}>{this.state.id_iqama}</TextInput>
                            </View>
                            <View style = {styles.input_component}>
                                <Text style = {[styles.common_text_style, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.phone_number}</Text>
                                <TextInput style = {[styles.input_box, styles.common_text_style, stylesGlobal.font_GESndBook]} placeholder = {strings.phone_number} keyboardType = {'phone-pad'} onChangeText = {(text) => this.setState({phone_number: text})}>{this.state.phone_number}</TextInput>
                            </View>
                            <View style = {styles.input_component}>
                                <Text style = {[styles.common_text_style, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.password}</Text>
                                <View style = {{width: '100%', height: 40}}>
                                    <TextInput style = {[styles.input_box, styles.common_text_style, stylesGlobal.font_GESndBook]} placeholder = {strings.password} secureTextEntry = {this.state.hide_password} onChangeText = {(text) => this.setState({password: text})}>{this.state.password}</TextInput>
                                    <TouchableOpacity style = {{height: 40, width: 40, position: 'absolute', left: 0, top: 5, justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.setState({hide_password: !this.state.hide_password})}>
                                        <Image style = {{width: 20, height: 20, resizeMode: 'contain'}} source = {this.state.hide_password ? require("../assets/images/password_hide.png") : require("../assets/images/password_show.png")}></Image>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style = {{width: '100%', marginTop: 20, marginBottom: 30, alignItems: 'center'}}>
                                <TouchableOpacity style = {{width: '80%', height: 40, borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.main,}} onPress = {() => this.edit_profile()}>
                                    <Text style = {[styles.common_text_style, {fontSize: 14, color: Colors.main_bg_color}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.edit}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
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