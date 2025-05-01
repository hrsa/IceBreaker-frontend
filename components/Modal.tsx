import { ReactNode, FC } from 'react';
import { useCommonStyles } from '@/constants/Styles';
import { Modal as ReactModal, View, Text, TouchableWithoutFeedback } from 'react-native';
import { BlurView } from 'expo-blur';

interface ModalProps {
  isVisible: boolean;
  children: ReactNode;
  buttons?: ReactNode;
  onDismiss: () => void;
  title: string;
  closeOnBackdropPress?: boolean;
  blurIntensity?: number;
  blurTint?: 'light' | 'dark' | 'default';
  contentStyle?: object;
}

const Modal: FC<ModalProps> = ({
  isVisible,
  children,
  buttons,
  onDismiss,
  title,
  closeOnBackdropPress = true,
  blurIntensity = 90,
  blurTint = 'dark',
  contentStyle,
}) => {
  const styles = useCommonStyles();
  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onDismiss();
    }
  };

  return (
    <ReactModal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onDismiss}>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <BlurView intensity={blurIntensity} tint={blurTint} style={[styles.modalContent, contentStyle]}>
              <Text style={styles.modalTitle}>{title}</Text>
              {children}
              {buttons && <View style={styles.modalButtons}>{buttons}</View>}
            </BlurView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </ReactModal>
  );
};
export default Modal;
