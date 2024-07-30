import {View, StyleSheet, Animated, TextInput} from "react-native";
import { Image } from 'expo-image';
import Svg, {G, Circle } from "react-native-svg";
import {useEffect, useRef} from "react";
import {colors, icons} from "../constants";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedInput = Animated.createAnimatedComponent(TextInput);

function BigDonutChart({
                        percentage = 75,
                        radius = 40,
                        strokeWidth = 10,
                        duration = 500,
                        color = "tomato",
                        delay = 0,
                        textColor,
                        max = 100,
                    }){

    const animatedValue = useRef(new Animated.Value(0)).current;
    const circleRef = useRef();
    const inputRef = useRef();
    const halfCircle = radius + strokeWidth;
    const circleCircumference = 2 * Math.PI * radius;
    const animation = (toValue) => {
        return Animated.timing(animatedValue, {
            toValue,
            duration,
            delay,
            useNativeDriver: true,
        }).start();
    }
    /*
      const animation = (toValue) => {
        return Animated.timing(animatedValue, {
            toValue,
            duration,
            delay,
            useNativeDriver: true,
        }).start(()=>{
            //animation(toValue === 0 ? percentage : 0)
        });
    }
    * */


    useEffect(() => {
        animation(percentage);
        animatedValue.addListener(v => {
            if(circleRef?.current){
                const maxPerc = 100 * v.value / max;
                const strokeDashoffset =
                    circleCircumference - (circleCircumference * maxPerc / 100);
                circleRef.current.setNativeProps({
                    strokeDashoffset,
                });
            }
            if(inputRef?.current){
                inputRef.current.setNativeProps({
                    text: `${Math.round(v.value)}`,
                })
            }
        })

        return () => {
            animatedValue.removeAllListeners();
        };
    }, [max, percentage]);

    return (
        <View>
            <Svg width={radius*2}
                 height={radius*2}
                 viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
            >
                <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
                    <Circle
                        cx="50%"
                        cy="50%"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        r={radius}
                        fill="transparent"
                        strokeOpacity={0.2}
                    />
                    <AnimatedCircle
                        ref={circleRef}
                        cx="50%"
                        cy="50%"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        r={radius}
                        fill="transparent"
                        strokeDasharray={circleCircumference}
                        strokeDashoffset={circleCircumference}
                        strokeLinecap="round"
                    />
                </G>
            </Svg>
            <Image source={icons.fitness} style={{
                position: "absolute",
                width: 40,
                height: 40,
                resizeMode: "contain",
                top: 25,
                left: radius - 20,
                tintColor: colors.donutColorDefault
            }}/>
            <AnimatedInput
                ref={inputRef}
                editable={false}
                defaultValue="0"
                style={[
                    StyleSheet.absoluteFillObject,
                    { fontSize: radius / 2, color: textColor ?? color },
                    { fontFamily: "Poppins-Bold", textAlign: "center" },
                    { top: 50}
                ]}

            />
        </View>
    )
}

export default BigDonutChart;