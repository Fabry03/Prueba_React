"use client"

import { useState, useEffect } from "react"
import { getMedicionesByComponente, createMedicion, updateMedicion, deleteMedicion } from "../../api/mediciones"
import "./MedicionList.css"

export default function MedicionesList({ componenteId }) {
  const [mediciones, setMediciones] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editMedicion, setEditMedicion] = useState(null)
  const [form, setForm] = useState({
    valor: "",
    fecha: "",
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
    setEditMedicion(null)
    loadMediciones()
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditMedicion(null)
    setForm({ valor: "", fecha: "" })
  }

  return (
    <div className="mediciones-overlay">
      <div className="mediciones-modal">
        <div className="modal-header">
          <h2 className="modal-title">Mediciones del Componente</h2>
          <button className="modal-close" onClick={() => window.location.reload()} title="Cerrar">
            ✕
          </button>
        </div>

        <div className="modal-content">
          {/* Formulario */}
          <div className="medicion-form-section">
            <div className="form-header">
              <h3 className="form-title">{editMedicion ? "Editar Medición" : "Nueva Medición"}</h3>
              {!showForm && !editMedicion && (
                <button className="btn btn-primary" onClick={handleAdd}>
                  <span className="btn-icon">➕</span>
                  Agregar Medición
                </button>
              )}
            </div>

            {(showForm || editMedicion) && (
              <form className="medicion-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Valor</label>
                    <input
                      type="number"
                      step="any"
                      name="valor"
                      className="form-input"
                      placeholder="Ingresa el valor medido"
                      value={form.valor}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fecha</label>
                    <input
                      type="date"
                      name="fecha"
                      className="form-input"
                      value={form.fecha}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-success">
                    <span className="btn-icon">💾</span>
                    {editMedicion ? "Actualizar" : "Guardar"}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    <span className="btn-icon">❌</span>
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Tabla de mediciones */}
          <div className="mediciones-table-section">
            <h3 className="section-title">Historial de Mediciones</h3>
            <div className="table-container">
              <table className="mediciones-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Valor</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {mediciones.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-state">
                        <div className="empty-content">
                          <span className="empty-icon">📊</span>
                          <p>No hay mediciones registradas</p>
                          <small>Agrega la primera medición para este componente</small>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    mediciones.map((medicion) => (
                      <tr key={medicion.id} className="medicion-row">
                        <td>
                          <span className="medicion-id">#{medicion.id}</span>
                        </td>
                        <td>
                          <span className="medicion-valor">{medicion.valor}</span>
                        </td>
                        <td>
                          <span className="medicion-fecha">
                            {new Date(medicion.fecha).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-action btn-edit"
                              onClick={() => handleEdit(medicion)}
                              title="Editar medición"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn-action btn-delete"
                              onClick={() => handleDelete(medicion.id)}
                              title="Eliminar medición"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
