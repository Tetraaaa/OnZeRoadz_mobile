import React from "react";
import {Image, View, Text} from "react-native";

class ActivityIndicator extends React.Component
{
    render()
    {
        return (
            <View style={[{flex:1, alignItems:"center"}, this.props.style]}>
                <Image style={[{height:96, width:96, flex:1}, this.props.style]} source={require("../Resources/Images/loading.gif")}/>
                {this.props.text && <Text style={{flex:1}}>{this.props.text}</Text>}
            </View>
            
        )
    }
}

export default ActivityIndicator;