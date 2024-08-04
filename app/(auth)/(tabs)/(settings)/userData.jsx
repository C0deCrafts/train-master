import {View, Text} from "react-native";
import CustomHeader from "../../../../components/CustomHeader";

const UserData = () => {
    return (
        <>
            <CustomHeader title={"Benutzerdaten"} backButtonVisible={true}/>
            <Text>Benutzer DATA</Text>
        </>
    );
};

export default UserData;