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
import moment from 'moment';
var RNFS = require('react-native-fs');
import * as Permission from "../utils/Permission";

var TAG = "RenterDetailScreen";

export default class RenterDetailScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            property_id: this.props.route.params.property_id,
            full_name: Global.FULLNAME,
            allocated_property: null,
            allocated_unit: null,
            renter: null
        }
    }

    UNSAFE_componentWillMount = async() => {
        this.getRenterDetail();
    }

    getRenterDetail= async() => {
        try {
            this.setState({
                loading: true
            })
            var uri = Global.BASE_URL + "/api/rent_detail/" + this.state.property_id;
            
            console.log(TAG + " callGetRenterDetailAPI uri " + uri);

            WebService.callServiceGet(uri, this.handleGetRenterDetailAPI);
        } catch (error) {
            console.log(error)
            this.setState({
                loading: false,
            })
        }
    }

    handleGetRenterDetailAPI = async(response, isError) => {
        console.log(TAG + " callGetRenterDetailAPI Response " + JSON.stringify(response));
        console.log(TAG + " callGetRenterDetailAPI isError " + isError);
        try {
            if(!isError) {
                if(response.status == "success") {
                    this.setState({
                        renter: response.renter,
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
            loading: false,
        })
    }

    downloadPDFDoc = async(type) => {
        if(!Permission.requestStoragePermission) {
            return;
        }
        if(type == "contract") {
            if(this.state.allocated_unit.contract_pdf == null || this.state.allocated_unit.contract_pdf == "") {
                Alert.alert(strings.warnning, strings.contract_pdf_error);
                return;
            }
        } else {
            if(this.state.allocated_unit.instrument_pdf == null || this.state.allocated_unit.instrument_pdf == "") {
                Alert.alert(strings.warnning, strings.instrument_pdf_error);
                return;
            }
        }

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
        
        var filename = "";
        if(type == "contract") {
            filename = "contract_" + this.state.allocated_unit.unit_name + ".pdf";
        } else {
            filename = "instrument_" + this.state.allocated_unit.unit_name + ".pdf";
        }
        const downloadDest = `${RNFS.DocumentDirectoryPath}/${Global.DOWLOAD_DIR}/${filename}`;
    
        const progress = data => {
            const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
            console.log(`Progress  ${percentage}% `)
        };
    
        const begin = res => {
        
        };
    
        const progressDivider = 1;
        const background = false;
    
        // //////////  download pdf file  /////////
        // let download_handler = RNFS.downloadFile({ fromUrl: this.state.allocated_unit.contract_pdf, toFile: downloadDest, begin, progress, background, progressDivider });
        // await download_handler.promise.then(res => {
        //     console.log("file://" + downloadDest)
        //     this.props.navigation.navigate("DisplayPDFScreen", {path: downloadDest, filename: filename})
        // }).catch(err => {
        //     console.log("download error:", err);
        // });
        // this.setState({
        //     loading: false
        // })
        if(type == "contract") {
            this.props.navigation.navigate("DisplayPDFScreen", {path: downloadDest, filename: filename, url: this.state.allocated_unit.contract_pdf});
        } else {
            this.props.navigation.navigate("DisplayPDFScreen", {path: downloadDest, filename: filename, url: this.state.allocated_unit.instrument_pdf});
        }
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
                    <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.renter_detail}</Text>
                    {/* <TouchableOpacity onPress = {() => this.props.navigation.navigate("SettingsScreen")}>
                        <Image style = {styles.nav_button} source = {require('../assets/images/navbar_setting.png')}></Image>
                    </TouchableOpacity> */}
                    <View></View>
                </View>
                {/* <View style = {{width: '100%', height: 30, backgroundColor: Colors.main, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style = {[{fontSize: 14, color: Colors.white,}, stylesGlobal.font_GESndBook]}>{"unit number 5455"}</Text>
                </View> */}
                <View style = {{flex: 1, width: '100%'}}>
                {
                    !this.state.loading && this.state.allocated_unit == null &&
                    <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook, {fontSize: 16,}]}>{strings.no_unit_data}</Text>
                    </View>
                }
                {
                    !this.state.loading && this.state.allocated_unit != null &&
                    <ScrollView style = {{flex:1 , width: '100%', marginTop: 5}}>
                        <View style = {[styles.item_view, {justifyContent: 'space-between'}]}>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.renter_name}</Text>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.renter.name}</Text>
                        </View>
                        <View style = {[styles.item_view, {justifyContent: 'space-between'}]}>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.property_name}</Text>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.allocated_property.name}</Text>
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
                        <View style = {[styles.item_view, {justifyContent: 'space-between'}]}>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.annual_rent}</Text>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}> {this.state.allocated_property.price} {strings.sr}</Text>
                        </View>
                        <View style = {[styles.item_view, {justifyContent: 'space-between'}]}>
                        <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.area}</Text>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.allocated_property.area} M2</Text>
                        </View>
                        <View style = {[styles.item_view, {justifyContent: 'space-between'}]}>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.room}</Text>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.allocated_property.room}</Text>
                        </View>
                        <View style = {[styles.item_view,  {justifyContent: 'space-between'}]}>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.date_of_rent}</Text>
                            <View style = {styles.value_container_view}>
                                <Text style = {[styles.view_text, stylesGlobal.font_GESndBook]}>{moment(this.state.allocated_unit.rent_date).locale('en').format("MM-DD-yyyy")}</Text>
                            </View>
                            {/* <View style = {{width: '40%'}}>
                                <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.date_of_rent}</Text>
                            </View>
                            <View style = {{width: '30%'}}>
                                <View style = {styles.value_container_view}>
                                    <Text style = {[styles.view_text, stylesGlobal.font_GESndBook]}>{moment(this.state.allocated_unit.rent_date).locale('en').format("MM-DD-yyyy")}</Text>
                                </View>
                            </View> */}
                        </View>
                        <View style = {[styles.item_view,  {justifyContent: 'space-between'}]}>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.due_date}</Text>
                            <View style = {styles.value_container_view}>
                                <Text style = {[styles.view_text, stylesGlobal.font_GESndBook]}>{moment(this.state.allocated_unit.due_date).locale('en').format("MM-DD-yyyy")}</Text>
                            </View>
                            {/* <View style = {{width: '40%'}}>
                                <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.due_date}</Text>
                            </View>
                            <View style = {{width: '30%'}}>
                                <View style = {styles.value_container_view}>
                                    <Text style = {[styles.view_text, stylesGlobal.font_GESndBook]}>{moment(this.state.allocated_unit.due_date).locale('en').format("MM-DD-yyyy")}</Text>
                                </View>
                            </View> */}
                        </View>
                        <View style = {[styles.item_view,  {justifyContent: 'space-between'}]}>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.installment}</Text>
                            <View style = {styles.value_container_view}>
                                <Text style = {[styles.view_text, stylesGlobal.font_GESndBook]}>{this.state.allocated_unit.installment}{strings.sr}</Text>
                            </View>
                            {/* <View style = {{width: '40%'}}>
                                <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.installment}</Text>
                            </View>
                            <View style = {{width: '30%'}}>
                                <View style = {styles.value_container_view}>
                                    <Text style = {[styles.view_text, stylesGlobal.font_GESndBook]}>{this.state.allocated_unit.installment}{strings.sr}</Text>
                                </View>
                            </View> */}
                        </View>
                        <View style = {[styles.item_view,  {justifyContent: 'space-between'}]}>
                            <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.electricity_bill}</Text>
                            <TouchableOpacity style = {styles.value_bill_button} onPress = {() => this.props.navigation.navigate("ElectricityBillScreen")}>
                                <Text style = {[styles.view_text, stylesGlobal.font_GESndBook]}>{strings.view_bills}</Text>
                            </TouchableOpacity>
                            {/* <View style = {{width: '40%'}}>
                                <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.electricity_bill}</Text>
                            </View>
                            <View style = {{width: '60%'}}>
                                <TouchableOpacity style = {styles.value_bill_button} onPress = {() => this.props.navigation.navigate("ElectricityBillScreen")}>
                                    <Text style = {[styles.view_text, stylesGlobal.font_GESndBook]}>{strings.view_bills}</Text>
                                </TouchableOpacity>
                            </View> */}
                        </View>
                        <View style = {styles.item_view}>
                            <View style = {{width: '40%'}}>
                                <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.address}</Text>
                            </View>
                            <View style = {{width: '60%'}}>
                                <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{this.state.allocated_property.address}</Text>
                            </View>
                        </View>
                        <View style = {styles.item_view}>
                            <View style = {{width: '40%'}}>
                                <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.contract}</Text>
                            </View>
                            <View style = {{width: '60%'}}>
                                <TouchableOpacity onPress = {() => this.downloadPDFDoc("contract")}>
                                    <Image style = {{width: 30, height: 30, resizeMode: 'contain'}} source = {require('../assets/images/pdf.png')}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style = {styles.item_view}>
                            <View style = {{width: '40%'}}>
                                <Text style = {[styles.commont_text, stylesGlobal.font_GESndBook]}>{strings.real_estate_instrument}</Text>
                            </View>
                            <View style = {{width: '60%'}}>
                                <TouchableOpacity onPress = {() => this.downloadPDFDoc("instrument")}>
                                    <Image style = {{width: 30, height: 30, resizeMode: 'contain'}} source = {require('../assets/images/pdf.png')}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style = {{width: '100%', alignItems: 'center'}}>
                            <TouchableOpacity style = {styles.contact_button} onPress = {() => this.props.navigation.navigate("CustomerSupportScreen")}>
                                <Text style = {[{fontSize: 16, color: Colors.main_bg_color,}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.contact_custimer_support}</Text>
                            </TouchableOpacity>
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
        borderBottomWidth: 1, 
        borderBottomColor: Colors.text_main_color, 
        flexDirection: 'row', 
        alignItems: 'center', 
        
    },
    commont_text: {
        fontSize: 12, 
        color: Colors.text_main_color
    },
    contact_button: {
        marginTop: 20, 
        width: '80%', 
        height: 40, 
        borderRadius: 20, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: Colors.button_bg_color,
    },
    value_container_view: {
        width: 100,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.main,
        justifyContent: 'center',
        alignItems: 'center'
    },
    value_bill_button: {
        width: 80,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.text_main_color,
        justifyContent: 'center',
        alignItems: 'center'
    },
    empty_view: {
        width: 80,
        height: 20,
    },
    view_text: {
        fontSize: 12, 
        color: Colors.main_bg_color
    }
})