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
import { EventRegister } from 'react-native-event-listeners';

var TAG = "NewsDetailScreen";

export default class NewsDetailScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            news_id: this.props.route.params.id,
            news_item: null,
            selected_image_item: null,
        }

    }

    UNSAFE_componentWillMount = async() => {
        this.getNewsDetail(this.state.news_id);

        this.listener = EventRegister.addEventListener('news_notification', (data) => {
            this.getNewsDetail(data);
        })
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener)
    }

    getNewsDetail = async(news_id) => {
        try {
            this.setState({
                news_id: news_id,
                loading: true,
            });
            var uri = Global.BASE_URL + "/api/ournews/" + news_id;
            
            console.log(TAG + " callGetNewsAPI uri " + uri);

            WebService.callServiceGet(uri, this.handleGetNewsAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
            });
        }
    }

    handleGetNewsAPI = async(response, isError) => {
        console.log(TAG + " callGetNewsAPI Response " + JSON.stringify(response));
        console.log(TAG + " callGetNewsAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    this.setState({
                        news_item: response.ournews
                    })
                    if(response.ournews.images != null && response.ournews.images.length > 0) {
                        this.setState({
                            selected_image_item: response.ournews.images[0]
                        })
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
        })
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
                <View style = {{width: '100%', alignItems: 'center', paddingVertical: 10}}>
                    <Text style = {[{fontSize: 18, color: Colors.main, width: '90%', textAlign: 'center'}, stylesGlobal.font_GESndBook]}>{this.state.news_item == null ? "" : this.state.news_item.name}</Text>
                </View>
                <View style = {{flex:1 , width: '100%'}}>
                {
                    this.state.loading != null && this.state.news_item != null &&
                    <View style = {{width: '100%', height: '100%'}}>
                        <View style = {{width: '100%', height: 200, }}>
                            {/* <SliderBox
                                images = {this.state.news_item.image_urls}
                                ImageComponent = {FastImage}
                                sliderBoxHeight = {200}
                                disableOnPress = {true}
                                autoplay = {true}
                                circleLoop
                                // dotStyle = {{width: 15, height: 15, borderRadius: 7.5}}
                                // dotColor = '#3B3F48'
                                // inactiveDotColor = {'#203B3F48'}
                                // ImageComponentStyle = {{width: Dimensions.get('screen').width - 20, height: 200, borderRadius: 10}}
                            /> */}
                        {
                            this.state.selected_image_item != null && this.state.selected_image_item.type == "Image" &&
                            <FastImage style = {{flex: 1}} resizeMode = {FastImage.resizeMode.cover} source = {{uri: this.state.selected_image_item.url}}></FastImage>
                        }
                        {
                            this.state.selected_image_item != null && this.state.selected_image_item.type == "Video" &&
                            <Video
                                ref={ref => this._video = ref}
                                videoWidth={Dimensions.get('window').width}
                                videoHeight={200}
                                autoplay
                                video={{uri: this.state.selected_image_item.url}}
                                resizeMode='contain'
                                onLoad={() => {
                                    this._video.seek(0);
                                    this._video.resume();
                                }}
                                onPlayPress={() => {
                                    this._video.resume();
                                }}
                            />
                        }
                        </View>
                        <View style = {{padding: 15, flexDirection: 'row', alignItems: 'center'}}>
                            <View style = {{alignItems: 'center', flexDirection: 'row', marginEnd: 15}}>
                                <Image style = {{width: 30, height: 20, resizeMode: 'contain'}} source = {require('../assets/images/news_calendar.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{I18nManager.isRTL ? moment(this.state.news_item.created_at).locale('ar').format("DD MMM") : moment(this.state.news_item.created_at).locale('en').format("DD MMM")}</Text>
                            </View>
                            <View style = {{alignItems: 'center', flexDirection: 'row', marginEnd: 15}}>
                                <Image style = {{width: 30, height: 20, resizeMode: 'contain'}} source = {require('../assets/images/news_chat.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{this.state.news_item.author}</Text>
                            </View>
                            <View style = {{alignItems: 'center', flexDirection: 'row', marginEnd: 15}}>
                                <Image style = {{width: 30, height: 20, resizeMode: 'contain'}} source = {require('../assets/images/news_clock.png')}></Image>
                                <Text style = {[styles.desc_text, stylesGlobal.font_GESndBook]}>{moment(this.state.news_item.created_at).locale('en').format("hh:mm")}</Text>
                            </View>
                        </View>
                        <View style = {{width: '100%', paddingHorizontal: 5, marginVertical: 5}}>
                            <ScrollView style = {{height: 100}} horizontal = {true}>
                            {
                                this.state.news_item.images != null && this.state.news_item.images.map((item, index) => 
                                <TouchableOpacity key = {index} style = {{height: '100%', aspectRatio: 1.3, marginRight: 5, alignItems: 'center', justifyContent: 'center'}} onPress = {() => this.setState({selected_image_item: item})}>
                                {
                                    item.type == "Image" &&
                                    <FastImage style = {{width: '100%', height: '100%'}} resizeMode = {FastImage.resizeMode.cover} source = {{uri: item.url}}></FastImage>
                                }
                                {
                                    item.type == "Video" &&
                                    <View style = {{width: '100%', height: '100%'}}>
                                        <Video
                                            videoWidth={130}
                                            videoHeight={100}
                                            video={{uri: item.url}}
                                            resizeMode='contain'
                                            disableFullscreen
                                            disableSeek
                                            muted
                                        />
                                        <TouchableOpacity style = {{position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, zIndex: 10, elevation: 0}}
                                            activeOpacity = {1}
                                            onPress = {() => this.setState({selected_image_item: item})}
                                        />
                                    </View>
                                }   
                                </TouchableOpacity>
                                )
                            }
                            </ScrollView>
                        </View>
                        <View style = {{flex: 1, width: '100%', paddingHorizontal: 15}}>
                            <ScrollView style = {{width: '100%'}}>
                                <View style = {{flex: 1, alignItems: 'flex-start'}}>
                                    <Text style = {[{fontSize: 14, color: Colors.main}, stylesGlobal.font_GESndBook]}>{this.state.news_item.description}</Text>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
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
    desc_text: {
        fontSize: 12, 
        color: Colors.main
    }
})