
import React, { Component } from "react";
import { View,
    Text,
    Image,
    TouchableOpacity
 } from "react-native";

 import { stylesGlobal } from '../global/stylesGlobal'
 import { Colors } from '../utils/Colors'
 import { strings } from "../strings";
 import { SafeAreaView } from 'react-native-safe-area-context';
 import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
 import {languageSwitcher} from '../utils/language';

export default class IntroScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {

        }
    }

    async componentWillUnmount() {
        
    }

    render() {
        return (
            <SafeAreaView style = {{flex: 1, backgroundColor: Colors.main, justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity style = {{position: 'absolute', top: StaticSafeAreaInsets.safeAreaInsetsTop + 30, right: 15, paddingHorizontal: 15, height: 30, borderRadius: 15, backgroundColor: Colors.white, flexDirection: 'row', alignItems: 'center', zIndex: 5, elevation: 5}}
                    onPress={() => languageSwitcher.toggleLanguages()}
                >
                    <Text style = {[{fontSize: 14, color: Colors.black}, stylesGlobal.font_GESSTwoLight_Light]}>{strings.language}</Text>
                    <Image style = {{width: 20, height: 20, resizeMode: 'contain', marginStart: 15}} source = {require("../assets/images/world.png")}></Image>
                </TouchableOpacity>
                <View style = {{width: '100%', height: '40%', alignItems: 'center', justifyContent: 'flex-end'}}>
                    <View style = {{width: '50%', aspectRatio: 1}}>
                        <Image style = {{width: '100%', height: '100%', resizeMode: 'contain', tintColor: Colors.white}} source = {require("../assets/images/logo_splash.png")}></Image>
                    </View>
                </View>
                <View style = {{width: '100%', height: '30%', justifyContent: "center", alignItems: 'center'}}>
                    <Text style = {[{fontSize: 52, color: Colors.white}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.welcome_splash}</Text>
                </View>
                <View style = {{width: '100%', height: '30%', justifyContent: "center", alignItems: 'center'}}>
                    <View style = {{marginVertical: 10, paddingHorizontal: 30}}>
                        <Text style = {[{fontSize: 18, color: Colors.white}, stylesGlobal.font_GESSTwoLight_Light]}>{strings.signin_selah}</Text>
                    </View>
                    <TouchableOpacity style = {{width: '80%', height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.button_bg_color, borderRadius: 25, overflow: 'hidden'}}
                        onPress = {() => this.props.navigation.navigate("SignInScreen")}
                    >
                        <Text style = {[{fontSize: 18, color: Colors.white}, stylesGlobal.font_GESSTwoMedium_Medium]}>{strings.signin}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {{marginVertical: 10, paddingHorizontal: 30}}
                        onPress = {() => this.props.navigation.navigate("SignUpScreen")}
                    >
                        <Text style = {[{fontSize: 18, color: Colors.white}, stylesGlobal.font_GESSTwoLight_Light]}>{strings.new_user}</Text>
                    </TouchableOpacity>
                </View>
                
            </SafeAreaView>
        );
    }
}