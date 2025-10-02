import React, {useMemo, useState} from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';

import{Ionicons} from "@expo/vector-icons";

type Car = {
    id: string;
    name: string;
    image: string;
    rating: number;
    price: number;
    total: number;
    mostUsed?: boolean;
};

const DATA: Car[]=[
    {id: "1", name: "BMWi3", image: require('../../assets/TeslaModel3.jpg'), rating: 4.5, price: 38.55, total: 388, mostUsed: true},
    {id: "2", name: "NissanLeaf", image: require('../../assets/NissanLeaf.jpg'), rating: 4, price: 35.44, total: 345, mostUsed: true},
    {id: "3", name: "TeslaModel3", image: require('../../assets/TeslaModel3.jpg'), rating: 4.7, price: 31.33, total: 310, mostUsed: true}
];

const FILTERS = ["All", "Price", "Rating", "Most Used"] as const;
type Filter = typeof FILTERS[number];

const GAP = 12;
const CARD_W = (Dimensions.get("window").width - GAP * 3)/2;

export default function DiscoverScreen() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const list = useMemo(() =>{
      const base = DATA.filter((c) =>
      c.name.toLowerCase().includes(q.trim().toLowerCase())
      ).filter((c)=>(filter === "Most Used" ? c.mostUsed : true));

      if (filter === "Price") return [...base].sort((a,b)=>b.price-a.price);
      if (filter === "Rating") return [...base].sort((a,b)=>b.rating-a.rating);
      return base;
  }, [q,filter]);

  return(
      <SafeAreaView style={s.wrap}>
          {/* teal header */}
          <View style={s.header}>
              <View style={s.avatar} />
              <TouchableOpacity style={s.refresh} onPress={() => setQ("")}>
                  <Ionicons name="reload" size={18} color="#0b3b3b" />
              </TouchableOpacity>
          </View>

          {/* search bar */}
          <View style={s.search}>
              <Ionicons name="search" size={16} color="#9ca3af" />
              <TextInput
                  placeholder="Seach cars"
                  placeholderTextColor="#9ca3af"
                  value={q}
                  onChangeText={setQ}
                  style={s.input}
                  returnKeyType="search"
                  />
          </View>

          {/* filters */}
          <View style={s.chips}>
              {FILTERS.map((f) => (
                  <TouchableOpacity
                      key={f}
                      onPress={() => setFilter(f)}
                      style={[s.chip, f === filter && s.chipActive]}
                  >
                      <Text style={[s.chipTxt, f === filter && s.chipTxtActive]}>{f}</Text>
                  </TouchableOpacity>
              ))}
          </View>
          <FlatList
              data={list}
              keyExtractor={(i) => i.id}
              numColumns={2}
              columnWrapperStyle={{ gap: GAP, paddingHorizontal: GAP }}
              contentContainerStyle={{ gap: GAP, paddingVertical: 14, paddingBottom: 100 }}
              renderItem={({ item }) => (
                  <TouchableOpacity style={s.card} activeOpacity={0.9}>
                      <Image source={{ uri: item.image }} style={s.img} />
                      <Text style={s.name} numberOfLines={1}>{item.name}</Text>
                      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                          <Text style={s.price}>€{item.price.toFixed(2)}</Text>
                          <Text style={s.per}>/day</Text>
                      </View>
                      <Text style={s.total}>€{item.total.toFixed(2)} total</Text>
                  </TouchableOpacity>
              )}
          />
      </SafeAreaView>

  );

}

const s = StyleSheet.create({
    wrap:{flex:1,backgroundColor:"#fff"},

header: {
    backgroundColor: "#4b7b8a",
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
},
avatar: {
    width: 64, height: 64, borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.85)",
},
refresh: {
    position: "absolute", right: 14, top: 18,
        width: 34, height: 34, borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.9)",
        alignItems: "center", justifyContent: "center",
},

search: {
    marginTop: -18, marginHorizontal: 14, backgroundColor: "#f3f4f6",
        borderRadius: 22, paddingHorizontal: 12, paddingVertical: 8,
        flexDirection: "row", alignItems: "center",
},
input: { marginLeft: 8, flex: 1, color: "#111827" },

chips: { flexDirection: "row", paddingHorizontal: 14, paddingTop: 10 },
chip: {
    borderWidth: 1, borderColor: "#d1d5db",
        paddingHorizontal: 12, paddingVertical: 6,
        borderRadius: 16, marginRight: 8, backgroundColor: "#fff",
},
chipActive: { backgroundColor: "#111827", borderColor: "#111827" },
chipTxt: { color: "#374151", fontWeight: "600", fontSize: 13 },
chipTxtActive: { color: "#fff" },

card: {
    width: CARD_W, backgroundColor: "#fff",
        borderRadius: 14, padding: 10,
        shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
},
img: { width: "100%", height: CARD_W * 0.55, borderRadius: 10, backgroundColor: "#e5e7eb", marginBottom: 8 },
name: { fontWeight: "700", color: "#111827", marginBottom: 4 },
price: { color: "#ea580c", fontWeight: "800", fontSize: 16 },
per: { color: "#ea580c", marginLeft: 2 },
total: { color: "#9ca3af", fontSize: 12, marginTop: 2 },
});


/*const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
*/