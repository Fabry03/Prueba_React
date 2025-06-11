import { useState, useEffect } from "react"
import { getMedicionesByComponente, createMedicion, updateMedicion, deleteMedicion } from "../../api/mediciones"

export default function MedicionesList({ componenteId }) {
    const [mediciones, setMediciones] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editMedicion, setEditMedicion] = useState(null)
    const [form, setForm] = useState({
        valor: "",
        fecha: ""
    })

    const loadMediciones = async () => {
        const response = await getMedicionesByComponente(componenteId)
        setMediciones(response.data)
    }

    useEffect(() => {
        if (componenteId) loadMediciones()
    }, [componenteId])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleAdd = () => {
        setForm({ valor: "", fecha: "" })
        setEditMedicion(null)
        setShowForm(true)
    }

    const handleEdit = (medicion) => {
        setForm({ valor: medicion.valor, fecha: medicion.fecha })
        setEditMedicion(medicion)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar esta medición?")) {
            await deleteMedicion(id)
            loadMediciones()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (editMedicion) {
            await updateMedicion(editMedicion.id, { ...form, componente: componenteId })
        } else {
            await createMedicion({ ...form, componente: componenteId })
        }
        setShowForm(false)
        loadMediciones()
    }

    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold mb-2 text-center">Mediciones del Componente</h3>
            <button
                className="mb-2 px-4 py-1 bg-blue-700 text-white rounded hover:bg-blue-900"
                onClick={handleAdd}
            >
                Agregar medición
            </button>
            <table className="min-w-full bg-white rounded-lg">
                <thead>
                    <tr className="bg-blue-900 text-white">
                        <th className="px-4 py-2 text-left font-semibold">ID</th>
                        <th className="px-4 py-2 text-left font-semibold">Valor</th>
                        <th className="px-4 py-2 text-left font-semibold">Fecha</th>
                        <th className="px-4 py-2 text-left font-semibold">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {mediciones.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-6 text-gray-400">
                                No hay mediciones registradas.
                            </td>
                        </tr>
                    ) : (
                        mediciones.map((medicion) => (
                            <tr key={medicion.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border-b">{medicion.id}</td>
                                <td className="px-4 py-2 border-b">{medicion.valor}</td>
                                <td className="px-4 py-2 border-b">{medicion.fecha}</td>
                                <td className="px-4 py-2 border-b">
                                    <button
                                        className="mr-2 text-blue-700 hover:text-blue-900"
                                        title="Editar"
                                        onClick={() => handleEdit(medicion)}
                                    >✏️</button>
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        title="Eliminar"
                                        onClick={() => handleDelete(medicion.id)}
                                    >🗑️</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {showForm && (
                <form className="mt-4 flex gap-4 items-end" onSubmit={handleSubmit}>
                    <div>
                        <label className="text-xs font-semibold mb-1">Valor</label>
                        <input
                            type="number"
                            step="any"
                            name="valor"
                            className="border px-2 py-1 rounded ml-2"
                            value={form.valor}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold mb-1">Fecha</label>
                        <input
                            type="date"
                            name="fecha"
                            className="border px-2 py-1 rounded ml-2"
                            value={form.fecha}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Guardar
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                        onClick={() => setShowForm(false)}
                    >
                        Cancelar
                    </button>
                </form>
            )}
        </div>
    )
}