import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native'
import {Image} from 'expo-image';
import {useAppStyle} from "../../../../context/AppStyleContext";
import {useContext, useEffect} from "react";
import Card from "../../../../components/Card";
import {WorkoutContext} from "../../../../context/WorkoutContext";
import CustomHeader from "../../../../components/CustomHeader";
import {elements, icons, images} from "../../../../constants";
import Animated, {FadeInDown,} from "react-native-reanimated";
import Calendar from "../../../../components/Calendar";
import {appStyles} from "../../../../constants/elementStyles";
import useHealthData from "../../../../hook/useHealthData";

const Training = () => {
    const {getTextStyles, getColors, fontFamily, bottomTabSpacing} = useAppStyle();
    const {workouts} = useContext(WorkoutContext);
    const colors = getColors();
    const textStyles = getTextStyles();
    const {getWeight, getSteps} = useHealthData();

    const styles = createStyles(textStyles, colors, fontFamily, bottomTabSpacing);

    useEffect(() => {
        //getWeight();
        //getSteps(new Date());
    }, []);

    const calculateTotalDuration = (workout) => {
        const totalDurationInSeconds = workout.exercises.reduce((total, exercise) => {
            const duration = exercise.duration || 0; // Default to 0 if duration is not set
            return total + duration;
        }, 0);

        return Math.ceil(totalDurationInSeconds / 60);
    };

    const RenderWorkout = ({item, index}) => {
        const totalDuration = calculateTotalDuration(item);
        const imageUrl = item.image || '';

        return (
            <Animated.View
                entering={FadeInDown.delay(100).duration(index * 500)}>
                <Card
                    style={styles.workout}
                    href={{pathname: `(noTabs)/[workoutId]`, params: {id: item.id, item: JSON.stringify(item), workout: item.id}}}
                    clickable
                >
                    {imageUrl && (
                        <Image
                            source={{uri: item.image}}
                            style={{
                                width: "100%",
                                height: 100,
                                borderTopLeftRadius: elements.cardRadius,
                                borderTopRightRadius: elements.cardRadius,
                            }}
                        />
                    )}
                    {/*<Image source={item.image} style={styles.workoutImage} />*/}
                    <View style={styles.cardContent}>
                        <View style={styles.cardContainerTitleDescription}>
                            <View>
                                <Text style={[styles.cardTitle, styles.maxWith]}
                                      numberOfLines={1}
                                      ellipsizeMode="tail"
                                >{item.name}</Text>
                                <Text style={[styles.cardDescription, styles.maxWith]}
                                      numberOfLines={2}
                                      ellipsizeMode="tail"
                                >
                                    {item.description}
                                </Text>
                            </View>
                            <View>
                                <Image style={styles.icon} source={icons.forward}/>
                            </View>
                        </View>
                        <View style={styles.cardContainerDetails}>
                            <View>
                                <Image source={icons.time} style={styles.smallIcon}/>
                            </View>
                            <View style={styles.cardContentDetails}>
                                <Text style={styles.cardDescription}>{totalDuration} Min</Text>
                                <Text style={styles.cardDescription}> ● {item.exercises.length} Übungen</Text>
                            </View>
                        </View>
                    </View>
                </Card>
            </Animated.View>
        )
    }

    return (
        <>
            <CustomHeader title={"Training"}/>
            <View style={styles.backgroundImage}>
                <Image
                    source={images.backgroundSymbol}
                    style={styles.image}
                />
                <View style={styles.container}>
                    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                        <Calendar/>
                        <View style={styles.spacing}>
                            <Text style={styles.titleText}>Fitnesspläne</Text>
                        </View>
                        <View>
                            <FlatList
                                data={workouts}
                                renderItem={({ item, index }) => (
                                    <RenderWorkout item={item} index={index} />
                                )}
                                keyExtractor={item => item.id}
                                horizontal={true} // Set horizontal to true for horizontal scrolling
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </>
    );
};

export default Training;

const createStyles = (textStyles, colors, fontFamily, bottomTabSpacing) => {
    return StyleSheet.create({
        backgroundImage: {
            flex: 1,
            backgroundColor: colors.primary,
            paddingBottom: bottomTabSpacing,
        },
        image: {
            position: "absolute",
            top: appStyles.backgroundImagePositionTopWithHeader,
            width: "100%",
            height: "100%",
            tintColor: colors.quaternaryLabel,
            pointerEvents: "none"
        },
        container: {
            flex: 1,
            paddingHorizontal: 20,
        },
        text: {
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label
        },
        titleText: {
            fontFamily: fontFamily.Poppins_SemiBold,
            fontSize: textStyles.title_3,
            color: colors.label
        },
        workout: {
            backgroundColor: colors.secondary,
            marginRight: appStyles.spacingVerticalSmall,
            padding: 0,
            borderRadius: elements.cardRadius,
        },
        cardContent: {
            height: 120,
            paddingLeft: 10,
            paddingVertical: 10,
            justifyContent: "space-between"
        },
        cardContainerTitleDescription: {
            flexDirection: "row",
            justifyContent: "space-between",
            //alignItems: "center",
        },
        cardContainerDetails: {
            flexDirection: "row",
            marginRight: 10,
            alignItems: "center",
        },
        cardContentDetails: {
            flexDirection: "row",
        },
        cardTitle: {
            fontFamily: fontFamily.Poppins_SemiBold,
            color: colors.label,
            fontSize: textStyles.subhead,
        },
        maxWith: {
            width: 165
        },
        cardDescription: {
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.secondaryLabel,
            fontSize: textStyles.footnote,
        },
        icon: {
            width: 30,
            height: 30,
            tintColor: colors.baseColor,
        },
        smallIcon: {
            width: appStyles.smallIcon,
            height: appStyles.smallIcon,
            tintColor: colors.baseColor,
            marginRight: 5,
        },
        spacing: {
            //backgroundColor: "red",
            marginVertical: appStyles.cardTitleSpacingBottom
        }
    })
}