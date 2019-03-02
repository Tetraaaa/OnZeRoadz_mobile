import React from "react";
import { View, Text } from "react-native";
import IconF from 'react-native-vector-icons/FontAwesome';
import IconM from 'react-native-vector-icons/MaterialIcons';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from "react-native-paper";
import Colors from "../Colors";

class CircuitListItem extends React.Component{

    render(){
        return(
            <View style={{borderRadius:3, borderColor:'black', borderStyle:'solid', borderWidth:1, padding: 5, flexDirection:'row', marginBottom:1}}>
                <View style={{flex:6}}>
                    <Text style={{color:Colors.secondary, fontWeight:"bold"}}>{this.props.data.name}</Text>
                    <Text>{this.props.data.description}</Text>

                    <View style={{flexDirection:'row', justifyContent:"space-between", marginTop:5}}>
                        <View style={{flexDirection:"row"}}>
                            <IconF name="clock-o" size={24} color={Colors.secondary}/>
                            <Text> {this.props.data.duration}s</Text>
                        </View>
                        
                        <View style={{flexDirection:"row"}}>
                            <IconMC name="map-marker-distance" size={24} color={Colors.secondary} />
                            <Text>{this.props.data.length/1000}km</Text>
                        </View>                        
                        
                        <View style={{flexDirection:"row"}}>
                            <IconM name="trending-up" size={24} color={Colors.secondary}/>
                            <Text>{this.props.data.slope} m</Text>
                        </View>                        
                        
                        <View style={{flexDirection:"row"}}>
                            <IconM name="star" size={24} color={Colors.secondary}/>
                            <Text>{this.props.data.averageRatings != null && this.props.data.averageRatings} {this.props.data.averageRatings === null && '-'}</Text>
                        </View>
                    </View>
                </View>
                <View style={{flex:1}}>
                    {this.props.downloaded && 
                        <Button onPress={() => this.props.play(this.props.data.id)}>
                            <IconF name="play" size={24} color={Colors.secondary}/>
                        </Button>
                    }
                    {!this.props.downloaded && 
                        <Button onPress={() => console.log("download")}>
                            <IconF name="download" size={24} color={Colors.secondary}/>
                        </Button>
                    }
                </View>
            </View>
        )
    }
}

export default CircuitListItem;