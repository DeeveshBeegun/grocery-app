import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useTheme } from '../../theme/ThemeContext';

const ContactUsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const styles = makeStyles(colors);

  const send = () => {
    if (!name.trim() || !message.trim()) return;
    setSent(true);
    setName(''); setEmail(''); setMessage('');
    setTimeout(() => setSent(false), 2000);
  };

  const ContactRow = ({ icon, label, value, onPress }: { icon: any; label: string; value: string; onPress?: () => void }) => (
    <View style={styles.contactRow}>
      <View style={[styles.contactIcon, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={20} color={colors.primaryDark} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={[styles.contactValue, onPress && { color: colors.primaryDark }]} onPress={onPress}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <Header title="Contact Us" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Get in touch</Text>
        <Text style={styles.subtitle}>We'd love to hear from you. Reach out any time.</Text>

        <View style={styles.card}>
          <ContactRow icon="call-outline" label="Phone" value="+230 5 000 0000" onPress={() => Platform.OS !== 'web' && Linking.openURL('tel:+23050000000')} />
          <View style={styles.divider} />
          <ContactRow icon="mail-outline" label="Email" value="support@example.com" onPress={() => Linking.openURL('mailto:support@example.com')} />
          <View style={styles.divider} />
          <ContactRow icon="location-outline" label="Address" value="123 Market Street, Port Louis" />
        </View>

        <Text style={styles.sectionTitle}>Send us a message</Text>
        <View style={styles.card}>
          <InputField label="Your name" icon="person-outline" value={name} onChangeText={setName} placeholder="Name" />
          <InputField label="Email" icon="mail-outline" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
          <InputField label="Message" icon="chatbubble-ellipses-outline" value={message} onChangeText={setMessage} placeholder="How can we help?" multiline />
          <Button title={sent ? 'Message Sent ✓' : 'Send Message'} icon={sent ? undefined : 'send'} variant={sent ? 'outline' : 'primary'} onPress={send} style={{ marginTop: 8 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    content: { padding: 16, paddingBottom: 40 },
    title: { fontSize: 24, fontWeight: '800', color: c.text },
    subtitle: { fontSize: 14, color: c.textMuted, marginTop: 4, marginBottom: 18 },
    card: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.border, padding: 16 },
    contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
    contactIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    contactLabel: { fontSize: 12, color: c.textMuted },
    contactValue: { fontSize: 15, color: c.text, fontWeight: '600', marginTop: 2 },
    divider: { height: 1, backgroundColor: c.border, marginVertical: 8 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: c.text, marginTop: 22, marginBottom: 10 },
  });

export default ContactUsScreen;
