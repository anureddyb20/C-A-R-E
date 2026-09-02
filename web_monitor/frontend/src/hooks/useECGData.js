import { useState, useEffect, useRef } from 'react';

export function useECGData() {
  const [data, setData] = useState({ hr: 0, gsr: 0, panic: 0 });
  const [chartData, setChartData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const connectWs = () => {
      const ws = new WebSocket('ws://localhost:8000/ws');
      
      ws.onopen = () => {
        setIsConnected(true);
      };
      
      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          setData({
            hr: parsed.hr,
            gsr: parsed.gsr,
            panic: parsed.panic
          });
          
          setChartData(prev => {
            const newPoint = { time: timeRef.current++, ecg: parsed.ecg };
            const newData = [...prev, newPoint];
            return newData.length > 100 ? newData.slice(newData.length - 100) : newData;
          });
        } catch (e) {
          console.error("Failed to parse data", e);
        }
      };
      
      ws.onclose = () => {
        setIsConnected(false);
        setTimeout(connectWs, 2000);
      };
      
      ws.onerror = () => {
        ws.close();
      };
      
      wsRef.current = ws;
    };
    
    connectWs();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { data, chartData, isConnected };
}
