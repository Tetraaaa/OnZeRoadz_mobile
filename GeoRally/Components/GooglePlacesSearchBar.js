import React from 'react';
import { View, FlatList, Text, TouchableOpacity, Keyboard, Animated, Slider, TextInput } from 'react-native';
import FetchRequest from "../Tools/FetchRequest"
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Colors';
import Config from "../Resources/Config";
import Url from "../Resources/Url";
import Strings from '../Resources/i18n';

class GooglePlacesSearchBar extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            predictions: [],
            focusOnBar: false,
            filtering: false,
            rating: 0,
            minDistance: 0,
            maxDistance: 0,
            minDuration: 0,
            maxDuration: 0,
            minNote: 0,
            height: new Animated.Value(0)
        }
        this.requests = []
    }

    componentDidMount()
    {
        this.keyboardListener = Keyboard.addListener("keyboardDidHide", () => { this.searchBar.blur() })
    }

    componentWillUnmount()
    {

        this.keyboardListener.remove()
    }

    _onSearch = (item) => 
    {
        this.requests.forEach(request => request.abort())
        let f = new FetchRequest(Url.googlePlaces + item.place_id + "&key=" + Config.apiKey)
        this.requests.push(f)
        f.open().then(response =>
        {
            if (response.ok)
            {
                response.json().then(json => this.props.onSearch(json))
                this.props.onChangeText(item.description)
                this.searchBar.blur()
            }
        })
            .catch(error => console.log(error))
    }

    _onChangeText = (text) =>
    {
        this.requests.forEach(request => request.abort())
        let f = new FetchRequest(Url.googleAutocompletion + text + "&key=" + Config.apiKey);
        this.requests.push(f);
        f.open()
            .then(response =>
            {
                if (response.ok)
                {
                    response.json().then(json => this.setState({ predictions: json.predictions }))
                }
            })
            .catch(error => console.log(error))

        this.props.onChangeText(text)
    }

    _handleFilterButtonPress = () =>
    {
        if (this.state.filtering)
        {
            Animated.timing(this.state.height, {
                toValue: 0,
                duration: 350
            }).start()
            this.props.onFilterSelection({ distanceMin: this.state.minDistance, distanceMax: this.state.maxDistance, durationMin: this.state.minDuration, durationMax: this.state.maxDuration, note: this.state.minNote })
        }
        else
        {
            Animated.spring(this.state.height, {
                toValue: 200,
                duration: 1500
            }).start()

        }
        this.setState({
            filtering: !this.state.filtering
        })

    }

    render()
    {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.primary, margin: 5, borderRadius: 3, elevation: 4 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity style={{ marginLeft: 3, backgroundColor: this.state.filtering ? Colors.primaryLight : Colors.primary }} onPress={this._handleFilterButtonPress}>
                        <Icon name="tune" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={{ flex: 1, margin: 5, borderRadius: 30, backgroundColor: "white" }}>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", padding: 3 }}>
                            <View style={{ flex: 9 }}>
                                <TextInput style={{ padding: 0 }} ref={component => this.searchBar = component} onBlur={() => { this.setState({ focusOnBar: false }) }} onFocus={() => { this.setState({ focusOnBar: true }) }} value={this.props.value} onChangeText={this._onChangeText} placeholder={Strings("placeholders", "searchbar")} selectTextOnFocus={true} />
                            </View>
                            <View style={{ flex: 1, alignItems: "flex-end" }}>
                                <Icon color={Colors.primaryDark} name="search" size={36} />
                            </View>
                        </View>
                    </View>
                </View>
                <Animated.View style={{ flex: 1, backgroundColor: "white", height: this.state.height, overflow: "hidden" }}>
                    <Text style={{ color: "black", fontWeight: "bold", margin: 5 }}>Distance</Text>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <Text>{Strings("texts", "between")} </Text>
                        <TextInput style={{ width: "20%" }} keyboardType={"decimal-pad"} underlineColorAndroid={"black"} maxLength={4} value={this.state.minDistance.toString()} onChangeText={(minDistance) => this.setState({ minDistance })} />
                        <Text>{Strings("texts", "and")}</Text>
                        <TextInput style={{ width: "20%" }} keyboardType={"decimal-pad"} underlineColorAndroid={"black"} maxLength={4} value={this.state.maxDistance.toString()} onChangeText={(maxDistance) => this.setState({ maxDistance })} />
                        <Text> {Strings("texts", "meters")} </Text>
                    </View>

                    <Text style={{ color: "black", fontWeight: "bold", margin: 5 }}>{Strings("texts", "duration")}</Text>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <Text>{Strings("texts", "between")}</Text>
                        <TextInput style={{ width: "20%" }} keyboardType={"decimal-pad"} underlineColorAndroid={"black"} maxLength={4} value={this.state.minDuration.toString()} onChangeText={(minDuration) => this.setState({ minDuration })} />
                        <Text> {Strings("texts", "and")} </Text>
                        <TextInput style={{ width: "20%" }} keyboardType={"decimal-pad"} underlineColorAndroid={"black"} maxLength={4} value={this.state.maxDuration.toString()} onChangeText={(maxDuration) => this.setState({ maxDuration })} />
                        <Text> {Strings("texts", "minutes")} </Text>
                    </View>
                    <Text style={{ color: "black", fontWeight: "bold", margin: 5 }}>{Strings("texts", "minimalNote")}</Text>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <Slider style={{ width: "50%" }} value={this.state.minNote} onValueChange={(minNote) => this.setState({ minNote })} maximumValue={5} />
                        <Text>{this.state.minNote.toFixed(2) + Strings("texts", "stars")} </Text>
                    </View>

                </Animated.View>
                <View style={{ flex: 1, backgroundColor: "white", borderBottomLeftRadius: 3, borderBottomRightRadius: 3 }}>
                    {
                        this.state.focusOnBar ?
                            <FlatList
                                keyboardShouldPersistTaps={"handled"}
                                data={this.state.predictions}
                                keyExtractor={(item, index) => item.id}
                                renderItem={({ item }) =>
                                {
                                    return (
                                        <TouchableOpacity style={{ padding: 10, borderBottomWidth: 1, borderColor: Colors.primaryLight }} onPress={() => { this._onSearch(item) }}>
                                            <Text style={{ color: Colors.primaryDark }}>{item.description}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                                }
                            />
                            :
                            null
                    }
                </View>


            </View>

        );
    }
}

export default GooglePlacesSearchBar

