import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useSimulation } from '../context/SimulationContext';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const SIMULATION_WINDOW_SECONDS = 30; // Ventana de tiempo

// Opciones base para todos los gráficos
const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 0 },
  elements: { point: { radius: 0 } },
  scales: {
    x: {
      ticks: { maxTicksLimit: 10, autoSkip: true },
      title: { display: true, text: 'Tiempo (s)' },
    },
  },
};

// Componente para un único gráfico
function SingleChart({ title, yLabel, data, borderColor, backgroundColor, yMin }) {
  const chartData = {
    labels: data.labels,
    datasets: [{
      label: yLabel,
      data: data.values,
      borderColor,
      backgroundColor,
      borderWidth: 2,
      tension: 0.1,
    }],
  };

  const chartOptions = {
    ...baseChartOptions,
    plugins: {
      legend: {
        display: false, // No necesitamos una leyenda para un solo set de datos
      },
      title: {
        display: true,
        text: title, // Usamos el título que pasamos como prop
      },
    },
    scales: {
      ...baseChartOptions.scales,
      x: {
        type: 'linear',
        min: 0,
        max: SIMULATION_WINDOW_SECONDS,
        title: { display: true, text: 'Tiempo (s)' },
        ticks: { maxTicksLimit: 8, autoSkip: true },
      },
      y: {
        title: { display: true, text: yLabel },
        suggestedMin: yMin,
      },
    },
  };

  return <Line options={chartOptions} data={chartData} />;
}

// Componente principal que renderiza los tres gráficos
function SimulationCharts() {
  const { simulationState } = useSimulation();
  const { results, isLoading } = simulationState;

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 text-muted">
        Ejecuta una simulación para ver los resultados.
      </div>
    );
  }

  const timeArray = results.series_tiempo.tiempo;

  // Encontramos cuántos puntos de datos caben en nuestra ventana de 15 segundos
  let pointsToShow = timeArray.length;
  for (let i = 0; i < timeArray.length; i++) {
    if (timeArray[i] > SIMULATION_WINDOW_SECONDS) {
      pointsToShow = i;
      break;
    }
  }

  // Recortamos todos los arrays al mismo tamaño
  const labels = timeArray.slice(0, pointsToShow).map(t => t.toFixed(2));
  const pressureValues = results.series_tiempo.presion_via_aerea.slice(0, pointsToShow);
  const flowValues = results.series_tiempo.flujo_total.slice(0, pointsToShow);
  const volumeValues = results.series_tiempo.volumen_total.slice(0, pointsToShow);

  const pressureData = { labels, values: pressureValues };
  const flowData = { labels, values: flowValues };
  const volumeData = { labels, values: volumeValues };

  return (
    // Contenedor principal
    <div className="d-flex flex-column h-100">
      <div className="chart-wrapper">
        <SingleChart 
          title="Presión en la Vía Aérea" 
          yLabel="Presión (cmH2O)" 
          data={pressureData} 
          borderColor="rgb(255, 99, 132)" 
          backgroundColor="rgba(255, 99, 132, 0.5)" 
          yMin={-5} />
      </div>
      <div className="chart-wrapper mt-3">
        <SingleChart 
          title="Flujo Respiratorio" 
          yLabel="Flujo (L/s)" 
          data={flowData} 
          borderColor="rgb(54, 162, 235)" 
          backgroundColor="rgba(54, 162, 235, 0.5)" />
      </div>
      <div className="chart-wrapper mt-3">
        <SingleChart 
          title="Volumen Tidal" 
          yLabel="Volumen (L)" 
          data={volumeData} 
          borderColor="rgb(75, 192, 192)" 
          backgroundColor="rgba(75, 192, 192, 0.5)" />
      </div>
    </div>
  );
}

export default SimulationCharts;