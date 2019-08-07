import React, { Component } from "react";
import {
    StyleSheet,
    View,
    ActivityIndicator,
    FlatList,
    ScrollView
} from "react-native";
import {
    Image,
    Icon,
    ListItem,
    Button,
    Text,
    Rating,
    Avatar
} from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";

import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default class Restaurant extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reviews: null,
            startReview: null,
            limitReviews: 5,
            isLoading: true,
            rating: 0
        };
    }

    componentDidMount() {
        this.loadReviews();
    }

    checkUserLogin = () => {
        const user = firebase.auth().currentUser;

        if (user) {
            return true;
        }
        return false;
    };

    checkAddReviewUser = () => {
        const user = firebase.auth().currentUser;
        const idUser = user.uid;
        const idRestaurant = this.props.navigation.state.params.restaurant.item
            .restaurant.id;
        const reviewsRef = db.collection("reviews");
        const queryRef = reviewsRef
            .where("idUser", "==", idUser)
            .where("idRestaurant", "==", idRestaurant);

        return queryRef.get().then(resolve => {
            const countReview = resolve.size;

            if (countReview > 0) {
                return true;
            } else {
                return false;
            }
        });
    };

    goToScreenAddReview = () => {
        this.checkAddReviewUser().then(resolve => {
            if (resolve) {
                this.refs.toast.show("Ya has enviado una review", 1500);
            } else {
                const {
                    id,
                    name
                } = this.props.navigation.state.params.restaurant.item.restaurant;

                this.props.navigation.navigate("AddReviewRestaurant", {
                    id,
                    name,
                    loadReview: this.loadReviews
                });
            }
        });
    };

    loadButtonAddReview = () => {
        if (!this.checkUserLogin()) {
            return (
                <Text>
                    Para escribir una review tienes que iniciar sesión, puedes
                    hacerlo{" "}
                    <Text
                        onPress={() => this.props.navigation.navigate("Login")}
                        style={styles.textLinkLogin}
                    >
                        Aquí
                    </Text>
                </Text>
            );
        } else {
            return (
                <Button
                    title="Añadir Comentario"
                    onPress={() => this.goToScreenAddReview()}
                    buttonStyle={styles.btnAddReview}
                />
            );
        }
    };

    loadReviews = async () => {
        const { limitReviews } = this.state;
        const {
            id
        } = this.props.navigation.state.params.restaurant.item.restaurant;

        let resultReviews = [];
        let arrayRating = [];

        const reviews = db
            .collection("reviews")
            .where("idRestaurant", "==", id);

        return await reviews.get().then(response => {
            this.setState({
                startReview: response.docs[response.docs.length - 1]
            });

            response.forEach(doc => {
                let review = doc.data();

                resultReviews.push(review);

                arrayRating.push(doc.data().rating);
            });

            let numSum = 0;
            console.log("nuevoo");
            arrayRating.map(value => {
                numSum = numSum + value;
            });

            console.log("numSum: ", numSum);

            const countRating = arrayRating.length;
            const resultRating = numSum / countRating;
            const resultRatingFinish = resultRating ? resultRating : 0;

            this.setState({
                reviews: resultReviews,
                rating: resultRatingFinish
            });
        });
    };

    renderFlatList = reviews => {
        if (reviews) {
            return (
                <FlatList
                    data={reviews}
                    renderItem={this.renderRow}
                    keyExtractor={(item, index) => {
                        index.toString();
                    }}
                    onEndReachedThrehold={0}
                />
            );
        } else {
            return (
                <View style={styles.loadReviews}>
                    <ActivityIndicator size="large" />
                    <Text>Cargando reviews...</Text>
                </View>
            );
        }
    };

    renderRow = reviewData => {
        const {
            title,
            review,
            rating,
            idUser,
            createAt,
            avatarUser
        } = reviewData.item;

        const createReview = new Date(createAt.seconds * 1000);

        const avatar = avatarUser
            ? avatarUser
            : "https://api.adorable.io/avatars/285/abott@adorable.png";

        return (
            <View style={styles.viewReview}>
                <View style={styles.viewImageAvatar}>
                    <Avatar
                        source={{
                            uri: avatar
                        }}
                        size="large"
                        rounded
                        containerStyle={styles.imageAvatarUser}
                    />
                </View>
                <View style={styles.viewInfo}>
                    <Text style={styles.reviewTitle}>{title}</Text>
                    <Text style={styles.reviewText}>{review}</Text>
                    <Rating imageSize={15} startingValue={rating} />
                    <Text style={styles.reviewDate}>
                        {createReview.getDate()}/{createReview.getMonth() + 1}/
                        {createReview.getFullYear()} - {createReview.getHours()}
                        :{createReview.getMinutes()}
                    </Text>
                </View>
            </View>
        );
    };

    render() {
        const { reviews, rating } = this.state;

        const {
            id,
            name,
            city,
            address,
            description,
            image
        } = this.props.navigation.state.params.restaurant.item.restaurant;

        const listExtraInfo = [
            {
                text: `${city}, ${address}`,
                iconName: "map-marker",
                iconType: "material-community",
                action: null
            },
            {
                text: "6671-76-88-99",
                iconName: "phone",
                iconType: "material-community",
                action: null
            }
        ];

        return (
            <ScrollView>
                <View style={styles.viewBody}>
                    <View style={styles.viewImage}>
                        <Image
                            source={{ uri: image }}
                            PlaceholderContent={<ActivityIndicator />}
                            style={styles.imageRestaurant}
                        />
                    </View>

                    <View style={styles.viewRestaurantBasicInfo}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.nameRestaurant}>{name}</Text>
                            <Rating
                                style={{ position: "absolute", right: 0 }}
                                imageSize={20}
                                readonly
                                startingValue={parseFloat(rating)}
                            />
                        </View>
                        <Text style={styles.descriptionRestaurant}>
                            {description}
                        </Text>
                    </View>

                    <View style={styles.viewRestaurantExtraInfo}>
                        <Text style={styles.restaurantExtraInfoTitle}>
                            Información sobre el restaurante:
                        </Text>
                        {listExtraInfo.map((item, index) => (
                            <ListItem
                                key={index}
                                title={item.text}
                                leftIcon={
                                    <Icon
                                        name={item.iconName}
                                        type={item.iconType}
                                    />
                                }
                            />
                        ))}
                    </View>

                    <View style={styles.viewBtnAddReview}>
                        {this.loadButtonAddReview()}
                    </View>

                    <Text style={styles.commentTitle}>Comentarios</Text>

                    {this.renderFlatList(reviews)}

                    <Toast
                        ref="toast"
                        position="bottom"
                        positionValue={320}
                        fadeInDuration={1000}
                        fadeOutDuration={1000}
                        opacity={0.8}
                        textStyle={{ color: "#fff" }}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    viewImage: {
        width: "100%"
    },
    imageRestaurant: {
        width: "100%",
        height: 200,
        resizeMode: "cover"
    },
    viewRestaurantBasicInfo: {
        margin: 15
    },
    nameRestaurant: {
        fontSize: 20,
        fontWeight: "bold"
    },
    descriptionRestaurant: {
        marginTop: 5,
        color: "grey"
    },
    viewRestaurantExtraInfo: {
        margin: 15,
        marginTop: 25
    },
    restaurantExtraInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    },
    viewBtnAddReview: {
        margin: 20
    },
    btnAddReview: {
        backgroundColor: "#00a680"
    },
    textLinkLogin: {
        color: "#0068a0",
        fontWeight: "bold"
    },
    loadReviews: {
        marginTop: 20,
        alignItems: "center"
    },
    viewReview: {
        flexDirection: "row",
        margin: 10,
        paddingBottom: 20,
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 1
    },
    viewImageAvatar: {
        marginRight: 15
    },
    imageAvatarUser: {
        width: 50,
        height: 50
    },
    viewInfo: {
        flex: 1,
        alignItems: "flex-start"
    },
    reviewTitle: {
        fontWeight: "bold"
    },
    reviewText: {
        paddingTop: 2,
        color: "grey",
        marginBottom: 5
    },
    reviewDate: {
        marginTop: 5,
        color: "grey",
        fontSize: 12
    },
    commentTitle: {
        fontSize: 20,
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20,
        fontWeight: "bold"
    }
});
