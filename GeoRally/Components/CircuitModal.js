import React from "react";
import { Animated, View, Text, ActivityIndicator } from 'react-native'
import Button from "../Components/Button";
import IconF from 'react-native-vector-icons/FontAwesome';
import IconM from 'react-native-vector-icons/MaterialIcons';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from "../Colors";
import Strings from "../Resources/i18n";
import BetterBadderPicker from "./BetterBadderPicker";
import Flag from 'react-native-flags';

class CircuitModal extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            modalHeight: new Animated.Value(0),
            idLanguage: 0
        }
    }

    componentDidUpdate(prevProps)
    {
        if (prevProps.open !== this.props.open)
        {
            this.animate();            
        }

        if ((prevProps.marker != null && this.props.marker!= null && prevProps.marker.id != this.props.marker.id) || (!prevProps.marker && this.props.marker)){            
            if(this.props.playable){
                this.setState({
                    idLanguage: this.props.marker.language.id
                })
            }else{
                this.setState({
                    idLanguage: this.props.marker.supportedLanguages[0].id
                });
            }            
        }
    }

    _renderRatings = () =>
    {
        if (this.props.marker.averageRatings)
        {
            let starGauge = [];
            let rating = this.props.marker.averageRatings;

            for (let i = 0; i < 5; i++)
            {
                if (rating >= 1)
                {
                    starGauge.push(<IconM key={i} color={Colors.secondary} name="star" size={24} />);
                    rating--;
                }
                else if (rating >= 0.5)
                {
                    starGauge.push(<IconM key={i} color={Colors.secondary} name="star-half" size={24} />)
                    rating -= 0.5;
                }
                else
                {
                    starGauge.push(<IconM key={i} color={Colors.secondary} name="star-border" size={24} />)
                }
            }

            return (
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    {
                        starGauge.map(item => item)
                    }
                    <Text>{"(" + this.props.marker.averageRatings.toFixed(2) + ")"}</Text>

                </View>


            )
        }
        else
        {
            return <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}><Text>{Strings("circuitModal", "notRated") }</Text></View>
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
                        <Text style={{ textAlign: "center" }}>{Strings("circuitModal", "downloading") }</Text>
                    </Animated.View>
                    :
                    <Animated.View style={{ height: this.state.modalHeight.interpolate({ inputRange: [0, 150], outputRange: ["0%", "35%"] }), position: "absolute", bottom: 1, backgroundColor: "white", borderTopLeftRadius: 10, borderTopRightRadius: 10, width: "100%", elevation: 4 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ textAlign: "center", color: Colors.secondaryDark, fontSize: 18, margin: 3, borderWidth: 0, borderBottomWidth: 1, borderColor: Colors.secondaryLight }}>{this.props.marker.name}</Text>
                        </View >
                        <View style={{flex:1}}>
                            
                        </View>                        
                        <View style={{ flex: 2, flexDirection: "row", borderColor: "black", justifyContent: "center" }}>
                            <View style={{ flexDirection: "row", flex: 1, margin: 3, alignItems: "center", justifyContent: "center" }}>
                                <IconMC name="map-marker-distance" size={22} color={Colors.secondary} style={{ marginRight: 3 }} />
                                <Text style={{ fontSize: 16 }}>{this.props.marker.length / 1000 + " km"}</Text>
                            </View>
                            <View style={{ flexDirection: "row", flex: 1, margin: 3, alignItems: "center", justifyContent: "center" }}>
                                <IconF name="clock-o" size={22} color={Colors.secondary} style={{ marginRight: 3 }} />
                                <Text style={{ fontSize: 16 }}>{Math.floor(this.props.marker.duration/1000/60) + " min"}</Text>
                            </View>
                            <View style={{ flexDirection: "row", flex: 1, margin: 3, alignItems: "center", justifyContent: "center" }}>
                                <IconM name="trending-up" size={22} color={Colors.secondary} style={{ marginRight: 3 }} />
                                <Text style={{ fontSize: 16 }}>{this.props.marker.slope + " m"}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <Text style={{ color: Colors.secondary, fontSize: 15, marginLeft: 5 }}>{Strings("circuitModal", "createdBy") + this.props.marker.creator.username}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                {
                                    this._renderRatings()
                                }
                            </View>
                        </View>



                        {                            
                            this.props.connected ?
                                <View style={{flexDirection:'row'}}>
                                    {this.props.playable ? <Flag style={{ flex: 2, margin: 5, padding:5 }} size={32} code={this.props.marker.language.code.toString().toUpperCase()} />  : <BetterBadderPicker onValueChange={(item) => this.setState({idLanguage: item.id})} style={{ flex: 4, margin: 5 }} keyMember="id" displayMember="label" selected={this.props.marker.supportedLanguages.find(item => item.id === this.state.idLanguage)} items={this.props.marker.supportedLanguages.filter((language) => language.supportedPercentage == 100)} title="Langage" />}
                                    <Button color={this.props.playable ? Colors.primary : Colors.secondary} style={{ margin: 5, flex:15}} title={this.props.playable ? this.props.marker.progress ? Strings("circuitModal", "resume")  : Strings("circuitModal", "play")  : Strings("circuitModal", "download") } onPress={this.props.playable ? this.props.onPlay : () => this.props.onDownload(this.state.idLanguage)} />
                                </View>
                                :
                                null
                        }

                    </Animated.View>
                :
                <Animated.View style={{ height: this.state.modalHeight, position: "absolute", bottom: 1, backgroundColor: "white", borderTopLeftRadius: 10, borderTopRightRadius: 10, width: "100%", elevation: 4 }}>
                </Animated.View>
        )
    }
}

export default CircuitModal;