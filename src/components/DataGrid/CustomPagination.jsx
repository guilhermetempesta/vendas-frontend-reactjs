import * as React from 'react';
import {
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';

export default function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      sx={{
        position: 'absolute',
        left: '1px'
      }}
      color="primary"
      count={pageCount}
      page={page + 1}
      showFirstButton 
      showLastButton
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}