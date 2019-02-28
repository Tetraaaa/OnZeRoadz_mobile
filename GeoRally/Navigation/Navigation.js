import React from "react";
import NavigationOffline from "../Navigation/NavigationOffline";
import NavigationOnline from "../Navigation/NavigationOnline";
import { connect } from 'react-redux'

class Navigation extends React.Component
{
    render()
    {
        return (
            this.props.connectionReducer.connected ? <NavigationOnline/> : <NavigationOffline/> 
        )
    }
}


const mapStateToProps = (state) => {
    return state
  }
  
  export default connect(mapStateToProps)(Navigation)