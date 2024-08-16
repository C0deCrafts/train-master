import React, { Component } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import { appStyles } from "../constants/elementStyles";

export default class SwipeableRow extends Component {
    renderRightActions = (progress, _dragAnimatedValue) => (
        <View
            style={{
                width: 120,
                flexDirection: 'row',
            }}>
            {this.renderRightAction('Löschen', '#dd2c00', 300, progress)}
        </View>
    );

    renderRightAction = (text, color, x, progress) => {
        const trans = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [x, 0],
        });

        const pressHandler = () => {
            this.close();
            console.log('Item deleted'); // Placeholder for actual delete function
        };

        return (
            <Animated.View
                style={{
                    flex: 1,
                    transform: [{ translateX: trans }],
                }}>
                <RectButton style={[styles.rightAction, {
                    backgroundColor: color,
                    borderRadius: appStyles.cardRadius,
                }]} onPress={pressHandler}>
                    <Text style={styles.actionText}>{text}</Text>
                </RectButton>
            </Animated.View>
        );
    };

    updateRef = (ref) => {
        this.swipeableRow = ref;
    };

    close = () => {
        this.swipeableRow?.close();
        this.props.onDelete();
    };

    onSwipeableOpen = () => {
        this.close();
    };

    render() {
        const { children } = this.props;
        return (
            <Swipeable
                ref={this.updateRef}
                enableTrackpadTwoFingerGesture
                friction={1.4}
                overshootRight={false}
                rightThreshold={140}
                renderRightActions={this.renderRightActions}
                onSwipeableOpen={this.onSwipeableOpen}>
                {children}
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    actionText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'transparent',
        padding: 10,
        alignSelf: 'flex-start',
    },
    rightAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
});
