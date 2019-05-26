import React from 'react';
import { Text, View, Image, Dimensions } from "react-native";
import GeoLocTools from '../Resources/GeoLoc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
    accelerometer,
    gyroscope,
    magnetometer,
    setUpdateIntervalForType,
    SensorTypes
  } from "react-native-sensors";


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
            target: 0
        }
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
        setUpdateIntervalForType(SensorTypes.magnetometer, 1000);
        magnetometer.subscribe(data => {            
            this.setState({
                text: this.getHeadingFromMeasurements(data.x, data.y),
                x:data.x,
                y:data.y,
                heading: this._computeRealHeading(this.getHeadingFromMeasurements(data.x, data.y)),
                brng: this.getAngleFromCoordinates(this.props.userLat,this.props.userLng, this.props.transit.step.latitude, this.props.transit.step.longitude)
            }, () => this.setState({
                target: (this.state.brng-this.state.heading)%360
            }))
        })      
    }

    _computeRealHeading(h){
        r = h-90;
        if(r<0){
            r = 360+r;
        }
        return r;
    }

    componentDidUpdate(prevProps)
    {
    }

    render()
    {
        let coeff = this.state.brng/360;
        return (
            <View style={{flex:1}}>
                <View style={{ flex: 2 }}>
                    <Text>
                        {this.state.text}
                    </Text>
                    <Text>
                        x: {this.state.x}
                    </Text>
                    <Text>
                        y: {this.state.y}
                    </Text>
                    <Text>
                        heading: {this.state.heading}
                    </Text>
                    <Text>
                        bearing: {this.state.brng}
                    </Text>
                    <Text>
                        bearing - heading: {this.state.target}
                    </Text>                               
                </View>
                <View style={{flex:5, justifyContent:"center", alignItems: "center"}}>
                    <Image style={{height:200, width:200, transform:[{rotate: this.state.target+'deg'}]}} source={require("../Resources/Images/compass.png")}/>
                </View>
            </View>            
        )
    }
}

export default TransitViewCompass;