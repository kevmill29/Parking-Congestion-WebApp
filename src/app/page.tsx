"use client";

import { useEffect, useRef, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import SortIcon from "@mui/icons-material/Sort";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { getDistance } from "@/lib/distances";
interface Lot {
  _id?: string;
  lotID: string;
  title: string;
  capacity: number;
  scans?: { plateNumber: string }[];
  scanCount: number;
  available?: number;
  location: string;
  allows: { [key: string]: boolean };
  distance: number;
}

export default function LotsListPage() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(true); // toggle for sort order
  const [displayMode, setDisplayMode] = useState<
    "resident" | "facstaff" | "visitor" | "commuter"
  >("commuter");
  const [targetBuilding, setTargetBuilding] = useState<
    "science-hall" | "lecture-center"
  >("science-hall");

  const buildingCoords = {
    "science-hall": { lat: 41.743050942491706, long: -74.08055594997064 },
    "lecture-center": { lat: 41.74267224856954, long: -74.08419207155384 },
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
        const filtered = processed.filter((item: Lot) => {
          return item.allows[displayMode] == true;
        });
        const filteredWithDistance = filtered.map((item: Lot) => {
          const coords = item.location
            .split(",")
            .map((item) => parseFloat(item));
          console.log(coords);
          console.log(buildingCoords[targetBuilding]);
          const distance = getDistance(
            buildingCoords[targetBuilding].lat,
            buildingCoords[targetBuilding].long,
            coords[0],
            coords[1]
          );
          return { ...item, distance };
        });

        setLots(filteredWithDistance);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [displayMode, targetBuilding]);

  // Sort handler
  const handleSort = () => {
    setSortAsc((prev) => !prev);
    setLots((prev) =>
      [...prev].sort(
        (a, b) =>
          sortAsc
            ? (b.available ?? 0) - (a.available ?? 0) // Descending
            : (a.available ?? 0) - (b.available ?? 0) // Ascending
      )
    );
  };

  const getColor = (percent: number) => {
    if (percent >= 90) return "error"; // red
    if (percent >= 70) return "warning"; // yellow
    return "success"; // green
  };

  const handleModePicker = (e) => {
    setDisplayMode(e.target.value);
  };
  const handleBuildingPicker = (e) => {
    setTargetBuilding(e.target.value);
  };

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
      >
        <FormControl>
          <InputLabel id="displayModePickerLabel">Parking Type</InputLabel>
          <Select
            labelId="displayModePickerLabel"
            id="displayModePicker"
            value={displayMode}
            label="Age"
            onChange={handleModePicker}
          >
            <MenuItem value={"resident"}>Resident Student</MenuItem>
            <MenuItem value={"commuter"}>Commuter Student</MenuItem>
            <MenuItem value={"facstaff"}>Faculty/Staff</MenuItem>{" "}
            <MenuItem value={"visitor"}>Visitor</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="targetBuildingLabel">Parking Near</InputLabel>
          <Select
            labelId="targetBuildingLabel"
            id="targetBuilding"
            value={targetBuilding}
            label="Age"
            onChange={handleBuildingPicker}
          >
            <MenuItem value={"science-hall"}>Science Hall</MenuItem>
            <MenuItem value={"lecture-center"}>Lecture Center</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          startIcon={<SortIcon />}
          onClick={handleSort}
        >
          Sort by Availability {sortAsc ? "(↓)" : "(↑)"}
        </Button>
      </Stack>

      {lots.length === 0 && (
        <Typography variant="body1" textAlign="center" color="text.secondary">
          No parking lots found in the database.
        </Typography>
      )}

      {lots.map((lot) => {
        const percent =
          lot.capacity > 0 ? (lot.scanCount / lot.capacity) * 100 : 0;

        return (
          <Paper
            key={lot.lotID}
            elevation={3}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">{lot.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {lot.distance.toFixed(2)}mi
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {lot.available} / {lot.capacity} available
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={percent}
              color={getColor(percent)}
              sx={{ height: 10, borderRadius: 5 }}
            />

            <Typography variant="caption" color="text.secondary">
              {Math.round(percent)}% occupied
            </Typography>
          </Paper>
        );
      })}
    </main>
  );
}
