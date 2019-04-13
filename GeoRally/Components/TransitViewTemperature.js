import React from 'react';
import { Text, View, ScrollView } from "react-native";
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
        let currentDistance = GeoLocTools.distanceBetween(this.props.userLat, this.props.userLng, this.props.transit.step.latitude, this.props.transit.step.longitude);
        let ratioDistance = currentDistance/this.state.originalDistance;

        return(
            <View style={{flex:1}}>
                <View style={{flex:1}}>
                    <Text>{GeoLocTools.delta}</Text>                
                    <Text>Distance original: {this.state.originalDistance}</Text>
                    <Text>Distance: {currentDistance}</Text>
                    <Text>Distance cible: {currentDistance - GeoLocTools.delta} </Text>                
                </View>
                <View style={{flex:5, flexDirection:"row"}}>
                    <View style={{flex:1}}>
                        {this.state.previousDistance > currentDistance && <><Icon name="temperature-high" color="red" size={50}/>
                        <Icon name="arrow-up" color="red" size={50}/></>}
                        {this.state.previousDistance < currentDistance && <><Icon name="temperature-low" color="blue" size={50}/>
                        <Icon name="arrow-down" color="blue" size={50}/></>}
                    </View>                                       
                    <View style={{flex:1}}>
                        { ratioDistance <= 0.1 ? <View style={{flex:1, backgroundColor: "rgb(255,0,0)"}}></View> : <View style={{flex:1}}/> }
                        { ratioDistance <= 0.2 ? <View style={{flex:1, backgroundColor: "rgb(229.4, 0, 24.6)"}}></View> : <View style={{flex:1}}/>}
                        { ratioDistance <= 0.4 ? <View style={{flex:1, backgroundColor: "rgb(202.8, 0, 50.2)"}}></View> : <View style={{flex:1}}/>}
                        { ratioDistance <= 0.6 ? <View style={{flex:1, backgroundColor: "rgb(178.2, 0, 75.8)"}}></View> : <View style={{flex:1}}/>}
                        { ratioDistance <= 0.8 ? <View style={{flex:1, backgroundColor: "rgb(152.6, 0, 101.4)"}}></View> : <View style={{flex:1}}/>}
                        { ratioDistance <= 1 ? <View style={{flex:1, backgroundColor: "rgb(127, 0, 127)"}}></View> : <View style={{flex:1}}/>}
                        { ratioDistance <= 1.2 ? <View style={{flex:1, backgroundColor: "rgb(101.4, 0, 152.6)"}}></View> : <View style={{flex:1}}/>}
                        { ratioDistance <= 1.4 ? <View style={{flex:1, backgroundColor: "rgb(75.8, 0, 178.2)"}}></View> : <View style={{flex:1}}/>}
                        { ratioDistance <= 1.6 ? <View style={{flex:1, backgroundColor: "rgb(50.2, 0, 202.8)"}}></View> : <View style={{flex:1}}/>}
                        { ratioDistance <= 1.8 ? <View style={{flex:1, backgroundColor: "rgb(24.6, 0, 229.4)"}}></View> : <View style={{flex:1}}/>}
                        { ratioDistance <= 1.9 ? <View style={{flex:1, backgroundColor: "rgb(0, 0, 255)"}}></View> : <View style={{flex:1}}/>}
                    </View>
                </View>
            </View>
        )
    }
}

export default TransitViewTemperature;