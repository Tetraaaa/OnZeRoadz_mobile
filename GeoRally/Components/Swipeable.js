import React from "react";
import { TouchableOpacity, Animated, View, Text, PanResponder, Dimensions } from 'react-native';


class Swipeable extends React.PureComponent
{
    constructor(props)
    {
        super(props);
        this.state = {
            x: new Animated.Value(0),
            selected: false
        };
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder:(evt, gestureState) => false,
            onStartShouldSetPanResponderCapture:(evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return !(gestureState.dx === 0 && gestureState.dy === 0)     
            },
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                return !(gestureState.dx === 0 && gestureState.dy === 0)
            },

            onPanResponderGrant: (evt, gestureState) =>
            {

            },

            onPanResponderMove: (evt, gestureState) =>
            {
                Animated.event([
                    null,
                    { x: gestureState.dx }
                ])
                this.state.x.setValue(gestureState.dx)
            },

            onPanResponderTerminationRequest: (evt, gestureState) =>
            {
                return true;
            },

            onPanResponderRelease: (evt, gestureState) =>
            {
                this.setState({ selected: false })
                if (gestureState.dx > 125)
                {
                    Animated.timing(this.state.x, {
                        toValue: Dimensions.get("window").width,
                        duration: 200
                    }).start(() =>
                    {
                        this.onSwipeComplete(this.props.item)
                    });

                }
                else if (gestureState.dx < -125)
                {
                    Animated.timing(this.state.x, {
                        toValue: -Dimensions.get("window").width,
                        duration: 200
                    }).start(() =>
                    {
                        this.onSwipeComplete(this.props.item)
                    });
                }
                else
                {
                    Animated.timing(this.state.x, {
                        toValue: 0,
                        duration: 200
                    }).start();

                }


            },

            onPanResponderTerminate: (evt, gestureState) =>
            {
                this.state.x.setValue(0);
            }
        })
    }

    onSwipeComplete = () =>
    {
        this.state.x.setValue(0);
        this.props.onSwipeComplete(this.props.item);
    }

    render()
    {
        return (
            <Animated.View {...this.panResponder.panHandlers} ref={this.props.item.id} style={{ transform: [{ translateX: this.state.x }], backgroundColor: "white", flexDirection: "row", flex:1 }}>
                <View style={{ flex: 1 }}>
                    {this.props.children}
                </View>
            </Animated.View>
        )
    }
}

export default Swipeable;