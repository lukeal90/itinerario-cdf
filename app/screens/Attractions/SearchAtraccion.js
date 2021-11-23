import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
} from "react-native";
import { SearchBar } from "react-native-elements";
import AttracItem from "../../components/attracItem";
import TagItem from "../../components/tagItem";
import {getAttractionsByType, getAttractionsTypes, getAllAttractions} from "../../api/PosadasApi";

export default function SearchAtraccion(props) {
  const { navigation, route } = props;
  const index = route.params?.index;
  const horas = route.params?.horas;
  const [atraccion, setAtraccion] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [tags,setTags] = useState();


  async function searchByType() {
    if (selectedId === '' && search === '') {
      getAllAttractions().then((response)=>{
        setAtraccion(response.data);
      })
      .catch(() => alert("Error de servidor"));
    }
    if(selectedId !== ''){
      getAttractionsByType(selectedId).then((response)=>{
        setAtraccion(response.data);
      })
      .catch(() => alert("Error de servidor"));
    }
  }

  async function setAllTypes(){
    let tagFinal = []
    getAttractionsTypes()
    .then((attractions) => {
      attractions.data.forEach((tagName) => {
        let tag = {
          title: tagName, id: tagName
        }
        tagFinal.push(tag)
      })
      setTags(tagFinal);
    })
    .catch(() => alert("Error de servidor"));
  }

  async function searchItems(value){
    setSearch(value);
    getAllAttractions()
    .then((attractions) => {
      if (search !== '') {
        const filteredData = attractions.data.filter((i) => {
        return Object.values(i).join('').toLowerCase().includes(search.toLowerCase())
        })
        setAtraccion(filteredData)
      }
      else{
        setAtraccion(attractions.data)
      }
  })
  }
 
  useEffect(() => {
    setAllTypes();
  },[])

  useEffect(() => {
    searchByType();
  }, [selectedId]);

  

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF", marginTop:20}}>
      <View style={{ padding: 20}}>
        <SearchBar
          placeholder="Buscar Atracciones..."
          onChangeText={(e) => searchItems(e)}
          value={search}
          placeholderTextColor={"#0B3534"}
          inputContainerStyle={styles.searchBarInput}
          containerStyle={styles.searchBarContainer}
          inputStyle={styles.searchBarInput}
          searchIcon={{ color: "#32BB77" }}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <SafeAreaView style={styles.container}>
          <FlatList
            horizontal={true}
            data={tags}
            renderItem={renderTagItem}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            extraData={selectedId}
          />
        </SafeAreaView>
      </View>

      {(search.length) > 0 || search === '' ? (
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
          <SafeAreaView style={styles.container}>
            <FlatList
              keyExtractor={(item) => item.id.toString()}
              data={atraccion}
              renderItem={renderAtracc}
            />
          </SafeAreaView>
        </View>
      ): 
      <View>
          <Text style={styles.secondaryText}>No se encontraron resultados</Text>
        </View>
      }
    </View>
  );

  function renderAtracc({ item }) {
    return (
      <AttracItem
        item={item}
        onPress={() => {
          //console.log(item);
          navigation.navigate("detalleAtraccion", { item: item , index: index , horas : horas});
        }}
      />
    );
  }

  function renderTagItem({ item }) {
    const backgroundColor = item.id === selectedId ? "#32BB77" : "#FFFFFF";
    const color = item.id === selectedId ? "#FFFFFF" : "#32BB77";

    return (
      <TagItem
        item={item}
        onPress={() => {
          if(selectedId === ''){
            setSelectedId(item.id)
          }else{
            setSelectedId('')
          }
        }}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  }


}

const styles = StyleSheet.create({
  input: {
    alignSelf: "center",
    paddingVertical: 15,
    marginVertical: 10,
    width: "60%",
    borderRadius: 32,
    borderColor: "#32BB77",
    borderWidth: 1,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
  },
  searchBarContainer: {
    borderColor: "#32BB77",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    height: 45,
    borderWidth: 2,
    borderTopColor: "#32BB77",
    borderBottomColor: "#32BB77",
  },
  searchBarInput: {
    height: 30,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    color: "#0B3534",
  },
  container: {
    flex: 1,
    //marginTop: StatusBar.currentHeight || 0,
  },
  secondaryText: {
    fontSize: 14,
    color: "grey",
  },
});
