
import React, { Component } from "react";

import { I18nManager } from 'react-native'

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import SideMenu from "./SideMenu";
import HomeScreen from './HomeScreen';
import SearchPlaceScreen from './SearchPlaceScreen';
import MyPropertiesScreen from './MyPropertiesScreen';
import AddingNewPropertiesScreen from './AddingNewPropertiesScreen';
import PropertyDetailScreen from './PropertyDetailScreen';
import UserProfileScreen from './UserProfileScreen';
import SettingsScreen from './SettingsScreen';
import ContactUsScreen from './ContactUsScreen';
import SearchResultScreen from './SearchResultScreen';
import PropertiesOnSaleScreen from './PropertiesOnSaleScreen';
import CustomerSupportScreen from './CustomerSupportScreen';
import OtherServiceScreen from './OtherServiceScreen';
import ElectricityBillScreen from './ElectricityBillScreen';
import YourUnitInfoScreen from './YourUnitInfoScreen';
import UnitRentDataScreen from './UnitRentDataScreen';
import DisplayPDFScreen from './DisplayPDFScreen';
import PaymentScreen from './PaymentScreen';
import TransactionsScreen from './TransactionsScreen';
import RenterDetailScreen from './RenterDetailScreen';
import NewsScreen from './NewsScreen';
import NewsDetailScreen from './NewsDetailScreen';
import {navigationRef} from '../utils/ReactNavigation';

const { isRTL } = I18nManager;

const Drawer = createDrawerNavigator();

export default class DrawerNavigator extends Component {

    constructor(props) {
        super(props);
        
    }

    UNSAFE_componentWillMount() {
       
    }
  
    render() {
        return (
            <Drawer.Navigator initialRouteName="HomeScreen" drawerContent = {(props) => <SideMenu {...props} />} drawerPosition =  {isRTL ? "right" : "left"} drawerStyle = {{drawerBackgroundColor: "transparent", width: "70%"}}>
                <Drawer.Screen name = "HomeScreen" component = {HomeScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "SearchPlaceScreen" component = {SearchPlaceScreen} />
                <Drawer.Screen name = "MyPropertiesScreen" component = {MyPropertiesScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "AddingNewPropertiesScreen" component = {AddingNewPropertiesScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "PropertyDetailScreen" component = {PropertyDetailScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "UserProfileScreen" component = {UserProfileScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "SettingsScreen" component = {SettingsScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "ContactUsScreen" component = {ContactUsScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "SearchResultScreen" component = {SearchResultScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "PropertiesOnSaleScreen" component = {PropertiesOnSaleScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "CustomerSupportScreen" component = {CustomerSupportScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "OtherServiceScreen" component = {OtherServiceScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "ElectricityBillScreen" component = {ElectricityBillScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "YourUnitInfoScreen" component = {YourUnitInfoScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "UnitRentDataScreen" component = {UnitRentDataScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "DisplayPDFScreen" component = {DisplayPDFScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "PaymentScreen" component = {PaymentScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "TransactionsScreen" component = {TransactionsScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "RenterDetailScreen" component = {RenterDetailScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "NewsScreen" component = {NewsScreen} options={{unmountOnBlur:true}}/>
                <Drawer.Screen name = "NewsDetailScreen" component = {NewsDetailScreen} options={{unmountOnBlur:true}}/>
            </Drawer.Navigator>
        );
    }
}