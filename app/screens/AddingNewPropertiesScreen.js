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
    Alert,
    Modal,
    I18nManager,
    NativeModules
 } from "react-native";

import { Colors } from '../utils/Colors'
import { strings } from "../strings";
import { stylesGlobal } from '../global/stylesGlobal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import StarRating from 'react-native-star-rating';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from '../components/react-native-actionsheet'
import ProgressIndicator from "../components/ProgressIndicator";
import * as Global from "../global/Global";
import WebService from "../utils/WebService";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Permission from "../utils/Permission";
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import ModalDropdown from '../components/ModalDropdown';
import ImageResizer from 'react-native-image-resizer';

var TAG = "AddingNewPropertiesScreen";

export default class AddingNewPropertiesScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            selected_category: 'FLAT', // flat, villa, land, building, compound, commercial_store, office, ranch
            property_name: "",
            price: "",
            address: "",
            city: "",
            latitude: 0,
            longitude: 0,
            temp_latitude: 0,
            temp_longitude: 0,
            room: "",
            area: "",
            electricity_subs_num: "",
            water_subs_num: "",
            description: "",
            living_room: "",
            on_garage: 0,
            on_kitchen: 0,
            on_buildingkeeper: 0,
            on_balcony: 0,
            on_lift: 0,
            unit_age: "",
            place_image_array: [],
            rent_sale_type: "RENT",

            bathrooms_count: "",
            front: "",
            front_index: 0,
            front_array: [strings.front_north, strings.front_south, strings.front_east, strings.front_west],
            front_array_en: ['northen', 'southern', 'eastern', 'western'],
            street_width: "",
            overlooking_street_count: "",
            overlooking_street_count_index: 0,
            overlooking_street_count_array: [strings.overlooking_street_count1, strings.overlooking_street_count2, strings.overlooking_street_count3, strings.overlooking_street_count4],
            overlooking_street_count_array_en: ['1 street', '2 street', '3 street', '4 street'],
            lengths: "",
            depth: "",
            land_permit: "",
            land_permit_index: 0,
            land_permit_array: [strings.land_permit_residential, strings.land_permit_commercial],
            land_permit_array_en: ['residential', 'commercial'],
            floor_count: "",
            showrooms_count: "",
            office_count: "",
            apartment_count: "",
            building_age: "",
            yearly_income: "",
            air_conditioning: 0,
            furnished: 0,
            gas: 0,
            seperate_electricity: 0,
            water: 0,
            extension: 0,
            garden: 0,
            maid_room: 0,
            swimming_pool: 0,



            mapModalVisible: false,
            edit_data: null, // property value when edit property
            delete_image_index: 0,
        }
    }

    UNSAFE_componentWillMount = async() => {

        if(this.props.route.params && this.props.route.params.data) {
            this.setState({
                edit_data: this.props.route.params.data
            }, () => {
                this.setState({
                    on_garage: this.state.edit_data.garage,
                    on_kitchen: this.state.edit_data.kitchen,
                    on_buildingkeeper: this.state.edit_data.keeper,
                    on_balcony: this.state.edit_data.balcony,
                    on_lift: this.state.edit_data.lift,
                    air_conditioning: this.state.edit_data.air_conditioning,
                    furnished: this.state.edit_data.furnished,
                    gas: this.state.edit_data.gas,
                    seperate_electricity: this.state.edit_data.seperate_electricity,
                    water: this.state.edit_data.water,
                    extension: this.state.edit_data.extension,
                    garden: this.state.edit_data.garden,
                    maid_room: this.state.edit_data.maid_room,
                    swimming_pool: this.state.edit_data.swimming_pool,
                })
                
                var place_image_array = [];
                for(i = 0; i < this.state.edit_data.images.length; i ++) {
                    place_image_array.push(this.state.edit_data.images[i].url)
                }
                this.setState({
                    property_name: this.state.edit_data.name || "",
                    selected_category: this.state.edit_data.type || "FLAT",
                    price: this.state.edit_data.price || "",
                    address: this.state.edit_data.address || "",
                    room: this.state.edit_data.room || "",
                    area: this.state.edit_data.area || "",
                    description: this.state.edit_data.description || "",
                    living_room: this.state.edit_data.living_room || "",
                    unit_age: this.state.edit_data.unit_age || "",
                    bathrooms_count: this.state.edit_data.bathrooms_count || "",
                    front: this.state.edit_data.front || this.state.front_array_en[0],
                    street_width: this.state.edit_data.street_width || "",
                    overlooking_street_count: this.state.edit_data.overlooking_street_count || this.state.overlooking_street_count_array_en[0],
                    lengths: this.state.edit_data.lengths || "",
                    depth: this.state.edit_data.depth || "",
                    land_permit: this.state.edit_data.land_permit || this.state.land_permit_array_en[0],
                    floor_count: this.state.edit_data.floor_count || "",
                    showrooms_count: this.state.edit_data.showrooms_count || "",
                    office_count: this.state.edit_data.office_count || "",
                    apartment_count: this.state.edit_data.apartment_count || "",
                    building_age: this.state.edit_data.building_age || "",
                    yearly_income: this.state.edit_data.yearly_income || "",


                    rent_sale_type: this.state.edit_data.category || "RENT",
                    place_image_array: place_image_array
                })
                for(var i = 0; i < this.state.front_array_en.length; i ++) {
                    if(this.state.edit_data.front == this.state.front_array_en[i]) {
                        this.setState({
                            front_index: i
                        })
                        break;
                    }
                }
                for(var i = 0; i < this.state.overlooking_street_count_array_en.length; i ++) {
                    if(this.state.edit_data.overlooking_street_count == this.state.overlooking_street_count_array_en[i]) {
                        this.setState({
                            overlooking_street_count_index: i
                        });
                        break;
                    }
                }
                for(var i = 0; i < this.state.land_permit_array_en.length; i ++) {
                    if(this.state.edit_data.land_permit == this.state.land_permit_array_en[i]) {
                        this.setState({
                            land_permit_index: i
                        });
                        break;
                    }
                }
                if(this.state.edit_data.lat && this.state.edit_data.lat != "" && this.state.edit_data.lng && this.state.edit_data.lng != "") {
                    this.setState({
                        latitude: parseFloat(this.state.edit_data.lat),
                        longitude: parseFloat(this.state.edit_data.lng),
                        temp_latitude: parseFloat(this.state.edit_data.lat),
                        temp_longitude: parseFloat(this.state.edit_data.lng),
                    })
                }
                if(this.state.edit_data.category == "RENT") {
                    this.setState({
                        electricity_subs_num: this.state.edit_data.electricity_subs_num,
                        water_subs_num: this.state.edit_data.water_subs_num,
                    })
                }
            })
        }
    }

    createNewProperty = async() => {
        try {
            if(this.state.property_name == "") {
                Alert.alert(strings.warnning, strings.property_name_error);
                return;
            }
            // if(this.state.price == "") {
            //     Alert.alert(strings.warnning, strings.property_price_error);
            //     return;
            // }
            // if(this.state.address == "") {
            //     Alert.alert(strings.warnning, strings.property_address_error);
            //     return;
            // }
            // if(this.state.room == "") {
            //     Alert.alert(strings.warnning, strings.property_room_error);
            //     return;
            // }
            // if(this.state.area == "") {
            //     Alert.alert(strings.warnning, strings.property_area_error);
            //     return;
            // }
            // if(this.state.electricity_subs_num == "") {
            //     Alert.alert(strings.warnning, strings.property_electricity_number_error);
            //     return;
            // }
            // if(this.state.water_subs_num == "") {
            //     Alert.alert(strings.warnning, strings.property_water_number_error);
            //     return;
            // }
            // if(this.state.living_room == "") {
            //     Alert.alert(strings.warnning, strings.property_living_room_error);
            //     return;
            // }
            // if(this.state.unit_age == "") {
            //     Alert.alert(strings.warnning, strings.property_unit_age_error);
            //     return;
            // }
            this.setState({
                loading: true,
            });

            let uri = Global.BASE_URL + "/api/property";
            if(this.state.edit_data != null) {
                uri += "/" + this.state.edit_data.id
            }
            let params = new FormData();
            params.append("name", this.state.property_name);
            params.append("type", this.state.selected_category);
            params.append("price", this.state.price);
            params.append("address", this.state.address);
            params.append("city", this.state.city);
            params.append("lat", this.state.latitude);
            params.append("lng", this.state.longitude);
            params.append("room", this.state.room);
            params.append("area", this.state.area);
            if(this.state.rent_sale_type == 'RENT') {
                params.append("electricity_subs_num", this.state.electricity_subs_num);
                params.append("water_subs_num", this.state.water_subs_num);
            }
            params.append("description", this.state.description);
            params.append("living_room", this.state.living_room);
            params.append("unit_age", this.state.unit_age);
            params.append("bathrooms_count", this.state.bathrooms_count);
            params.append("front", this.state.front);
            params.append("street_width", this.state.street_width);
            params.append("overlooking_street_count", this.state.overlooking_street_count);
            params.append("lengths", this.state.lengths);
            params.append("depth", this.state.depth);
            params.append("land_permit", this.state.land_permit);
            params.append("floor_count", this.state.floor_count);
            params.append("showrooms_count", this.state.showrooms_count);
            params.append("office_count", this.state.office_count);
            params.append("apartment_count", this.state.apartment_count);
            params.append("building_age", this.state.building_age);
            params.append("yearly_income", this.state.yearly_income);
            

            params.append("garage", this.state.on_garage);
            params.append("kitchen", this.state.on_kitchen);
            params.append("keeper", this.state.on_buildingkeeper);
            params.append("balcony", this.state.on_balcony);
            params.append("lift", this.state.on_lift);
            params.append("air_conditioning", this.state.air_conditioning);
            params.append("furnished", this.state.furnished);
            params.append("gas", this.state.gas);
            params.append("seperate_electricity", this.state.seperate_electricity);
            params.append("water", this.state.water);
            params.append("extension", this.state.extension);
            params.append("garden", this.state.garden);
            params.append("maid_room", this.state.maid_room);
            params.append("swimming_pool", this.state.swimming_pool);

            params.append("category", this.state.rent_sale_type);
            if(this.state.edit_data == null) {
                for(var i = 0; i < this.state.place_image_array.length; i ++) {
                    let localUriTypePart = this.state.place_image_array[i].split('.');
                    let fileType = localUriTypePart[localUriTypePart.length - 1];
                    const newImage = {
                        uri: this.state.place_image_array[i],
                        name: "property_image.png",
                        type: `image/${fileType}`,
                    }
                    params.append("image[]", newImage);
                }
            } else {
                var exist = false;
                for(var i = 0; i < this.state.place_image_array.length; i ++) {
                    exist = false;
                    for(var j = 0; j < this.state.edit_data.images.length; j ++) {
                        if(this.state.place_image_array[i] == this.state.edit_data.images[j].url) {
                            exist = true;
                            break;
                        }
                    }
                    if(!exist) {
                        let localUriTypePart = this.state.place_image_array[i].split('.');
                        let fileType = localUriTypePart[localUriTypePart.length - 1];
                        const newImage = {
                            uri: this.state.place_image_array[i],
                            name: "property_image.png",
                            type: `image/${fileType}`,
                        }
                        params.append("image[]", newImage);
                    }
                }
            }
                                    
            console.log(TAG + " callCreateNewPropertyAPI uri " + uri);
            console.log(TAG + " callCreateNewPropertyAPI params " + JSON.stringify(params));

            WebService.callServicePost(uri, params, this.handleCreateNewPropertyAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
            });
        }
    }

    handleCreateNewPropertyAPI = async(response, isError) => {
        console.log(TAG + " callCreateNewPropertyAPI Response " + JSON.stringify(response));
        console.log(TAG + " callCreateNewPropertyAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    // Alert.alert(strings.notice, this.state.edit_data == null ? strings.create_property_success : strings.edit_property_success);
                    if(this.props.route.params && this.props.route.params.refreshData) {
                        this.props.route.params.refreshData();
                    }
                    Alert.alert(strings.success, strings.add_property_success)
                    this.props.navigation.goBack();
                } else {
                    Alert.alert(strings.warnning, strings.api_error);
                }
            } else {
                Alert.alert(strings.warnning, strings.api_error);
            }
        } catch(error) {
            console.log("create new  properties catch error", error);
            Alert.alert(strings.warnning, strings.network_error);
        }
        this.setState({
            loading: false
        })
    }

    getPlaceAddress = async() => {
        this.setState({
            loading: true
        })
        var parameter = "";
        let languageCode = Platform.OS === 'ios'
                ? NativeModules.SettingsManager.settings.AppleLocale ||
                NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
                : NativeModules.I18nManager.localeIdentifier;
        if (languageCode == "en") {
            parameter = "latlng=" + this.state.temp_latitude + "," + this.state.temp_longitude + "&key=" + Permission.GoogleMapiAPIKey;
        } else {
            parameter = "latlng=" + this.state.temp_latitude + "," + this.state.temp_longitude + "&language=ar&key=" + Permission.GoogleMapiAPIKey;
        }

        parameter = "latlng=" + this.state.latitude + "," + this.state.longitude + "&language=" + languageCode + "&key=" + Permission.GoogleMapiAPIKey;
    
        console.log(parameter)
        await fetch("https://maps.googleapis.com/maps/api/geocode/json?" + parameter, {
            method: "GET",
        })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            console.log(JSON.stringify(responseData));
            if(responseData.status != "OK") {
                Alert.alert("Warning!", "Error occurred in getting address. Please try again.")
            } else {
                if(responseData.results.length > 0) {
                    this.setState({
                        address: responseData.results[0].formatted_address,
                        mapModalVisible: false
                    })

                    for(var i = 0; i < responseData.results[0].address_components.length; i ++) {
                        if(responseData.results[0].address_components[i].types.includes('sublocality')) {
                            this.setState({
                                city: responseData.results[0].address_components[i].long_name
                            })
                            break;
                        }
                    }
                }
            }
        })
        .catch(error => {
            console.log(error)
        });
    
        this.setState({
            loading: false
        })
    }

    deleteImage = (index) => {
        
        if(this.state.edit_data == null) {
            var place_image_array = this.state.place_image_array;
            place_image_array.splice(index, 1);
            this.setState({
                place_image_array: place_image_array
            })
        } else {
            try {
                this.setState({
                    loading: true,
                    delete_image_index: index
                })
                var uri = Global.BASE_URL + "/api/property_image/" + this.state.edit_data.images[index].id;
                
                console.log(TAG + " callDeletePropertyImageAPI uri " + uri);
    
                WebService.callServiceDelete(uri, this.handleDeletePropertyImageAPI);
            } catch (error) {
                console.log(error)
                this.setState({
                    loading: false
                })
            }
        }
    }

    handleDeletePropertyImageAPI = async(response, isError) => {
        console.log(TAG + " callDeletePropertyImageAPI Response " + JSON.stringify(response));
        console.log(TAG + " callDeletePropertyImageAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    var place_image_array = this.state.place_image_array;
                    place_image_array.splice(this.state.delete_image_index, 1)
                    var edit_data = this.state.edit_data;
                    edit_data.images.splice(this.state.delete_image_index, 1);
                    this.setState({
                        place_image_array: place_image_array,
                        edit_data: edit_data
                    })
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

    render() {
        return (
            <SafeAreaView style = {{flex: 1, backgroundColor: Colors.main_bg_color, justifyContent: 'center', alignItems: 'center'}}>
            {
                this.state.loading &&
                <ProgressIndicator/>
            }
                <ActionSheet
                    ref={o => this.SelectImageActionSheet = o}
                    title={strings.select_image}
                    options={[strings.take_photo, strings.open_library, strings.cancel]}
                    cancelButtonIndex={2}
                    // destructiveButtonIndex={1}
                    onPress={(index) => { 
                        if(index == 0) {
                            ImagePicker.openCamera({
                                cropping: false,
                            }).then(image => {
                                ImageResizer.createResizedImage(image.path, 500, 500, 'JPEG', 100, 0)
                                .then(response => {
                                    var place_image_array = this.state.place_image_array;
                                    place_image_array.push(response.path);
                                    this.setState({
                                        place_image_array: place_image_array
                                    })
                                })
                                .catch(err => {
                                    // Oops, something went wrong. Check that the filename is correct and
                                    // inspect err to get more details.
                                });
                                
                            });
                        } else if(index == 1) {
                            ImagePicker.openPicker({
                                cropping: false,
                                multiple: true,
                                maxFiles: 10
                            }).then(async(images) => {
                                var place_image_array = this.state.place_image_array;
                                for(var i = 0; i < images.length; i ++) {
                                    await ImageResizer.createResizedImage(images[i].path, 500, 500, 'JPEG', 100, 0)
                                    .then(async (response) => {
                                        place_image_array.push(response.path);
                                    })
                                    .catch(err => {
                                        // Oops, something went wrong. Check that the filename is correct and
                                        // inspect err to get more details.
                                    });
                                }
                                this.setState({
                                    place_image_array: place_image_array
                                })
                            });
                        }
                    }}
                />
                <Modal animationType="fade" transparent={false} visible={this.state.mapModalVisible}>
                    <MapView
                        provider = {PROVIDER_GOOGLE}
                        ref={ref => (this.myMapView = ref)}
                        showsUserLocation
                        showsMyLocationButton
                        style={{ flex: 1, width: '100%' }}
                        initialRegion={{
                            longitude: 24.7136,
                            latitude: 46.6753,
                            latitudeDelta: 0.03,
                            longitudeDelta: 0.03
                        }}
                        onMapReady={() => {
                            if(this.state.latitude == 0 && this.state.longitude == 0) {
                                Permission.getUserLocation(
                                    position => {
                                        const { latitude, longitude } = position.coords;
                                        
                                        this.myMapView.animateToRegion({
                                            latitude,
                                            longitude,
                                            latitudeDelta: 0.01,
                                            longitudeDelta: 0.01,
                                        });
                                        // todo: GeoCoding coords
                                        this.setState({
                                            temp_latitude: latitude,
                                            temp_longitude: longitude
                                        });
                                    },
                                    error => { console.log("error") }
                                );
                            } else {
                                this.myMapView.animateToRegion({
                                    latitude: this.state.latitude,
                                    longitude: this.state.longitude,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                });
                            }
                        }}
                        onRegionChangeComplete={region => {
                            const { latitude, longitude } = region;
                            this.setState({
                                temp_latitude: latitude,
                                temp_longitude: longitude
                            })
                        }}
                    >
                        <Marker
                            pinColor={Colors.blue}
                            coordinate={{latitude: this.state.temp_latitude, longitude: this.state.temp_longitude} || { longitude: 45, latitude: 25 }}
                        />
                    </MapView>
                    <View style = {{width: '100%', position: 'absolute', left: 0, top: StaticSafeAreaInsets.safeAreaInsetsTop}}>
                        <View style = {styles.nav_bar}>
                            <TouchableOpacity onPress = {() => this.setState({ mapModalVisible: false })}>
                                <Image style = {styles.nav_button} source = {require('../assets/images/navbar_back.png')}></Image>
                            </TouchableOpacity>
                            <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.welcome_place} {Global.FULLNAME}</Text>
                            <View style = {{width: 25}}></View>
                        </View>
                        <View style = {[styles.nav_bar, {justifyContent: 'center', backgroundColor: Colors.main_bg_color}]}>
                            <Text style = {[{fontSize: 14, color: Colors.text_main_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.location_map}</Text>
                        </View>
                    </View>
                    <View style = {{width: '60%', position: 'absolute', left: Dimensions.get('screen').width * 0.2, bottom: StaticSafeAreaInsets.safeAreaInsetsBottom + 5, alignItems: 'center'}}>
                        <TouchableOpacity style = {[styles.add_button, {width: '100%'}]} 
                            onPress = {() => {
                                this.setState({
                                    latitude: this.state.temp_latitude,
                                    longitude: this.state.temp_longitude
                                }, () => this.getPlaceAddress())
                            }}
                        >
                            <Text style = {[styles.action_button_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.continue}</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <View style = {styles.nav_bar}>
                    <TouchableOpacity onPress = {() => {
                        if(this.props.route.params && this.props.route.params.refreshData) {
                            this.props.route.params.refreshData();
                        }
                        this.props.navigation.goBack();
                    }}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_back.png')}></Image>
                    </TouchableOpacity>
                    <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{this.props.route.params && this.props.route.params.data ? strings.edit_property :strings.add_new_property}</Text>
                    {/* <TouchableOpacity>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_setting.png')}></Image>
                    </TouchableOpacity> */}
                    <View></View>
                </View>
                <View style = {{flex:1 , width: '100%', backgroundColor: Colors.main_bg_color, alignItems: 'center', paddingHorizontal: 15}}>
                    <KeyboardAwareScrollView style = {{width: '100%'}} extraHeight = {20}>
                        <View style = {{width: '100%', alignItems: 'center'}}>
                            
                            <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoMedium_Medium, {marginVertical: 20, fontSize: 14}]}>{strings.property_type}</Text>
                            <View style = {{width: '100%'}}>
                                <View style = {{width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                                    <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.selected_category == "FLAT" ? Colors.text_main_color : Colors.white}]} onPress = {() => this.setState({selected_category: "FLAT"})}>
                                        <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.selected_category == "FLAT" ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_flat}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.selected_category == "VILLA" ? Colors.text_main_color : Colors.white}]} onPress = {() => this.setState({selected_category: "VILLA"})}>
                                        <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.selected_category == "VILLA" ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_vila}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.selected_category == "LAND" ? Colors.text_main_color : Colors.white}]} onPress = {() => this.setState({selected_category: "LAND"})}>
                                        <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.selected_category == "LAND" ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_land}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.selected_category == "BUILDING" ? Colors.text_main_color : Colors.white}]} onPress = {() => this.setState({selected_category: "BUILDING"})}>
                                        <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.selected_category == "BUILDING" ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_building}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style = {{width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 15}}>
                                    <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.selected_category == "COMPOUND" ? Colors.text_main_color : Colors.white}]} onPress = {() => this.setState({selected_category: "COMPOUND"})}>
                                        <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.selected_category == "COMPOUND" ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_compound}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.selected_category == "COMMERCIAL_STORE" ? Colors.text_main_color : Colors.white}]} onPress = {() => this.setState({selected_category: "COMMERCIAL_STORE"})}>
                                        <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.selected_category == "COMMERCIAL_STORE" ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_commercial_store}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.selected_category == "OFFICE" ? Colors.text_main_color : Colors.white}]} onPress = {() => this.setState({selected_category: "OFFICE"})}>
                                        <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.selected_category == "OFFICE" ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_office}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.selected_category == "FARM" ? Colors.text_main_color : Colors.white}]} onPress = {() => this.setState({selected_category: "FARM"})}>
                                        <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.selected_category == "FARM" ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_ranch}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style = {{width: '100%', alignItems: 'center', marginTop: 25, flexDirection: 'row', justifyContent: 'space-around'}}>
                                <TouchableOpacity style = {{alignItems: 'center', flexDirection: 'row'}} onPress = {() => this.setState({rent_sale_type: 'RENT'})}>
                                    <Image style = {styles.cate_option_image} source = {this.state.rent_sale_type == 'RENT' ? require("../assets/images/remember_select.png") : require("../assets/images/remember_unselect.png")}></Image>
                                    <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.rent}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style = {{alignItems: 'center', flexDirection: 'row'}} onPress = {() => this.setState({rent_sale_type: 'SALE'})}>
                                    <Image style = {styles.cate_option_image} source = {this.state.rent_sale_type == 'SALE' ? require("../assets/images/remember_select.png") : require("../assets/images/remember_unselect.png")}></Image>
                                    <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.sale}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style = {{width: '100%', marginTop: 20}}>
                                <View style = {{width: '100%', marginTop: 10, alignItems: 'flex-start'}}>
                                    <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.property_name}</Text>
                                    <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} placeholder = {strings.property_name} onChangeText = {(text) => this.setState({property_name: text})}>{this.state.property_name}</TextInput>
                                </View>
                                <View style = {{width: '100%', justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap'}}>
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{this.state.rent_sale_type == 'SALE' ? strings.price : strings.annual_rent}</Text>
                                        <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'decimal-pad'} placeholder = {strings.price} onChangeText = {(text) => this.setState({price: text})}>{this.state.price}</TextInput>
                                    </View>
                                {
                                    this.state.selected_category != "LAND" && this.state.selected_category != "BUILDING" && 
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.area}</Text>
                                        <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'decimal-pad'} placeholder = {strings.area} onChangeText = {(text) => this.setState({area: text})}>{this.state.area}</TextInput>
                                    </View>
                                }
                                {
                                    (this.state.selected_category == "FLAT" || this.state.selected_category == "VILLA") && 
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.room}</Text>
                                        <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'number-pad'} placeholder = {strings.room} onChangeText = {(text) => this.setState({room: text})}>{this.state.room}</TextInput>
                                    </View>
                                }
                                {
                                    (this.state.selected_category == "FLAT" || this.state.selected_category == "VILLA") && 
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.bathrooms_count}</Text>
                                        <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'number-pad'} placeholder = {strings.bathrooms_count} onChangeText = {(text) => this.setState({bathrooms_count: text})}>{this.state.bathrooms_count}</TextInput>
                                    </View>
                                }
                                {
                                    (this.state.selected_category == "FLAT" || this.state.selected_category == "VILLA") && 
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.unit_age}</Text>
                                        <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'number-pad'} placeholder = {strings.unit_age} onChangeText = {(text) => this.setState({unit_age: text})}>{this.state.unit_age}</TextInput>
                                    </View>
                                }
                                {
                                    (this.state.selected_category == "LAND" || this.state.selected_category == "VILLA") &&
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.front}</Text>
                                        {/* <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'number-pad'} placeholder = {strings.front} onChangeText = {(text) => this.setState({front: text})}>{this.state.front}</TextInput> */}
                                        <ModalDropdown 
                                            style = {styles.text_input}
                                            dropdownStyle = {{width: 150, height: 30 * 4}}
                                            defaultIndex = {this.state.front_index}
                                            options = {this.state.front_array}
                                            onSelect = {(index) => {
                                                this.setState({
                                                    front_index: index,
                                                    front: this.state.front_array_en[index]
                                                });
                                            }}
                                            renderButton = {() => {
                                                return (
                                                    <View style={{ width: 150, height: 30, justifyContent: 'center', paddingHorizontal: 10, alignItems: 'flex-start'}}>
                                                        <Text style = {[styles.common_text, stylesGlobal.font_GESndBook]}>{this.state.front_array[this.state.front_index]}</Text>
                                                    </View>
                                                )
                                            }}
                                            renderRow = {(item, index, highlighted) => {
                                                return (
                                                    <View key = {index} style = {{width: 150, height: 30, justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 10}}>
                                                        <Text style = {[styles.common_text, stylesGlobal.font_GESndBook]}>{item}</Text>
                                                    </View>
                                                )
                                            }}
                                        />
                                    </View>
                                }
                                {
                                    (this.state.selected_category == "LAND" || this.state.selected_category == "VILLA") &&
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.street_width}</Text>
                                        <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'number-pad'} placeholder = {strings.street_width} onChangeText = {(text) => this.setState({street_width: text})}>{this.state.street_width}</TextInput>
                                    </View>
                                }
                                {
                                    (this.state.selected_category == "LAND" || this.state.selected_category == "VILLA") &&
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.overlooking_street_count}</Text>
                                        <ModalDropdown 
                                            style = {styles.text_input}
                                            dropdownStyle = {{width: 150, height: 30 * 4}}
                                            defaultIndex = {this.state.overlooking_street_count_index}
                                            options = {this.state.overlooking_street_count_array}
                                            onSelect = {(index) => {
                                                this.setState({
                                                    overlooking_street_count_index: index,
                                                    overlooking_street_count: this.state.overlooking_street_count_array_en[index]
                                                });
                                            }}
                                            renderButton = {() => {
                                                return (
                                                    <View style={{ width: 150, height: 30, justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 10}}>
                                                        <Text style = {[styles.common_text, stylesGlobal.font_GESndBook]}>{this.state.overlooking_street_count_array[this.state.overlooking_street_count_index]}</Text>
                                                    </View>
                                                )
                                            }}
                                            renderRow = {(item, index, highlighted) => {
                                                return (
                                                    <View key = {index} style = {{width: 150, height: 30, justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 10}}>
                                                        <Text style = {[styles.common_text, stylesGlobal.font_GESndBook]}>{item}</Text>
                                                    </View>
                                                )
                                            }}
                                        />
                                    </View>
                                }
                                {
                                    this.state.selected_category == "LAND" &&
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.lengths}</Text>
                                        <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'ascii-capable'} placeholder = {strings.lengths} onChangeText = {(text) => this.setState({lengths: text})}>{this.state.lengths}</TextInput>
                                    </View>
                                }
                                {
                                    this.state.selected_category == "LAND" &&
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.depth}</Text>
                                        <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'number-pad'} placeholder = {strings.depth} onChangeText = {(text) => this.setState({depth: text})}>{this.state.depth}</TextInput>
                                    </View>
                                }
                                {
                                    this.state.selected_category == "LAND" &&
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.land_permit}</Text>
                                        <ModalDropdown 
                                            style = {styles.text_input}
                                            dropdownStyle = {{width: 150, height: 30 * 2}}
                                            defaultIndex = {this.state.land_permit_index}
                                            options = {this.state.land_permit_array}
                                            onSelect = {(index) => {
                                                this.setState({
                                                    land_permit_index: index,
                                                    land_permit: this.state.land_permit_array_en[index]
                                                });
                                            }}
                                            renderButton = {() => {
                                                return (
                                                    <View style={{ width: 150, height: 30, justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 10}}>
                                                        <Text style = {[styles.common_text, stylesGlobal.font_GESndBook]}>{this.state.land_permit_array[this.state.land_permit_index]}</Text>
                                                    </View>
                                                )
                                            }}
                                            renderRow = {(item, index, highlighted) => {
                                                return (
                                                    <View key = {index} style = {{width: 150, height: 30, justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 10}}>
                                                        <Text style = {[styles.common_text, stylesGlobal.font_GESndBook]}>{item}</Text>
                                                    </View>
                                                )
                                            }}
                                        />
                                        {/* <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'number-pad'} placeholder = {strings.street_width} onChangeText = {(text) => this.setState({street_width: text})}>{this.state.street_width}</TextInput> */}
                                    </View>
                                }
                                {
                                    (this.state.selected_category == "VILLA" || this.state.selected_category == "BUILDING") &&
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.floor_count}</Text>
                                        <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'number-pad'} placeholder = {strings.floor_count} onChangeText = {(text) => this.setState({floor_count: text})}>{this.state.floor_count}</TextInput>
                                    </View>
                                }
                                {
                                    this.state.selected_category == "BUILDING" &&
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.showrooms_count}</Text>
                                        <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'number-pad'} placeholder = {strings.showrooms_count} onChangeText = {(text) => this.setState({showrooms_count: text})}>{this.state.showrooms_count}</TextInput>
                                    </View>
                                }
                                {
                                    this.state.selected_category == "BUILDING" &&
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.office_count}</Text>
                                        <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'number-pad'} placeholder = {strings.office_count} onChangeText = {(text) => this.setState({office_count: text})}>{this.state.office_count}</TextInput>
                                    </View>
                                }
                                {
                                    this.state.selected_category == "BUILDING" &&
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.apartment_count}</Text>
                                        <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'number-pad'} placeholder = {strings.apartment_count} onChangeText = {(text) => this.setState({apartment_count: text})}>{this.state.apartment_count}</TextInput>
                                    </View>
                                }
                                {
                                    this.state.selected_category == "BUILDING" &&
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.building_age}</Text>
                                        <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'number-pad'} placeholder = {strings.building_age} onChangeText = {(text) => this.setState({building_age: text})}>{this.state.building_age}</TextInput>
                                    </View>
                                }
                                {
                                    this.state.selected_category == "BUILDING" && this.state.rent_sale_type == "RENT" &&
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.yearly_income}</Text>
                                        <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'number-pad'} placeholder = {strings.yearly_income} onChangeText = {(text) => this.setState({yearly_income: text})}>{this.state.yearly_income}</TextInput>
                                    </View>
                                }
                                {
                                    (this.state.selected_category == "FLAT" || this.state.selected_category == "VILLA") && this.state.rent_sale_type == "RENT" &&
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.electricity_subs_num}</Text>
                                        <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'number-pad'} placeholder = {strings.electricity_subs_num} onChangeText = {(text) => this.setState({electricity_subs_num: text})}>{this.state.electricity_subs_num}</TextInput>
                                    </View>
                                }
                                {
                                    (this.state.selected_category == "FLAT" || this.state.selected_category == "VILLA") && this.state.rent_sale_type == "RENT" &&
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.water_subs_num}</Text>
                                        <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} keyboardType = {'number-pad'} placeholder = {strings.water_subs_num} onChangeText = {(text) => this.setState({water_subs_num: text})}>{this.state.water_subs_num}</TextInput>
                                    </View>
                                }
                                
                                    <View style = {styles.input_item_view}>
                                        <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.address}</Text>
                                        <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook]} placeholder = {strings.address} editable = {false} pointerEvents="none">{this.state.address}</TextInput>
                                    </View>
                                </View>
                                <View style = {{width: '100%', marginTop: 10, alignItems: 'flex-start'}}>
                                    <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.description}</Text>
                                    <TextInput style = {[styles.common_text, styles.text_input, stylesGlobal.font_GESndBook, {height: 60, textAlignVertical: "top", paddingVertical: 5}]} placeholder = {strings.description} multiline = {true} onChangeText = {(text) => this.setState({description: text})}>{this.state.description}</TextInput>
                                </View> 
                            </View>
                            <View style = {{width: '100%', justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap', marginTop: 10}}>
                            {
                                (this.state.selected_category == "FLAT" || this.state.selected_category == "VILLA" || this.state.selected_category == "BUILDING") &&
                                <TouchableOpacity style = {[styles.room_type_button]} 
                                    onPress = {() => {
                                        if(this.state.on_garage == 0) {
                                            this.setState({on_garage: 1})
                                        } else {
                                            this.setState({on_garage: 0})
                                        }
                                    }}
                                >
                                    <Image style = {styles.room_type_icon} source = {this.state.on_garage ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}></Image>
                                    <Text style = {[styles.room_type_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.living_room_garage}</Text>
                                </TouchableOpacity>
                            }
                            {
                                (this.state.selected_category == "FLAT" || this.state.selected_category == "VILLA") &&
                                <TouchableOpacity style = {styles.room_type_button} 
                                    onPress = {() => {
                                        if(this.state.on_kitchen == 0) {
                                            this.setState({on_kitchen: 1})
                                        } else {
                                            this.setState({on_kitchen: 0})
                                        }
                                    }}
                                >
                                    <Image style = {styles.room_type_icon} source = {this.state.on_kitchen ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}></Image>
                                    <Text style = {[styles.room_type_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.living_room_kitchen}</Text>
                                </TouchableOpacity>
                            }
                            {
                                (this.state.selected_category == "FLAT" || this.state.selected_category == "VILLA") &&
                                <TouchableOpacity style = {styles.room_type_button} 
                                    onPress = {() => {
                                        if(this.state.on_buildingkeeper == 0) {
                                            this.setState({on_buildingkeeper: 1})
                                        } else {
                                            this.setState({on_buildingkeeper: 0})
                                        }
                                    }}
                                >
                                    <Image style = {styles.room_type_icon} source = {this.state.on_buildingkeeper ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}></Image>
                                    <Text style = {[styles.room_type_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.living_room_building_keeper}</Text>
                                </TouchableOpacity>
                            }
                            {
                                (this.state.selected_category == "FLAT" || this.state.selected_category == "VILLA") &&
                                <TouchableOpacity style = {styles.room_type_button} 
                                    onPress = {() => {
                                        if(this.state.on_balcony == 0) {
                                            this.setState({on_balcony: 1})
                                        } else {
                                            this.setState({on_balcony: 0})
                                        }
                                    }}
                                >
                                    <Image style = {styles.room_type_icon} source = {this.state.on_balcony ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}></Image>
                                    <Text style = {[styles.room_type_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.living_room_balcony}</Text>
                                </TouchableOpacity>
                            }
                            {
                                (this.state.selected_category == "FLAT" || this.state.selected_category == "VILLA" || this.state.selected_category == "BUILDING") &&
                                <TouchableOpacity style = {styles.room_type_button} 
                                    onPress = {() => {
                                        if(this.state.on_lift == 0) {
                                            this.setState({on_lift: 1})
                                        } else {
                                            this.setState({on_lift: 0})
                                        }
                                    }}
                                >
                                    <Image style = {styles.room_type_icon} source = {this.state.on_lift ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}></Image>
                                    <Text style = {[styles.room_type_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.living_room_lift}</Text>
                                </TouchableOpacity>
                            }
                            {
                                (this.state.selected_category == "FLAT" || this.state.selected_category == "VILLA") &&
                                <TouchableOpacity style = {styles.room_type_button} 
                                    onPress = {() => {
                                        if(this.state.air_conditioning == 0) {
                                            this.setState({air_conditioning: 1})
                                        } else {
                                            this.setState({air_conditioning: 0})
                                        }
                                    }}
                                >
                                    <Image style = {styles.room_type_icon} source = {this.state.air_conditioning ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}></Image>
                                    <Text style = {[styles.room_type_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.air_conditioning}</Text>
                                </TouchableOpacity>
                            }
                            {
                                (this.state.selected_category == "FLAT" || this.state.selected_category == "VILLA") &&
                                <TouchableOpacity style = {styles.room_type_button} 
                                    onPress = {() => {
                                        if(this.state.furnished == 0) {
                                            this.setState({furnished: 1})
                                        } else {
                                            this.setState({furnished: 0})
                                        }
                                    }}
                                >
                                    <Image style = {styles.room_type_icon} source = {this.state.furnished ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}></Image>
                                    <Text style = {[styles.room_type_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.furnished}</Text>
                                </TouchableOpacity>
                            }
                            {
                                (this.state.selected_category == "FLAT" || this.state.selected_category == "VILLA") &&
                                <TouchableOpacity style = {styles.room_type_button} 
                                    onPress = {() => {
                                        if(this.state.gas == 0) {
                                            this.setState({gas: 1})
                                        } else {
                                            this.setState({gas: 0})
                                        }
                                    }}
                                >
                                    <Image style = {styles.room_type_icon} source = {this.state.gas ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}></Image>
                                    <Text style = {[styles.room_type_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.gas}</Text>
                                </TouchableOpacity>
                            }
                            {
                                (this.state.selected_category == "FLAT" || this.state.selected_category == "VILLA") &&
                                <TouchableOpacity style = {styles.room_type_button} 
                                    onPress = {() => {
                                        if(this.state.seperate_electricity == 0) {
                                            this.setState({seperate_electricity: 1})
                                        } else {
                                            this.setState({seperate_electricity: 0})
                                        }
                                    }}
                                >
                                    <Image style = {styles.room_type_icon} source = {this.state.seperate_electricity ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}></Image>
                                    <Text style = {[styles.room_type_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.seperate_electricity}</Text>
                                </TouchableOpacity>
                            }
                            {
                                (this.state.selected_category == "FLAT" || this.state.selected_category == "VILLA") &&
                                <TouchableOpacity style = {styles.room_type_button} 
                                    onPress = {() => {
                                        if(this.state.water == 0) {
                                            this.setState({water: 1})
                                        } else {
                                            this.setState({water: 0})
                                        }
                                    }}
                                >
                                    <Image style = {styles.room_type_icon} source = {this.state.water ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}></Image>
                                    <Text style = {[styles.room_type_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.water}</Text>
                                </TouchableOpacity>
                            }
                            {
                                this.state.selected_category == "VILLA" &&
                                <TouchableOpacity style = {styles.room_type_button} 
                                    onPress = {() => {
                                        if(this.state.extension == 0) {
                                            this.setState({extension: 1})
                                        } else {
                                            this.setState({extension: 0})
                                        }
                                    }}
                                >
                                    <Image style = {styles.room_type_icon} source = {this.state.extension ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}></Image>
                                    <Text style = {[styles.room_type_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.extension}</Text>
                                </TouchableOpacity>
                            }
                            {
                                this.state.selected_category == "VILLA" &&
                                <TouchableOpacity style = {styles.room_type_button} 
                                    onPress = {() => {
                                        if(this.state.garden == 0) {
                                            this.setState({garden: 1})
                                        } else {
                                            this.setState({garden: 0})
                                        }
                                    }}
                                >
                                    <Image style = {styles.room_type_icon} source = {this.state.garden ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}></Image>
                                    <Text style = {[styles.room_type_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.garden}</Text>
                                </TouchableOpacity>
                            }
                            {
                                this.state.selected_category == "VILLA" &&
                                <TouchableOpacity style = {styles.room_type_button} 
                                    onPress = {() => {
                                        if(this.state.maid_room == 0) {
                                            this.setState({maid_room: 1})
                                        } else {
                                            this.setState({maid_room: 0})
                                        }
                                    }}
                                >
                                    <Image style = {styles.room_type_icon} source = {this.state.maid_room ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}></Image>
                                    <Text style = {[styles.room_type_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.maid_room}</Text>
                                </TouchableOpacity>
                            }
                            {
                                this.state.selected_category == "VILLA" &&
                                <TouchableOpacity style = {styles.room_type_button} 
                                    onPress = {() => {
                                        if(this.state.swimming_pool == 0) {
                                            this.setState({swimming_pool: 1})
                                        } else {
                                            this.setState({swimming_pool: 0})
                                        }
                                    }}
                                >
                                    <Image style = {styles.room_type_icon} source = {this.state.swimming_pool ? require('../assets/images/property_check.png') : require('../assets/images/property_uncheck.png')}></Image>
                                    <Text style = {[styles.room_type_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.swimming_pool}</Text>
                                </TouchableOpacity>
                            }
                            </View>
                        {
                            this.state.place_image_array.length > 0 &&
                            <View style = {{width: '100%', marginTop: 15}}>
                                <ScrollView style = {{height: 60}} horizontal = {true}>
                                {
                                    this.state.place_image_array.map((item, index) =>
                                    <View key = {index} style = {{height: '100%', aspectRatio: 1.3, marginRight: 10}}>
                                    {
                                        item == "" &&
                                        <Image style = {{width: '100%', height: '100%', resizeMode: 'cover', }} source = {require('../assets/images/empty_image.png')}></Image>
                                    }
                                    {
                                        item != "" &&
                                        <Image style = {{width: '100%', height: '100%', resizeMode: 'cover'}} source = {{uri: item}}></Image>
                                    }
                                        <TouchableOpacity style = {{width: 15, height: 15, position: 'absolute', top: 0, right: 0}} onPress = {() => this.deleteImage(index)}>
                                            <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {require('../assets/images/property_uncheck.png')}></Image>
                                        </TouchableOpacity>
                                    </View>
                                    )
                                }
                                </ScrollView>
                            </View>
                        }
                            <View style = {{width: '100%', alignItems: 'center', marginTop: 10}}>
                                <Text style = {[styles.common_text, stylesGlobal.font_GESSTwoLight_Light]}>{strings.upload_photo}</Text>
                                <TouchableOpacity style = {[styles.add_button, {marginTop: 10, marginBottom: 0}]} onPress = {() => this.SelectImageActionSheet.show()}>
                                    <Text style = {[styles.action_button_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.select_image}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style = {{width: '100%', alignItems: 'center', marginTop: 25}}>
                                <TouchableOpacity style = {styles.add_button} onPress = {() => this.setState({mapModalVisible: true})}>
                                    <Text style = {[styles.action_button_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.location_map}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style = {{width: '100%', alignItems: 'center', marginTop: 20}}>
                                <TouchableOpacity style = {styles.add_button} onPress = {() => this.createNewProperty()}>
                                    <Text style = {[styles.action_button_text, stylesGlobal.font_GESSTwoMedium_Medium]}>{this.state.edit_data == null ? strings.add : strings.save_changes}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    nav_bar: {
        width: '100%', 
        height: 40, 
        backgroundColor: Colors.main, 
        paddingHorizontal: 15, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
    nav_button: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    common_text: {
        fontSize: 12, 
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
    input_item_view: {
        width: '48%',
        marginTop: 10,
        alignItems: 'flex-start'
    },
    text_input: {
        width: '100%', 
        height: 30, 
        paddingVertical: 0, 
        paddingHorizontal: 10, 
        backgroundColor: Colors.white, 
        marginTop: 5,
        textAlign: I18nManager.isRTL ? 'right' : 'left'
    },
    room_buttons_container_view: {
        width: '100%', 
        paddingVertical: 5, 
        paddingHorizontal: 10, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        borderBottomWidth: 1, 
        borderColor: Colors.text_main_color
    },
    room_type_button: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        width: '30%',
        marginTop: 10,
    },
    living_room_count_textinput: {
        width: 100, 
        height: 25, 
        backgroundColor: Colors.white, 
        paddingVertical: 0, 
        paddingHorizontal: 5,
        textAlign: I18nManager.isRTL ? 'right' : 'left'
    },
    room_type_icon: {
        width: 25, 
        height: 25, 
        resizeMode: 'contain', 
        marginHorizontal: 5
    },
    room_type_text: {
        fontSize: 10, 
        color: Colors.text_main_color
    },
    add_button: {
        width: '70%',
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.button_bg_color,
    },
    action_button_text: {
        fontSize: 16, 
        color: Colors.main_bg_color
    },
    add_cate_button: {
        width: '30%', 
        height: 30, 
        borderRadius: 15, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    cate_option_image: {
        width: 20, 
        height: 20, 
        resizeMode: 'contain', 
        marginHorizontal: 20
    }
})