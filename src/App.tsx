import React from "react";

import "./App.css";
import { useState } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

type WordRowType = {
  id: number;
  en: string | null;
  cht: string | null;
  part_speech: string | null;
};

function getRandom(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomRow(Words: WordRowType[]) {
  const wordRowLen = Words.length;
  let randomWordId = 0;
  if (wordRowLen > 0) {
    randomWordId = getRandom(0, wordRowLen - 1);
  }

  return Words[randomWordId];
}

function App() {
  // const [word, setWord] = useState("");
  const [showWordCht, setShowWordCht] = useState<string | null>("");
  const [showWord, setShowWord] = useState<string | null>("");
  const [wordRows, setWordRows] = useState<WordRowType[]>([]);
  const [wordText, setWordText] = useState<string>("");

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "en", headerName: "EN", width: 130 },
    { field: "cht", headerName: "CHT", width: 130 },
    {
      field: "part_speech",
      headerName: "Part of speech",
      width: 90,
    },
    {
      field: "fullWord",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.en || ""} ${params.row.cht || ""}`,
    },
  ];

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const nextWord = () => {
    if (showWord === wordText && wordText !== "") {
      const wordRow = getRandomRow(wordRows);
      setShowWord(wordRow.en);
      setShowWordCht(wordRow.cht);
      setWordText("");
    }
  };

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsText(file);

    reader.onloadend = () => {
      const text = String(reader.result);
      const lines = text.split("\n");
      const newWords = [];

      for (var line = 0; line < lines.length; line++) {
        const _word = lines[line].split(",");
        if (_word.length >= 4) {
          const en = _word[2];
          const cht = _word[3];

          const newWord = {
            id: line,
            en: en,
            cht: cht,
            part_speech: "",
          };

          newWords.push(newWord);
        }
      }

      setWordRows(newWords);
      const wordRow = getRandomRow(newWords);
      setShowWord(wordRow.en);
      setShowWordCht(wordRow.cht);
    };
  };

  return (
    <div className="App">
      <DataGrid
        rows={wordRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {Array.from(Array(6)).map((_, index) => (
          <Grid xs={2} sm={4} md={4} key={index}>
            <Item>xs=2</Item>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "block", displayPrint: "none" }}>
        {showWord}
        {showWordCht}
      </Box>

      <TextField
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
        value={wordText}
        onKeyDown={(ev) => {
          if (ev.key === "Enter") {
            nextWord();
            ev.preventDefault();
          }
        }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setWordText(event.target.value);
        }}
      />

      <Button
        variant="contained"
        endIcon={<SendIcon />}
        onClick={() => {
          nextWord();
        }}
      >
        Send
      </Button>

      <Button variant="contained" component="label">
        Upload File
        <input type="file" hidden onChange={handleFileUpload} accept=".csv" />
      </Button>
    </div>
  );
}

export default App;
