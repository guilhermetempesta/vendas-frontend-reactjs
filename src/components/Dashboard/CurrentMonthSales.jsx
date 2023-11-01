import React, { useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from '../Title';
import { currentDate, formatDatePtBr, getMonthAndYear } from '../../commons/utils';
import { useNavigate } from 'react-router-dom';
import { getTotalSalesCurrentMonth } from '../../services/dashboard';
import { clearUserData } from '../../commons/authVerify';

export default function CurrentMonthSales() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalSales: 0,
	  salesQuantity: 0,
	  salesAverage: 0,
	  salesAveragePerDay: 0
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
  
    const loadData = async () => {
      const response = await getTotalSalesCurrentMonth();
      console.log(response);
      
      if (response.networkError) {
        clearUserData();
        navigate("/login");
      }
  
      if (response.status === 200) {
        console.log(response.data)
        setData(response.data);
      };
  
    };
    loadData();
  }, []);
 
  const handleClickLink = (event) => {
    event.preventDefault();
    navigate("reports/salessummary");
  };

  return (
    <React.Fragment>
      <Title>Vendas ({getMonthAndYear()})</Title>
      <Typography component="p" variant="h4">
        R$ {data.totalSales.toFixed(2).replace(".",",")}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        até {formatDatePtBr(currentDate())}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {data.salesQuantity} vendas
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        Valor médio (R$): {data.salesAverage.toFixed(2).replace(".",",")}
      </Typography>
      <div>
        <Link color="primary" onClick={(e) => handleClickLink(e)} sx={{ mt: 3, cursor: 'pointer' }}>
          Ver Resumo de Vendas
        </Link>
      </div>
    </React.Fragment>
  );
}