import React from 'react';
import { Text, View, Image, Dimensions, ImageBackground } from "react-native";
import GeoLocTools from './../Resources/GeoLoc';
import Icon from 'react-native-vector-icons/FontAwesome5';

class TransitViewTemperature extends React.Component
{

    constructor(props){
        super(props);
        this.state = {
            originalDistance: 0,
            previousDistance: 0
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.userLat === 0 && prevProps.userLng === 0 && this.state.originalDistance === 0){            
            originalDistance = GeoLocTools.distanceBetween(this.props.userLat, this.props.userLng, this.props.transit.step.latitude, this.props.transit.step.longitude)
            this.setState({
                originalDistance,
                previousDistance: originalDistance
            })
        }else if (this.state.previousDistance !== 0){
            previousDistance = GeoLocTools.distanceBetween(prevProps.userLat, prevProps.userLng, this.props.transit.step.latitude, this.props.transit.step.longitude)
            if(Math.abs(this.state.previousDistance-previousDistance) >= 2){
                this.setState({
                    previousDistance
                })
            }
        }
    }        

    render()
    {        
        let currentDistance = Math.abs(GeoLocTools.distanceBetween(this.props.userLat, this.props.userLng, this.props.transit.step.latitude, this.props.transit.step.longitude));
        let ratioDistance = currentDistance/this.state.originalDistance;
        if(currentDistance - GeoLocTools.delta < 0)
        {
            ratioDistance = 0;
        }
        

        let thermo =[];
        let red = 255;
        let blue = 0;
        let nbDiv = 100;
        let size = 2.3;
        let width = 75;
        for(k=0;k<nbDiv;k++){
            rgb = "rgb("+red.toFixed()+",0,"+blue.toFixed()+")";            
            if(ratioDistance <= k/(nbDiv/2)){
                thermo.push(<View key={k} style={{height:size, backgroundColor:rgb, width:width}}></View>);
            }
            
            red -= 255/nbDiv;
            blue += 255/nbDiv;
        }
        return(
            <View style={{flex:1}}>
                <View style={{flex:1}}>
                    {this.state.previousDistance > currentDistance && <><Icon name="temperature-high" color="red" size={50}/>
                    <Icon name="arrow-up" color="red" size={50}/></>}
                    {this.state.previousDistance < currentDistance && <><Icon name="temperature-low" color="blue" size={50}/>
                    <Icon name="arrow-down" color="blue" size={50}/></>}
                </View>


                <View style={{flex:1, flexDirection:"column-reverse", position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, marginLeft:"40%", marginBottom:"29%"}}>
                        {thermo.reverse()}
                </View>
                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={require("../Resources/Images/thermometer.png")}/> 
                </View>
                            
            </View>
        )
    }
}

export default TransitViewTemperature;