"use client";

import {
  Typography,
  LinearProgress,
  Stack,
  Paper,
  Box,
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Lot } from "../page";

export default function Page() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [lotID, setLotID] = useState<string>("OMP");
  const [plateNumber, setPlateNumber] = useState<string>("");
  const [currentLot, setCurrentLot] = useState<Lot>();
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  // type RequestData = {
  // plateNumber: string;
  // lotID: string;
  // scanType: "entry" | "exit";
  // };

  const addCar = async (plateNumber: string) => {
    await fetch("/api/scan/", {
      method: "POST",
      body: JSON.stringify({ plateNumber, lotID, scanType: "entry" }),
    });
  };
  const removeCar = async (plateNumber: string) => {
    await fetch("/api/scan/", {
      method: "POST",
      body: JSON.stringify({ plateNumber, lotID, scanType: "exit" }),
    });
  };

  const handlePlateChange = (e) => {
    setPlateNumber(e.target.value);
  };

  const getColor = (percent: number) => {
    if (percent >= 90) return "error"; // red
    if (percent >= 70) return "warning"; // yellow
    return "success"; // green
  };
  const handleSelectLot = (e) => {
    setLotID(e.target.value);
  };
  useEffect(() => {
    fetch("/api/lots")
      .then((res) => res.json())
      .then((data) => {
        // Compute derived data fields if not provided
        const processed = data.map((lot: Lot) => {
          const available = lot.available ?? lot.capacity - lot.scanCount;
          return { ...lot, available };
        });
        setLots(processed);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [refresh]);

  if (loading) {
    return (
      <main className="p-6 max-w-3xl mx-auto text-center">
        <Typography variant="h5" sx={{ mb: 2 }}>
          Loading parking lot data...
        </Typography>
        <LinearProgress />
      </main>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Typography variant="h4" gutterBottom>
        Parking Lots Overview
      </Typography>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      ></Stack>
      <FormControl>
        <InputLabel id="displayModePickerLabel">Permit Type</InputLabel>
        <Select
          labelId="displayModePickerLabel"
          id="displayModePicker"
          value={lotID}
          label="Display Mode"
          onChange={handleSelectLot}
        >
          {lots.map((lot) => {
            return <MenuItem value={lot.lotID}>{lot.title}</MenuItem>;
          })}
        </Select>
      </FormControl>

      {/* a text input to type a license plate, then buttons for entry and exit scans */}
      {/* text input */}
      <Box>
        <TextField
          id="outlined-basic"
          label="License Plate"
          variant="outlined"
          value={plateNumber}
          onChange={handlePlateChange}
        />
      </Box>
      <Box sx={{ my: 2 }}>
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={() => addCar(plateNumber)}
        >
          Entry Scan
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => removeCar(plateNumber)}
        >
          Exit Scan
        </Button>
      </Box>
    </main>
  );
}
