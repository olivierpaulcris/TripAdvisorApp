import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Image,
    TouchableOpacity
} from "react-native";
// import Image from "react-native-elements";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
// import * as firebase from "firebase";

import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default class Restaurants extends Component {
    constructor() {
        super();

        this.state = {
            login: false,
            restaurants: null,
            startRestaurants: null,
            limitRestaurants: 7,
            isLoading: true
        };
    }

    componentDidMount() {
        this.checkLogin();
        this.loadRestaurants();
    }

    checkLogin = () => {
        console.log("check in correcto");

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    login: true
                });
            } else {
                this.setState({
                    login: false
                });
            }
        });
    };

    loadActionButton = () => {
        const { login } = this.state;

        if (login) {
            return (
                <ActionButton
                    buttonColor="#00a680"
                    title="Add Restaurant"
                    onPress={() =>
                        this.props.navigation.navigate("AddRestaurant", {
                            loadRestaurants: this.loadRestaurants
                        })
                    }
                >
                    <Icon name="md-create" style={styles.actionButtonIcon} />
                </ActionButton>
            );
        }

        return null;
    };

    loadRestaurants = async () => {
        const { limitRestaurants } = this.state;
        let resultRestaurants = [];

        const restaurants = db
            .collection("restaurants")
            .limit(limitRestaurants)
            .orderBy("createAt", "desc");

        await restaurants.get().then(response => {
            this.setState({
                startRestaurants: response.docs[response.docs.length - 1]
            });

            response.forEach(doc => {
                let restaurant = doc.data();
                restaurant.id = doc.id;
                resultRestaurants.push({ restaurant });
            });

            this.setState({
                restaurants: resultRestaurants,
                isLoading: false
            });
        });

        // console.log(this.state.restaurants);
    };

    goToScreen = nameScreen => {
        this.props.navigation.navigate(nameScreen);
    };

    renderRow = restaurants => {
        // console.log(restaurants);

        const {
            name,
            city,
            address,
            description,
            image
        } = restaurants.item.restaurant;

        // console.log(name);

        return (
            <TouchableOpacity onPress={() => this.clickRestaurant(restaurants)}>
                <View style={styles.viewRestaurant}>
                    <View style={styles.restaurantImage}>
                        <Image
                            resizeMode="cover"
                            source={{ uri: image }}
                            style={styles.imageRestaurant}
                        />
                    </View>
                    <View>
                        <Text style={styles.restaurantName}>{name}</Text>
                        <Text style={styles.restaurantAddress}>
                            {city}, {address}
                        </Text>
                        <Text style={styles.restaurantDescription}>
                            {description.substr(0, 60)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    clickRestaurant = restaurant => {
        console.log("haz realizado un click en el siguiente restaurnte");
        // console.log(restaurant);
        this.props.navigation.navigate("Restaurant", { restaurant });
    };

    handleLoadMore = async () => {
        console.log("cargando nuevos restaurantes");

        const { limitRestaurants, startRestaurants } = this.state;
        let resultRestaurants = [];

        this.state.restaurants.forEach(doc => {
            resultRestaurants.push(doc);
        });

        console.log("---------------------------------------");

        const restaurantDB = db
            .collection("restaurants")
            .orderBy("createAt", "desc")
            .startAfter(startRestaurants.data().createAt)
            .limit(limitRestaurants);

        await restaurantDB.get().then(response => {
            // console.log(response);
            if (response.docs.length > 0) {
                // console.log(response.docs);

                this.setState({
                    startRestaurants: response.docs[response.docs.length - 1]
                });
            } else {
                this.setState({
                    isLoading: false
                });
            }

            response.forEach(doc => {
                console.log("esteeee");
                // console.log(doc.data());

                let restaurant = doc.data();
                restaurant.id = doc.id;
                resultRestaurants.push({ restaurant });
            });

            this.setState({
                restaurants: resultRestaurants
            });
        });
    };

    renderFooter = () => {
        if (this.state.isLoading) {
            return (
                <View style={styles.loaderRestaurants}>
                    <ActivityIndicator size="large" />
                </View>
            );
        } else {
            return (
                <View style={styles.notFoundRestaurants}>
                    <Text>No quedan más restaurantes</Text>
                </View>
            );
        }
    };

    renderFlatList = restaurants => {
        // console.log(restaurants);

        // const { restaurants } = this.state;

        if (restaurants) {
            return (
                <FlatList
                    data={this.state.restaurants}
                    renderItem={this.renderRow}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0}
                    ListFooterComponent={this.renderFooter}
                />
            );
        } else {
            return (
                <View style={styles.startLoadRestaurants}>
                    <ActivityIndicator size="large" />
                    <Text>Cargando restaurantes...</Text>
                </View>
            );
        }
    };

    render() {
        const { restaurants } = this.state;

        return (
            <View style={styles.viewBody}>
                {this.renderFlatList(restaurants)}
                {this.loadActionButton()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: "white"
    },
    startLoadRestaurants: {
        marginTop: 20,
        alignItems: "center"
    },
    viewRestaurant: {
        flexDirection: "row",
        margin: 10
    },
    restaurantImage: {
        marginRight: 15
    },
    imageRestaurant: {
        width: 80,
        height: 80
    },
    restaurantName: {
        fontWeight: "bold"
    },
    restaurantAddress: {
        paddingTop: 2,
        color: "grey"
    },
    restaurantDescription: {
        paddingTop: 2,
        color: "grey",
        width: 300
    },
    loaderRestaurants: {
        marginTop: 10
    },
    notFoundRestaurants: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center"
    }
});
