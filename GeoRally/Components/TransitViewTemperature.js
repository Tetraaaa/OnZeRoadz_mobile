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
            previousDistance: 0,
            initialDistance: 0
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.userLat === 0 && prevProps.userLng === 0 && this.state.originalDistance === 0){            
            originalDistance = GeoLocTools.distanceBetween(this.props.userLat, this.props.userLng, this.props.transit.step.latitude, this.props.transit.step.longitude)
            this.setState({
                originalDistance,
                previousDistance: originalDistance
            })
        }
        else if(this.props.userLat !== 0 && this.props.userLng !== 0 && this.state.initialDistance === 0)
        {
            this.setState({
                initialDistance:GeoLocTools.distanceBetween(this.props.userLat, this.props.userLng, this.props.transit.step.latitude, this.props.transit.step.longitude)
            })
        }
        else if (this.state.previousDistance !== 0){
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
        let ratioDistance = currentDistance/this.state.initialDistance;
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

        i=0;
        for(k=0;k<nbDiv;k++)
        {
            console.log(ratioDistance)
            rgb = "rgb("+red.toFixed()+",0,"+blue.toFixed()+")";            
            if(ratioDistance <= k/(nbDiv/2)){
                i++;
                thermo.push(<View key={k} style={{height:size, backgroundColor:rgb, width:width}}></View>);
            }
            
            red -= 255/nbDiv;
            blue += 255/nbDiv;
        }
        return(
            <View style={{flex:1}}>
                <View style={{flex:1}}>
                    {this.state.previousDistance < currentDistance && <><Icon name="temperature-high" color="red" size={50}/>
                    <Icon name="arrow-up" color="red" size={50}/></>}
                    {this.state.previousDistance > currentDistance && <><Icon name="temperature-low" color="blue" size={50}/>
                    <Icon name="arrow-down" color="blue" size={50}/></>}
                </View>
                <View style={{flex:1, flexDirection:"column-reverse", position:"absolute", top:0, bottom:0, left:0, right:0, marginLeft:"40%", marginBottom:"29%"}}>
                        {thermo.reverse()}
                </View>
                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={require("../Resources/Images/thermometer.png")}/> 
                </View>
                <Text style={{color:"rgb("+ 2.55*i  + ", 0, " + (255 - 2.55*i) + ")", fontSize:16, textAlign:"center"}}>{"Température : " + i}</Text>
                            
            </View>
        )
    }
}

export default TransitViewTemperature;