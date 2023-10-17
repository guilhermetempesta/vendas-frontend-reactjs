import React, { useEffect, useState } from 'react';
import { PieChart, Pie, ResponsiveContainer, Legend, Cell } from 'recharts';
import Title from '../Title';
import { useNavigate } from 'react-router-dom';
import { getSalesBySeller } from '../../services/dashboard';
import { clearUserData } from '../../commons/authVerify';
import { extractAbbreviatedName } from '../../commons/utils';

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Função de utilitário para gerar cores primárias
const getColor = index => {
  const primaryColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0045'];
  return primaryColors[index % primaryColors.length];
};

export default function SalesBySeller() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadData = async () => {
      const response = await getSalesBySeller();
      console.log(response);

      if (response.networkError) {
        clearUserData();
        navigate('/login');
      }

      if (response.status === 200) {
        console.log(response.data);
        response.data.forEach((element, index) => {
          element.name = extractAbbreviatedName(element.name);
        });
        setData(response.data);
      }
    };
    loadData();
  }, []);

  return (
    <React.Fragment>
      <Title>Vendas por Vendedor</Title>
      <ResponsiveContainer width="100%" height="100%" >
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={68}
            fill="#8884d8"
            dataKey="total"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(index)} />
            ))}
          </Pie>
          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
