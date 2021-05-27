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
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import FastImage from 'react-native-fast-image';
import NumberFormat from 'react-number-format';

var TAG = "YourUnitInfoScreen";

export default class YourUnitInfoScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            full_name: Global.FULLNAME,
            allocated_unit: null,
            allocated_property: null,
            selected_image_index: 0
        }
    }

    UNSAFE_componentWillMount() {
        this.getUnitInfo();
    }

    getUnitInfo = async() => {
        try {
            this.setState({
                loading: true
            })
            var uri = Global.BASE_URL + "/api/unit";
            
            console.log(TAG + " callGetUnitAPI uri " + uri);

            WebService.callServiceGet(uri, this.handleGetUnitAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false
            })
        }
    }

    handleGetUnitAPI = async(response, isError) => {
        console.log(TAG + " callGetUnitAPI Response " + JSON.stringify(response));
        console.log(TAG + " callGetUnitAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    this.setState({
                        allocated_property: response.property,
                        allocated_unit: response.unit
                    })
                    
                } else {
                    
                }
            } else {
                Alert.alert(strings.warnning, strings.api_error);
            }
        } catch(error) {
            console.log("get my properties catch error", error);
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
                <View style = {{width: '100%', height: 40, backgroundColor: Colors.main, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity onPress = {() => this.props.navigation.goBack()}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_back.png')}></Image>
                    </TouchableOpacity>
                    {/* <View style = {{alignItems: 'center'}}>
                        <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.welcome_place} "{this.state.full_name}"</Text>
                        <Text style = {[{fontSize: 14, color: Colors.main_bg_color,}, stylesGlobal.font_GESndBook]}>{"5455"}</Text>
                    </View> */}
                    {/* <TouchableOpacity onPress = {() => this.props.navigation.navigate("SettingsScreen")}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_setting.png')}></Image>
                    </TouchableOpacity> */}
                    <View></View>
                </View>
                <View style = {{flex: 1, width: '100%'}}>
                {
                    !this.state.loading && this.state.allocated_property == null &&
                    <View style = {{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        <Text>No Unit allocated</Text>
                    </View>
                }
                {
                    !this.state.loading && this.state.allocated_property != null &&
                    <ScrollView style = {{flex:1 , width: '100%', marginTop: 5}}>
                        <View style = {{width: '100%', aspectRatio: 1.2}}>
                        {
                            this.state.allocated_property.images.length > 0 &&
                            <FastImage style = {{width: '100%', height: '100%'}} resizeMode = {FastImage.resizeMode.cover} source = {{uri: this.state.allocated_property.images[this.state.selected_image_index].url}}></FastImage>
                        }
                        {
                            this.state.allocated_property.images.length == 0 &&
                            <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {require('../assets/images/empty_image.png')}></Image>
                        }
                        </View>
                    {
                        this.state.allocated_property.images.length > 0 &&
                        <View style = {{width: '100%', paddingHorizontal: 5, marginVertical: 5}}>
                            <ScrollView style = {{flex: 1, height: 100}} horizontal = {true}>
                            {
                                this.state.allocated_property.images.map((item, index) => 
                                <TouchableOpacity key = {index} style = {{height: '100%', aspectRatio: 1.3, marginRight: 5}} onPress = {() => this.setState({selected_image_index: index})}>
                                    <FastImage style = {{width: '100%', height: '100%'}} resizeMode = {FastImage.resizeMode.cover} source = {{uri: item.url}}></FastImage>
                                </TouchableOpacity>
                                )
                            }
                            </ScrollView>
                        </View>
                    }
                        <View style = {styles.item_view}>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook, {fontSize: 14}]}>{this.state.allocated_property.name}</Text>
                            {/* <StarRating
                                disabled={true}
                                maxStars={5}
                                halfStarEnabled = {true}
                                starSize = {13}
                                fullStarColor = {'#E5981B'}
                                halfStarColor = {'#E5981B'}
                                emptyStarColor = {'#AEAFB2'}
                                rating={4}
                            /> */}
                        </View>
                        <View style = {styles.item_view}>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.price}</Text>
                        {
                            this.state.allocated_property.price != null && this.state.allocated_property.price != "" &&
                            <NumberFormat value={this.state.allocated_property.price} displayType={'text'} thousandSeparator={true} renderText={value => <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}> {value} {strings.sr}</Text>} />
                        }
                        {
                            !(this.state.allocated_property.price != null && this.state.allocated_property.price != "") &&
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}> {"0"} {strings.sr}</Text>
                        }
                        </View>
                        <View style = {styles.item_view}>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.area}</Text>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.allocated_property.area} M2</Text>
                        </View>
                        <View style = {styles.item_view}>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.room}</Text>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.allocated_property.room}</Text>
                        </View>
                        <View style = {{width: '100%', marginTop: 10, paddingHorizontal: 20, }}>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.description}:</Text>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]} multiline = {true}>{this.state.allocated_property.description}</Text>
                        </View>
                        <View style = {{width: '100%', marginTop: 10, paddingHorizontal: 20, alignItems: 'center'}}>
                            <TouchableOpacity style = {styles.contact_button} onPress = {() => this.props.navigation.navigate("UnitRentDataScreen", {property: this.state.allocated_property, unit: this.state.allocated_unit})}>
                                <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.view_housing_unit_data}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {{width: '100%', marginTop: 10, paddingHorizontal: 20, }}>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.location_map}:</Text>
                        </View>
                        <View style={{ width: '100%', height: 150, marginTop: 10}}>
                            <MapView
                                provider = {PROVIDER_GOOGLE}
                                ref={ref => (this.myMapView = ref)}
                                showsUserLocation
                                showsMyLocationButton
                                style={{ width: '100%', height: '100%'}}
                                initialRegion={{
                                    latitude: (this.state.allocated_property.lat && parseFloat(this.state.allocated_property.lat)) || 24.7136,
                                    longitude: (this.state.allocated_property.lng && parseFloat(this.state.allocated_property.lng)) || 46.6753,
                                    latitudeDelta: 0.1,
                                    longitudeDelta: 0.1
                                }}
                                // onMapReady={() => {
                                //     this.myMapView.animateToRegion({
                                //         latitude: parseFloat(this.state.property.lat),
                                //         longitude: parseFloat(this.state.property.lng),
                                //         latitudeDelta: 0.1,
                                //         longitudeDelta: 0.1
                                //     });
                                // }}
                            >
                                <Marker
                                    pinColor={Colors.blue}
                                    // coordinate={{latitude: parseFloat(this.state.property.lat), longitude: parseFloat(this.state.property.lng)}}
                                    coordinate={{latitude: (this.state.allocated_property.lat && parseFloat(this.state.allocated_property.lat)) || 24.7136, longitude: (this.state.allocated_property.lng && parseFloat(this.state.allocated_property.lng)) || 46.6753}}
                                />
                            </MapView>
                        </View>
                    </ScrollView>
                }
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
    item_view: {
        width: '100%', 
        paddingHorizontal: 20, 
        paddingBottom: 5, 
        marginBottom: 5,
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        
    },
    commont_text: {
        fontSize: 12, 
        color: Colors.text_main_color
    },
    contact_button: {
        marginTop: 10, 
        width: '80%', 
        height: 40, 
        borderRadius: 20, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: Colors.button_bg_color,
    }
})