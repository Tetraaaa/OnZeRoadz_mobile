import React from 'react';
import { Text, View, ScrollView } from "react-native";
import HTML from "react-native-render-html";
import Colors from '../Colors';
import Button from "../Components/Button";
import TransitViewTemperature from './TransitViewTemperature';

class TransitView extends React.Component
{


    render()
    {
        let okGeoLoc = this.props.okGeoLoc;

        let over = false;
        let title = "Valider le transit";

        if (this.props.transit.transitIndex == 0)
        {
            title = "Valider le transit et commencer le circuit";
        }
        if (this.props.transit.step === null)
        {
            over = true;
            title = "Terminer le circuit et retourner au menu principal";
        } else if (!okGeoLoc && !this.props.transit.step.geoLoc)
        {            
            okGeoLoc = true;
        }

        let view = null;
        if (this.props.transit.transitType.id === 1)
        {
            
            view =             
            <ScrollView>
                <HTML
                    html={this.props.transit.description}
                />
            </ScrollView>                   
        }
        else if(this.props.transit.transitType.id === 3)//température
        {
            view = <TransitViewTemperature transit={this.props.transit} userLat={this.props.userLat} userLng={this.props.userLng} />
        }
        else
        {            
            view = <Text>Type de transit invalide</Text>
        }

        return(
            <View style={{flex:1}}>                
                <View style={{flex:9}}>
                    {view}
                </View>
                <View style={{ flex: 1 }}>
                    {
                        this.props.transit.step && <Button style={{ margin: 5 }} color={Colors.secondary} disabled={!okGeoLoc} title={title} onPress={() => this.props.validTransit(over)} />
                    }
                </View>
            </View>
        )
    }
}

export default TransitView;