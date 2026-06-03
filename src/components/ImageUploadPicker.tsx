import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  value?: string | null;
  onChange: (uri: string | null) => void;
  height?: number;
  label?: string;
}
const ImageUploadPicker: React.FC<Props> = ({ value, onChange, height = 170, label = 'Product Photo' }) => {
  const { colors } = useTheme();

  const pick = async () => {
    try {
      if (Platform.OS !== 'web') {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Permission needed', 'Please allow photo access to upload an image.');
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets?.length) {
        onChange(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Could not open picker', 'Please try again.');
    }
  };

  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <Pressable onPress={pick} style={[styles.box, { height, borderColor: colors.primary, backgroundColor: colors.primarySoft }]}>
        {value ? (
          <>
            <Image source={{ uri: value }} style={[styles.img, { height }]} resizeMode="cover" />
            <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera" size={14} color="#fff" />
              <Text style={styles.editText}>Change</Text>
            </View>
          </>
        ) : (
          <>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
              <Ionicons name="cloud-upload-outline" size={26} color="#fff" />
            </View>
            <Text style={[styles.hint, { color: colors.primary }]}>Tap to upload a photo</Text>
            <Text style={[styles.sub, { color: colors.textMuted }]}>
              {Platform.OS === 'web' ? 'Choose an image from your computer' : 'Choose from your gallery'}
            </Text>
          </>
        )}
      </Pressable>
      {value ? (
        <Pressable onPress={() => onChange(null)} style={styles.remove}>
          <Ionicons name="trash-outline" size={15} color={colors.danger} />
          <Text style={[styles.removeText, { color: colors.danger }]}>Remove photo</Text>
        </Pressable>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  box: { borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  img: { width: '100%' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  hint: { fontSize: 15, fontWeight: '800' },
  sub: { fontSize: 12, marginTop: 4 },
  editBadge: { position: 'absolute', bottom: 10, right: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, gap: 5 },
  editText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  remove: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8, gap: 5 },
  removeText: { fontWeight: '700', fontSize: 13 },
});
export default ImageUploadPicker;
