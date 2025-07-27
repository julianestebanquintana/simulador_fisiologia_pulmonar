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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0, // Desactivar animaciones para una respuesta instantánea
  },
  elements: {
    point: {
      radius: 0, // No mostrar puntos en la línea
    },
  },
  scales: {
    x: {
      ticks: {
        maxTicksLimit: 10, // Limitar el número de etiquetas en el eje X
      },
    },
  },
};

function SimulationCharts() {
  const { simulationState } = useSimulation();
  const { results } = simulationState;

  if (!results) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
        <p className="text-muted">Ejecuta una simulación para ver los resultados.</p>
      </div>
    );
  }

  const chartData = {
    labels: results.series_tiempo.tiempo.map(t => t.toFixed(2)),
    datasets: [
      {
        label: 'Presión (cmH2O)',
        data: results.series_tiempo.presion_via_aerea,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Flujo (L/s)',
        data: results.series_tiempo.flujo_total,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        yAxisID: 'y1',
      },
      {
        label: 'Volumen (L)',
        data: results.series_tiempo.volumen_total,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        yAxisID: 'y2',
      },
    ],
  };

  const optionsWithMultipleAxes = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Presión' } },
      y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Flujo' } },
      y2: { type: 'linear', display: false }, // Ocultamos este eje para no saturar
    }
  };


  return (
    <div className="h-100">
      <Line options={optionsWithMultipleAxes} data={chartData} />
    </div>
  );
}

export default SimulationCharts;