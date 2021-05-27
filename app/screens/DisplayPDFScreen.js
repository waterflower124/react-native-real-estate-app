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
    Share
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
var RNFS = require('react-native-fs');
import * as Permission from "../utils/Permission";
import PDFView from 'react-native-view-pdf';
import ModalDropdown from '../components/ModalDropdown';
// import Share from 'react-native-share';

var TAG = "DisplayPDFScreen";

export default class DisplayPDFScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            pdf_type: this.props.route.params.type,
            file_name: this.props.route.params.filename,
            url: this.props.route.params.url
        }
    }

    UNSAFE_componentWillMount = async() => {
        
    }

    share_func = async() => {
        Share.open({
            message: this.state.url
        })
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            err && console.log(err);
        });
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
                    <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESndBook]}>{this.state.file_name}</Text>
                    <ModalDropdown 
                        dropdownStyle = {{width: 100, height: 40 * 2}}
                        defaultIndex = {0}
                        options = {[strings.download, strings.share]}
                        onSelect = {async(index) => {
                            if(index == 0) {
                                this.setState({
                                    loading: true
                                })
                        
                                RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/${Global.DOWLOAD_DIR}/`, null)
                                    .then((res) => {
                                        console.log('mkdif res: ')
                                    })
                                    .catch((error) => {
                                        console.log('mkdif error: ')
                                    })
                                
                                const downloadDest = `${RNFS.DocumentDirectoryPath}/${Global.DOWLOAD_DIR}/${this.state.file_name}`;
                            
                                const progress = data => {
                                    const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
                                    console.log(`Progress  ${percentage}% `)
                                };
                            
                                const begin = res => {
                                
                                };
                            
                                const progressDivider = 1;
                                const background = false;
                            
                                //////////  download pdf file  /////////
                                let download_handler = RNFS.downloadFile({ fromUrl: this.state.url, toFile: downloadDest, begin, progress, background, progressDivider });
                                await download_handler.promise.then(res => {
                                    console.log("file://" + downloadDest)
                                    
                                }).catch(err => {
                                    console.log("download error:", err);
                                });
                                this.setState({
                                    loading: false
                                })
                            } else if(index == 1) {
                                setTimeout(() => {
                                    Share.share({
                                        message: this.state.url
                                    })
                                    .then((res) => {
                                        console.log(res);
                                    })
                                    .catch((err) => {
                                        err && console.log(err);
                                    });
                                }, 510);
                                
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
                </View>
                
                <View style = {{flex:1 , width: '100%', padding: 10}}>
                {
                    Platform.OS == "ios" &&
                    <PDFView
                        fadeInDuration={250.0}
                        style={{ flex: 1 }}
                        // resource={"file://" + this.state.file_path}
                        resource = {this.state.url}
                        resourceType={"url"}
                        onLoad={() => console.log(`PDF rendered from url `)}
                        onError={(error) => console.log('Cannot render PDF', error)}
                    />
                }
                {
                    Platform.OS == "android" &&
                    <PDFView
                        fadeInDuration={250.0}
                        style={{ flex: 1 }}
                        // resource={this.state.file_path}
                        // resourceType={"file"}
                        resource = {this.state.url}
                        resourceType={"url"}
                        onLoad={() => console.log(`PDF rendered from url `)}
                        onError={(error) => console.log('Cannot render PDF', error)}
                    />
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
        color: Colors.text_main_color
    },
    
})