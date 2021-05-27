
import React, { Component } from "react";
import { View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
    TextInput
 } from "react-native";

import { Colors } from '../utils/Colors'
import { strings } from "../strings";
import { stylesGlobal } from '../global/stylesGlobal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventRegister } from 'react-native-event-listeners';
import { Constants } from "../global/Constants";
import * as Global from "../global/Global";
import { useIsFocused } from '@react-navigation/native';

var top_height = 180;

export default class HomeScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            user_type: Global.USERTYPE,
            full_name: Global.FULLNAME,
            user_avatar: Global.AVATAR,
        }
    }

    UNSAFE_componentWillMount = async() => {
        
        this.profileChangeListener = EventRegister.addEventListener(Constants.PROFILE_CHANGED, async() => {
            this.setState({
                full_name: Global.FULLNAME,
                user_avatar: Global.AVATAR,
            })
        })
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.setState ({
                user_type: Global.USERTYPE,
                full_name: Global.FULLNAME,
                user_avatar: Global.AVATAR,
            })
        })
    }

    componentWillUnmount() {
        this.focusListener()
    }

    render() {
        
        return (
            <SafeAreaView style = {{flex: 1, backgroundColor: Colors.main_bg_color, justifyContent: 'center', alignItems: 'center'}}>
                <View style = {{width: '100%', height: top_height, backgroundColor: Colors.text_main_color, alignItems: 'center'}}>
                    <View style = {{width: '100%', paddingHorizontal: 20, position: 'absolute', left: 0, top: 15, justifyContent: 'space-between', flexDirection: 'row', zIndex: 10, elevation: 10}}>
                        {/* <TouchableOpacity style = {styles.top_button} onPress = {() => this.props.navigation.navigate("SearchPlaceScreen")}>
                            <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {require('../assets/images/search_light.png')}></Image>
                        </TouchableOpacity> */}
                        <View></View>
                        <TouchableOpacity style = {styles.top_button} onPress = {() => this.props.navigation.openDrawer()}>
                            <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {require('../assets/images/menu_light.png')}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style = {{height: top_height * 0.8, width: '100%', marginTop: 20, alignItems: 'center'}}>
                        <View style = {{width: top_height * 0.8 * 0.7, aspectRatio: 1, borderRadius: top_height * 0.8 * 0.7 / 2, borderColor: Colors.main_bg_color, borderWidth: 1, overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}}>
                        {
                            (this.state.user_avatar == null || this.state.user_avatar == "") &&
                            <Image style = {{width: '50%', height: '50%', resizeMode: 'contain'}} source = {require('../assets/images/empty_user_light.png')}></Image>
                        }
                        {
                            this.state.user_avatar != null && this.state.user_avatar != "" &&
                            <Image style = {{width: '100%', height: '100%', resizeMode:'cover'}} source = {{uri: this.state.user_avatar}}></Image>
                        }
                        </View>
                        <View style = {{flex: 1, width: '80%', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style = {[{fontSize: 20, color: Colors.white}, stylesGlobal.font_GESSTwoMedium_Medium]}>{this.state.full_name}</Text>
                            <Text style = {[{fontSize: 14, color: Colors.white}, stylesGlobal.font_GESSTwoMedium_Medium]}>{this.state.user_type == "OWNER" ? strings.owner : strings.renter}</Text>
                        </View>
                    </View>
                </View>
            {
                this.state.user_type == "OWNER" &&
                <View style = {{ flex: 1, width: '100%',}}>
                    <View style = {{width: '100%', height: '33%', flexDirection: 'row', borderBottomColor: Colors.main, borderBottomWidth: 1}}>
                        <View style = {{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRightColor: Colors.main, borderRightWidth: 1}}>
                            <TouchableOpacity style = {{width: '70%', height: '70%', backgroundColor: Colors.main, justifyContent: 'center', alignItems: 'center', borderTopStartRadius: 15, borderBottomEndRadius: 15}}
                                onPress = {() => this.props.navigation.navigate("MyPropertiesScreen")}
                            >
                                <Image style = {{width: '50%', height: '50%', resizeMode: 'contain'}} source = {require("../assets/images/property_my.png")}></Image>
                                <Text style = {[{fontSize: 12, color: Colors.white, width: '90%', textAlign: 'center'}, stylesGlobal.font_GESSTwoMedium_Medium]} multiline = {true}>{strings.my_property}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity style = {{width: '70%', height: '70%', backgroundColor: Colors.main, justifyContent: 'center', alignItems: 'center', borderTopEndRadius: 15, borderBottomStartRadius: 15}}
                                onPress = {() => this.props.navigation.navigate("AddingNewPropertiesScreen", {data: null, refreshData: null})}
                            >
                                <Image style = {{width: '50%', height: '50%', resizeMode: 'contain'}} source = {require("../assets/images/property_add.png")}></Image>
                                <Text style = {[{fontSize: 12, color: Colors.white, width: '90%', textAlign: 'center'}, stylesGlobal.font_GESSTwoMedium_Medium]} multiline = {true}>{strings.add_new_property}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style = {{width: '100%', height: '33%', flexDirection: 'row', borderBottomColor: Colors.main, borderBottomWidth: 1}}>
                        <View style = {{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRightColor: Colors.main, borderRightWidth: 1}}>
                            <TouchableOpacity style = {{width: '70%', height: '70%', backgroundColor: Colors.main, justifyContent: 'center', alignItems: 'center', borderTopEndRadius: 15, borderBottomStartRadius: 15}}
                                onPress= {() => this.props.navigation.navigate("PropertiesOnSaleScreen")}
                            >
                                <Image style = {{width: '50%', height: '50%', resizeMode: 'contain'}} source = {require("../assets/images/property_sale.png")}></Image>
                                <Text style = {[{fontSize: 12, color: Colors.white, width: '90%', textAlign: 'center'}, stylesGlobal.font_GESSTwoMedium_Medium]} multiline = {true}>{strings.property_onsale}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity style = {{width: '70%', height: '70%', backgroundColor: Colors.main, justifyContent: 'center', alignItems: 'center', borderTopStartRadius: 15, borderBottomEndRadius: 15}}
                                onPress= {() => this.props.navigation.navigate("TransactionsScreen")}
                            >
                                <Image style = {{width: '50%', height: '50%', resizeMode: 'contain', tintColor: Colors.white}} source = {require("../assets/images/transactions.png")}></Image>
                                <Text style = {[{fontSize: 12, color: Colors.white, width: '90%', textAlign: 'center'}, stylesGlobal.font_GESSTwoMedium_Medium]} multiline = {true}>{strings.menu_transactions}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style = {{width: '100%', height: '33%', flexDirection: 'row'}}>
                        <View style = {{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRightColor: Colors.main, borderRightWidth: 1}}>
                            <TouchableOpacity style = {{width: '70%', height: '70%', backgroundColor: Colors.main, justifyContent: 'center', alignItems: 'center', borderTopStartRadius: 15, borderBottomEndRadius: 15}}
                                onPress= {() => this.props.navigation.navigate("CustomerSupportScreen")}
                            >
                                <Image style = {{width: '50%', height: '50%', resizeMode: 'contain'}} source = {require("../assets/images/property_manager.png")}></Image>
                                <Text style = {[{fontSize: 12, color: Colors.white, width: '90%', textAlign: 'center'}, stylesGlobal.font_GESSTwoMedium_Medium]} multiline = {true}>{strings.property_manager}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity style = {{width: '70%', height: '70%', backgroundColor: Colors.main, justifyContent: 'center', alignItems: 'center', borderTopEndRadius: 15, borderBottomStartRadius: 15}}
                                onPress = {() => this.props.navigation.navigate("NewsScreen")}
                            >
                                <Image style = {{width: '50%', height: '50%', resizeMode: 'contain'}} source = {require("../assets/images/news.png")}></Image>
                                <Text style = {[{fontSize: 12, color: Colors.white, width: '90%', textAlign: 'center'}, stylesGlobal.font_GESSTwoMedium_Medium]} multiline = {true}>{strings.news}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }
            {
                this.state.user_type == "RENTER" &&
                <View style = {{ flex: 1, width: '100%',}}>
                    <View style = {{width: '100%', height: '50%', flexDirection: 'row', borderBottomColor: Colors.main, borderBottomWidth: 1}}>
                        <View style = {{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRightColor: Colors.main, borderRightWidth: 1}}>
                            <TouchableOpacity style = {{width: '70%', height: '70%', backgroundColor: Colors.main, justifyContent: 'center', alignItems: 'center', borderTopStartRadius: 15, borderBottomEndRadius: 15}}
                                onPress= {() => this.props.navigation.navigate("YourUnitInfoScreen")}
                            >
                                <Image style = {{width: '50%', height: '50%', resizeMode: 'contain'}} source = {require("../assets/images/renter_unit_info.png")}></Image>
                                <Text style = {[{fontSize: 12, color: Colors.white, width: '90%', textAlign: 'center'}, stylesGlobal.font_GESSTwoMedium_Medium]} multiline = {true}>{strings.unit_info}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity style = {{width: '70%', height: '70%', backgroundColor: Colors.main, justifyContent: 'center', alignItems: 'center', borderTopEndRadius: 15, borderBottomStartRadius: 15}}
                                onPress= {() => this.props.navigation.navigate("ElectricityBillScreen")}
                            >
                                <Image style = {{width: '50%', height: '50%', resizeMode: 'contain'}} source = {require("../assets/images/renter_electricitybill.png")}></Image>
                                <Text style = {[{fontSize: 12, color: Colors.white, width: '90%', textAlign: 'center'}, stylesGlobal.font_GESSTwoMedium_Medium]} multiline = {true}>{strings.electricity_bill}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style = {{width: '100%', height: '50%', flexDirection: 'row'}}>
                        {/* <View style = {{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRightColor: Colors.main, borderRightWidth: 1}}>
                            <TouchableOpacity style = {{width: '70%', height: '70%', backgroundColor: Colors.main, justifyContent: 'center', alignItems: 'center', borderTopEndRadius: 15, borderBottomStartRadius: 15}}
                                onPress= {() => this.props.navigation.navigate("OtherServiceScreen")}
                            >
                                <Image style = {{width: '50%', height: '50%', resizeMode: 'contain'}} source = {require("../assets/images/renter_otherservice.png")}></Image>
                                <Text style = {[{fontSize: 12, color: Colors.white, width: '90%', textAlign: 'center'}, stylesGlobal.font_GESSTwoMedium_Medium]} multiline = {true}>{strings.other_service}</Text>
                            </TouchableOpacity>
                        </View> */}
                        <View style = {{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRightColor: Colors.main, borderRightWidth: 1}}>
                            <TouchableOpacity style = {{width: '70%', height: '70%', backgroundColor: Colors.main, justifyContent: 'center', alignItems: 'center', borderTopEndRadius: 15, borderBottomStartRadius: 15}}
                                onPress= {() => this.props.navigation.navigate("TransactionsScreen")}
                            >
                                <Image style = {{width: '50%', height: '50%', resizeMode: 'contain', tintColor: Colors.white}} source = {require("../assets/images/transactions.png")}></Image>
                                <Text style = {[{fontSize: 12, color: Colors.white, width: '90%', textAlign: 'center'}, stylesGlobal.font_GESSTwoMedium_Medium]} multiline = {true}>{strings.account_statement}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity style = {{width: '70%', height: '70%', backgroundColor: Colors.main, justifyContent: 'center', alignItems: 'center', borderTopStartRadius: 15, borderBottomEndRadius: 15}}
                                onPress= {() => this.props.navigation.navigate("CustomerSupportScreen")}
                            >
                                <Image style = {{width: '50%', height: '50%', resizeMode: 'contain'}} source = {require("../assets/images/renter_customersupport.png")}></Image>
                                <Text style = {[{fontSize: 12, color: Colors.white, width: '90%', textAlign: 'center'}, stylesGlobal.font_GESSTwoMedium_Medium]} multiline = {true}>{strings.customer_support}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }  
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    top_button: {
        width: 20,
        height: 20
    }
})