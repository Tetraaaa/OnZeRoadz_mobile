import React from "react";
import NavigationOffline from "../Navigation/NavigationOffline";
import NavigationOnline from "../Navigation/NavigationOnline";
import { connect } from 'react-redux'
import FetchRequest from "../Tools/FetchRequest";
import Url from "../Resources/Url";

class Navigation extends React.Component
{
    componentDidMount()
    {
        new FetchRequest(Url.whoami).open()
            .then(response =>
            {
                if(response.ok)
                {
                    response.json().then(json => {
                        let action = {type:"LOGIN", value:json.username}
                        this.props.dispatch(action)
                    })
                }
                else
                {
                    let action = {type:"LOGOUT"}
                    this.props.dispatch(action)
                }
            })
            .catch(error => {
                let action = {type:"LOGOUT"}
                this.props.dispatch(action)
            })
    }
    render()
    {
        return (
            this.props.connectionReducer.connected ? <NavigationOnline /> : <NavigationOffline />
        )
    }
}


const mapStateToProps = (state) =>
{
    return state
}

export default connect(mapStateToProps)(Navigation)