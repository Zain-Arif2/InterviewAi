'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ProgressChart({ data }) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={12} />
          <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={12} />
          <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="overallScore" name="Overall" stroke="var(--color-primary-500)" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="technicalScore" name="Technical" stroke="var(--color-success-600)" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="communicationScore" name="Communication" stroke="var(--color-warning-600)" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}