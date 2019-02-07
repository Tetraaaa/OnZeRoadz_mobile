import React from 'react';
import { TextInput, View, FlatList, Text, TouchableOpacity, Keyboard } from 'react-native';
import FetchRequest from "../Tools/FetchRequest"

class GooglePlacesSearchBar extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            predictions: [],
            focusOnBar: false
        }
        this.requests = []
    }

    componentDidMount()
    {
        Keyboard.addListener("keyboardDidHide", () => {this.searchBar.blur()})
    }

    _onSearch = (item) => 
    {
        this.requests.forEach(request => request.abort())
        let f = new FetchRequest("https://maps.googleapis.com/maps/api/place/details/json?&placeid=" + item.place_id + "&key=AIzaSyAJiED9aRjJTSCUHmBE2pUZg4OifcAenpk")
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
        if (text.length > 2)
        {
            let f = new FetchRequest("https://maps.googleapis.com/maps/api/place/autocomplete/json?&input=" + text + "&key=AIzaSyAJiED9aRjJTSCUHmBE2pUZg4OifcAenpk");
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
        }
        this.props.onChangeText(text)
    }

    render()
    {
        return (
            <View>
                <TextInput ref={component => this.searchBar = component} onBlur={() => { this.setState({ focusOnBar: false }) }} onFocus={() => { this.setState({ focusOnBar: true }) }} value={this.props.value} onChangeText={this._onChangeText} placeholder={"Rechercher un lieu..."} />
                {
                    this.state.focusOnBar ?
                        <FlatList
                            keyboardShouldPersistTaps={"handled"}
                            data={this.state.predictions}
                            keyExtractor={(item, index) => item.id}
                            renderItem={({ item }) =>
                            {
                                return (
                                    <TouchableOpacity style={{ margin: 5 }} onPress={() => { this._onSearch(item) }}>
                                        <Text>{item.description}</Text>
                                    </TouchableOpacity>
                                )
                            }
                            }
                        />
                        :
                        null
                }
            </View>

        );
    }
}

export default GooglePlacesSearchBar

