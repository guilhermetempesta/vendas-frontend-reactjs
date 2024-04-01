import React, { useContext, useEffect, useState } from 'react';
import { 
  // LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import Title from '../Title';
// import { getMonthAndYear } from '../../commons/utils';
import { getSalesLast30Days } from '../../services/dashboard';
import { clearUserData } from '../../commons/authVerify';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../contexts/auth";

export default function SalesChartLast30Days() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);  
  const [data, setData] = useState([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  
    const loadData = async () => {
      const onlyCurrentUser = (user.role!=='admin');

      const response = await getSalesLast30Days(onlyCurrentUser);
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
  }, [navigate, user]);
  
  
  return (
    <React.Fragment>
      <Title>Vendas dos últimos 30 dias</Title>
      <ResponsiveContainer width="100%" height="100%">
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
