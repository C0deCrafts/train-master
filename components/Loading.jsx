import Spinner from "react-native-loading-spinner-overlay";
import {useAppStyle} from "../context/AppStyleContext";

const Loading = ({
                     visible,
                     textContent,
                     color,
                     overlayColor = "rgba(0, 0, 0, 0.25)",
                     children,
}) => {
    const {getColors, getTextStyles} = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    return (
                <Spinner size="large"
                         color={color || colors.label}
                         overlayColor={overlayColor}
                         textContent={textContent}
                         textStyle={{
                             color: color || colors.label,
                             fontSize: textStyles.title_3,
                             fontWeight: "600",
                         }}
                         visible={visible}
                >
                    {children}
                </Spinner>
    );
};

export default Loading;