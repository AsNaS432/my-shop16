import React, { useContext, useState } from 'react';
import { Container, Typography, Grid, IconButton, useTheme, Button, Paper } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import AuthPage from './pages/AuthPage';
import LoginButton from './components/LoginButton';
import AIChatPopup from './components/AIChatPopup';
import { ThemeContext } from './context/ThemeContext';

function App() {
  const theme = useTheme();
  const { toggleTheme } = useContext(ThemeContext);
  const [openAI, setOpenAI] = useState(false); // State for AI chat popup

  return (
    <Router>
      <Container>
        <Paper elevation={6} sx={{ 
          p: 3,
          mb: 4,
          textAlign: 'center',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1a237e, #283593)' 
            : 'linear-gradient(145deg, #3f51b5, #5c6bc0)',
          color: 'white',
          borderRadius: 2,
          boxShadow: theme.shadows[10]
        }}>
          <Typography variant="h2" component="h1" sx={{ 
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase'
          }}>
            MYtoolsShop
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
            Магазин качественных комплектующих
          </Typography>
        </Paper>
        <IconButton 
          onClick={toggleTheme} 
          sx={{ position: 'absolute', top: 16, right: 16 }}
        >
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <LoginButton /> {/* Removed profile button */}
        <Button 
          variant="contained" 
          onClick={() => setOpenAI(true)}
          sx={{ position: 'absolute', top: 16, right: 80 }}
        >
          AI Помощник
        </Button>
        <AIChatPopup
          open={openAI} 
          onClose={() => setOpenAI(false)}
        />
        
        <Routes>
          <Route path="/" element={
            <Grid container spacing={2}>
              <Grid item xs={12} md={9}>
                <ProductList />
              </Grid>
              <Grid item xs={12} md={3}>
                <Cart />
              </Grid>
            </Grid>
          } />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
