import React, { useContext, useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from '../Title';
import { currentDate, formatDatePtBr, getMonthAndYear } from '../../commons/utils';
import { useNavigate } from 'react-router-dom';
import { getTotalSalesCurrentMonth } from '../../services/dashboard';
import { clearUserData } from '../../commons/authVerify';
import { AuthContext } from "../../contexts/auth";

export default function CurrentMonthSales() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);  
  const [data, setData] = useState({
    totalSales: 0,
	  salesQuantity: 0,
	  salesAverage: 0,
	  salesAveragePerDay: 0
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
  
    const loadData = async () => {
      const onlyCurrentUser = (user.role!=='admin');
      const response = await getTotalSalesCurrentMonth(onlyCurrentUser);
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
  }, [navigate, user]);
 
  const handleClickLink = (event) => {
    event.preventDefault();
    (user.role==='admin') ? navigate("reports/salessummary") : navigate("my-sales");
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
        {(user.role==='admin') ? 'Ver Resumo de Vendas' : 'Ver minhas vendas'}
        </Link>
      </div>
    </React.Fragment>
  );
}