// history.tsx
import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {getCarsHistoryFromStorage} from "@/api/Storage";
import {Car} from "@/constants/Car";

export default function HistoryScreen() {
    const [historyData, setHistoryData] = useState<Car[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCarsHistoryFromStorage();
                setHistoryData(data);
            } catch (err) {
                console.error("Error loading cars history:", err);
            }
        };
        fetchData();
    }, []);
    const renderItem = ({item}) => {
        const isCancelled = item.status === 'Cancelled';

        return (
            <View style={styles.card}>
                {/* Car icon with optional dollar icon */}
                <View style={styles.iconContainer}>
                    <Ionicons
                        name={isCancelled ? 'car' : 'car-outline'}
                        size={isCancelled ? 44 : 40}
                        color="black"
                    />
                    {!isCancelled && (
                        <Ionicons
                            name="cash-outline"
                            size={16}
                            color="black"
                            style={styles.cashIcon}
                        />
                    )}
                </View>

                {/* Car Info */}
                <View style={styles.info}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.subtitle}>XX Location to XX Location</Text>

                    <TouchableOpacity>
                        <Text style={styles.link}>View Details →</Text>
                    </TouchableOpacity>
                </View>

                {/* Date and Price */}
                <View style={styles.right}>
                    <Text style={styles.date}>{item.date}</Text>
                    <Text
                        style={[
                            styles.price,
                            isCancelled && styles.cancelled,
                        ]}
                    >
                        {item.price}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerBar}>
                <Text style={styles.headerText}>Activity History</Text>
            </View>

            <FlatList
                data={historyData}
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
        backgroundColor: '#2E8B8B',
        paddingTop: 40,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
    },
    iconContainer: {
        marginRight: 10,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    cashIcon: {
        position: 'absolute',
        bottom: 0,
        right: -2,
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
        marginVertical: 2,
    },
    link: {
        fontSize: 13,
        color: '#007b83',
        fontWeight: '500',
    },
    right: {
        alignItems: 'flex-end',
    },
    date: {
        fontSize: 12,
        color: '#555',
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    cancelled: {
        color: 'red',
        fontWeight: '600',
    },
});
