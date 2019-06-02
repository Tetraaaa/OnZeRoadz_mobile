import React from "react";
import { Animated, View, Text } from 'react-native'
import Button from "../Components/Button";
import IconF from 'react-native-vector-icons/FontAwesome';
import IconM from 'react-native-vector-icons/MaterialIcons';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from "../Colors";


class UpdateModal extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            modalHeight: new Animated.Value(0)
        }
    }

    componentDidUpdate(prevProps)
    {
        if (prevProps.open !== this.props.open)
        {
            this.animate();
        }
    }

    animate = () =>
    {
        if (this.props.open)
        {
            Animated.spring(this.state.modalHeight, {
                toValue: 150,
                duration: 1500
            }).start()
        }
        else
        {
            Animated.timing(this.state.modalHeight, {
                toValue: 0,
                duration: 300
            }).start()
        }
    }

    render()
    {

        return (
            this.props.circuitId ?               
                    <Animated.View style={{ height: this.state.modalHeight.interpolate({ inputRange: [0, 150], outputRange: ["0%", "35%"] }), position: "absolute", bottom: 1, backgroundColor: "white", borderTopLeftRadius: 10, borderTopRightRadius: 10, width: "100%", elevation: 4 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ textAlign: "center", color: Colors.secondaryDark, fontSize: 18, margin: 3, borderWidth: 0, borderBottomWidth: 1, borderColor: Colors.secondaryLight }}>
                                Une mise à jour est disponible pour ce circuit.
                            </Text>
                            <View style={{flex:1}}>
                                <Text style={{color: Colors.secondary, margin:5, fontSize: 15}}>
                                    Voulez vous mettre à jour ce circuit ? {"\n"}
                                    La mise à jour du circuit entrainera la perte de votre progression
                                </Text>
                            </View>
                            <View style={{flex:1, flexDirection: "row"}}>
                            <View style={{flex:1}}>
                                <Button color={Colors.secondary} style={{ margin: 5 }} title="Mettre à jour" onPress={() => this.props.wantUpdate(true)} />
                            </View>
                            <View style={{flex:1}}>
                                <Button color={Colors.secondary} style={{ margin: 5 }} title="Jouer" onPress={() => this.props.wantUpdate(false)} />
                            </View>                            
                            </View>
                        </View >
                    </Animated.View>
                :
                <Animated.View style={{ height: this.state.modalHeight, position: "absolute", bottom: 1, backgroundColor: "white", borderTopLeftRadius: 10, borderTopRightRadius: 10, width: "100%", elevation: 4 }}>
                </Animated.View>
        )
    }
}

export default UpdateModal;