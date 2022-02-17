import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import styled, { ThemeProvider } from "styled-components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
const theme = {
  bgColor: "#1c1c1c",
  grey: "#6e6e6e",
  darkGrey: "#303030",
  fontColor: "white",
};
const STORAGE_KEY = "@toDos";

export default function App() {
  const { width } = useWindowDimensions();
  const [work, setWork] = useState(true);
  const [value, setValue] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    loadTodos();
  }, []);
  const onWorkPress = () => {
    setWork(true);
  };
  const onTravelPress = () => {
    setWork(false);
  };
  const onChangeText = (e) => {
    setValue(e);
  };
  const addToDos = async () => {
    if (value === "") return;
    const newTodos = { ...toDos, [Date.now()]: { work, value } };
    setToDos(newTodos);
    await saveToDos(newTodos);
    setValue("");
  };
  const saveToDos = async (newTodos) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
  };
  const loadTodos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  };
  const onDeletePress = (key) => {
    Alert.alert(
      `Delete ${toDos[key].work ? "Work" : "Travel"}`,
      "Are you sure?",
      [
        {
          text: "Cancel",
        },
        {
          text: "I'm sure",
          onPress: async () => {
            const newTodos = {
              ...toDos,
            };
            delete newTodos[key];
            setToDos(newTodos);
            await saveToDos(newTodos);
          },
        },
      ]
    );
  };
  return (
    <ThemeProvider theme={theme}>
      <Container screenWidth={width}>
        <StatusBar style="light" />
        <Header>
          <TouchableOpacity onPress={onWorkPress}>
            <Tap style={{ color: work ? theme.fontColor : theme.grey }}>
              Work
            </Tap>
          </TouchableOpacity>
          <TouchableOpacity onPress={onTravelPress}>
            <Tap style={{ color: work ? theme.grey : theme.fontColor }}>
              Travel
            </Tap>
          </TouchableOpacity>
        </Header>
        <Input
          onSubmitEditing={addToDos}
          onChangeText={onChangeText}
          screenWidth={width}
          placeholder={work ? "Add To do" : "Where do you want to go?"}
          value={value}
        />
        <ScrollView>
          {toDos &&
            Object.keys(toDos).map((key) =>
              work === toDos[key].work ? (
                <ToDos screenWidth={width} key={key}>
                  <ToDo>{toDos[key].value}</ToDo>
                  <TouchableOpacity onPress={() => onDeletePress(key)}>
                    <DeleteBtn>
                      <Fontisto name="trash" size={18} color={theme.grey} />
                    </DeleteBtn>
                  </TouchableOpacity>
                </ToDos>
              ) : null
            )}
        </ScrollView>
      </Container>
    </ThemeProvider>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${(p) => p.theme.bgColor};
  padding-horizontal: ${(p) => p.screenWidth / 13};
`;
const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: 15;
`;
const Tap = styled.Text`
  margin-top: 100;
  font-size: 48;
  font-weight: 500;
`;
const Input = styled.TextInput`
  background-color: ${(p) => p.theme.fontColor};
  padding-vertical: 20;
  padding-horizontal: 15;
  border-radius: 30;
  margin-top: 20;
  margin-bottom: 20;
  font-size: 15;
`;
const ToDos = styled.View`
  background-color: ${(p) => p.theme.darkGrey};
  padding-horizontal: 15;
  padding-vertical: 15;
  border-radius: 10;
  margin-top: 10;

  flex-direction: row;
  flex: 1;
  justify-content: space-between;
`;
const ToDo = styled.Text`
  color: ${(p) => p.theme.fontColor};
`;
const DeleteBtn = styled.Text``;
