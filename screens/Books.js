import React, { useState, useCallback } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Modal, Platform, RefreshControl, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { View, StyleSheet, Text } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_ALL_BOOKS } from '../schemas/query';
import Book from '../components/Book';
import Loader from '../components/Loader';
import AddBook from './AddBook'
import ErrorScreen from '../components/ErrorScreen';
import { FlashList } from "@shopify/flash-list";
const Books = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { loading, error, data, refetch, fetchMore } = useQuery(GET_ALL_BOOKS, {
        variables: {
            limit: 5,
            offset: 0
        }
    });

    const onRefresh = () => {
        setRefreshing(true);
        refetch();
        setRefreshing(false);
    };


    function fetchMoreBooks() {
        setIsLoadingMore(true);
        fetchMore({
            variables: {
                offset: data["book_book"].length,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) {
                    setIsLoadingMore(false);
                    return prev;
                }
                setIsLoadingMore(false);
                return {
                    ...prev,
                    book_book: [
                        ...prev.book_book,
                        ...fetchMoreResult.book_book,
                    ],
                };
            },
        });
    }
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
                <View style={styles.listContainer}>
                    {data["book_book"] && <FlashList
                        data={data["book_book"]}
                        renderItem={({ item }) => <Book book={item} />}
                        estimatedItemSize={180}
                        onEndReached={fetchMoreBooks}
                        onEndReachedThreshold={0.8}
                        ListFooterComponent={
                            isLoadingMore ? (
                                <ActivityIndicator size="large" color="#00BFFF" />
                            ) : null
                        }
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />}
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    listContainer: {
        height: 600,
        width: Dimensions.get("screen").width,
        marginVertical: 10,

    },
    addButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
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
