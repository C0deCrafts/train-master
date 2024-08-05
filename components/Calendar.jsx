import {View, Text, StyleSheet} from "react-native";
import {useAppStyle} from "../context/AppStyleContext";
import {useAccountSetting} from "../context/AccountSettingContext";
import {format} from "date-fns";
import {de} from "date-fns/locale";
import {Image} from "expo-image";
import {icons} from "../constants";

const Calendar = () => {
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily);
    const {showStepsCount, setShowStepsCount} = useAccountSetting();

    const date = new Date();
    const formattedDate = format(date, 'EEEE, dd MMM yyyy', { locale: de });

    return (
        <View>
            <View style={styles.calendarHeader}>
                <Text style={styles.titleText}>{formattedDate}</Text>
                <Image style={styles.image} source={icons.calendar}/>
            </View>
        </View>
    );
};

export default Calendar;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
            padding: 20,
        },
        calendarHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 15,
        },
        titleText: {
            fontFamily: fontFamily.Poppins_SemiBold,
            fontSize: textStyles.title_3,
            color: colors.label,
            textAlign: "center"
        },
        text: {
            color: colors.label
        },
        image: {
            width: 30,
            height: 30,
            contentFit: "contain",
            tintColor: colors.baseColor
        },
    });
};
