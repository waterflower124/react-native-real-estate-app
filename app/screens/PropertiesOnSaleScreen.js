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
import RowProperty from '../components/RowProperty';

var TAG = "PropertiesOnSaleScreen";

export default class PropertiesOnSaleScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            refreshing: false,
            properties_array: [],
            page_number: 0,
            more_load: true,
            full_name: Global.FULLNAME,
            feature_images: [],
            category_flat: false,
            category_villa: false,
            category_land: false,
            category_building: false,
            category_compound: false,
            category_commercial_store: false,
            category_office: false,
            category_ranch: false,
            category_all: true,
        }

        this.onEndReachedCalledDuringMomentum = true;
    }

    UNSAFE_componentWillMount = async() => {
        this.getBanners()
        this.getProperties()
    }

    getBanners = async() => {
        try {
            
            var uri = Global.BASE_URL + "/api/banners";
            
            console.log(TAG + " callGetBannersAPI uri " + uri);

            WebService.callServiceGet(uri, this.handleGetBannersAPI);
        } catch (error) {
            console.log(error)
            
        }
    }

    handleGetBannersAPI = async(response, isError) => {
        console.log(TAG + " callGetBannersAPI Response " + JSON.stringify(response));
        console.log(TAG + " callGetBannersAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    var feature_images = [];
                    for(i = 0; i < response.banners.length; i ++) {
                        feature_images.push(response.banners[i].url)
                    }
                    this.setState({
                        feature_images: feature_images
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
    }

    getProperties = async() => {
        try {
            if(!this.state.refreshing) {
                this.setState({
                    loading: true,
                });
            }

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
            
            let uri = Global.BASE_URL + "/api/properties?count=10&category=SALE" + "&type=" + type_str + "&page=" + this.state.page_number;
            console.log(TAG + " callGetPropertiesAPI uri " + uri);

            WebService.callServiceGet(uri, this.handleGetPropertiesAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
                refreshing: false
            });
        }
    }

    handleGetPropertiesAPI = async(response, isError) => {
        console.log(TAG + " callGetPropertiesAPI Response " + JSON.stringify(response));
        console.log(TAG + " callGetPropertiesAPI isError " + isError);
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
                        if(response.properties.length < 10) {
                            this.setState({
                                more_load: false
                            })
                        }
                    }
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
            refreshing: false
        })
    }

    select_category = (category) => {
        if(category == "category_flat") {
            this.setState({
                category_flat: !this.state.category_flat,
                category_villa: false,
                category_land: false,
                category_building: false,
                category_compound: false,
                category_commercial_store: false,
                category_office: false,
                category_ranch: false,
            })
            if(this.state.category_flat) {
                this.setState({
                    category_all: true
                })
            } else {
                this.setState({
                    category_all: false
                })
            }
        } else if(category == "category_villa") {
            this.setState({
                category_flat: false,
                category_villa: !this.state.category_villa,
                category_land: false,
                category_building: false,
                category_compound: false,
                category_commercial_store: false,
                category_office: false,
                category_ranch: false,
            })
            if(this.state.category_villa) {
                this.setState({
                    category_all: true
                })
            } else {
                this.setState({
                    category_all: false
                })
            }
        } else if(category == "category_land") {
            this.setState({
                category_flat: false,
                category_villa: false,
                category_land: !this.state.category_land,
                category_building: false,
                category_compound: false,
                category_commercial_store: false,
                category_office: false,
                category_ranch: false,
            })
            if(this.state.category_land) {
                this.setState({
                    category_all: true
                })
            } else {
                this.setState({
                    category_all: false
                })
            }
        } else if(category == "category_building") {
            this.setState({
                category_flat: false,
                category_villa: false,
                category_land: false,
                category_building: !this.state.category_building,
                category_compound: false,
                category_commercial_store: false,
                category_office: false,
                category_ranch: false,
            })
            if(this.state.category_building) {
                this.setState({
                    category_all: true
                })
            } else {
                this.setState({
                    category_all: false
                })
            }
        } else if(category == "category_compound") {
            this.setState({
                category_flat: false,
                category_villa: false,
                category_land: false,
                category_building: false,
                category_compound: !this.state.category_compound,
                category_commercial_store: false,
                category_office: false,
                category_ranch: false,
            })
            if(this.state.category_compound) {
                this.setState({
                    category_all: true
                })
            } else {
                this.setState({
                    category_all: false
                })
            }
        } else if(category == "category_commercial_store") {
            this.setState({
                category_flat: false,
                category_villa: false,
                category_land: false,
                category_building: false,
                category_compound: false,
                category_commercial_store: !this.state.category_commercial_store,
                category_office: false,
                category_ranch: false,
            })
            if(this.state.category_commercial_store) {
                this.setState({
                    category_all: true
                })
            } else {
                this.setState({
                    category_all: false
                })
            }
        } else if(category == "category_office") {
            this.setState({
                category_flat: false,
                category_villa: false,
                category_land: false,
                category_building: false,
                category_compound: false,
                category_commercial_store: false,
                category_office: !this.state.category_office,
                category_ranch: false,
            })
            if(this.state.category_office) {
                this.setState({
                    category_all: true
                })
            } else {
                this.setState({
                    category_all: false
                })
            }
        } else if(category == "category_ranch") {
            this.setState({
                category_flat: false,
                category_villa: false,
                category_land: false,
                category_building: false,
                category_compound: false,
                category_commercial_store: false,
                category_office: false,
                category_ranch: !this.state.category_ranch,
            })
            if(this.state.category_ranch) {
                this.setState({
                    category_all: true
                })
            } else {
                this.setState({
                    category_all: false
                })
            }
        } else if(category == "all") {
            this.setState({
                category_flat: false,
                category_villa: false,
                category_land: false,
                category_building: false,
                category_compound: false,
                category_commercial_store: false,
                category_office: false,
                category_ranch: false,
                category_all: true
            })
        }

        this.refreshMyProperties();
    }

    refreshMyProperties = async() => {
        this.setState({
            refreshing: true,
            page_number: 0,
            more_load: true
        }, () => this.getProperties())
        
    }
    
    renderProperty = (item, index) => {
        return (
            <TouchableOpacity key = {index} style = {{width: '100%', height: 150, alignItems: 'center', paddingHorizontal: 10, marginTop: 15}}  onPress = {() => this.props.navigation.navigate("PropertyDetailScreen", {property: item, property_type: "property_sale"})}>
                <View style = {{width: '100%', height: '100%', padding: 10, borderRadius: 5, overflow: 'hidden', flexDirection: 'row', justifyContent: 'flex-end', borderWidth: 0.5, borderColor: Colors.main}}>
                    <View style = {{height: '100%', width: 150}}>
                        <SliderBox
                            images = {item.image_urls}
                            ImageComponent = {FastImage}
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
                    </View>
                    <View style = {{flex: 1, height: '100%', marginStart: 10}}>
                        <View style = {{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                <Image style = {styles.icon_style} source = {require('../assets/images/property_date.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{moment(item.created_at).locale('en').format('MM-DD-YYYY')}</Text>
                            </View>
                            <View style = {{flex: 1, alignItems: 'flex-end'}}>
                                <Text style = {[{fontSize: 16, color: Colors.main}, stylesGlobal.font_GESndBook]}>{item.name}</Text>
                            </View>
                        </View>
                        <View style = {{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row'}}>
                            {/* <Image style = {styles.icon_style} source = {require('../assets/images/property_price.png')}></Image> */}
                            <Text style = {[styles.desc_text, {fontSize: 14}, stylesGlobal.font_GESndBook]}>{item.price && item.price != "" ? item.price : "0"}</Text>
                        </View>
                        <View style = {{flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <View style = {{justifyContent: 'center', flexDirection: 'row'}}>
                                <Image style = {styles.icon_style} source = {require('../assets/images/property_bathroom.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{item.bathrooms_count && item.bathrooms_count != "" ? item.bathrooms_count : "0"}</Text>
                            </View>
                            <View style = {{justifyContent: 'center', flexDirection: 'row'}}>
                                <Image style = {styles.icon_style} source = {require('../assets/images/property_room.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{item.room && item.room != "" ? item.room : "0"}</Text>
                            </View>
                            <View style = {{justifyContent: 'center', flexDirection: 'row'}}>
                                <Image style = {styles.icon_style} source = {require('../assets/images/property_area.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{item.area && item.area != "" ? item.area : "0"}</Text>
                            </View>
                        </View>
                        <View style = {{flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Text style = {[styles.desc_text, {height: 20}, stylesGlobal.font_GESndBook]}>{item.address}</Text>
                        </View>
                    </View>
                </View>
                {/* <View style = {{width: '100%', height: '100%', borderRadius: 15, overflow: 'hidden',justifyContent: 'flex-end', backgroundColor: Colors.property_bg}}>
                    <View style = {{width: '100%', height: '100%', position: 'absolute'}}>
                    {
                        item.images.length > 0 &&
                        <FastImage style = {{width: '100%', height: '100%'}} resizeMode = {FastImage.resizeMode.cover} source = {{uri: item.images[0].url}}></FastImage>
                    }
                    {
                        item.images.length == 0 &&
                        <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {require('../assets/images/empty_image.png')}></Image>
                    }
                    </View>
                    <View style = {{width: '100%', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: Colors.property_bg}}>
                        <View style = {{width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                            <Text style = {[{fontSize: 14, color: Colors.main_bg_color}, stylesGlobal.font_GESSTwoMedium_Medium]}>{item.name}</Text>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                halfStarEnabled = {true}
                                starSize = {13}
                                fullStarColor = {'#E5981B'}
                                halfStarColor = {'#E5981B'}
                                emptyStarColor = {'#AEAFB2'}
                                rating={4}
                            />
                        </View>
                        <View style = {{width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                            <View style = {{alignItems: 'center', flexDirection: 'row'}}>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESSTwoLight_Light]}> {strings.price} </Text>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{item.price}$</Text>
                            </View>
                            <View style = {{alignItems: 'center', flexDirection: 'row'}}>
                                <Image style = {{width: 15, height: 15, resizeMode: 'contain'}} source = {require('../assets/images/place_maker_light.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESSTwoLight_Light]}> {item.city ? item.city : ""} </Text>
                            </View>
                            <View style = {{alignItems: 'center', flexDirection: 'row'}}>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESSTwoLight_Light]}> {strings.room} </Text>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{item.room}</Text>
                            </View>
                            <View style = {{alignItems: 'center', flexDirection: 'row'}}>
                                <Image style = {{width: 30, height: 15, resizeMode: 'contain'}} source = {require('../assets/images/distance_light.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}> {item.area} </Text>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>M2</Text>
                            </View>
                        </View>
                    </View>
                </View> */}
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
                    <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.welcome_place} "{this.state.full_name}"</Text>
                    <TouchableOpacity onPress = {() => this.props.navigation.navigate("SearchPlaceScreen")}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/search_light.png')}></Image>
                    </TouchableOpacity>
                </View>
                <View style = {{flex:1 , width: '100%', }}>
                    <View style = {{width: '100%', height: 200, marginTop: 10}}>
                        <SliderBox
                            images = {this.state.feature_images}
                            // ImageComponent = {FastImage}
                            sliderBoxHeight = {150}
                            disableOnPress = {true}
                            autoplay = {true}
                            circleLoop
                            dotStyle = {{width: 15, height: 15, borderRadius: 7.5}}
                            dotColor = '#3B3F48'
                            inactiveDotColor = {'#203B3F48'}
                            ImageComponentStyle = {{width: Dimensions.get('screen').width - 20, height: 200, borderRadius: 10}}
                        />
                    </View>
                    <View style = {{width: '100%', marginTop: 20, paddingHorizontal: 10}}>
                        <View style = {{width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                            <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.category_flat ? Colors.text_main_color : Colors.white}]} onPress = {() => this.select_category("category_flat")}>
                                <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.category_flat ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_flat}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.category_villa ? Colors.text_main_color : Colors.white}]} onPress = {() => this.select_category("category_villa")}>
                                <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.category_villa ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_vila}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.category_land ? Colors.text_main_color : Colors.white}]} onPress = {() => this.select_category("category_land")}>
                                <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.category_land ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_land}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.category_building ? Colors.text_main_color : Colors.white}]} onPress = {() => this.select_category("category_building")}>
                                <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.category_building ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_building}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {{width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 15}}>
                            <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.category_compound ? Colors.text_main_color : Colors.white}]} onPress = {() => this.select_category("category_compound")}>
                                <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.category_compound ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_compound}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.category_commercial_store ? Colors.text_main_color : Colors.white}]} onPress = {() => this.select_category("category_commercial_store")}>
                                <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.category_commercial_store ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_commercial_store}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.category_office ? Colors.text_main_color : Colors.white}]} onPress = {() => this.select_category("category_office")}>
                                <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.category_office ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_office}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.category_ranch ? Colors.text_main_color : Colors.white}]} onPress = {() => this.select_category("category_ranch")}>
                                <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.category_ranch ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_ranch}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {{width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 15}}>
                            <TouchableOpacity style = {[styles.category_button, {backgroundColor: this.state.category_all ? Colors.text_main_color : Colors.white}]} onPress = {() => this.select_category("all")}>
                                <Text style = {[styles.category_text, stylesGlobal.font_GESSTwoMedium_Medium, {color: this.state.category_all ? Colors.main_bg_color : Colors.text_main_color}]}>{strings.property_type_all}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style = {{flex: 1, width: '100%'}}>
                        <FlatList
                            onRefresh={() => this.refreshMyProperties()}
                            refreshing={this.state.refreshing}
                            onEndReachedThreshold={0.5}
                            onEndReached={() => {
                                if(!this.onEndReachedCalledDuringMomentum && this.state.more_load) {
                                    this.onEndReachedCalledDuringMomentum = true;
                                    this.getProperties();
                                }
                            }}
                            data={this.state.properties_array}
                            extraData={this.state}
                            // contentContainerStyle={{ alignItems: "center", flex: 1 }}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                            // renderItem={({ item, index }) => this.renderProperty(item, index)}
                            renderItem={({ item, index }) => <RowProperty item = {item} index = {index} navigate = {this.props.navigation.navigate} />}
                        />
                    </View>
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
        color: Colors.main
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
    icon_style: {
        width: 20, 
        height: 15, 
        resizeMode: 'contain'
    }
})