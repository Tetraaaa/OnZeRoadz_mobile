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
            <TouchableOpacity activeOpacity={0.5} style={[{elevation:4, borderRadius:2, padding:7}, this.props.style, {backgroundColor:this.props.disabled ? this.props.disabledColor : this.props.color}]} onPress={this.onPress} disabled={this.props.disabled} >
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
    color:"#2196F3",
    disabledColor:"lightgray",
    disabled:false
}

export default Button;