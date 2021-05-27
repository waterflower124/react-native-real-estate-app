import React, { Component, PureComponent } from "react";
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

var TAG = "RowProperty";

export default class RowProperty extends PureComponent {

    constructor(props) {
        super(props);
        
        this.state = {
            
        }
    }

    UNSAFE_componentWillMount = async() => {
        
    }

    render() {
        return (
            <View style = {{flex: 1}}>
            <TouchableOpacity key = {this.props.index} style = {{width: '100%', height: 150, alignItems: 'center', paddingHorizontal: 10, marginTop: 15}}  onPress = {() => this.props.navigate("PropertyDetailScreen", {property: this.props.item, property_type: this.props.type})}>
                <View style = {{width: '100%', height: '100%', padding: 10, borderRadius: 5, overflow: 'hidden', flexDirection: 'row', justifyContent: 'flex-end', borderWidth: 0.5, borderColor: Colors.main}}>
                    <View style = {{height: '100%', width: 150}}>
                        {/* <SliderBox
                            images = {this.props.item.image_urls}
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
                        /> */}
                    {
                        this.props.item.image_urls.length > 0 &&
                        <FastImage style = {{width: 150, height: 130}} resizeMode = {FastImage.resizeMode.cover} source = {{uri: this.props.item.image_urls[0]}}></FastImage>
                    }
                        
                    {
                        this.props.item.ribbon_text != "" && this.props.type == "my_property" &&
                        <View style = {{position: 'absolute', top: 10, right: 10, padding: 5, backgroundColor: Colors.main}}>
                            <Text style = {[{fontSize: 12, color: Colors.white,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{this.props.item.ribbon_text}</Text>
                        </View>
                    }
                    </View>
                    <View style = {{flex: 1, height: '100%', marginStart: 10}}>
                        <View style = {{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                            {/* <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                <Image style = {styles.icon_style} source = {require('../assets/images/property_date.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{moment(this.props.item.created_at).locale('en').format('MM-DD-YYYY')}</Text>
                            </View> */}
                            <View style = {{flex: 1, alignItems: 'flex-start'}}>
                                <Text style = {[{fontSize: 16, color: Colors.main}, stylesGlobal.font_GESndBook]}>{this.props.item.name}</Text>
                            </View>
                        </View>
                        {/* <View style = {{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row'}}>
                            <Text style = {[styles.desc_text, {fontSize: 14}, stylesGlobal.font_GESndBook]}>{this.props.item.price && this.props.item.price != "" ? this.props.item.price : "0"}</Text>
                        </View> */}
                        <View style = {{flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            {/* <View style = {{justifyContent: 'center', flexDirection: 'row'}}>
                                <Image style = {[styles.icon_style,{marginEnd: 5}]} source = {require('../assets/images/property_bathroom.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{this.props.item.bathrooms_count && this.props.item.bathrooms_count != "" ? this.props.item.bathrooms_count : "0"}</Text>
                            </View>
                            <View style = {{justifyContent: 'center', flexDirection: 'row'}}>
                                <Image style = {[styles.icon_style,{marginEnd: 5}]} source = {require('../assets/images/property_room.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{this.props.item.room && this.props.item.room != "" ? this.props.item.room : "0"}</Text>
                            </View> */}
                            <View style = {{justifyContent: 'center', flexDirection: 'row'}}>
                                <Image style = {[styles.icon_style,{marginEnd: 5}]} source = {require('../assets/images/property_area.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{this.props.item.area && this.props.item.area != "" ? this.props.item.area : "0"}</Text>
                            </View>
                        </View>
                        <View style = {{flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Text style = {[styles.desc_text, {height: 20}, stylesGlobal.font_GESndBook]}>{this.props.item.address}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            </View>
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