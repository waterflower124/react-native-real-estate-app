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
    ImageBackground
 } from "react-native";

import { Colors } from '../utils/Colors'
import { strings } from "../strings";
import { stylesGlobal } from '../global/stylesGlobal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Global from "../global/Global";

var top_height = 180;

export default class SearchPlaceScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            search_text: '',
            category_flat: false,
            category_villa: false,
            category_land: false,
            category_building: false,
            category_compound: false,
            category_commercial_store: false,
            category_office: false,
            category_ranch: false,
            land_area_from: '',
            land_area_to: '',
            price_from: '',
            price_to: '',

        }
    }

    UNSAFE_componentWillMount() {
        console.log("=========================")
    }

    componentWillUnmount() {
        console.log("0000000000000000000000")
    }

    search_properties = async() => {
        var type_str = "";
        if(this.state.category_flat) {
            type_str += "FLAT,";
        }
        if(this.state.category_villa) {
            type_str += "VILLA,";
        }
        if(this.state.category_land) {
            type_str += "LAND,";
        }
        if(this.state.category_building) {
            type_str += "BUILDING,";
        }
        if(this.state.category_compound) {
            type_str += "COMPOUND,";
        }
        if(this.state.category_commercial_store) {
            type_str += "COMMERCIAL_STORE,";
        }
        if(this.state.category_office) {
            type_str += "OFFICE,";
        }
        if(this.state.category_ranch) {
            type_str += "FARM,";
        }
        var area_str = "";
        if(this.state.land_area_from == "") {
            area_str += "0,";
        } else {
            area_str += this.state.land_area_from + ",";
        }
        if(this.state.land_area_to == "") {
            area_str += "";
        } else {
            area_str += this.state.land_area_to;
        }
        var price_str = "";
        if(this.state.price_from == "") {
            price_str += "0,";
        } else {
            price_str += this.state.price_from + ",";
        }
        if(this.state.price_to == "") {
            price_str += "";
        } else {
            price_str += this.state.price_to;
        }

        let url = Global.BASE_URL + "/api/properties?category=SALE&count=10&city=" + this.state.search_text + "&type=" + type_str + "&area=" + area_str + "&price=" + price_str;
        this.props.navigation.navigate("SearchResultScreen", {url, url});
    }

    render() {
        return (
            <SafeAreaView style = {{flex: 1, backgroundColor: Colors.main, justifyContent: 'center', alignItems: 'center'}}>
                <View style = {{width: '100%', height: 40, backgroundColor: Colors.main, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity onPress = {() => this.props.navigation.goBack()}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_back.png')}></Image>
                    </TouchableOpacity>
                    <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.search}</Text>
                    {/* <TouchableOpacity onPress = {() => this.props.navigation.navigate("SettingsScreen")}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_setting.png')}></Image>
                    </TouchableOpacity> */}
                    <View></View>
                </View>
                <View style = {{width: '100%', height: 80, alignItems: 'center', backgroundColor: Colors.main_bg_color}}>
                    <View style = {{width: '100%', height: '50%', backgroundColor: Colors.main,}}></View>
                    <View style = {{width: '80%', height: '50%', borderRadius: 20, backgroundColor: Colors.white, marginTop: -20, flexDirection: 'row', alignItems: 'center'}}>
                        <TextInput style = {[styles.common_text, stylesGlobal.font_GESSTwoMedium_Medium, {flex: 1, paddingHorizontal: 10}]} placeholder = {strings.area} underlineColorAndroid = {'transparent'}
                            onChangeText = {(text) => this.setState({search_text: text})}
                        >{this.state.search_text}</TextInput>
                        <Image style = {{width: 20, height: 20, resizeMode: 'contain', marginHorizontal: 10}} source = {require('../assets/images/search_dark.png')}></Image>
                    </View>
                </View>
                <View style = {{flex:1 , width: '100%', backgroundColor: Colors.main_bg_color, alignItems: 'center', paddingHorizontal: 15}}>
                    <KeyboardAwareScrollView style = {{width: '100%'}} extraHeight = {20}>
                        <View style = {{width: '100%', alignItems: 'center'}}>
                            <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.property_type}</Text>
                            <View style = {{width: '100%', marginTop: 20}}>
                                <View style = {{width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                                    <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.category_flat ? Colors.text_main_color : Colors.white}]} onPress = {() => this.setState({category_flat: !this.state.category_flat})}>
                                        <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.category_flat ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_flat}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.category_villa ? Colors.text_main_color : Colors.white}]} onPress = {() => this.setState({category_villa: !this.state.category_villa})}>
                                        <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.category_villa ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_vila}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.category_land ? Colors.text_main_color : Colors.white}]} onPress = {() => this.setState({category_land: !this.state.category_land})}>
                                        <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.category_land ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_land}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.category_building ? Colors.text_main_color : Colors.white}]} onPress = {() => this.setState({category_building: !this.state.category_building})}>
                                        <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.category_building ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_building}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style = {{width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 15}}>
                                    <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.category_compound ? Colors.text_main_color : Colors.white}]} onPress = {() => this.setState({category_compound: !this.state.category_compound})}>
                                        <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.category_compound ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_compound}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.category_commercial_store ? Colors.text_main_color : Colors.white}]} onPress = {() => this.setState({category_commercial_store: !this.state.category_commercial_store})}>
                                        <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.category_commercial_store ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_commercial_store}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.category_office ? Colors.text_main_color : Colors.white}]} onPress = {() => this.setState({category_office: !this.state.category_office})}>
                                        <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.category_office ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_office}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.category_ranch ? Colors.text_main_color : Colors.white}]} onPress = {() => this.setState({category_ranch: !this.state.category_ranch})}>
                                        <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.category_ranch ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_ranch}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style = {{width: '100%', marginTop: 20}}>
                                <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.land_area}</Text>
                                <View style = {{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 5}}>
                                    <View style = {{width: '52%', flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.from}</Text>
                                        <View style = {styles.from_text_input_view}>
                                            <TextInput style = {[styles.from_to_textinput, stylesGlobal.font_GESndBook]} textAlign = {'right'} keyboardType = {'decimal-pad'} onChangeText = {(text) => this.setState({land_area_from: text})}>{this.state.land_area_from}</TextInput>
                                        </View>
                                    </View>
                                    <View style = {{width: '47%', flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.to}</Text>
                                        <View style = {styles.to_text_input_view}>
                                            <TextInput style = {[styles.from_to_textinput, stylesGlobal.font_GESndBook]} keyboardType = {'decimal-pad'} onChangeText = {(text) => this.setState({land_area_to: text})}>{this.state.land_area_to}</TextInput>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style = {{width: '100%', marginTop: 20}}>
                                <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.price}</Text>
                                <View style = {{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 5}}>
                                    <View style = {{width: '52%', flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.from}</Text>
                                        <View style = {styles.from_text_input_view}>
                                            <TextInput style = {[styles.from_to_textinput, stylesGlobal.font_GESndBook]} textAlign = {'right'} keyboardType = {'number-pad'} onChangeText = {(text) => this.setState({price_from: text})}>{this.state.price_from}</TextInput>
                                        </View>
                                    </View>
                                    <View style = {{width: '47%', flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.to}</Text>
                                        <View style = {styles.to_text_input_view}>
                                            <TextInput style = {[styles.from_to_textinput, stylesGlobal.font_GESndBook]} keyboardType = {'number-pad'} onChangeText = {(text) => this.setState({price_to: text})}>{this.state.price_to}</TextInput>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity style = {{width: '60%', height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.button_bg_color, marginTop: 40}}
                                onPress = {() => this.search_properties()}
                            >
                                <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.search}</Text>
                            </TouchableOpacity>
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
    common_text: {
        fontSize: 14, 
        color: Colors.text_main_color
    },
    category_button: {
        width: '23%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15
    },
    category_text: {
        fontSize: 8, 
    },
    from_text_input_view: {
        flex: 1,
        height: 30,
        borderTopStartRadius: 12.5,
        borderBottomStartRadius: 12.5,
        backgroundColor: Colors.white,
        overflow: 'hidden',
        marginHorizontal: 5,
        alignItems: 'flex-end'
    },
    to_text_input_view: {
        flex: 1,
        height: 30,
        borderTopEndRadius: 12.5,
        borderBottomEndRadius: 12.5,
        backgroundColor: Colors.white,
        overflow: 'hidden',
        marginLeft: 5
    },
    from_to_textinput: {
        fontSize: 14, 
        color: Colors.text_main_color,
        flex: 1, 
        paddingHorizontal: 10, 
        paddingVertical: 0,
        width: '100%',
        height: '100%',
        paddingHorizontal: 5,
        paddingVertical: 0
    }
})