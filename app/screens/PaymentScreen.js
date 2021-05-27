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
import { SliderBox } from "react-native-image-slider-box";
import FastImage from "react-native-fast-image";
import moment from 'moment';
var RNFS = require('react-native-fs');
import * as Permission from "../utils/Permission";
import PDFView from 'react-native-view-pdf';
import { CreditCardInput, LiteCreditCardInput } from "react-native-input-credit-card";


var TAG = "PaymentScreen";
const device_width = Dimensions.get('screen').width
export default class PaymentScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            input_card_form: null,
            saved_card_list: [],
            deleted_card_index: 0,

        }
    }

    UNSAFE_componentWillMount = async() => {
        this.getPaymentRequest();
    }

    getPaymentRequest = async() => {
        try {
            this.setState({
                loading: true,
            });
            var uri = Global.BASE_URL + "/api/payments";
            
            console.log(TAG + " callGetPaymentRequestAPI uri " + uri);

            WebService.callServiceGet(uri, this.handleGetPaymentRequestAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
            });
        }
    }

    handleGetPaymentRequestAPI = async(response, isError) => {
        console.log(TAG + " callGetPaymentRequestAPI Response " + JSON.stringify(response));
        console.log(TAG + " callGetPaymentRequestAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    this.setState({
                        saved_card_list: response.cards
                    })
                } else {
                    Alert.alert(strings.warnning, strings.api_error);
                }
            } else {
                Alert.alert(strings.warnning, strings.api_error);
            }
        } catch(error) {
            console.log("get my properties catch error", error);
            Alert.alert(strings.warnning, strings.network_error);
        }
        this.setState({
            loading: false,
        });
    }

    addCreditCard = async() => {
        try {
            if(this.state.input_card_form == null) {
                Alert.alert(strings.warnning, strings.input_card_error);
                return;
            }
            if(this.state.input_card_form.valid) {
                if(this.state.input_card_form.status.number != "valid") {
                    Alert.alert(strings.warnning, strings.card_number_error);
                    return;
                }
                if(this.state.input_card_form.status.expiry != "valid") {
                    Alert.alert(strings.warnning, strings.card_expiry_error);
                    return;
                }
                if(this.state.input_card_form.status.cvc != "valid") {
                    Alert.alert(strings.warnning, strings.card_cvc_error);
                    return;
                }
            }
            
            this.setState({
                loading: true,
            });
            var uri = Global.BASE_URL + "/api/card";
            
            let params = new FormData();
            params.append("card_number", this.state.input_card_form.values.number);
            params.append("expiry", this.state.input_card_form.values.expiry);
            params.append("cvc", this.state.input_card_form.values.cvc);
                                    
            console.log(TAG + " callAddCardAPI uri " + uri);
            console.log(TAG + " callAddCardAPI params " + JSON.stringify(params));

            WebService.callServicePost(uri, params, this.handleAddCardAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
            });
        }
    }

    handleAddCardAPI = async(response, isError) => {
        console.log(TAG + " callAddCardAPI Response " + JSON.stringify(response));
        console.log(TAG + " callAddCardAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    response.card.is_default = 0;
                    this.setState({
                        input_card_form: null,
                        saved_card_list: [...this.state.saved_card_list, response.card]
                    })
                    this.CCInput.setValues({number: "", expiry: "", cvc: ""})
                } else {
                    Alert.alert(strings.warnning, strings.api_error);
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

    deleteCard = async(index) => {
        try {
            this.setState({
                loading: true,
                deleted_card_index: index
            });
            var uri = Global.BASE_URL + "/api/card/" + this.state.saved_card_list[index].id;
            
            console.log(TAG + " callDeleteCardAPI uri " + uri);

            WebService.callServiceDelete(uri, this.handleDeleteCardAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
            });
        }
    }

    handleDeleteCardAPI = async(response, isError) => {
        console.log(TAG + " callDeleteCardAPI Response " + JSON.stringify(response));
        console.log(TAG + " callDeleteCardAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    var saved_card_list = this.state.saved_card_list;
                    saved_card_list.splice(this.state.deleted_card_index, 1);
                    this.setState({
                        saved_card_list: saved_card_list
                    })
                } else {
                    Alert.alert(strings.warnning, strings.api_error);
                }
            } else {
                Alert.alert(strings.warnning, strings.api_error);
            }
        } catch(error) {
            console.log("get my properties catch error", error);
            Alert.alert(strings.warnning, strings.network_error);
        }
        this.setState({
            loading: false,
        });
    }

    changeCard = async(form) => {
        console.log(form)
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
                    <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESndBook]}>{strings.payment}</Text>
                    {/* <TouchableOpacity>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_setting.png')}></Image>
                    </TouchableOpacity> */}
                    <View></View>
                </View>
                
                <View style = {{flex:1 , width: '100%', padding: 10, alignItems: 'center'}}>
                    <KeyboardAwareScrollView style = {{width: '100%'}} extraHeight = {20}>
                    {
                        this.state.saved_card_list.length > 0 &&
                        <View style = {{width: '100%', alignItems: 'center'}}>
                            <View style = {{width: '100%'}}>
                                <Text style = {[{fontSize: 16, color: Colors.text_main_color,}, stylesGlobal.font_GESndBook]}>{strings.your_saved_card}</Text>
                            </View>
                            <ScrollView style = {{width: '80%', marginTop: 10}}>
                            {
                                this.state.saved_card_list.map((item, index) => 
                                <View key = {index} style = {{width: '100%', alignItems: 'center', flexDirection: 'row', marginBottom: 5}}>
                                    <TouchableOpacity style = {{flex: 1, alignItems: 'center', flexDirection: 'row'}} onPress = {() => {
                                        var saved_card_list = this.state.saved_card_list;
                                        var a = 0;
                                        for(i = 0; i < saved_card_list.length; i ++) {
                                            saved_card_list[i].is_default = 0;
                                            if(i == index) {
                                                saved_card_list[i].is_default = 1;
                                            }
                                        }
                                        this.setState({
                                            saved_card_list: saved_card_list
                                        })
                                    }}>
                                        <Text style = {[{flex: 1, height: 25, fontSize: 14, color: Colors.black,}, stylesGlobal.font_GESndBook]}>{item.last_four}</Text>
                                        <View style = {{width: 20, height: 20}}>
                                        {
                                            item.is_default.toString() == "0" &&
                                            <Image style = {{height: '100%', width: '100%', resizeMode: 'contain'}} source = {require('../assets/images/property_uncheck.png')}></Image>
                                        }
                                        {
                                            item.is_default.toString() != "0" &&
                                            <Image style = {{height: '100%', width: '100%', resizeMode: 'contain'}} source = {require('../assets/images/property_check.png')}></Image>
                                        } 
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {{width: 20, height: 20, marginStart: 20}} onPress = {() => this.deleteCard(index)}>
                                        <Image style = {{height: '100%', width: '100%', resizeMode: 'contain'}} source = {require('../assets/images/delete.png')}></Image>
                                    </TouchableOpacity>
                                </View>
                                )
                            }
                            </ScrollView>
                        </View>
                    }
                        <View style = {{width: '100%', alignItems: 'center', marginTop: 10}}>
                            <View style = {{width: '100%'}}>
                                <Text style = {[{fontSize: 16, color: Colors.text_main_color,}, stylesGlobal.font_GESndBook]}>{strings.add_new_card}</Text>
                            </View>
                            <View style = {{width: '100%', aspectRatio: 1.1, justifyContent: 'center', alignItems: 'center'}}>
                                <CreditCardInput 
                                    ref={(ref) => this.CCInput = ref}
                                    cardScale = {(Dimensions.get('screen').width - 50) / 300}
                                    labels = {{ number: strings.title_card_number, expiry: strings.title_expiry, cvc: strings.title_cvc }}
                                    labelStyle = {stylesGlobal.font_GESSTwoMedium_Medium}
                                    inputStyle = {stylesGlobal.font_GESndBook}
                                    onChange={(form) => this.setState({input_card_form: form})} 
                                />
                                
                            </View>
                            <TouchableOpacity style = {styles.action_button} onPress = {() => this.addCreditCard()}>
                                <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.add}</Text>
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
    desc_text: {
        fontSize: 12, 
        color: Colors.text_main_color
    },
    action_button: {
        marginTop: 10, 
        width: '80%', 
        height: 40, 
        borderRadius: 20, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: Colors.button_bg_color,
    }
})