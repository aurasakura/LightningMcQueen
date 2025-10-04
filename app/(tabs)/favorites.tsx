import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Expo built-in icons

const favoritesData = [
    { id: '1', name: 'Toyota Prius Hybrid', price: '$40/day' },
    { id: '2', name: 'Toyota Prius Hybrid', price: '$40/day' },
    { id: '3', name: 'Toyota Prius Hybrid', price: '$40/day' },
    { id: '4', name: 'Toyota Prius Hybrid', price: '$40/day' },
];

export default function FavoritesScreen() {
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {/* Car Icon */}
            <Ionicons name="car-outline" size={40} color="black" style={styles.carIcon} />

            {/* Car Info */}
            <View style={styles.info}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.subtitle}>🚗 5 seats   ⚙️ Automatic   📍 Unlimited km</Text>

                <TouchableOpacity>
                    <Text style={styles.link}>See Locations Near You →</Text>
                </TouchableOpacity>
            </View>

            {/* Price */}
            <Text style={styles.price}>{item.price}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Top Header */}
            <View style={styles.headerBar}>
                <Text style={styles.headerText}>Favorites</Text>
            </View>

            {/* List */}
            <FlatList
                data={favoritesData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerBar: {
        backgroundColor: '#2E8B8B', // <-- same teal as bottom bar
        paddingTop: 40,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4, // adds shadow on Android
        shadowColor: '#000', // adds shadow on iOS
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff', // white text
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
    },
    carIcon: {
        marginRight: 10,
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        marginVertical: 3,
    },
    link: {
        fontSize: 13,
        color: '#007b83',
        fontWeight: '500',
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
