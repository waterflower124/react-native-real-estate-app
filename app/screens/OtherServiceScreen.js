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

var TAG = "OtherServiceScreen";

export default class OtherServiceScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            full_name: Global.FULLNAME,
            service_list: []
        }
    }

    UNSAFE_componentWillMount = async() => {
        this.getServices();
    }

    componentWillUnmount() {
        this.setState({
            loading: false
        })
    }

    getServices = async() => {
        try {
            this.setState({
                loading: true,
            });
            var uri = Global.BASE_URL + "/api/services";
            
            console.log(TAG + " callGetServicesAPI uri " + uri);

            WebService.callServiceGet(uri, this.handleGetServicesAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
            });
        }
    }

    handleGetServicesAPI = async(response, isError) => {
        console.log(TAG + " callGetServicesAPI Response " + JSON.stringify(response));
        console.log(TAG + " callGetServicesAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    this.setState({
                        service_list: response.data
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

    subscribePayment = async(service_item) => {
        try {
            
            this.setState({
                loading: true,
            });
            var uri = Global.BASE_URL + "/api/service/subscription/" + service_item.id;
            let params = new FormData();
            params.append("temp", "");
                                    
            console.log(TAG + " callSubscriptionAPI uri " + uri);
            console.log(TAG + " callSubscriptionAPI params " + JSON.stringify(params));

            WebService.callServicePost(uri, params, this.handleSubscriptionAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
            });
        }
    }

    handleSubscriptionAPI = async(response, isError) => {
        console.log(TAG + " callSubscriptionAPI Response " + JSON.stringify(response));
        console.log(TAG + " callSubscriptionAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    Alert.alert(strings.success, strings.id_passowrd_incorrect);
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

    renderService = (item, index) => {
        var last = false;
        if((index % 2 == 0) && (index == this.state.service_list.length - 1 || index == this.state.service_list.length - 2)) {
            last = true;
        }
        if((index % 2 == 1) && (index == this.state.service_list.length - 1)) {
            last = true;
        }
        return (
            <View style = {[styles.component_view, {borderRightColor: Colors.main, borderRightWidth: index % 2 == 0 ? 1 : 0, borderBottomColor: Colors.main, borderBottomWidth: last ? 0 : 1}]}>
                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{strings.package} {strings.num_order} {index + 1}</Text>
                <View style = {styles.component_main_view}>
                    <View style = {styles.component_white_view}>
                        <View style = {styles.logo_view}>
                            <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {require("../assets/images/logo_signin.png")}></Image>
                        </View>
                        <Text style = {[styles.desc_text, stylesGlobal.font_GESSTwoMedium_Medium, {marginBottom: 10}]}>{strings.one_month}</Text>
                    </View>
                    <View style = {styles.circle_view}>
                        <Text style = {[{fontSize: 20, color: Colors.text_main_color}, stylesGlobal.font_GESndBook]}>{item.month_price}</Text>
                        <Text style = {[{fontSize: 18, color: Colors.text_main_color}, stylesGlobal.font_GESndBook]}>{"SR"}</Text>
                    </View>
                </View>
                <View style = {{marginTop: 5}}>
                    <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{item.month_visits} {strings.visits}</Text>
                </View>
                <TouchableOpacity style = {styles.button_view} onPress = {() => this.subscribePayment(item)}>
                    <Text style = {[{fontSize: 16, color: Colors.main_bg_color, }, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.choice}</Text>
                </TouchableOpacity>
            </View>
        )
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
                    <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.other_service}</Text>
                    {/* <TouchableOpacity onPress = {() => this.props.navigation.navigate("SettingsScreen")}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_setting.png')}></Image>
                    </TouchableOpacity> */}
                    <View></View>
                </View>
                <View style = {{width: '100%', height: 30, backgroundColor: Colors.main, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style = {[{fontSize: 16, color: Colors.white,}, stylesGlobal.font_GESndBook]}>{"unit number 5455"}</Text>
                </View>
                <View style = {{width: '100%', paddingVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style = {[{fontSize: 16, color: Colors.text_main_color,}, stylesGlobal.font_GESndBook]}>{strings.hygiene_package}</Text>
                </View>
                <View style = {{flex:1 , width: '100%', }}>
                    <FlatList 
                        style = {{flex: 1}}
                        data = {this.state.service_list}
                        extraData={this.state}
                        numColumns = {2}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => this.renderService(item, index)}
                    />
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
    component_view: {
        width: '50%', 
        aspectRatio: 0.6,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    component_main_view: {
        width: '50%', 
        alignItems: 'center', 
        paddingBottom: (Dimensions.get('screen').width * 0.5 * 0.5 - 10 * 2) / 2
    },
    component_white_view: {
        width: '100%', 
        alignItems: 'center', 
        paddingBottom: (Dimensions.get('screen').width * 0.5 * 0.5 - 10 * 2) / 2, 
        backgroundColor: Colors.white, 
        borderRadius: 10
    },
    logo_view: {
        width: '80%', 
        aspectRatio: 1.5, 
        marginVertical: 5
    },
    circle_view: {
        position: 'absolute', 
        width: Dimensions.get('screen').width * 0.5 * 0.5 - 10 * 2, 
        aspectRatio: 1, 
        borderRadius: (Dimensions.get('screen').width * 0.5 * 0.5 - 10 * 2) / 2, 
        bottom: 0, 
        left: 10, 
        backgroundColor: Colors.main, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    button_view: {
        width: '60%', 
        height: 30, 
        backgroundColor: Colors.button_bg_color, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 15, 
        marginTop: 5
    }
})