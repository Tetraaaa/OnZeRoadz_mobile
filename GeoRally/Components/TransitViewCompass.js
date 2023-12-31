import React from 'react';
import { Text, View, Image, Dimensions, Animated, Easing } from "react-native";
import GeoLocTools from '../Resources/GeoLoc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
    accelerometer,
    gyroscope,
    magnetometer,
    setUpdateIntervalForType,
    SensorTypes
  } from "react-native-sensors";
import Strings from '../Resources/i18n';


class TransitViewCompass extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {            
            text: '',
            x: null,
            y: null,
            heading: null,
            brng: null,
            target: new Animated.Value(0)
        }
        this.COMPASS_REFRESH_RATE = 1000;
    }

    getAngleFromCoordinates = (lat1, long1, lat2, long2) =>
    {
        lat1 = lat1*Math.PI/180
        lat2 = lat2*Math.PI/180
        long1 = long1*Math.PI/180
        long2 = long2*Math.PI/180
        let dLon = (long2 - long1);
    
        let y = Math.sin(dLon) * Math.cos(lat2);
        let x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1)
                * Math.cos(lat2) * Math.cos(dLon);
    
        let brng = Math.atan2(y, x);
    
        brng = brng * (180/Math.PI)
        brng = (brng + 360) % 360;
        //brng = 360 - brng; // count degrees counter-clockwise - remove to make clockwise
    
        return brng;
    }

    /**
     * @see https://cdn-shop.adafruit.com/datasheets/AN203_Compass_Heading_Using_Magnetometers.pdf
     * @param {*} x 
     * @param {*} y 
     */
    getHeadingFromMeasurements(x, y)
    {
        if(y > 0)
        {
            return 90 - Math.atan(x/y)*180/Math.PI
        }
        else if(y < 0)
        {
            return 270 - Math.atan(x/y)*180/Math.PI
        }
        else if(y === 0 && x < 0)
        {
            return 180
        }
        else
        {
            return 0;
        }
    }

    componentDidMount()
    {
        setUpdateIntervalForType(SensorTypes.magnetometer, this.COMPASS_REFRESH_RATE);
        this.magnetometer = magnetometer.subscribe(data => {            
            this.setState({
                text: this.getHeadingFromMeasurements(data.x, data.y),
                x:data.x,
                y:data.y,
                heading: this._computeRealHeading(data.x, data.y),
                brng: this.getAngleFromCoordinates(this.props.userLat,this.props.userLng, this.props.transit.step.latitude, this.props.transit.step.longitude)
            }, () => {Animated.timing(this.state.target, {
                toValue: (this.state.brng-this.state.heading)%360,
                easing:Easing.linear,
                duration:this.COMPASS_REFRESH_RATE
            }).start()})
        })      
    }

    componentWillUnmount()
    {
        this.magnetometer.unsubscribe();
    }



    _computeRealHeading(x, y)
    {
        let h = this.getHeadingFromMeasurements(x, y);

        let r = h-90;
        if(r<0)
        {
            r = 360+r;
        }
        return r;
    }

    render()
    {
        let coeff = this.state.brng/360;
        return (
            <View style={{flex:1}}>
                <Text style={{ textAlign: "center", fontSize: 20, color: Colors.primaryDark }}>{Strings("playScreen", "instructionsCompass")}</Text>
                <View style={{flex:5, justifyContent:"center", alignItems: "center"}}>
                    <Animated.Image style={{height:300, width:300, transform:[{rotate:  this.state.target.interpolate({inputRange:[0,360], outputRange:["0deg", "360deg"]})}]}} source={require("../Resources/Images/compass.png")}/>
                </View>
            </View>            
        )
    }
}

export default TransitViewCompass;