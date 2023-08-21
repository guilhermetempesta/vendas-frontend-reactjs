import * as React from 'react';
import { GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';

export default function CustomToolBar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton/>
    </GridToolbarContainer>    
  );
}