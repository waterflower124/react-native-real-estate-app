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
    TouchableHighlight,
    I18nManager,
    Linking,
    Modal
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
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import FastImage from 'react-native-fast-image';
import ModalDropdown from '../components/ModalDropdown';
import NumberFormat from 'react-number-format';
import ActionSheet from '../components/react-native-actionsheet';
import * as Permission from "../utils/Permission";

var TAG = "PropertyDetailScreen";

export default class PropertyDetailScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            property: this.props.route.params.property,
            selected_image_index: 0,
            ribbon_text: '',
            rented_flag: false,
            front_array: [strings.front_north, strings.front_south, strings.front_east, strings.front_west],
            front_array_en: ['northen', 'southern', 'eastern', 'western'],
            overlooking_street_count_array: [strings.overlooking_street_count1, strings.overlooking_street_count2, strings.overlooking_street_count3, strings.overlooking_street_count4],
            overlooking_street_count_array_en: ['1 street', '2 street', '3 street', '4 street'],
            land_permit_array: [strings.land_permit_residential, strings.land_permit_commercial],
            land_permit_array_en: ['residential', 'commercial'],

            mapModalVisible: false,
            map_routes: [],
        }
    }

    UNSAFE_componentWillMount = async() => {
        if(this.props.route.params.property.category == "RENT") {
            if(this.props.route.params.property.status == "RENT") {
                this.setState({
                    ribbon_text: strings.property_rented,
                    rented_flag: true
                })
            } else {
                this.setState({
                    ribbon_text: strings.property_rent,
                })
            }
        } else if(this.props.route.params.property.category == "SALE") {
            if(this.props.route.params.property.status == "SOLD") {
                this.setState({
                    ribbon_text: strings.property_sold
                })
            } else {
                this.setState({
                    ribbon_text: strings.property_sale,
                })
            }
        }
        var property = this.props.route.params.property;
        for(i = 0; i < this.state.front_array_en.length; i ++) {
            if(property.front == this.state.front_array_en[i]) {
                property.front_index = i;
                break;
            }
        }
        for(i = 0; i < this.state.overlooking_street_count_array_en.length; i ++) {
            if(property.overlooking_street_count == this.state.overlooking_street_count_array_en[i]) {
                property.overlooking_street_count_index = i;
                break;
            }
        }
        for(i = 0; i < this.state.land_permit_array_en.length; i ++) {
            if(property.land_permit == this.state.land_permit_array_en[i]) {
                property.land_permit_index = i;
                break;
            }
        }
        this.setState({
            property: property
        })
    }

    contactCustomer = async() => {
        this.props.navigation.navigate("CustomerSupportScreen", {property_id: this.state.property.id});
    }

    deleteProperty = async() => {
        try {
            this.setState({
                loading: true
            })
            var uri = Global.BASE_URL + "/api/property/" + this.state.property.id;
            
            console.log(TAG + " callDeletePropertyAPI uri " + uri);

            WebService.callServiceDelete(uri, this.handleDeletePropertyAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false
            })
        }
    }

    handleDeletePropertyAPI = async(response, isError) => {
        console.log(TAG + " callDeletePropertyAPI Response " + JSON.stringify(response));
        console.log(TAG + " callDeletePropertyAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    this.props.navigation.goBack();
                } else {
                    Alert.alert("Warning!", strings.api_error);
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

    refreshData = async() => {
        try {
            this.setState({
                loading: true
            })
            var uri = Global.BASE_URL + "/api/property/" + this.state.property.id;
            
            console.log(TAG + " callGetPropertyAPI uri " + uri);

            WebService.callServiceGet(uri, this.handleGetPropertyAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false
            })
        }
    }

    handleGetPropertyAPI = async(response, isError) => {
        console.log(TAG + " callGetPropertyAPI Response " + JSON.stringify(response));
        console.log(TAG + " callGetPropertyAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    this.setState({
                        property: property
                    })
                } else {
                    // Alert.alert("Warning!", "get my properties success error");
                }
            } else {
                // Alert.alert(strings.warnning, strings.api_error);
            }
        } catch(error) {
            console.log("get my properties catch error", error);
            // Alert.alert(strings.warnning, strings.network_error);
        }
        this.setState({
            loading: false
        })
    }

    openMap(type) {
        const streetViewLatLngD = {
            latitudeDelta: 0.001,
            longitudeDelta: 0.0015
        }
        const cityViewLatLngD = {
            latitudeDelta: 2.5,
            longitudeDelta: 0.8
        }
        var scheme = "";
        if(type == "ios_map") {
            scheme = 'maps:0,0?q=';
        } else {
            scheme = 'geo:0,0?q=';
        }  
        var latLng = `${this.state.property.lat},${this.state.property.lng}`;
        var label = this.state.property.name;
        var url = "";
        if(type == "ios_map") {
            url = `${scheme}${label}@${latLng}`;
        } else {
            if(Platform.OS == "android") {
                url = `${scheme}${latLng}(${label})`;
            } else if(Platform.OS == "ios") {
                // url = "comgooglemaps://?q=" + label + "&center=" + this.state.property.lat + "," + this.state.property.lng;
                // url = "https://www.google.de/maps/@" + this.state.property.lat + "," + this.state.property.lng + "?q=" + label;
                url = 'http://maps.google.com/maps?daddr=' + this.state.property.lat + ',' + this.state.property.lng;
                // const latLng = `${this.state.property.lat},${this.state.property.lng}`;
            }
        } 
        
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("linking error")
            }
        })
        .catch(error => console.log(error));
    }

    getRoute = async(src, dest) => {
        var parameter = "origin=" + src.latitude + "," + src.longitude + "&destination=" + dest.latitude + "," + dest.longitude + "&key=" + Permission.GoogleMapiAPIKey;
        await fetch("https://maps.googleapis.com/maps/api/directions/json?" + parameter, {
            method: "GET",
        })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            
            if(responseData.status == "OK") {
                var routes = [];
                if(responseData.routes.length > 0 && responseData.routes[0].legs.length > 0) {
                    for(var i = 0; i < responseData.routes[0].legs[0].steps.length; i ++) {
                        routes.push({latitude: responseData.routes[0].legs[0].steps[i].start_location.lat, longitude: responseData.routes[0].legs[0].steps[i].start_location.lng});
                    }
                    routes.push({latitude: responseData.routes[0].legs[0].steps[responseData.routes[0].legs[0].steps.length - 1].end_location.lat, longitude: responseData.routes[0].legs[0].steps[responseData.routes[0].legs[0].steps.length - 1].end_location.lng});
                    this.setState({
                        map_routes: routes
                    })
                }
                console.log(JSON.stringify(routes));
            }
            
        })
        .catch(error => {
            console.log(error)
        });
    }

    render() {
        
        return (
            <SafeAreaView style = {{flex: 1, backgroundColor: Colors.main_bg_color, justifyContent: 'center', alignItems: 'center'}}>
            {
                this.state.loading && <ProgressIndicator/>
            }
                <ActionSheet
                    ref={o => this.mapActionSheet = o}
                    title={strings.select_map}
                    options={[strings.google_map, strings.ios_map, strings.cancel]}
                    cancelButtonIndex={2}
                    // destructiveButtonIndex={1}
                    onPress={(index) => { 
                        if(index == 0) {
                            this.openMap("google_map");
                        } else if(index == 1) {
                            this.openMap("ios_map");
                        }
                    }}
                />
                <Modal animationType="fade" transparent={false} visible={this.state.mapModalVisible}>
                    <MapView
                        provider = {PROVIDER_GOOGLE}
                        ref={ref => (this.myFullMapView = ref)}
                        showsUserLocation
                        showsMyLocationButton
                        style={{ width: '100%', height: '100%'}}
                        initialRegion={{
                            latitude: this.state.property.lat,
                            longitude: this.state.property.lng,
                            latitudeDelta: 0.1,
                            longitudeDelta: 0.1
                        }}
                        onMapReady={() => {
                            Permission.getUserLocation(
                                position => {
                                    const { latitude, longitude } = position.coords;
                                    this.getRoute({latitude: latitude, longitude: longitude}, {latitude: this.state.property.lat, longitude: this.state.property.lng});
                                },
                                error => { console.log("error") }
                            );
                            this.myFullMapView.animateToRegion({
                                latitude: parseFloat(this.state.property.lat),
                                longitude: parseFloat(this.state.property.lng),
                                latitudeDelta: 0.1,
                                longitudeDelta: 0.1
                            });
                        }}
                    >
                        <Marker
                            pinColor={Colors.blue}
                            coordinate={{latitude: parseFloat(this.state.property.lat), longitude: parseFloat(this.state.property.lng)}}
                            onPress = {(coord) => {
                            }}
                        />
                        <Polyline
                            coordinates = {this.state.map_routes}
                            strokeColor = {Colors.blue}
                            strokeWidth = {3}
                        />
                    </MapView>
                    <View style = {{width: '100%', height: 40, paddingHorizontal: 15, position: 'absolute', left: 0, top: StaticSafeAreaInsets.safeAreaInsetsTop}}>
                        <TouchableOpacity onPress = {() => this.setState({ mapModalVisible: false })}>
                            <Image style = {[styles.nav_button, {tintColor: Colors.main}]} source = {require('../assets/images/navbar_back.png')}></Image>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <View style = {{width: '100%', height: 40, backgroundColor: Colors.main, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity onPress = {() => this.props.navigation.goBack()}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_back.png')}></Image>
                    </TouchableOpacity>
                    <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{this.props.route.params.property_type == "my_property" ? strings.my_property : strings.property_for_sale}</Text>
                    <View style = {{height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center'}}>
                    {
                        this.state.property.owner_id == Global.USER_ID &&
                        <ModalDropdown 
                            dropdownStyle = {{width: 100, height: 40 * 2}}
                            defaultIndex = {0}
                            options = {[strings.edit, strings.delete]}
                            onSelect = {(index) => {
                                if(index == 0) {
                                    this.props.navigation.navigate("AddingNewPropertiesScreen", {data: this.state.property, refreshData: this.refreshData})
                                } else if(index == 1) {
                                    Alert.alert(strings.notice, strings.delete_property_message,
                                    [
                                        {text: 'OK', onPress: () => this.deleteProperty()},
                                        {text: 'Cancel', onPress: () => null},
                                    ],
                                        {cancelable: true}
                                    )
                                }
                            }}
                            renderButton = {() => {
                                return (
                                    <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                                        <Image style={{width: 25, height: 25, resizeMode: 'contain', tintColor: Colors.white}} source={require('../assets/images/menu_dark.png')}/>
                                    </View>
                                )
                            }}
                            renderRow = {(item, index, highlighted) => {
                                return (
                                    <View key = {index} style = {{width: 100, height: 40, justifyContent: 'center', paddingHorizontal: 10}}>
                                        <Text style = {[{fontSize: 16, color: Colors.text_main_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{item}</Text>
                                    </View>
                                )
                            }}
                        />
                    }
                    </View>
                </View>
                <ScrollView style = {{flex:1 , width: '100%', marginTop: 5}}>
                    <View style = {{width: '100%', aspectRatio: 1.2}}>
                    {
                        this.state.property.images.length > 0 &&
                        <FastImage style = {{width: '100%', height: '100%'}} resizeMode = {FastImage.resizeMode.cover} source = {{uri: this.state.property.images[this.state.selected_image_index].url}}></FastImage>
                    }
                    {
                        this.state.property.images.length == 0 &&
                        <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {require('../assets/images/empty_image.png')}></Image>
                    }
                    {
                        this.state.ribbon_text != "" &&
                        <View style = {{position: 'absolute', top: 20, right: 20, padding: 10, backgroundColor: Colors.main}}>
                            <Text style = {[{fontSize: 16, color: Colors.white,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{this.state.ribbon_text}</Text>
                        </View>
                    }
                    </View>
                    <View style = {{width: '100%', paddingHorizontal: 5, marginVertical: 5}}>
                        <ScrollView style = {{flex: 1, height: 100}} horizontal = {true}>
                        {
                            this.state.property.images.map((item, index) => 
                            <TouchableOpacity key = {index} style = {{height: '100%', aspectRatio: 1.3, marginRight: 5}} onPress = {() => this.setState({selected_image_index: index})}>
                                <FastImage style = {{width: '100%', height: '100%'}} resizeMode = {FastImage.resizeMode.cover} source = {{uri: item.url}}></FastImage>
                            </TouchableOpacity>
                            )
                        }
                        </ScrollView>
                    </View>
                    <View style = {[styles.item_view, {justifyContent: 'center'}]}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook, {fontSize: 14}]}>{this.state.property.name}</Text>
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
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.category == "RENT" ? strings.annual_rent : strings.price}</Text>
                        {
                            this.state.property.price && this.state.property.price != "" &&
                            <NumberFormat value={this.state.property.price} displayType={'text'} thousandSeparator={true} renderText={value => <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}> {value} {strings.sr}</Text>} />
                        }
                        {
                            !(this.state.property.price && this.state.property.price != "") &&
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}> {"0"} {strings.sr}</Text>
                        }
                    </View>
                {
                    this.state.property.type != "LAND" && this.state.property.type != "BUILDING" &&
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.area}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.area && this.state.property.area != '' ? this.state.property.area : "0"} M2</Text>
                    </View>
                }
                {
                    (this.state.property.type == "FLAT" || this.state.property.type == "VILLA") && 
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.room}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.room}</Text>
                    </View>
                }
                {
                    (this.state.property.type == "FLAT" || this.state.property.type == "VILLA") && 
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.bathrooms_count}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.bathrooms_count}</Text>
                    </View>
                }
                {
                    (this.state.property.type == "FLAT" || this.state.property.type == "VILLA") && 
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.unit_age}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.unit_age && this.state.property.unit_age != "" ? this.state.property.unit_age : "0"}</Text>
                    </View>
                }
                {
                    (this.state.property.type == "LAND" || this.state.property.type == "VILLA") &&
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.front}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.front_index != null ? this.state.front_array[this.state.property.front_index] : ""}</Text>
                    </View>
                }
                {
                    (this.state.property.type == "LAND" || this.state.property.type == "VILLA") &&
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.street_width}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.street_width && this.state.property.street_width != "" ? this.state.property.street_width : "0"}</Text>
                    </View>
                }
                {
                    (this.state.property.type == "LAND" || this.state.property.type == "VILLA") &&
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.overlooking_street_count}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.overlooking_street_count_index != null ? this.state.overlooking_street_count_array[this.state.property.overlooking_street_count_index] : ""}</Text>
                    </View>
                }
                {
                    this.state.property.type == "LAND" &&
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.lengths}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.lengths && this.state.property.lengths != "" ? this.state.property.lengths : "0"}</Text>
                    </View>
                }
                {
                    this.state.property.type == "LAND" &&
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.depth}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.depth && this.state.property.depth != "" ? this.state.property.depth : "0"}</Text>
                    </View>
                }
                {
                    this.state.property.type == "LAND" &&
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.land_permit}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.land_permit_index != null ? this.state.land_permit_array[this.state.property.land_permit_index] : ""}</Text>
                    </View>
                }
                {
                    (this.state.property.type == "VILLA" || this.state.property.type == "BUILDING") &&
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.floor_count}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.floor_count && this.state.property.floor_count != "" ? this.state.property.floor_count : "0"}</Text>
                    </View>
                }
                {
                    this.state.property.type == "BUILDING" &&
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.showrooms_count}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.showrooms_count && this.state.property.showrooms_count != "" ? this.state.property.showrooms_count : "0"}</Text>
                    </View>
                }
                {
                    this.state.property.type == "BUILDING" &&
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.office_count}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.office_count && this.state.property.office_count != "" ? this.state.property.office_count : "0"}</Text>
                    </View>
                }
                {
                    this.state.property.type == "BUILDING" &&
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.apartment_count}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.apartment_count && this.state.property.apartment_count != "" ? this.state.property.apartment_count : "0"}</Text>
                    </View>
                }
                {
                    this.state.property.type == "BUILDING" &&
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.building_age}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.building_age && this.state.property.building_age != "" ? this.state.property.building_age : "0"}</Text>
                    </View>
                }
                {
                    this.state.property.type == "BUILDING" && this.state.property.category == "RENT" &&
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.yearly_income}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.yearly_income && this.state.property.yearly_income != "" ? this.state.property.yearly_income : "0"}</Text>
                    </View>
                }
                {
                    (this.state.property.type == "FLAT" || this.state.property.type == "VILLA") && this.state.property.category == "RENT" &&
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.electricity_subs_num}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.electricity_subs_num && this.state.property.electricity_subs_num != "" ? this.state.property.electricity_subs_num : ""}</Text>
                    </View>
                }
                {
                    (this.state.property.type == "FLAT" || this.state.property.type == "VILLA") && this.state.property.category == "RENT" &&
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.water_subs_num}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.property.water_subs_num && this.state.property.water_subs_num != "" ? this.state.property.water_subs_num : ""}</Text>
                    </View>
                }
                
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.address}</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook, {flex: 1, paddingStart: 5, textAlign: 'right'}]}>{this.state.property.address && this.state.property.address != "" ? this.state.property.address : ""}</Text>
                    </View>
                {
                    (this.state.property.type == "FLAT" || this.state.property.type == "VILLA" || this.state.property.type == "BUILDING") && 
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.living_room_garage}</Text>
                        <Image style = {{width: 25, height: 25, resizeMode: 'contain'}} source = {this.state.property.garage == 1 ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}/>
                    </View>
                }
                {
                    (this.state.property.type == "FLAT" || this.state.property.type == "VILLA") && 
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.living_room_kitchen}</Text>
                        <Image style = {{width: 25, height: 25, resizeMode: 'contain'}} source = {this.state.property.kitchen == 1 ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}/>
                    </View>
                }
                {
                    (this.state.property.type == "FLAT" || this.state.property.type == "VILLA") && 
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.living_room_building_keeper}</Text>
                        <Image style = {{width: 25, height: 25, resizeMode: 'contain'}} source = {this.state.property.keeper == 1 ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}/>
                    </View>
                }
                {
                    (this.state.property.type == "FLAT" || this.state.property.type == "VILLA") && 
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.living_room_balcony}</Text>
                        <Image style = {{width: 25, height: 25, resizeMode: 'contain'}} source = {this.state.property.balcony == 1 ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}/>
                    </View>
                }
                {
                    (this.state.property.type == "FLAT" || this.state.property.type == "VILLA" || this.state.property.type == "BUILDING") && 
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.living_room_lift}</Text>
                        <Image style = {{width: 25, height: 25, resizeMode: 'contain'}} source = {this.state.property.lift == 1 ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}/>
                    </View>
                }
                {
                    (this.state.property.type == "FLAT" || this.state.property.type == "VILLA") && 
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.air_conditioning}</Text>
                        <Image style = {{width: 25, height: 25, resizeMode: 'contain'}} source = {this.state.property.air_conditioning == 1 ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}/>
                    </View>
                }
                {
                    (this.state.property.type == "FLAT" || this.state.property.type == "VILLA") && 
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.furnished}</Text>
                        <Image style = {{width: 25, height: 25, resizeMode: 'contain'}} source = {this.state.property.furnished == 1 ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}/>
                    </View>
                }    
                {
                    (this.state.property.type == "FLAT" || this.state.property.type == "VILLA") && 
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.gas}</Text>
                        <Image style = {{width: 25, height: 25, resizeMode: 'contain'}} source = {this.state.property.gas == 1 ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}/>
                    </View>
                }    
                {
                    (this.state.property.type == "FLAT" || this.state.property.type == "VILLA") && 
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.seperate_electricity}</Text>
                        <Image style = {{width: 25, height: 25, resizeMode: 'contain'}} source = {this.state.property.seperate_electricity == 1 ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}/>
                    </View>
                }
                {
                    (this.state.property.type == "FLAT" || this.state.property.type == "VILLA") && 
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.water}</Text>
                        <Image style = {{width: 25, height: 25, resizeMode: 'contain'}} source = {this.state.property.water == 1 ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}/>
                    </View>
                }
                {
                    this.state.property.type == "VILLA" && 
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.extension}</Text>
                        <Image style = {{width: 25, height: 25, resizeMode: 'contain'}} source = {this.state.property.extension == 1 ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}/>
                    </View>
                }
                {
                    this.state.property.type == "VILLA" && 
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.garden}</Text>
                        <Image style = {{width: 25, height: 25, resizeMode: 'contain'}} source = {this.state.property.garden == 1 ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}/>
                    </View>
                }
                {
                    this.state.property.type == "VILLA" && 
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.maid_room}</Text>
                        <Image style = {{width: 25, height: 25, resizeMode: 'contain'}} source = {this.state.property.maid_room == 1 ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}/>
                    </View>
                }
                {
                    this.state.property.type == "VILLA" && 
                    <View style = {styles.item_view}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.swimming_pool}</Text>
                        <Image style = {{width: 25, height: 25, resizeMode: 'contain'}} source = {this.state.property.swimming_pool == 1 ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}/>
                    </View>
                }
                    <View style = {{width: '100%', marginTop: 10, paddingHorizontal: 20, }}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.description}:</Text>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]} multiline = {true}>{this.state.property.description}:</Text>
                    </View>
                    <View style = {{width: '100%', marginTop: 10, alignItems: 'center'}}>
                        <TouchableOpacity style = {styles.contact_button} onPress = {() => this.contactCustomer()}>
                            <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.contact_custimer_support}</Text>
                        </TouchableOpacity>
                    </View>
                    
                {
                    this.state.rented_flag &&
                    <View style = {{width: '100%', alignItems: 'center', marginTop: 20}}>
                        <TouchableOpacity style = {styles.contact_button} onPress = {() => this.props.navigation.navigate("RenterDetailScreen", {property_id: this.state.property.id})}>
                            <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.show_renter_detail}</Text>
                        </TouchableOpacity>
                    </View>
                }
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
                                latitude: this.state.property.lat,
                                longitude: this.state.property.lng,
                                latitudeDelta: 0.1,
                                longitudeDelta: 0.1
                            }}
                            onMapReady={() => {
                                this.myMapView.animateToRegion({
                                    latitude: parseFloat(this.state.property.lat),
                                    longitude: parseFloat(this.state.property.lng),
                                    latitudeDelta: 0.1,
                                    longitudeDelta: 0.1
                                });
                            }}
                        >
                            <Marker
                                pinColor={Colors.blue}
                                coordinate={{latitude: parseFloat(this.state.property.lat), longitude: parseFloat(this.state.property.lng)}}
                                onPress = {(coord) => {
                                    if(Platform.OS == "ios") {
                                        this.mapActionSheet.show();
                                    } else if(Platform.OS == "android") {
                                        this.openMap("google_map");
                                    }
                                    // Permission.getUserLocation(
                                    //     position => {
                                    //         const { latitude, longitude } = position.coords;
                                    //         this.getRoute({latitude: latitude, longitude: longitude}, {latitude: this.state.property.lat, longitude: this.state.property.lng});
                                    //         const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                                    //         const latLng = `${latitude},${longitude}`;
                                    //         const label = 'My Location';
                                    //         var url = Platform.select({
                                    //             ios: `${scheme}${label}@${latLng}`,
                                    //             android: `${scheme}${latLng}(${label})`
                                    //         });
                                            
                                    //         if(Platform.OS == "android") {
                                    //             Linking.openURL(url); 
                                    //         } else {
                                    //             url = 'http://maps.google.com/maps?daddr=' + latitude + ',' + longitude;
                                    //             Linking.openURL(url).catch(err => console.error('An error occurred', err));
                                    //         }
                                    //     },
                                    //     error => { console.log("error") }
                                    // );
                                }}
                            />
                        </MapView>
                    </View>
                </ScrollView>
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
        borderBottomWidth: 1, 
        borderBottomColor: Colors.text_main_color, 
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