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
    KeyboardAvoidingView,
    ActivityIndicator
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
import { ifIphoneX, isIphoneX } from '../components/react-native-iphone-x-helper'

var TAG = "CustomerSupportScreen";

export default class CustomerSupportScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            refreshing: false,
            send_loading: false,
            more_load: true,
            full_name: Global.FULLNAME,
            customer_supporter: null,
            system_admin: null, // Selah system admin info
            message_array: [],
            fetching_data: false, // true during fetching data
            send_message: "",
            chat_block: false
        }

    }

    UNSAFE_componentWillMount = async() => {
        this.getSupporter();
    }

    componentWillUnmount = async() => {
        try {
            this.props.route.params = null;
            clearTimeout(this.refreshInterval)
        } catch (error) {
            
        }
    }

    getSupporter = async() => {
        try {
            this.setState({
                loading: true,
            });

            var uri = Global.BASE_URL + "/api/support";
            if(this.props.route.params && this.props.route.params.property_id) {
                uri += "/" + this.props.route.params.property_id
            }
            
            console.log(TAG + " callGetSupporterAPI uri " + uri);

            WebService.callServiceGet(uri, this.handleGetSupporterAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
            });
        }
    }

    handleGetSupporterAPI = async(response, isError) => {
        console.log(TAG + " callGetSupporterAPI Response " + JSON.stringify(response));
        console.log(TAG + " callGetSupporterAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    this.setState({
                        customer_supporter: response.support,
                        system_admin: response.admin
                    }, () => this.getChatList(0));
                } else {
                    this.setState({
                        loading: false,
                    })
                    Alert.alert(strings.warnning, strings.no_custmer_support);
                    this.props.navigation.goBack();
                }
            } else {
                this.setState({
                    loading: false,
                })
                Alert.alert("Warning!", strings.api_error);
                this.props.navigation.goBack();
            }
        } catch(error) {
            this.setState({
                loading: false,
            })
            console.log("get my properties catch error", error);
            Alert.alert("Warning!", strings.network_error);
            this.props.navigation.goBack();
        }
        
    }

    getChatList = async(fetch_type) => {
        try {
            
            var uri = Global.BASE_URL + "/api/messages/" + this.state.customer_supporter.id;
            if(fetch_type == 1) { // load more
                if(this.state.message_array.length > 0) {
                    uri += "?from=" + this.state.message_array[0].date;
                }
            } if(fetch_type == 2) { // get new message in timer
                if(this.state.message_array.length > 0) {
                    uri += "?to=" + this.state.message_array[this.state.message_array.length - 1].date;
                }
            }
            
            console.log(TAG + " callGetChatListAPI uri " + uri);

            WebService.callServiceGet(uri, this.handleGetChatListAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
                refreshing: false
            });
        }
    }

    handleGetChatListAPI = async(response, isError) => {
        console.log(TAG + " callGetChatListAPI Response " + JSON.stringify(response));
        console.log(TAG + " callGetChatListAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    if(response.data.length > 0) {
                        if(this.state.refreshing) {
                            this.setState({
                                message_array: [...response.data.reverse(), ...this.state.message_array]
                            })
                        } else {
                            this.setState({
                                message_array: [...this.state.message_array, ...response.data.reverse()]
                            })
                            
                            setTimeout(() => this.flatlist.scrollToEnd({animated: true}), 300)
                        }
                    }
                    this.refreshInterval = setTimeout(() => {
                        this.getChatList(2)
                    }, 5000);
                } else {
                    if(this.refreshInterval) {
                        clearTimeout(this.refreshInterval);
                    }
                    this.setState({
                        chat_block: true
                    })
                    Alert.alert(strings.warnning, strings.chat_block);
                }
            } else {
                
            }
        } catch(error) {
            console.log("get my properties catch error", error);
        }
        this.setState({
            loading: false,
            refreshing: false
        })
    }

    getMoreChatList = async() => {
        this.setState({
            refreshing: true,
            more_load: true
        }, () => this.getChatList(1))
    }

    sendMessage = async () => {
        if(this.state.chat_block) {
            Alert.alert(strings.warnning, strings.chat_block);
            return;
        }
        if(this.state.send_message == "") {
            return;
        }
        try {
            this.setState({
                send_loading: true,
            });
            var uri = Global.BASE_URL + "/api/message";
            let params = new FormData();
            params.append("support_id", this.state.customer_supporter.id);
            params.append("text", this.state.send_message);

            console.log(TAG + " callSendMessageAPI uri " + uri);
            console.log(TAG + " callSendMessageAPI params " + JSON.stringify(params));

            WebService.callServicePost(uri, params, this.handleSendMessageAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                send_loading: false,
            });
        }
    }

    handleSendMessageAPI = async(response, isError) => {
        console.log(TAG + " callSendMessageAPI Response " + JSON.stringify(response));
        console.log(TAG + " callSendMessageAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    if(this.refreshInterval) {
                        clearTimeout(this.refreshInterval);
                    }
                    this.getChatList(2);
                    this.setState({
                        send_message: ""
                    })
                } else {
                }
            } else {
            }
        } catch(error) {
            console.log("send phone number catch error", error);
        }
        this.setState({
            send_loading: false,
        })
    }

    renderMessage = (item, index) => {
        return (
            <View key = {index} style = {{width: '100%', marginBottom: 10, }}>
            {
                item.sender_type == 'User' &&
                <View style = {{width: '100%', paddingHorizontal: 15}}>
                    <View style = {{width: '100%', alignItems: 'flex-start', marginTop: 15}}>
                        <Text style = {[{fontSize: 16, color: Colors.text_main_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.you}</Text>
                    </View>
                    <View style = {{width: '100%', paddingStart: 40}}>
                        <Image style = {{width: 40, height: 25, resizeMode: 'contain'}} source = {require('../assets/images/message_mine_triangle.png')}></Image>
                    </View>
                    <View style = {{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', }}>
                        <View style = {{width: '80%', paddingVertical: 5, paddingHorizontal: 10, backgroundColor: Colors.main, borderRadius: 15}}>
                            <Text style = {[styles.my_message_text, stylesGlobal.font_GESndBook]} multiline = {true}>{item.text}</Text>
                        </View>
                        <View style = {{width: 15, height: 15}}>
                            {/* <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {require('../assets/images/message_check_mine.png')}></Image> */}
                        </View>
                    </View>
                </View>
            }
            {
                item.sender_type == 'Support' &&
                <View style = {{width: '100%', paddingHorizontal: 15}}>
                    <View style = {{width: '100%', alignItems: 'flex-end', marginTop: 10}}>
                        <Text style = {[{fontSize: 16, color: Colors.text_main_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{item.sender_id == 0 ? strings.admin : strings.customer_support}</Text>
                    </View>
                    <View style = {{width: '100%', paddingEnd: 40, alignItems: 'flex-end'}}>
                        <Image style = {{width: 40, height: 25, resizeMode: 'contain'}} source = {require('../assets/images/message_other_triangle.png')}></Image>
                    </View>
                    <View style = {{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', }}>
                        <View style = {{width: 15, height: 15}}>
                            {/* <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {require('../assets/images/message_check_other.png')}></Image> */}
                        </View>
                        <View style = {{width: '80%', paddingVertical: 5, paddingHorizontal: 10, backgroundColor: Colors.white, borderRadius: 5}}>
                            <Text style = {[styles.customer_message_text, stylesGlobal.font_GESndBook]} multiline = {true}>{item.text}</Text>
                        </View>
                    </View>
                </View>
            }
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
                <View style = {{width: '100%', height: 80, backgroundColor: Colors.main, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity onPress = {() => this.props.navigation.goBack()}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_back.png')}></Image>
                    </TouchableOpacity>
                    <View style = {{flex: 1, height: '100%', flexDirection: 'row', alignItems: 'center', marginStart: 15}}>
                        <View style = {{width: 60, height: 60, borderRadius: 30, borderColor: Colors.main_bg_color, borderWidth: 1, overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}}>
                        {
                            (this.state.customer_supporter == null || this.state.customer_supporter.avatar == null || this.state.customer_supporter.avatar == "") &&
                            <Image style = {{width: '50%', height: '50%', resizeMode: 'contain'}} source = {require('../assets/images/empty_user_light.png')}></Image>
                        }
                        {
                            this.state.customer_supporter != null && this.state.customer_supporter.avatar != null && this.state.customer_supporter.avatar != "" &&
                            <Image style = {{width: '100%', height: '100%', resizeMode:'cover'}} source = {{uri: this.state.customer_supporter.avatar}}></Image>
                        }
                        </View>
                        <Text style = {[{fontSize: 16, color: Colors.main_bg_color, marginStart: 20}, stylesGlobal.font_GESSTwoMedium_Medium]}>{this.state.customer_supporter == null ? "" : this.state.customer_supporter.name}</Text>
                    </View>
                    
                </View>
                <View style = {{flex: 1 , width: '100%', }}>
                    <KeyboardAvoidingView
                        style={{flex: 1}}
                        behavior={Platform.OS == "ios" ? "padding" : null}
                        keyboardVerticalOffset={isIphoneX ? 120 : 100}
                        enabled
                    >
                        <FlatList
                            ref={(ref) => this.flatlist = ref}
                            onRefresh={() => this.getMoreChatList()}
                            refreshing={this.state.refreshing}
                            onEndReachedThreshold={0.5}
                            data={this.state.message_array}
                            extraData={this.state}
                            // onContentSizeChange = {() => this.flatlist.scrollToEnd({animated: true})}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => this.renderMessage(item, index)}
                        />
                        <View style = {{width: '100%', paddingHorizontal: 10, marginTop: 5, borderTopWidth: 1, borderTopColor: Colors.main, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <View style = {{flex: 1, height: 40, paddingEnd: 15}}>
                                <View style = {{width: '100%', height: '100%', borderBottomEndRadius: 20, borderTopEndRadius: 20, borderBottomStartRadius: 20, borderTopStartRadius: 5, backgroundColor: Colors.main, justifyContent: 'center', paddingHorizontal: 10 }}>
                                    <TextInput style = {[styles.my_message_text, stylesGlobal.font_GESndBook]} placeholder = {strings.type_message} placeholderTextColor = {Colors.lightGray} autoCorrect = {false} onChangeText = {(text) => this.setState({send_message: text})}>{this.state.send_message}</TextInput>
                                </View>
                            </View>
                            <TouchableOpacity style = {{width: 40, height: 40, aspectRatio: 1, backgroundColor: Colors.main, justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.sendMessage()}>
                            {
                                this.state.send_loading &&
                                <ActivityIndicator color = {Colors.black} size = {'small'}/>
                            } 
                            {
                                !this.state.send_loading &&
                                <Image style = {{width: '80%', height: '80%', resizeMode: 'contain', tintColor: Colors.main_bg_color}} source = {require('../assets/images/message_send.png')}></Image>
                            }    
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
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
    customer_message_text: {
        fontSize: 14, 
        color: Colors.text_main_color,
        width: '100%'
    },
    my_message_text: {
        fontSize: 14, 
        color: Colors.main_bg_color,
        width: '100%'
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

})