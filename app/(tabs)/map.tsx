import { Car } from "@/constants/Car";
import { fetchCars } from "@/services/CarService";
import { Ionicons } from '@expo/vector-icons';
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, Dimensions,
    Image,
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';


async function loadCars(): Promise<Car[]> {
    try {
        const cars = await fetchCars();
        if (!cars || !Array.isArray(cars)) {
            throw new Error("Invalid car data received");
        }
        return cars;
    } catch (error) {
        console.error("Final error loading cars:", error);
        return [];
    }
}

export default function MapScreen() {
    const [allCars, setAllCars] = useState<Car[]>([]);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterVisible, setFilterVisible] = useState(false);
    const [filteredCars, setFilteredCars] = useState<Car[]>([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minSeats, setMinSeats] = useState('');
    const [minRatings, setMinRatings] = useState('');
    const router = useRouter();

    const openMaps = (lat: number, lng: number) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        Linking.openURL(url);
    };

    const closeModal = () => setSelectedCar(null);

    const applyFilters = () => {
        const filtered = allCars.filter(car => {
            const priceNum = parseInt(car.price.replace(/\D/g, ''));
            const seatsNum = car.seats ?? 0;
            const ratingsNum = car.ratings ?? 0;

            return (
                (!minPrice || priceNum >= parseInt(minPrice)) &&
                (!maxPrice || priceNum <= parseInt(maxPrice)) &&
                (!minSeats || seatsNum >= parseInt(minSeats)) &&
                (!minRatings || ratingsNum >= parseInt(minRatings))
            );
        });
        setFilteredCars(filtered);
        setFilterVisible(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await loadCars();
                if (data) {
                    setAllCars(data);
                    setFilteredCars(data);
                } else {
                    setAllCars([]);
                    setFilteredCars([]);
                }
            } catch (err) {
                console.error("Error loading cars:", err);
                setError("Failed to load car data. Please try again later.");
                setAllCars([]);
                setFilteredCars([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff"/>
                <Text style={{marginTop: 8}}>Loading map data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={{flex: 1}}>
            <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
                <Text style={styles.filterButtonText}>Filter</Text>
            </TouchableOpacity>

            {filteredCars.length > 0 ? (
                <MapView
                    style={{flex: 1}}
                    initialRegion={{
                        latitude: 55.3962,
                        longitude: 10.3906,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    }}
                >
                    {filteredCars.map((poi) => (
                        <Marker
                            key={poi.id}
                            coordinate={poi.coords}
                            onPress={() => setSelectedCar(poi)}
                        >
                            <Ionicons name="location" size={30} color="red"/>
                        </Marker>
                    ))}
                </MapView>
            ) : (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>No cars available with current filters</Text>
                </View>
            )}

            {/* Filter Modal */}
            <Modal visible={filterVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.filterModal}>
                        <Text style={styles.modalTitle}>Filter Cars</Text>
                        <ScrollView>
                            {/* Min Price */}
                            <Text>Min Price (DKK/day): {minPrice || 0}</Text>
                            <Slider
                                style={{width: '100%', height: 40}}
                                minimumValue={0}
                                maximumValue={5000}
                                step={50}
                                value={Number(minPrice) || 0}
                                onValueChange={(value) => setMinPrice(value.toString())}
                                minimumTrackTintColor="#1EB1FC"
                                maximumTrackTintColor="#d3d3d3"
                            />

                            {/* Max Price */}
                            <Text>Max Price (DKK/day): {maxPrice || 0}</Text>
                            <Slider
                                style={{width: '100%', height: 40}}
                                minimumValue={0}
                                maximumValue={5000}
                                step={50}
                                value={Number(maxPrice) || 0}
                                onValueChange={(value) => setMaxPrice(value.toString())}
                                minimumTrackTintColor="#1EB1FC"
                                maximumTrackTintColor="#d3d3d3"
                            />

                            {/* Min Seats */}
                            <Text>Min Seats: {minSeats || 0}</Text>
                            <Slider
                                style={{width: '100%', height: 40}}
                                minimumValue={1}
                                maximumValue={8}
                                step={1}
                                value={Number(minSeats) || 1}
                                onValueChange={(value) => setMinSeats(value.toString())}
                                minimumTrackTintColor="#1EB1FC"
                                maximumTrackTintColor="#d3d3d3"
                            />

                            {/* Min Ratings */}
                            <Text>Min Ratings: {minRatings || 0}</Text>
                            <Slider
                                style={{width: '100%', height: 40}}
                                minimumValue={1}
                                maximumValue={5}
                                step={1}
                                value={Number(minRatings) || 1}
                                onValueChange={(value) => setMinRatings(value.toString())}
                                minimumTrackTintColor="#1EB1FC"
                                maximumTrackTintColor="#d3d3d3"
                            />
                        </ScrollView>

                        {/* Apply Filters */}
                        <TouchableOpacity style={styles.button} onPress={applyFilters}>
                            <Text style={styles.buttonText}>Apply Filters</Text>
                        </TouchableOpacity>

                        {/* Reset Filters */}
                        <TouchableOpacity
                            style={[styles.button, {backgroundColor: '#ff5c5c'}]}
                            onPress={() => {
                                setMinPrice('0');
                                setMaxPrice('5000');
                                setMinSeats('1');
                                setMinRatings('1');
                            }}
                        >
                            <Text style={styles.buttonText}>Reset Filters</Text>
                        </TouchableOpacity>

                        {/* Close Modal */}
                        <TouchableOpacity
                            style={[styles.button, {backgroundColor: '#aaa'}]}
                            onPress={() => setFilterVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Car Modal */}
            <Modal
                visible={selectedCar !== null}
                transparent
                animationType="fade"
                onRequestClose={closeModal}
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={closeModal} activeOpacity={1}>
                    <View style={styles.modalContent}>
                        {selectedCar && (
                            <>
                                <Image source={{uri: selectedCar.image}} style={styles.modalImage}/>
                                <View style={styles.modalInfo}>
                                    <Text style={styles.modalTitle}>{selectedCar.title}</Text>
                                    <Text style={styles.modalPrice}>{selectedCar.price}</Text>

                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => {
                                            closeModal();
                                            router.push({pathname: `/id`, params: {id: selectedCar.id, from: 'map'}});
                                        }}
                                    >
                                        <Text style={styles.buttonText}>Find More Details</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.button, {backgroundColor: '#2196F3'}]}
                                        onPress={() => openMaps(selectedCar.coords.latitude, selectedCar.coords.longitude)}
                                    >
                                        <Text style={styles.buttonText}>Find Location</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    filterButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        backgroundColor: '#4b7b8a',
        padding: 10,
        borderRadius: 8,
    },
    filterButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterModal: {
        width: width * 0.85,
        maxHeight: '80%',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 8,
        padding: 8,
        marginVertical: 6,
    },
    modalContent: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        width: width * 0.9,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    modalImage: {
        width: 120,
        height: 120,
        borderRadius: 8,
        resizeMode: 'contain',
    },
    modalInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 4,
    },
    modalPrice: {
        color: 'green',
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#4b7b8a',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        textAlign: 'center'
    },
    map: {flex: 1},
    imagePlaceholder: {
        width: 50,
        height: 50,
        backgroundColor: '#eee',
        borderRadius: 4
    },
    textContainer: {
        marginLeft: 8
    },
    noDataText: {
        textAlign: 'center'
    },
    callout: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 8,
        width: 220,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Android shadow
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    noDataContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{translateX: -50}, {translateY: -50}],
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        borderRadius: 4,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    price: {
        color: 'green',
        marginTop: 4,
    },
});
