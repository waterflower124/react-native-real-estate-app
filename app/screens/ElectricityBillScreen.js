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
var RNFS = require('react-native-fs');
import * as Permission from "../utils/Permission";


var TAG = "ElectricityBillScreen";

export default class ElectricityBillScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            refreshing: false,
            full_name: Global.FULLNAME,
            bills_array: [],
            download_complete: false,
            // property_name: this.props.route.params.property_name
        }
    }

    UNSAFE_componentWillMount = async() => {
        this.getBills();
    }

    getBills = async() => {
        try {
            if(!this.state.refreshing) {
                this.setState({
                    loading: true
                })
            }
            var uri = Global.BASE_URL + "/api/bills";
            
            console.log(TAG + " callGetBillsAPI uri " + uri);

            WebService.callServiceGet(uri, this.handleGetBillsAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
                refreshing: false,
            })
        }
    }

    handleGetBillsAPI = async(response, isError) => {
        console.log(TAG + " callGetBillsAPI Response " + JSON.stringify(response));
        console.log(TAG + " callGetBillsAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    this.setState({
                        bills_array: response.bills
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
            loading: false,
            refreshing: false,
        })
    }

    downloadBillDoc = async(index) => {
        if(!Permission.requestStoragePermission) {
            return;
        }
        this.setState({
            loading: true
        })

        RNFS.mkdir(`${RNFS.LibraryDirectoryPath}/${Global.DOWLOAD_DIR}/`, null)
            .then((res) => {
                console.log('mkdif res: ')
            })
            .catch((error) => {
                console.log('mkdif error: ')
            })
        
        var filename = "bill_" + this.state.bills_array[index].month + ".pdf";
        const downloadDest = `${RNFS.LibraryDirectoryPath}/${Global.DOWLOAD_DIR}/${filename}`;
    
        const progress = data => {
            const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
            console.log(`Progress  ${percentage}% `)
        };
    
        const begin = res => {
        
        };
    
        const progressDivider = 1;
        const background = false;
    
        //////////  download pdf file  /////////
        // let download_handler = RNFS.downloadFile({ fromUrl: this.state.bills_array[index].bill_pdf, toFile: downloadDest, begin, progress, background, progressDivider });
        // await download_handler.promise.then(res => {
        //     console.log("file://" + downloadDest)
        //     this.props.navigation.navigate("DisplayPDFScreen", {path: downloadDest, filename: filename})
        // }).catch(err => {
        //     console.log("download error:", err);
        // });
        // this.setState({
        //     loading: false
        // })

        this.props.navigation.navigate("DisplayPDFScreen", {path: downloadDest, filename: filename, url: this.state.bills_array[index].bill_pdf})
    }

    renderHeader = () => {
        return (
            <View style = {{width: '100%', height: 30, flexDirection: 'row', borderWidth: 1, borderColor: Colors.text_main_color}}>
                <View style = {{width: '20%', height: '100%', justifyContent: 'center', alignItems: 'center', borderEndWidth: 1, borderEndColor: Colors.text_main_color}}>
                    <Text style = {[{fontSize: 14, color: Colors.text_main_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.bills}</Text>
                </View>
                <View style = {{width: '25%', height: '100%', justifyContent: 'center', alignItems: 'center', borderEndWidth: 1, borderEndColor: Colors.text_main_color}}>
                    <Text style = {[{fontSize: 14, color: Colors.text_main_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.paid_up}</Text>
                </View>
                {/* <View style = {{width: '23%', height: '100%', justifyContent: 'center', alignItems: 'center', borderEndWidth: 1, borderEndColor: Colors.text_main_color}}>
                    <Text style = {[{fontSize: 14, color: Colors.text_main_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.quantity}</Text>
                </View> */}
                <View style = {{width: '25%', height: '100%', justifyContent: 'center', alignItems: 'center', borderEndWidth: 1, borderEndColor: Colors.text_main_color}}>
                    <Text style = {[{fontSize: 14, color: Colors.text_main_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.price}</Text>
                </View>
                <View style = {{width: '30%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style = {[{fontSize: 14, color: Colors.text_main_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.month}</Text>
                </View>
            </View>
        )
    }

    renderBill = (item, index) => {
        return (
            <View key = {index} style = {{width: '100%', height: 40, flexDirection: 'row', borderStartWidth: 1, borderBottomWidth: 1, borderEndWidth: 1, borderColor: Colors.text_main_color}}>
                <View style = {{width: '20%', height: '100%', justifyContent: 'center', alignItems: 'center', borderEndWidth: 1, borderEndColor: Colors.text_main_color}}>
                    <TouchableOpacity style = {{width: '80%', height: '80%'}} onPress = {() => this.downloadBillDoc(index)}>
                        <Image style = {{height: '100%', width: '100%', resizeMode: 'contain'}} source = {require('../assets/images/pdf.png')}></Image>
                    </TouchableOpacity>
                </View>
                <View style = {{width: '25%', height: '100%', justifyContent: 'center', alignItems: 'center', borderEndWidth: 1, borderEndColor: Colors.text_main_color}}>
                {
                    item.paid.toString() == '0' &&
                    <Image style = {{height: '50%', width: '100%', resizeMode: 'contain'}} source = {require('../assets/images/property_uncheck.png')}></Image>
                }
                {
                    item.paid.toString() != '0' &&
                    <Image style = {{height: '50%', width: '100%', resizeMode: 'contain'}} source = {require('../assets/images/property_check.png')}></Image>
                } 
                </View>
                {/* <View style = {{width: '23%', height: '100%', justifyContent: 'center', alignItems: 'center', borderEndWidth: 1, borderEndColor: Colors.text_main_color}}>
                    <Text style = {[{fontSize: 12, color: Colors.text_main_color,}, stylesGlobal.font_GESndBook]}>{item.quantity}</Text>
                </View> */}
                <View style = {{width: '25%', height: '100%', justifyContent: 'center', alignItems: 'center', borderEndWidth: 1, borderEndColor: Colors.text_main_color}}>
                    <Text style = {[{fontSize: 12, color: Colors.text_main_color,}, stylesGlobal.font_GESndBook]}>{item.price}{" SR"}</Text>
                </View>
                <View style = {{width: '30%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style = {[{fontSize: 12, color: Colors.text_main_color,}, stylesGlobal.font_GESndBook]}>{moment(item.month).format("MM-DD-yyyy")}</Text>
                </View>
            </View>
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
                    <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.electricity_bill}</Text>
                    {/* <TouchableOpacity onPress = {() => this.props.navigation.navigate("SettingsScreen")}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_setting.png')}></Image>
                    </TouchableOpacity> */}
                    <View></View>
                </View>
                {/* <View style = {{width: '100%', height: 30, backgroundColor: Colors.main, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style = {[{fontSize: 14, color: Colors.white,}, stylesGlobal.font_GESndBook]}>{this.state.property_name}</Text>
                </View> */}
                <View style = {{flex:1 , width: '100%', paddingHorizontal: 10, marginVertical: 15}}>
                    <FlatList
                        ListHeaderComponent={()=>this.renderHeader()}
                        onRefresh={() => this.setState({refreshing: true}, () => this.getBills())}
                        refreshing={this.state.refreshing}
                        data={this.state.bills_array}
                        extraData={this.state}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => this.renderBill(item, index)}
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
        color: Colors.text_main_color
    },
    
})