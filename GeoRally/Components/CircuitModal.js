import React from "react";
import { Animated, View, Text, Button, ActivityIndicator } from 'react-native'


class CircuitModal extends React.Component
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
            this.props.marker ?
                this.props.downloadingCircuit ?
                    <Animated.View style={{ height: this.state.modalHeight, position: "absolute", bottom: 1, backgroundColor: "white", borderTopLeftRadius: 10, borderTopRightRadius: 10, width: "100%", elevation: 4 }}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={{ textAlign: "center" }}>Téléchargement du circuit...</Text>
                    </Animated.View>

                    :
                    <Animated.View style={{ height: this.state.modalHeight, position: "absolute", bottom: 1, backgroundColor: "white", borderTopLeftRadius: 10, borderTopRightRadius: 10, width: "100%", elevation: 4 }}>
                        <Text style={{ textAlign: "center", color: "black", fontSize: 18, margin: 3 }}>{this.props.marker.name}</Text>
                        <Text style={{ color: "black" }}>{this.props.marker.description}</Text>
                        <Text>{this.props.marker.length / 1000 + " km"}</Text>
                        <Button style={{ margin: 8 }} title={this.props.playable ? "Jouer" : "Télécharger"} onPress={this.props.playable ? this.props.onPlay : this.props.onDownload} />
                    </Animated.View>
                :
                <Animated.View style={{ height: this.state.modalHeight, position: "absolute", bottom: 1, backgroundColor: "white", borderTopLeftRadius: 10, borderTopRightRadius: 10, width: "100%", elevation: 4 }}>
                </Animated.View>
        )
    }
}

export default CircuitModal;