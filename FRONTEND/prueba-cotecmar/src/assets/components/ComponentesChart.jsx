import { Bar } from "react-chartjs-2"
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js"

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function ComponentesChart({ componentes }) {
    const data = {
        labels: componentes.map(c => c.descripcion),
        datasets: [
            {
                label: "Valor Máximo",
                data: componentes.map(c => parseFloat(c.valor_maximo)),
                backgroundColor: "rgba(54, 162, 235, 0.7)",
            },
            {
                label: "Valor Mínimo",
                data: componentes.map(c => parseFloat(c.valor_minimo)),
                backgroundColor: "rgba(255, 99, 132, 0.7)",
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Valores de Componentes" },
        },
    }

    return (
        <div className="my-8 bg-white p-4 rounded-xl shadow">
            <Bar data={data} options={options} />
        </div>
    )
}