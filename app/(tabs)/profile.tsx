import React from "react";
import{
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
} from "react-native";

import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";

export default  function ProfileScreen() {
    const router = useRouter();

    const onEdit = () => Alert.alert("Edit profile", "Hook this up to your edit form.");
    const onFavs = () => Alert.alert("Favourites", "Navigate to your favourites list.");
    const onLanguage = () => Alert.alert("Language", "Open language selector.");
    const onLogin = () => Alert.alert("Log In", "Navigate to auth flow.");
    const onLogout = () => Alert.alert("Log Out", "Clear auth state here.");

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.hBtn}>
                    <Ionicons name="chevron-back" size={22} color="#fff"/>
                </TouchableOpacity>
                <Text style={s.hTitle}>My Profile</Text>
                <TouchableOpacity onPress={() => Alert.alert("Settings")} style={s.hBtn}>
                    <Ionicons name="settings-outline" size={20} color="#fff"/>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{paddingBottom: 100}}>
                {/* Profile, name and email */}
                <View style={s.headerCard}>
                    <View style={s.avatarWrap}>
                        <Ionicons name="person-circle-outline" size={64} color="#cbd5e1"/>
                    </View>
                    <View>
                        <Text style={s.name}>Peter Pan</Text>
                        <Text style={s.email}>Peter22@gmail.com</Text>
                        <TouchableOpacity onPress={onEdit} style={s.editBtn}>
                            <Text style={s.editTxt}>Edit profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Options */}
                <Item icon="heart-outline" label="Favourites" onPress={onFavs}/>
                <Item icon="language-outline" label="Language" onPress={onLanguage}/>

                <View style={s.divider}/>

                <Item icon="log-in-outline" label="Log In" onPress={onLogin}/>
                <Item icon="log-out-outline" label="Log Out" onPress={onLogout}/>


            </ScrollView>
        </SafeAreaView>
    );
}
function Item({
    icon,
    label,
    onPress,
              }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity onPress={onPress} style={s.item}>
            <Ionicons name={icon} size={22} color="#111827" style={{ width: 28 }} />
            <Text style={s.itemTxt}>{label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" style={{ marginLeft: "auto" }} />
        </TouchableOpacity>
    );
}

    const s = StyleSheet.create({
        header: {
            backgroundColor: "#4b7b8a",
            height: 56,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 8,
        },
        hBtn: { width: 40, alignItems: "center", justifyContent: "center" },
        hTitle: { flex: 1, textAlign: "center", color: "#fff", fontWeight: "700", fontSize: 18 },
        headerCard: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 16,
            gap: 12,
        },
        avatarWrap: {
            width: 64, height: 64, borderRadius: 999, alignItems: "center", justifyContent: "center",
            backgroundColor: "#eef2f7",
        },
        name: { fontSize: 16, fontWeight: "700", color: "#111827" },
        email: { color: "#6b7280", marginTop: 2, marginBottom: 6 },
        editBtn: {
            alignSelf: "flex-start",
            backgroundColor: "#e0edff",
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
        },
        editTxt: { color: "#2b6cb0", fontWeight: "600", fontSize: 12 },

        item: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 14,
        },
        itemTxt: { fontSize: 15, color: "#111827", marginLeft: 10 },
        divider: {
            height: 1, backgroundColor: "#e5e7eb", marginVertical: 10, marginHorizontal: 16,
        },
});