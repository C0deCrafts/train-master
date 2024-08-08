import {View, StyleSheet} from "react-native";
import {Image} from 'expo-image';
import Svg, {Circle} from "react-native-svg";
import {useEffect} from "react";
import {icons} from "../constants";
import Animated, {useAnimatedProps, useSharedValue, withTiming} from "react-native-reanimated";
import {useAppStyle} from "../context/AppStyleContext";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function BigDonutChart({
                           radius = 65,
                           strokeWidth = 23,
                           progress,
                           max = 10000,
                       }) {
    const {getTextStyles, getColors, fontFamily} = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily, strokeWidth);

    const innerRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * innerRadius;

    const fill = useSharedValue(0);

    useEffect(() => {
        fill.value = withTiming(progress / max, {duration: 1500});
    }, [progress, max]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDasharray: [circumference * fill.value, circumference]
    }));

    return (
        <View style={{
            width: radius * 2,
            height: radius * 2,
            alignSelf: "center"
        }}>
            <Svg>
                {/* Background */}
                <Circle
                    r={innerRadius}
                    cx={radius}
                    cy={radius}
                    strokeWidth={strokeWidth}
                    stroke={colors.baseColor}
                    opacity={0.2}
                    fill="transparent"
                />
                {/* Foreground */}
                <AnimatedCircle
                    r={innerRadius}
                    cx={radius}
                    cy={radius}
                    originX={radius}
                    originY={radius}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    stroke={colors.baseColor}
                    strokeLinecap="round"
                    rotation={"-90"}
                    animatedProps={animatedProps}
                />
            </Svg>
            <Image source={icons.arrowRight} style={styles.icon}/>
        </View>
    )
}

const createStyles = (textStyles, colors, fontFamily, strokeWidth) => {
    return StyleSheet.create({
        icon: {
            position: 'absolute',
            alignSelf: 'center',
            top: strokeWidth * 0.1,
            width: strokeWidth * 0.8,
            height: strokeWidth * 0.8,
            tintColor: colors.colorButtonLabel
        }
    })
}

export default BigDonutChart;
