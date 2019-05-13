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
            region:null
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
    
        brng = Math.toDegrees(brng);
        brng = (brng + 360) % 360;
        brng = 360 - brng; // count degrees counter-clockwise - remove to make clockwise
    
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
        navigator.geolocation.getCurrentPosition(
            (position) =>
            {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: this.state.region.latitudeDelta,
                        longitudeDelta: this.state.region.longitudeDelta
                    }
                });
            }
        );



        setUpdateIntervalForType(SensorTypes.magnetometer, 1000);
        magnetometer.subscribe(data => {
            console.log(Math.atan2(data.y, data.x) * (180 / Math.PI))
        })
    }

    componentDidUpdate(prevProps)
    {
    }

    render()
    {
        return (
            <View style={{ flex: 1 }}>

            </View>
        )
    }
}

export default TransitViewCompass;