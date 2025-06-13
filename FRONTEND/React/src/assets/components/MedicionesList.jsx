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
  <div className="mt-10 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
    <h3 className="text-xl font-semibold text-center mb-4">Mediciones del Componente</h3>
    
    <div className="flex justify-end mb-4">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleAdd}
      >
        Agregar medición
      </button>
    </div>

    <table className="w-full table-auto border-collapse bg-white shadow-sm">
      <thead className="bg-blue-800 text-white">
        <tr>
          <th className="px-4 py-2 text-left">ID</th>
          <th className="px-4 py-2 text-left">Valor</th>
          <th className="px-4 py-2 text-left">Fecha</th>
          <th className="px-4 py-2 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {mediciones.length === 0 ? (
          <tr>
            <td colSpan="4" className="text-center text-gray-500 py-6">
              No hay mediciones registradas.
            </td>
          </tr>
        ) : (
          mediciones.map((medicion) => (
            <tr key={medicion.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{medicion.id}</td>
              <td className="px-4 py-2 border-b">{medicion.valor}</td>
              <td className="px-4 py-2 border-b">{medicion.fecha}</td>
              <td className="px-4 py-2 border-b space-x-2">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => handleEdit(medicion)}
                >✏️</button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(medicion.id)}
                >🗑️</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>

    {showForm && (
      <form className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">Valor</label>
          <input
            type="number"
            step="any"
            name="valor"
            className="w-full border px-3 py-2 rounded"
            value={form.valor}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fecha</label>
          <input
            type="date"
            name="fecha"
            className="w-full border px-3 py-2 rounded"
            value={form.fecha}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Guardar
          </button>
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={() => setShowForm(false)}
          >
            Cancelar
          </button>
        </div>
      </form>
    )}
  </div>
)

}