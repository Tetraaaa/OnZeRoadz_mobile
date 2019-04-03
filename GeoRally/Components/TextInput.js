import React from "react";
import {TextInput} from "react-native";
import Colors from "../Colors";

class AppTextInput extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            focus:false
        }
    }

    _onFocus = () =>
    {   
        this.setState({focus:true}, () => {
            if(this.props.onFocus) this.props.onFocus()
        })
    }

    _onBlur = () =>
    {
        this.setState({focus:false}, () => {
            if(this.props.onBlur) this.props.onBlur()
        })
    }

    render()
    {
        return (
            <TextInput onFocus={this._onFocus} onBlur={this._onBlur} style={[{borderColor:this.state.focus ? Colors.secondaryDark : Colors.secondaryLight, borderWidth:1, borderRadius:3, margin:5}, this.props.style]} {...this.props}/>
        )
    }
}

export default AppTextInput;