import React, { Component } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Linking,
  I18nManager
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../utils/Colors'
import { strings } from "../strings";
import { stylesGlobal } from '../global/stylesGlobal';
import { EventRegister } from 'react-native-event-listeners';
import { Constants } from "../global/Constants";
import * as Global from "../global/Global";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {languageSwitcher} from '../utils/language';

var top_height = 100;

export default class SideMenu extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            user_type: Global.USERTYPE,
            full_name: Global.FULLNAME,
            user_avatar: Global.AVATAR,
            show_screens: [],
            owner_screens: [
                "HomeScreen",
                "UserProfileScreen",
                "ContactUsScreen",
                // "SettingsScreen",
                "LanguageSetting",
                "AboutusScreen"
            ],
            renter_screens: [
                "HomeScreen",
                "UserProfileScreen",
                // "YourUnitInfoScreen",
                // "OtherServiceScreen",
                // "CustomerSupportScreen",
                "ContactUsScreen",
                // "SettingsScreen",
                "LanguageSetting",
                "AboutusScreen"
            ],
            data: [
                {
                    screen: "HomeScreen",
                    name: strings.menu_mainpage,
                    icon: require("../assets/images/menu_home.png")
                },
                {
                    screen: "UserProfileScreen",
                    name: strings.menu_userprofile,
                    icon: require("../assets/images/menu_profile.png")
                },
                {
                    screen: "ContactUsScreen",
                    name: strings.contact_us,
                    icon: require("../assets/images/menu_message.png")
                },
                {
                    screen: "AddingNewPropertiesScreen",
                    name: strings.menu_addnew,
                    icon: require("../assets/images/menu_home.png")
                },
                {
                    screen: "YourUnitInfoScreen",
                    name: strings.unit_info,
                    icon: require("../assets/images/menu_unitinfo.png")
                },
                {
                    screen: "MyPropertiesScreen",
                    name: strings.menu_myproperty,
                    icon: require("../assets/images/menu_property.png")
                },
                {
                    screen: "MyPropertiesMangerScreen",
                    name: strings.menu_propertymanager,
                    icon: require("../assets/images/menu_propertiesmanager.png")
                },
                {
                    screen: "TransactionsScreen",
                    name: strings.menu_transactions,
                    icon: require("../assets/images/transactions.png")
                },
                {
                    screen: "OtherServiceScreen",
                    name: strings.other_service,
                    icon: require("../assets/images/menu_otherservice.png")
                },
                {
                    screen: "CustomerSupportScreen",
                    name: strings.customer_support,
                    icon: require("../assets/images/menu_customersupport.png")
                },
                {
                    screen: "SettingsScreen",
                    name: strings.menu_settings,
                    icon: require("../assets/images/menu_setting.png")
                },
                {
                    screen: "AboutusScreen",
                    name: strings.menu_aboutus,
                    icon: require("../assets/images/menu_aboutus.png")
                },
                {
                    screen: "LanguageSetting",
                    name: strings.language,
                    icon: require("../assets/images/menu_language.png")
                }
            ]
        }
    }

    async UNSAFE_componentWillMount() {
        if(this.state.user_type == "OWNER") {
            this.setState({
                show_screens: this.state.owner_screens
            })
        } else if(this.state.user_type == "RENTER") {
            this.setState({
                show_screens: this.state.renter_screens
            })
        }

        this.profileChangeListener = EventRegister.addEventListener(Constants.PROFILE_CHANGED, async() => {
            this.setState({
                full_name: Global.FULLNAME,
                user_avatar: Global.AVATAR,
            })
        })
    }

    render() {
        // console.log("===================")
        // console.log(this.props.params)
        // console.log("===================")
        const user_type = Global.USERTYPE;
        const full_name = Global.FULLNAME;
        const user_avatar = Global.AVATAR;
        var show_screens = [];
        if(user_type == "OWNER") {
            show_screens = this.state.owner_screens;
        } else if(user_type == "RENTER") {
            show_screens = this.state.renter_screens;
        }
        const { isRTL } = I18nManager;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style = {{width: '100%', height: top_height, alignItems: "center", justifyContent: 'flex-end', backgroundColor: Colors.button_bg_color}}>
                    <View style = {{width: '80%', height: top_height * 0.6, marginBottom: 10, flexDirection: 'row'}}>
                        <View style = {{width: top_height * 0.6, height: top_height * 0.6, borderRadius: top_height * 0.6 / 2, overflow: 'hidden', borderColor: Colors.main_bg_color, borderWidth: 1, justifyContent: 'center', alignItems: 'center'}}>
                        {
                            (user_avatar == null || user_avatar == "") &&
                            <Image style = {{width: '50%', height: '50%', resizeMode:'contain'}} source = {require('../assets/images/empty_user_light.png')}></Image>
                        }
                        {
                            user_avatar != null && user_avatar != "" &&
                            <Image style = {{width: '100%', height: '100%', resizeMode:'cover'}} source = {{uri: user_avatar}}></Image>
                        }
                        </View>
                        <View style = {{flex: 1, height: '100%', justifyContent: 'flex-end', marginLeft: 10}}>
                            <View style = {{width: '100%', height: '70%', justifyContent: 'space-between'}}>
                                <Text style = {[{fontSize: 16, color: Colors.white}, stylesGlobal.font_GESSTwoMedium_Medium]}>{full_name}</Text>
                                <Text style = {[{fontSize: 12, color: Colors.white}, stylesGlobal.font_GESndBook]}>{user_type == "OWNER" ? strings.owner : strings.renter}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style = {{flex: 1, width: '100%', alignItems: "center"}}>
                {
                    this.state.data.map((item, index) => 
                    <View key = {index} style = {{width: '100%'}}>
                    {
                        show_screens.includes(item.screen) &&
                        <TouchableOpacity key = {index} style = {styles.button_component} 
                            onPress = {() => {
                                // this.props.navigation.closeDrawer();
                                if(item.screen == "LanguageSetting") {
                                    languageSwitcher.toggleLanguages();
                                } else if(item.screen == "MyPropertiesMangerScreen") {
                                    this.props.navigation.navigate("CustomerSupportScreen");
                                } else if(item.screen == "AboutusScreen") {
                                    Linking.canOpenURL("http://172.105.62.245/help").then(supported => {
                                        if (supported) {
                                            Linking.openURL("http://172.105.62.245/help");
                                        } else {
                                            
                                        }
                                    });
                                } else {
                                    this.props.navigation.navigate(item.screen);
                                }
                            }}
                        >
                            <View style = {styles.button_view}>
                                <Image style = {styles.iconStyle} source = {item.icon}></Image>
                                <Text style = {[styles.menu_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    </View>
                    )
                }
                    <View style = {{width: '100%', position: 'absolute', left: 0, bottom: 10}}>
                        <TouchableOpacity style = {styles.button_component} onPress = {async () => {
                            try {
                                await AsyncStorage.setItem(Constants.KEY_USER_ID, "");
                                await AsyncStorage.setItem(Constants.KEY_USER_PASSWORD, "");
                                Global.API_TOKEN = "";
                                Global.FULLNAME = "";
                                Global.PHONENUMBER = "";
                                Global.USERTYPE = "";
                                Global.IDIQAMA = "";
                                Global.AVATAR = "";
                                this.props.navigation.closeDrawer();
                                this.props.navigation.navigate("SignInScreen");
                            } catch(error) {

                            }
                        }}>
                            <View style = {[styles.button_view, {borderBottomWidth: 0}]}>
                                <Image style = {styles.iconStyle} source = {require("../assets/images/menu_logout.png")}></Image>
                                <Text style = {[styles.menu_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.menu_logout}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    button_component: {
        width: '100%', 
        alignItems: 'center'
    },
    button_view: {
        width: '80%',
        borderBottomColor: Colors.main,
        borderBottomWidth: 2,
        paddingVertical: 15,
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    iconStyle: { 
        width: 25, 
        height: 25, 
        resizeMode: 'contain',
        tintColor: Colors.main
    },
    menu_text: {
        fontSize: 14, 
        color: 
        Colors.text_main_color, 
        marginLeft: 10
    }
});


