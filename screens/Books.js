import React, { useState } from 'react';
import { Alert, FlatList, Modal, Platform, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { View, StyleSheet, Text } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_ALL_BOOKS } from '../schemas/query';
import Book from '../components/Book';
import Loader from '../components/Loader';
import AddBook from './AddBook'
import ErrorScreen from '../components/ErrorScreen';
const Books = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const { loading, error, data, refetch } = useQuery(GET_ALL_BOOKS);

    if (loading) return <Loader />;
    if (error) {
        return <ErrorScreen />;
    }
    return (
        <SafeAreaView style={styles.AndroidSafeArea}>
            < View style={styles.container} >
                <View style={styles.addButtonContainer}>
                    <TouchableOpacity style={styles.buttonContainer}
                        onPress={() => {
                            setModalVisible(true);
                        }}
                    >
                        <Text style={styles.buttonText}>
                            Add New Book
                        </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
                <View syle={styles.listContainer}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={data["book_book"]}
                        renderItem={({ item }) => (<Book book={item} />)}
                        keyExtractor={item => item.id}
                        numColumns={2}
                    />
                </View>
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <AddBook setModalVisible={setModalVisible} refetch={refetch} />
                    </Modal>
                </View>
            </View >
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        padding: 5,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingBottom: 70,
    },
    listContainer: {
        marginVertical: 10,
    },
    addButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    }, title: {
        fontSize: 30
    },
    buttonContainer: {
        height: 50,
        width: 200,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: '#00BFFF',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
    }
})

export default Books;
