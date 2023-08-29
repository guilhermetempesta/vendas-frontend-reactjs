import React, { useState, useEffect, useCallback } from 'react';
import { getProductsPagination } from '../../services/product';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCart from '@mui/icons-material/AddShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import { IconButton, InputBase, Paper } from '@mui/material';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [initialFetch, setInitialFetch] = useState(true);

  const fetchItems = useCallback(async (page, searchQuery = '') => {
    setLoading(true);

    try {
      const response = await getProductsPagination(page, searchQuery);
      const { products, totalPages: responseTotalPages, currentPage: responseCurrentPage } = response.data;

      if (page === 1) {
        setItems(products);
      } else {
        setItems(prevItems => [...prevItems, ...products]);
      }

      setTotalPages(responseTotalPages);
      setCurrentPage(responseCurrentPage);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    }

    setLoading(false);
  }, []);

  const handleScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= fullHeight && currentPage < totalPages && !loading && !searching) {
      fetchItems(currentPage + 1, search);
    }
  }, [fetchItems, currentPage, totalPages, loading, search, searching]);

  const handleSearch = () => {
    setCurrentPage(1);
    setItems([]);
    setSearching(true);
    fetchItems(1, search).then(() => {
      setSearching(false);
    });
  };

  useEffect(() => {
    if (initialFetch) {
      fetchItems(1, search).then(() => {
        setInitialFetch(false);
      });
    }
  }, [fetchItems, search, initialFetch]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleClickAddCart = (item) => {
    // Lógica para adicionar item ao carrinho
    console.log(`Adicionado ao carrinho: ${item.name}`);
  };

  const handleClickInfoItem = (item) => {
    console.log(`Informações do item: ${item.name}`);
  };

  return (
    <div>
      {/* <h2>Lista de Itens</h2> */}
      {/* <h2 style={{ position: 'sticky', top: 0, backgroundColor: '#fff', padding: '16px', zIndex: 1 }}>Lista de Itens</h2> */}
      <Paper component="div" style={{ display: 'flex', alignItems: 'center', padding: '8px', position: 'sticky', top: 70, zIndex: 1 }}>
        <InputBase
          placeholder="Pesquisar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, marginRight: '8px' }}
        />
        <IconButton variant="contained" color="primary" onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      </Paper>
      
      <List>
        {items.map((item) => (
          <Card key={item._id} style={{ margin: '16px' }}>
            <CardContent 
              style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column', margin: '2px', padding: '8px' 
              }}
            >
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '1px' }}>
                <Typography variant="h6" noWrap style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                  {item.name}
                </Typography>
                <Typography variant="body1">{`R$ ${item.price.toFixed(2)}`}</Typography>
              </div>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton color="primary" onClick={() => handleClickInfoItem(item)}>
                  <InfoIcon/>
                </IconButton>
                <IconButton color="primary" onClick={() => handleClickAddCart(item)}>
                  <AddShoppingCart />
                </IconButton>
              </div>
            </CardContent>
          </Card>        
        ))}
      </List>
      {loading && <p>Carregando...</p>}
    </div>
  );
};

export default ItemsList;