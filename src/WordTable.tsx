import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";

import { useState } from "react";

function WordTable(props: any) {
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

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

  return (
    <div>
      <DataGrid
        rows={props.wordRows}
        columns={columns}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          const selectId: number = Number(newRowSelectionModel[0]);
          const en = props.wordRows[selectId].en;
          setRowSelectionModel(newRowSelectionModel);

          window.speechSynthesis.cancel();

          props.speak(en as string);
        }}
        rowSelectionModel={rowSelectionModel}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
}

export default WordTable;
