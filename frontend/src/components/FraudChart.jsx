import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const FraudChart = ({ transactions }) => {

  const fraudCount = transactions.filter(t => t.isFraud).length;
  const safeCount = transactions.filter(t => !t.isFraud).length;

  const pieData = [
    { name: 'Safe', value: safeCount, color: '#3fb158' },
    { name: 'Fraud', value: fraudCount, color: '#e53935' },
  ];

  const barData = transactions.slice(0, 10).map((t, idx) => ({
    name: t.transactionId ? t.transactionId.slice(-4) : `T${idx + 1}`,
    score: Number(((t.fraudScore || 0) * 100).toFixed(1)),
    amount: (t.amount || 0) / 1000,
  }));

  return (
    <>

      {/* Pie Chart */}
      <div className="glass-card p-6" data-testid="fraud-pie-chart">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Transaction Status
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>

            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(34, 40, 49, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
              }}
              itemStyle={{ color: '#fff' }}
            />

            <Legend wrapperStyle={{ color: '#fff' }} iconType="circle" />

          </PieChart>
        </ResponsiveContainer>
      </div>


      {/* Bar Chart */}
      <div className="glass-card p-6" data-testid="fraud-score-chart">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Fraud Score Analysis
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />

            <XAxis dataKey="name" stroke="#888" />

            <YAxis stroke="#888" />

            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(34, 40, 49, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
              }}
              itemStyle={{ color: '#fff' }}
            />

            <Bar dataKey="score" fill="hsl(210, 60%, 45%)" name="Fraud Score (%)" />

          </BarChart>
        </ResponsiveContainer>
      </div>

    </>
  );
};

export default FraudChart;