import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import COLORS from "../colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Rating } from 'react-native-elements';
import {GreenButton} from "../../components/buttonI";
import RNPickerSelect from "react-native-picker-select";
import {fetchUser , updateItinerary} from '../../api/PosadasApi';

export default function DetalleAtraccion({ route, navigation }) {
  const { item , index  , horas} = route.params;
  const [horariosDisponibles , setHorariosDisponibles] = useState([]);
  const [horario , setHorario] = useState();
  const [user , setUser] = useState();

useEffect(() => {
  fetchUser().then(res => setUser(res.data)).catch(error=> console.log(error));
  const data = timeAvailability(horas).map(
    horario => horario < 10 ? 
    ({value: `0${horario.toString()}:00`, label: `0${horario.toString()}:00`}) 
    : ({value: `${horario.toString()}:00` , label : `${horario.toString()}:00`})
  );
  setHorariosDisponibles(data);
  setHorario(data[0].label);
} , [])

const addAttraction = () => {
  if(horario !== 'asd'){
    let workUser = user;
    let arr = user.itinerary.totalDays[index].attractions;
    arr.push({
        address: item.address,
        dateAndHour: horario,
        id: item.id,
        name: item.name,
        typeAttraction: item.typeAttraction,
        rating: item.rating,
        description: item.description,
      })
    arr.sort((a, b) => {return Number(a.dateAndHour.split(':' , 1)) - Number(b.dateAndHour.split(':' , 1))}); //magia
    workUser.itinerary.totalDays[index].attractions = arr;
    const attendanceDate = workUser.itinerary.totalDays[index].attendanceDate;
    const request = {
      generalInfo: user.generalInfo,
      id: user.id,
      type: user.type,
      itinerary: {
        hotel: user.itinerary.hotel,
        dayFrom: user.itinerary.dayFrom,
        dayTo: user.itinerary.dayTo,
        totalDays: workUser.itinerary.totalDays,
      },
      newAttraction:{
        typeAttraction : item.typeAttraction,
        name: item.name,
        attendanceDate: attendanceDate,
      }
    }
    updateItineraryApiCall(request)
  }
}

const updateItineraryApiCall = (request) => {
  updateItinerary(JSON.stringify(request)).then(
    res => {
      if(res.status == 200){
        setTimeout(() => {
          navigation.reset({index : 0, routes: [{name: 'myTrip'}]})
        } , 600)
      }
    }
  ).catch(error => {
    alert('Error del servidor.');
  })
}


const timeAvailability = (attractions) => {
   let hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
   let timeUsed = attractions.sort((a, b) => { return b - a });
   timeUsed.forEach(hour => hours.splice(hour - 1, 1));
   return hours;
}

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: COLORS.white,
        paddingBottom: 20,
      }}
    >
      <ImageBackground style={style.headerImage} source={{ uri: item.image }} />
      <View>
   

        <View style={{ marginTop: 20, paddingHorizontal: 20}}>
          <Text style={{ fontSize: 30, fontWeight: "bold", textAlign:'center' }}>{item.name}</Text>
          <View>
            <Rating    
                  style={{ paddingVertical: 10 }}
                  readonly 
                  startingValue={item.rating}
                  imageSize={20}
                />
            </View>
          <View style ={style.directionContainer}>
                    <Icon
                      name='room'
                      color='#32BB77' 
                      size={28}
                     />

                 <Text style={{ fontSize: 17, textAlign:'center', color: COLORS.grey, fontWeight: "bold"}}>
                    {item.address}
                  </Text>

            </View>
           

          <View style={{marginTop: 20, marginBottom: 10, marginLeft: 10, marginRight: 10}}>
              <Text style={{ fontSize: 20, textAlign:'justify' }}>
                {item.description}
              </Text>
          </View>
        </View>
        <View style={style.marginInfo}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Categoria:
          </Text>
          <View style={[style.tagInfo, {marginLeft: 50}]}>
            <Text style={{fontSize: 20, fontWeight: "bold", color: COLORS.grey}}>
              {item.typeAttraction}
            </Text>
          </View>
        </View>

        <View style={style.marginInfo}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Horario: 
          </Text>
          <View style={[style.tagInfo,{marginLeft: 70}]}>
            <RNPickerSelect
              placeholder={{value: 'asd'  , label: 'Seleccione un horario'}}
              items={horariosDisponibles}
              onValueChange={(value) => { 
                setHorario(value);
              }}
            >
              <Text style={{marginLeft: 5}}>
                {horario}
              </Text>
            </RNPickerSelect>
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <GreenButton text={"AGREGAR"} onPress={addAttraction} />
        </View>

      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  btn: {
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  tagInfo: {
    height: 40,
    alignItems: "center",
    marginLeft: 40,
    paddingLeft: 20,
    flex: 1,
    backgroundColor: COLORS.secondary,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    flexDirection: "row",
  },
  iconContainer: {
    position: "absolute",
    height: 60,
    width: 60,
    backgroundColor: COLORS.primary,
    top: -30,
    right: 20,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    height: 400,
    borderBottomRightRadius: 160,
    borderBottomLeftRadius: 160,
    overflow: "hidden",
  },
  header: {
    marginTop: 60,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    justifyContent: "space-between",
  },
  marginInfo: {
    marginTop: 20,
    flexDirection: "row", 
    justifyContent: "space-between",  
    paddingLeft: 20, 
    alignItems: "center"
  },
  direccion:{
    marginTop:10,
  },
  directionContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center'
     
  }
});
