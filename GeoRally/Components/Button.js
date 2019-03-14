import React from "react";
import { TouchableOpacity, Text } from "react-native";
import PropTypes from "prop-types"

class Button extends React.Component
{
    onPress = () =>
    {
        this.props.onPress()
    }

    render()
    {
        return (
            <TouchableOpacity activeOpacity={0.5} style={[{backgroundColor:this.props.color, elevation:4, borderRadius:2, padding:7}, this.props.style]} onPress={this.onPress} >
                <Text style={{textAlign:"center", color:"white", fontWeight:"bold"}}>{this.props.title.toUpperCase()}</Text>
            </TouchableOpacity>
        )
    }
}

Button.propTypes = {
    onPress:PropTypes.func,
    title:PropTypes.string,
    style:PropTypes.oneOfType([PropTypes.object, PropTypes.number])
}

Button.defaultProps = {
    onPress:() => {},
    title:"",
    color:"#2196F3"
}

export default Button;