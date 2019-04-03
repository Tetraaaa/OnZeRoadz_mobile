import React from 'react';
import {Text, FlatList, View, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform} from 'react-native';
import Modal from 'react-native-modalbox';
import PropTypes from 'prop-types';

class BetterPicker extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            modalOpen: false
        }
    }

    onLayout = (e) =>
    {
        this.forceUpdate()
    }

    _select = (item) =>
    {
        this.setState({modalOpen:false})
        this.props.onValueChange(item)
    }


    render()
    {
        placeholder = <Text style={{color: '#9E9E9E', fontSize: 14}}>{this.props.placeholder || ""}</Text>
        height = 120 + (this.props.items.length * 41)
        if (height > Dimensions.get('window').height * 0.75) height = Dimensions.get('window').height * 0.75
        return (
            <View style={[{flex: 1, justifyContent: 'center'}, this.props.style]} onLayout={this.onLayout}>
                <TouchableOpacity disabled={this.props.disabled} style={[styles.textInput, this.props.textStyles]} onPress={() => this.setState({modalOpen: true})}>
                    {this.props.selected !== undefined ?
                        <Text style={[styles.selectedText, this.props.style, {color: this.props.disabled ? 'lightgrey' : 'black'}]} numberOfLines={1} ellipsizeMode={"tail"}>{this.props.selected[this.props.displayMember]}</Text>
                        :
                        placeholder
                    }

                    <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                        <Image style={{height: 10, width: 10, marginRight: 20, tintColor: this.props.disabled ? 'lightgrey' : null}} source={require('../Resources/Images/downArrow.png')} />
                    </View>
                </TouchableOpacity>

                <Modal
                    animationType="slide"
                    isOpen={this.state.modalOpen}
                    onClosed={() => this.setState({modalOpen: false})}
                    coverScreen={true}
                    backButtonClose={Platform.OS === 'android' ? true : false}
                    style={[styles.modal, {height: height}]}
                    position={'bottom'}
                >
                    <Text style={styles.modalTitle}>{this.props.title || "Choisissez une option"}</Text>
                    <ScrollView>
                        <FlatList
                            data={this.props.items}
                            renderItem={({item}) =>
                                <TouchableOpacity style={styles.selectionOptions} onPress={() => {this._select(item)}}>
                                    <Text style={{textAlignVertical: 'center', margin: 2, color: 'black'}}>{item[this.props.displayMember]}</Text>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        <Image style={{height: 24, width: 24, marginRight: 6}} source={this.props.selected && item[this.props.keyMember] == this.props.selected[this.props.keyMember] ? require('../Resources/Images/dotInCircle.png') : require('../Resources/Images/circle.png')} />
                                    </View>
                                </TouchableOpacity>
                            }
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </ScrollView>
                    <TouchableOpacity style={styles.cancel} onPress={() => {this.setState({modalOpen: false})}}>
                        <Text style={{textAlign: 'center', fontSize: 18, color: '#4F8DF4'}}>ANNULER</Text>
                    </TouchableOpacity>
                </Modal>
            </View>
        )
    }
}

BetterPicker.propTypes = {
    /**Array of items the BetterPicker will display for selection */
    items:PropTypes.array.isRequired,
    /**Object that is currently selected by the BetterPicker*/
    selected:PropTypes.object,
    /**Member of the JS Object that will be displayed */
    displayMember:PropTypes.string,
    /**Member of the JS Object that acts as an unique key */
    keyMember:PropTypes.string,
    /**Method to be called when the selected value changes */
    onValueChange:PropTypes.func,
    /** Styles to be applied to the view*/
    style:PropTypes.oneOfType([PropTypes.object,PropTypes.number]),
    /** True to disable all touches on the component */
    disabled:PropTypes.bool,
    /** String to be displayed at the top of the picker modal */
    title:PropTypes.string,
    /** String to be displayed when the picker is empty */
    placeholder:PropTypes.string
}

BetterPicker.defaultProps = {
    displayMember:'name',
    keyMember:'id'
}


export default BetterPicker;

const styles = StyleSheet.create({
    modal: {
        borderWidth: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius:15,
        padding: 5,
        borderColor: 'gray'
    },
    textInput: {
        flexDirection: 'row',
        padding: 2,
        borderColor: "lightgray",
        borderWidth: 1,
        borderRadius: 3,
        minHeight: 32.7
    },
    selectionOptions: {
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 8
    },
    modalTitle: {
        textAlign: 'center',
        borderBottomWidth: 2,
        borderColor: '#dbdde0',
        color: 'black',
        fontSize: 18,
        margin: 5,
        padding: 3
    },
    cancel: {
        borderRadius: 20,
        backgroundColor: '#dbdde0',
        borderColor: 'lightgray',
        margin: 8,
        padding: 10
    },
    selectedText: {
        color: 'black',
        flex: 1
    }
})
