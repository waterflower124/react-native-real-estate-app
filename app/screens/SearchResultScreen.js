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
import FastImage from 'react-native-fast-image';
import RowProperty from '../components/RowProperty';

var TAG = "SearchResultScreen";

export default class SearchResultScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            owner: true,
            loading: false,
            refreshing: false,
            properties_array: [],
            page_number: 0,
            more_load: true
        }

        this.onEndReachedCalledDuringMomentum = true;
    }

    UNSAFE_componentWillMount = async() => {
        this.getMyProperties();
    }

    getMyProperties = async() => {
        try {
            if(!this.state.refreshing) {
                this.setState({
                    loading: true,
                });
            }
            var uri = this.props.route.params.url;
            uri += "&page=" + this.state.page_number;
            
            console.log(TAG + " callGetMyPropertiesAPI uri " + uri);

            WebService.callServiceGet(uri, this.handleGetMyPropertiesAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
                refreshing: false
            });
        }
    }

    handleGetMyPropertiesAPI = async(response, isError) => {
        console.log(TAG + " callGetMyPropertiesAPI Response " + JSON.stringify(response));
        console.log(TAG + " callGetMyPropertiesAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    if(response.properties != null) {
                        for(var i = 0; i < response.properties.length; i ++) {
                            response.properties[i].image_urls = [];
                            for(var j = 0; j < response.properties[i].images.length; j ++) {
                                response.properties[i].image_urls.push(response.properties[i].images[j].url);
                            }
                        }
                        if(this.state.refreshing) {
                            this.setState({
                                properties_array: response.properties,
                                page_number: this.state.page_number + 1
                            })
                        } else {
                            this.setState({
                                properties_array: [...this.state.properties_array, ...response.properties]
                            })
                        }
                        if(response.properties.length == 0) {
                            this.setState({
                                more_load: false
                            })
                        }
                    }
                } else {
                    Alert.alert("Warning!", "get my properties success error");
                }
            } else {
                Alert.alert("Warning!", "get my properties error");
            }
        } catch(error) {
            console.log("get my properties catch error", error);
        }
        this.setState({
            loading: false,
            refreshing: false
        })
    }

    refreshMyProperties = async() => {
        this.setState({
            refreshing: true,
            page_number: 0,
            more_load: true
        }, () => this.getMyProperties())
        
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
                    <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.search_result}</Text>
                    {/* <TouchableOpacity onPress = {() => this.props.navigation.navigate("SettingsScreen")}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_setting.png')}></Image>
                    </TouchableOpacity> */}
                    <View></View>
                </View>
                <View style = {{flex:1 , width: '100%'}}>
                    <FlatList
                        onRefresh={() => this.refreshMyProperties()}
                        refreshing={this.state.refreshing}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                            if(!this.onEndReachedCalledDuringMomentum && this.state.more_load) {
                                this.onEndReachedCalledDuringMomentum = true;
                                this.getMyProperties();
                            }
                        }}
                        data={this.state.properties_array}
                        extraData={this.state}
                        // contentContainerStyle={{ alignItems: "center", flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                        renderItem={({ item, index }) => <RowProperty item = {item} index = {index} navigate = {this.props.navigation.navigate} type = {'property_sale'}/>}
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
        color: Colors.main_bg_color
    }
})