import { Box, Container, Paper, Typography } from "@mui/material";
import { Button } from "@mui/material";

export default function BottomNav() {
  return (
    <Paper elevation={8} square variant="outlined">
      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          ali: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          p: 2,
        }}
      >
        {/* {" "}
        <img style={{ height: "1.5rem" }} src={"/lotsight.svg"}></img> */}

        <Button size="small" variant="outlined" href={"/"}>
          Home
        </Button>
        <Button size="small" variant="outlined" href={"/enforcement"}>
          Enforcement
        </Button>
        <Button size="small" variant="outlined" href={"/scanner"}>
          Scan API
        </Button>
        <Button size="small" variant="outlined" href={"/parking-lots"}>
          Lots
        </Button>
      </Container>
    </Paper>
  );
}
