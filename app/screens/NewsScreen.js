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
    I18nManager
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
import Video from 'react-native-video-player';
import { SliderBox } from "react-native-image-slider-box";
import moment from 'moment';
import 'moment/locale/ar';

var TAG = "NewsScreen";

export default class NewsScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            refreshing: false,
            news_array: [],
            page_number: 0,
            more_load: true,
            feature_images: []
        }

        this.onEndReachedCalledDuringMomentum = true;
    }

    UNSAFE_componentWillMount = async() => {
        this.getBanners()
        this.getNews();
    }

    getBanners = async() => {
        try {
            
            var uri = Global.BASE_URL + "/api/banners?type=news";
            
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

    getNews = async() => {
        try {
            if(!this.state.refreshing) {
                this.setState({
                    loading: true,
                });
            }
            var uri = Global.BASE_URL + "/api/ournews_list?page=" + this.state.page_number + "&count=10";
            
            console.log(TAG + " callGetNewsAPI uri " + uri);

            WebService.callServiceGet(uri, this.handleGetNewsAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
                refreshing: false
            });
        }
    }

    handleGetNewsAPI = async(response, isError) => {
        console.log(TAG + " callGetNewsAPI Response " + JSON.stringify(response));
        console.log(TAG + " callGetNewsAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    if(response.ournews_list != null) {
                        for(var i = 0; i < response.ournews_list.length; i ++) {
                            response.ournews_list[i].image_urls = [];
                            for(var j = 0; j < response.ournews_list[i].images.length; j ++) {
                                response.ournews_list[i].image_urls.push(response.ournews_list[i].images[j].url);
                            }
                        }
                        if(this.state.refreshing) {
                            this.setState({
                                news_array: response.ournews_list,
                            })
                        } else {
                            this.setState({
                                news_array: [...this.state.news_array, ...response.ournews_list],
                            })
                        }
                        if(response.ournews_list.length < 10) {
                            this.setState({
                                more_load: false,
                            })
                        } else {
                            this.setState({
                                page_number: this.state.page_number + 1
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
            Alert.alert(strings.warnning, strings.network_error);
        }
        this.setState({
            loading: false,
            refreshing: false
        })
    }

    refreshNews = async() => {
        this.setState({
            refreshing: true,
            page_number: 0,
            more_load: true
        }, () => this.getNews())
    }
    
    renderNewsItem = (item, index) => {
        return (
            <TouchableOpacity key = {index} style = {{width: '100%', height: 150, alignItems: 'center', paddingHorizontal: 10, marginTop: 15}}  onPress = {() => this.props.navigation.navigate("NewsDetailScreen", {id: item.id})}>
                <View style = {{width: '100%', height: '100%', borderRadius: 5, overflow: 'hidden', padding: 10, flexDirection: 'row', borderWidth: 0.5, borderColor: Colors.main}}>
                    <View style = {{height: '100%', width: 150}}>
                    {
                        item.images.length > 0 && item.images[0].type == "Image" &&
                        <FastImage style = {{width: 150, height: 130}} resizeMode = {FastImage.resizeMode.cover} source = {{uri: item.images[0].url}}></FastImage>
                    }
                    {
                        item.images.length > 0 && item.images[0].type == "Video" &&
                        <View style = {{width: '100%', height: '100%'}}>
                            <Video
                                videoWidth={150}
                                videoHeight={130}
                                // autoplay
                                video={{uri: item.images[0].url}}
                                resizeMode='contain'
                                disableFullscreen
                                disableSeek
                                muted
                                hideControlsOnStart
                            />
                            <View style = {{position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, zIndex: 10, elevation: 0}}/>
                        </View>
                    }
                    </View>
                    <View style = {{flex: 1, height: '100%', marginStart: 10}}>
                        <View style = {{flex: 1, alignItems: 'flex-start'}}>
                            <Text style = {[{fontSize: 18, color: Colors.main}, stylesGlobal.font_GESndBook]} numberOfLines={1}>{item.name}</Text>
                        </View>
                        <View style = {{flex: 2, width: '100%', alignItems: 'flex-start'}}>
                            <Text style = {[{height: '90%', fontSize: 14, color: Colors.main}, stylesGlobal.font_GESndBook]} multiline = {true}>{item.description}</Text>
                        </View>
                        <View style = {{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <View style = {{justifyContent: 'center', flexDirection: 'row'}}>
                                <Image style = {{width: 20, height: 15, resizeMode: 'contain'}} source = {require('../assets/images/news_calendar.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{I18nManager.isRTL ? moment(item.created_at).locale('ar').format("DD MMM") : moment(item.created_at).locale('en').format("DD MMM")}</Text>
                            </View>
                            <View style = {{justifyContent: 'center', flexDirection: 'row'}}>
                                <Image style = {{width: 20, height: 15, resizeMode: 'contain'}} source = {require('../assets/images/news_chat.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{item.author}</Text>
                            </View>
                            <View style = {{justifyContent: 'center', flexDirection: 'row'}}>
                                <Image style = {{width: 20, height: 15, resizeMode: 'contain'}} source = {require('../assets/images/news_clock.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{moment(item.created_at).locale('en').format("hh:mm")}</Text>
                            </View>
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
                <View style = {{width: '100%', paddingVertical: 5, backgroundColor: Colors.main, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity onPress = {() => this.props.navigation.goBack()}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_back.png')}></Image>
                    </TouchableOpacity>
                    <Image style = {{width: 60, height: 40, resizeMode: 'contain', tintColor: Colors.white}} source = {require('../assets/images/logo_signin.png')}></Image>
                    {/* <TouchableOpacity onPress = {() => this.props.navigation.navigate("SettingsScreen")}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_setting.png')}></Image>
                    </TouchableOpacity> */}
                    <View></View>
                </View>
                <View style = {{flex:1 , width: '100%'}}>
                    <View style = {{width: '100%', height: 200, marginTop: 10}}>
                        <SliderBox
                            images = {this.state.feature_images}
                            ImageComponent = {FastImage}
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
                    <View style = {{flex: 1, width: '100%'}}>
                        <FlatList
                            onRefresh={() => this.refreshNews()}
                            refreshing={this.state.refreshing}
                            onEndReachedThreshold={0.5}
                            onEndReached={() => {
                                if(!this.onEndReachedCalledDuringMomentum && this.state.more_load) {
                                    this.onEndReachedCalledDuringMomentum = true;
                                    this.getNews();
                                }
                            }}
                            data={this.state.news_array}
                            extraData={this.state}
                            // contentContainerStyle={{ alignItems: "center", flex: 1 }}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                            renderItem={({ item, index }) => this.renderNewsItem(item, index)}
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
        fontSize: 10, 
        color: Colors.main
    }
})