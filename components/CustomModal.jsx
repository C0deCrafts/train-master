import { Modal, TouchableOpacity, Button, StyleSheet } from 'react-native';

const CustomModal = ({ isVisible, onClose, children, styles, onCloseLabel="Schließen" }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.modalContainer} onPress={onClose} activeOpacity={1}>
                <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
                    {children}
                    <Button title={onCloseLabel} onPress={onClose} />
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default CustomModal;

const createStyles = (colors, textStyles, appStyles) => StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: colors.secondaryLabel
    },
    modalContent: {
        width: "100%",
        padding: 20,
        backgroundColor: colors.secondary,
        borderTopLeftRadius: appStyles.modalRadius,
        borderTopRightRadius: appStyles.modalRadius,
    },
});
