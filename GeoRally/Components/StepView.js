import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, Image, Alert, ScrollView, Button } from "react-native";

class StepView extends React.Component {

    render(){
        return(
            <View>
                <Text>{this.props.step.name}</Text>
                <Text>{this.props.step.description}</Text>
                <Button title="Valider l'étape" onPress={() => this.props.validStep(0)}/>
            </View>
        );
    }
}

export default StepView;