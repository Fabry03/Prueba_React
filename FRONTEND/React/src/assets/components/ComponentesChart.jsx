import { Bar } from "react-chartjs-2"
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from "chart.js"

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

export default function ComponentesChart({ componentes }) {
  if (!componentes || componentes.length === 0) {
    return (
      <div className="chart-empty-state">
        <div className="empty-content">
          <span className="empty-icon">📊</span>
          <h3>Sin datos para mostrar</h3>
          <p>No hay componentes seleccionados para la gráfica</p>
        </div>
      </div>
    )
  }

  const data = {
    labels: componentes.map((c) => c.descripcion),
    datasets: [
      {
        label: "Valor Máximo",
        data: componentes.map((c) => Number.parseFloat(c.valor_maximo)),
        backgroundColor: "rgba(37, 99, 235, 0.8)",
        borderColor: "rgba(37, 99, 235, 1)",
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: "Valor Mínimo",
        data: componentes.map((c) => Number.parseFloat(c.valor_minimo)),
        backgroundColor: "rgba(220, 38, 38, 0.8)",
        borderColor: "rgba(220, 38, 38, 1)",
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: "600",
          },
        },
      },
      title: {
        display: true,
        text: `Rangos de Valores - ${componentes[0]?.descripcion || "Componente"}`,
        font: {
          size: 16,
          weight: "700",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const component = componentes[context.dataIndex]
            return `${context.dataset.label}: ${context.parsed.y} ${component.unidad || ""}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  }

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <Bar data={data} options={options} />
      </div>
      <div className="chart-info">
        <div className="chart-stats">
          <div className="stat-item">
            <span className="stat-label">Componentes:</span>
            <span className="stat-value">{componentes.length}</span>
          </div>
          {componentes.length === 1 && (
            <div className="stat-item">
              <span className="stat-label">Unidad:</span>
              <span className="stat-value">{componentes[0].unidad}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
