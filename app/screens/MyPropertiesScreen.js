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
import { SliderBox } from "react-native-image-slider-box";
import moment from 'moment';
import RowProperty from '../components/RowProperty';

var TAG = "MyPropertiesScreen";

export default class MyPropertiesScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            owner: true,
            loading: false,
            refreshing: false,
            properties_array: [],
            page_number: 0,
            more_load: true,
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
            var uri = Global.BASE_URL + "/api/properties?page=" + this.state.page_number + "&count=10";
            
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
                            response.properties[i].ribbon_text = ""
                            if(response.properties[i].category == "RENT") {
                                if(response.properties[i].status == "RENT") {
                                    response.properties[i].ribbon_text = strings.property_rented
                                } else {
                                    response.properties[i].ribbon_text = strings.property_rent
                                }
                            } else if(response.properties[i].category == "SALE") {
                                if(response.properties[i].status == "SOLD") {
                                    response.properties[i].ribbon_text = strings.property_sold
                                } else {
                                    response.properties[i].ribbon_text = strings.property_sale
                                }
                            }
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
                        if(response.properties.length < 10) {
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
    
    renderProperty = (item, index) => {
        return (
            <TouchableOpacity key = {index} style = {{width: '100%', height: 150, alignItems: 'center', paddingHorizontal: 10, marginTop: 15}}  onPress = {() => this.props.navigation.navigate("PropertyDetailScreen", {property: item, property_type: "my_property"})}>
                <View style = {{width: '100%', height: '100%', padding: 10, borderRadius: 5, overflow: 'hidden', flexDirection: 'row', justifyContent: 'flex-end', borderWidth: 0.5, borderColor: Colors.main}}>
                    <View style = {{height: '100%', width: 150}}>
                        <SliderBox
                            images = {item.image_urls}
                            // ImageComponent = {FastImage}
                            sliderBoxHeight = {130}
                            parentWidth = {150}
                            disableOnPress = {true}
                            autoplay = {true}
                            circleLoop
                            // dotStyle = {{width: 15, height: 15, borderRadius: 7.5}}
                            // dotColor = '#3B3F48'
                            // inactiveDotColor = {'#203B3F48'}
                            // ImageComponentStyle = {{width: Dimensions.get('screen').width - 20, height: 200, borderRadius: 10}}
                        />
                    {
                        item.ribbon_text != "" &&
                        <View style = {{position: 'absolute', top: 10, right: 10, padding: 5, backgroundColor: Colors.main}}>
                            <Text style = {[{fontSize: 12, color: Colors.white,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{item.ribbon_text}</Text>
                        </View>
                    }
                    </View>
                    <View style = {{flex: 1, height: '100%', marginStart: 10}}>
                        <View style = {{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                            {/* <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                <Image style = {styles.icon_style} source = {require('../assets/images/property_date.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{moment(item.created_at).locale('en').format('MM-DD-YYYY')}</Text>
                            </View> */}
                            <View style = {{flex: 1, alignItems: 'flex-end'}}>
                                <Text style = {[{fontSize: 16, color: Colors.main}, stylesGlobal.font_GESndBook]}>{item.name}</Text>
                            </View>
                        </View>
                        {/* <View style = {{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row'}}>
                            <Text style = {[styles.desc_text, {fontSize: 14}, stylesGlobal.font_GESndBook]}>{item.price && item.price != "" ? item.price : "0"}</Text>
                        </View> */}
                        <View style = {{flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            {/* <View style = {{justifyContent: 'center', flexDirection: 'row'}}>
                                <Image style = {[styles.icon_style,{marginEnd: 5}]} source = {require('../assets/images/property_bathroom.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{item.bathrooms_count && item.bathrooms_count != "" ? item.bathrooms_count : "0"}</Text>
                            </View>
                            <View style = {{justifyContent: 'center', flexDirection: 'row'}}>
                                <Image style = {[styles.icon_style,{marginEnd: 5}]} source = {require('../assets/images/property_room.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{item.room && item.room != "" ? item.room : "0"}</Text>
                            </View> */}
                            <View style = {{justifyContent: 'center', flexDirection: 'row'}}>
                                <Image style = {[styles.icon_style,{marginEnd: 5}]} source = {require('../assets/images/property_area.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{item.area && item.area != "" ? item.area : "0"}</Text>
                            </View>
                        </View>
                        <View style = {{flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Text style = {[styles.desc_text, {height: 20}, stylesGlobal.font_GESndBook]}>{item.address}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
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
                    <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.my_property}</Text>
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
                            if(!this.onEndReachedCalledDuringMomentum && this.state.more_load && !this.state.refreshing) {
                                this.onEndReachedCalledDuringMomentum = true;
                                this.getMyProperties();
                            }
                        }}
                        data={this.state.properties_array}
                        extraData={this.state}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                        // renderItem={({ item, index }) => this.renderProperty(item, index)}
                        renderItem={({ item, index }) => <RowProperty item = {item} index = {index} navigate = {this.props.navigation.navigate} type = {'my_property'}/>}
                    />
                </View>
                {/* <TouchableOpacity style = {{width: 80, height: 50, borderRadius: 80, position: 'absolute', left: 25, bottom: StaticSafeAreaInsets.safeAreaInsetsBottom + 25}} onPress = {() => this.props.navigation.navigate("AddingNewPropertiesScreen")}>
                    <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {require('../assets/images/portfolio_add.png')}/>
                </TouchableOpacity> */}
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
        color: Colors.main
    },
    icon_style: {
        width: 20, 
        height: 15, 
        resizeMode: 'contain'
    }
})