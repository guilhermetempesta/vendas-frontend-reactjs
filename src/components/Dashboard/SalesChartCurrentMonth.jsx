import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Title from '../Title';
import { getMonthAndYear } from '../../commons/utils';
import { getSalesCurrentMonth } from '../../services/dashboard';
import { clearUserData } from '../../commons/authVerify';
import { useNavigate } from 'react-router-dom';

export default function SalesChartCurrentMonth() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  
    const loadData = async () => {
      const response = await getSalesCurrentMonth();
      console.log(response);
      
      if (response.networkError) {
        clearUserData();
        navigate("/login");
      }
  
      if (response.status === 200) {
        console.log(response.data)
        const sales = response.data;
        sales.forEach((sale) => { 
          sale.ValorTotal = sale.totalAmount;
        })
        setData(sales);
      };
    };
    loadData();
  }, []);
  
  
  return (
    <React.Fragment>
      <Title>Vendas Diárias: {getMonthAndYear()}</Title>
      <ResponsiveContainer width="100%" height="100%">
        {/* <LineChart
          width={500}
          height={300}
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart> */}
        <AreaChart width={500} height={300} data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="_id" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area type="monotone" dataKey="ValorTotal" stroke="#8884d8" fillOpacity={1} fill="url(#colorTotal)" />
        </AreaChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
