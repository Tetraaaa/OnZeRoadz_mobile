import React from "react";
import { Text, View, Image, Dimensions, ImageBackground } from "react-native";
import GeoLocTools from "./../Resources/GeoLoc";
import Icon from "react-native-vector-icons/FontAwesome5";
import LinearGradient from "react-native-linear-gradient";
import Strings from "../Resources/i18n";

class TransitViewTemperature extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            originalDistance: 0,
            previousDistance: 0,
            initialDistance: 0
        };
    }

    componentDidUpdate(prevProps)
    {
        if (this.state.originalDistance === 0)
        {
            originalDistance = GeoLocTools.distanceBetween(
                this.props.userLat,
                this.props.userLng,
                this.props.transit.step.latitude,
                this.props.transit.step.longitude
            );
            this.setState({
                originalDistance,
                previousDistance: originalDistance
            });
        
        } else if (
            this.props.userLat !== 0 &&
            this.props.userLng !== 0 &&
            this.state.initialDistance === 0
        )
        {
            this.setState({
                initialDistance: GeoLocTools.distanceBetween(
                    this.props.userLat,
                    this.props.userLng,
                    this.props.transit.step.latitude,
                    this.props.transit.step.longitude
                )
            });
        } else if (this.state.previousDistance !== 0)
        {
            previousDistance = GeoLocTools.distanceBetween(
                prevProps.userLat,
                prevProps.userLng,
                this.props.transit.step.latitude,
                this.props.transit.step.longitude
            );
            if (Math.abs(this.state.previousDistance - previousDistance) >= 2)
            {
                this.setState({
                    previousDistance
                });
            }
        }
    }

    render()
    {
        let currentDistance = Math.abs(
            GeoLocTools.distanceBetween(
                this.props.userLat,
                this.props.userLng,
                this.props.transit.step.latitude,
                this.props.transit.step.longitude
            )
        );
        let ratioDistance = currentDistance / this.state.initialDistance;
        if (currentDistance - GeoLocTools.delta < 0)
        {
            ratioDistance = 0;
        }

        let red = 255;
        let blue = 0;
        let nbDiv = 100;
        i = 0;

        

        for (k = 0; k < nbDiv; k++)
        {
            if (ratioDistance <= k / 50)
            {
                i++;
            }

            red -= 255 / nbDiv;
            blue += 255 / nbDiv;
        }
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ textAlign: "center", fontSize: 20, color: Colors.primaryDark }}>{Strings("playScreen", "instructionsTemperature")}</Text>
                <View style={{flex:1}}>
                    {this.state.previousDistance > currentDistance && <><Icon name="temperature-high" color="red" size={50} />
                        <Icon name="arrow-up" color="red" size={50} /></>}
                    {this.state.previousDistance < currentDistance && <><Icon name="temperature-low" color="blue" size={50} />
                        <Icon name="arrow-down" color="blue" size={50} /></>}
                </View>
                <LinearGradient
                    colors={["rgb(" + Math.round(2.55 * i) + ", 0, " + Math.round(255 - 2.55 * i) + ")", "blue"]}
                    style={{
                        justifyContent: "flex-end",
                        height: i * 2.4,
                        width: 80,
                        marginBottom:20
                    }}
                >
                    <Image source={require("../Resources/Images/thermometer.png")} />
                </LinearGradient>

            </View>
        );
    }
}

export default TransitViewTemperature;
