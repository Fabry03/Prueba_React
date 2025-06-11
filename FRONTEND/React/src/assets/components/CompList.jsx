import { useState, useEffect } from "react"
import { getComponentes, createComponente, updateComponente, deleteComponente } from "../../api/conmponentes"
import MedicionesList from "./MedicionesList" // Ajusta la ruta si es necesario
import ComponentesChart from "./ComponentesChart"

export default function CompList() {
    const [componentes, setComponentes] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editComponente, setEditComponente] = useState(null)
    const [form, setForm] = useState({
        descripcion: "",
        unidad: "",
        valor_maximo: "",
        valor_minimo: ""
    })
    const [selectedComponente, setSelectedComponente] = useState(null)
    const [componenteGrafica, setComponenteGrafica] = useState(null) // NUEVO

    const loadComponentes = async () => {
        const response = await getComponentes()
        console.log(response.data) // <-- Verifica qué llega
        setComponentes(response.data)
    }
    useEffect(() => {
        loadComponentes()
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleAdd = () => {
        setForm({ descripcion: "", unidad: "", valor_maximo: "", valor_minimo: "" })
        setEditComponente(null)
        setShowForm(true)
    }

    const handleEdit = (componente) => {
        setForm({
            descripcion: componente.descripcion,
            unidad: componente.unidad,
            valor_maximo: componente.valor_maximo,
            valor_minimo: componente.valor_minimo
        })
        setEditComponente(componente)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este componente?")) {
            await deleteComponente(id)
            loadComponentes()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (editComponente) {
            await updateComponente(editComponente.id, form)
        } else {
            await createComponente(form)
        }
        setShowForm(false)
        loadComponentes()
    }

    return (
        <div className="min-h-screen bg-gray-200 flex flex-col">
            <div className="flex flex-1 justify-center items-start py-10">
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-8x2 p-8">
                    <h2 className="text-2xl font-bold text-center mb-6 tracking-wide">
                        Modelo de Datos de Componentes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Columna izquierda: Tabla */}
                        <div className="flex flex-col">
                            <form
                                className="grid grid-cols-4 gap-4 mb-6"
                                onSubmit={handleSubmit}
                            >
                                <div className="col-span-1 flex flex-col">
                                    <label className="text-xs font-semibold mb-1">Descripción</label>
                                    <input
                                        className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        name="descripcion"
                                        placeholder="Descripción"
                                        value={form.descripcion}
                                        onChange={handleChange}
                                        required
                                        disabled={!showForm && !editComponente}
                                    />
                                </div>
                                <div className="col-span-1 flex flex-col">
                                    <label className="text-xs font-semibold mb-1">Unidad</label>
                                    <input
                                        className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        name="unidad"
                                        placeholder="Unidad"
                                        value={form.unidad}
                                        onChange={handleChange}
                                        required
                                        disabled={!showForm && !editComponente}
                                    />
                                </div>
                                <div className="col-span-1 flex flex-col">
                                    <label className="text-xs font-semibold mb-1">Valor Máximo</label>
                                    <input
                                        className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        name="valor_maximo"
                                        placeholder="Valor Máximo"
                                        value={form.valor_maximo}
                                        onChange={handleChange}
                                        required
                                        disabled={!showForm && !editComponente}
                                    />
                                </div>
                                <div className="col-span-1 flex flex-col">
                                    <label className="text-xs font-semibold mb-1">Valor Mínimo</label>
                                    <input
                                        className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        name="valor_minimo"
                                        placeholder="Valor Mínimo"
                                        value={form.valor_minimo}
                                        onChange={handleChange}
                                        required
                                        disabled={!showForm && !editComponente}
                                    />
                                </div>
                                <div className="col-span-4 flex gap-2 mt-2 justify-center">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-900 font-semibold"
                                        onClick={handleAdd}
                                    >
                                        Agregar datos
                                    </button>
                                    {showForm && (
                                        <>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 font-semibold"
                                                onClick={() => setShowForm(false)}
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </form>
                            <div className="overflow-x-auto rounded-lg">
                                <table className="min-w-full bg-white rounded-lg">
                                    <thead>
                                        <tr className="bg-blue-900 text-white">
                                            <th className="px-4 py-2 text-left font-semibold">DESCRIPCIÓN</th>
                                            <th className="px-4 py-2 text-left font-semibold">UNIDAD</th>
                                            <th className="px-4 py-2 text-left font-semibold">VALOR MÁXIMO</th>
                                            <th className="px-4 py-2 text-left font-semibold">VALOR MÍNIMO</th>
                                            <th className="px-4 py-2 text-left font-semibold">ACCIONES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {componentes.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-6 text-gray-400">
                                                    No hay componentes registrados.
                                                </td>
                                            </tr>
                                        ) : (
                                            componentes.map((componente) => (
                                                <tr key={componente.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2 border-b">{componente.descripcion}</td>
                                                    <td className="px-4 py-2 border-b">{componente.unidad}</td>
                                                    <td className="px-4 py-2 border-b">{componente.valor_maximo}</td>
                                                    <td className="px-4 py-2 border-b">{componente.valor_minimo}</td>
                                                    <td className="px-4 py-2 border-b flex flex-wrap gap-2">
                                                        <button
                                                            className="mr-2 text-blue-700 hover:text-blue-900"
                                                            title="Editar"
                                                            onClick={() => handleEdit(componente)}
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-800"
                                                            title="Eliminar"
                                                            onClick={() => handleDelete(componente.id)}
                                                        >
                                                            🗑️
                                                        </button>
                                                        <button
                                                            className="px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-800"
                                                            title="Ver Mediciones"
                                                            onClick={() => setSelectedComponente(componente.id)}
                                                        >
                                                            📐
                                                        </button>
                                                        <button
                                                            className="px-2 py-1 bg-pink-600 text-white rounded hover:bg-pink-800"
                                                            title="Ver Gráfica"
                                                            onClick={() => setComponenteGrafica(componente)}
                                                        >
                                                            📊
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Columna derecha: Gráfica SOLO del componente seleccionado */}
                        <div className="flex flex-col items-center justify-center">
                            {componenteGrafica && (
                                <ComponentesChart componentes={[componenteGrafica]} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {selectedComponente && (
                <MedicionesList componenteId={selectedComponente} />
            )}
        </div>
    )
}