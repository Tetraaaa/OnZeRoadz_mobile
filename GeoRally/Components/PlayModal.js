import React from "react";
import { Animated, ScrollView } from 'react-native'


class PlayModal extends React.Component
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
        if (prevProps.expanded !== this.props.expanded)
        {
            this.animate();
        }
    }

    animate = () =>
    {
        if (this.props.expanded)
        {
            Animated.spring(this.state.modalHeight, {
                toValue: 100,
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

            <Animated.View style={{ height: this.state.modalHeight.interpolate({ inputRange: [0, 100], outputRange: ["40%", "95%"] }), position: "absolute", bottom: 1, backgroundColor: "white", width: "100%", elevation: 4 }}>
                <ScrollView>
                    {this.props.children}
                </ScrollView>
            </Animated.View>
        )
    }
}

export default PlayModal;