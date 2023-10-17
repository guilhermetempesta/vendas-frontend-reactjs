import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Title from '../Title';
import { getSalesByMonth } from '../../services/dashboard';
import { useNavigate } from 'react-router-dom';
import { clearUserData } from '../../commons/authVerify';

export default function MonthlySalesChart() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadData = async () => {
      const response = await getSalesByMonth();
      console.log(response);

      if (response.networkError) {
        clearUserData();
        navigate("/login");
      }

      if (response.status === 200) {
        console.log(response.data);
        setData(response.data);
      }

    };
    loadData();
  }, []);
   
  return (
    <React.Fragment>
      <Title>Vendas nos últimos 12 meses</Title>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{ top: 16, right: 16, bottom: 0, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {/* <Legend /> */}
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}

