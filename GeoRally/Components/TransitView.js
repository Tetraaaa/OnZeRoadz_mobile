import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, Image, Alert, ScrollView, Button } from "react-native";

class TransitView extends React.Component {

    render(){
        let okGeoLoc = this.props.okGeoLoc;

        let over = false;
        let title = "Valider le transit";

        if(this.props.transit.transitIndex == 0){
            title = "Après avoir validé ce transit le circuit va commencer";
        }
        if(this.props.transit.step === null){
            over = true;
            title = "Terminer le circuit et retourner au menu principal";
        }else if(!okGeoLoc && !this.props.transit.step.geoLoc){
                okGeoLoc = true;
        }

        return(
            <View style={{flex:1}}>
                <Text>{this.props.transit.description}</Text>
                <Button disabled={!okGeoLoc} title={title} onPress={() => this.props.validTransit(over)}/>                
            </View>
        );
    }
}

export default TransitView;