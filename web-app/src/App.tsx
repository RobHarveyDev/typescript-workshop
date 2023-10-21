import "./App.css";
import PetsApi from "./api/pets-api";
import { Pet } from "@backend/types/Pet";
import { CssBaseline, Grid, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import PetList from "./components/PetList";
import Header from "./components/Header";
import PetDetails from "./components/PetDetails";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import en from "date-fns/locale/en-GB";

const theme = createTheme({
  palette: {
    primary: {
      main: "#22313f",
    },
    secondary: {
      main: "#ffae04",
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

const petsApi = new PetsApi();

function App() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const triggerUpdateAllPetData = () => {
    setIsLoading(true);
    petsApi
      .getAllPets()
      .then(setPets)
      .finally(() => setIsLoading(false));
  };
  const onPetUpdated = useCallback(
    (pet: Pet) => {
      const petIndex = pets.findIndex((p) => p.id === pet.id);
      if (petIndex === -1) {
        return;
      }

      setPets([...pets.slice(0, petIndex), pet, ...pets.slice(petIndex + 1)]);
    },
    [pets]
  );

  useEffect(triggerUpdateAllPetData, []);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={en}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <Header
            triggerUpdateAllPetData={triggerUpdateAllPetData}
            appIsLoading={isLoading}
          />

          <Grid
            container
            columnSpacing={"2em"}
            sx={{
              maxWidth: "90%",
              mt: "2em",
              ml: "auto",
              mr: "auto",
            }}
          >
            <Grid item xs={4}>
              <PetList
                pets={pets}
                selectedPetId={selectedPetId}
                onSelectPet={(pet) => setSelectedPetId(pet.id)}
              />
            </Grid>
            <Grid item xs={8}>
              {selectedPet ? (
                <PetDetails pet={selectedPet} onPetUpdated={onPetUpdated} />
              ) : (
                <Typography>Select a pet...</Typography>
              )}
            </Grid>
          </Grid>
        </div>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
