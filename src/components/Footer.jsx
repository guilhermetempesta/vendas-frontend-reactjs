import Typography from '@mui/material/Typography';
// import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          {/* <Link color="inherit" href="https://mui.com/">
            Material UI
          </Link>{' '} */}
          {new Date().getFullYear()}
          {'.'}
        </Typography>            
      </Container>
    </Box>
  );
}