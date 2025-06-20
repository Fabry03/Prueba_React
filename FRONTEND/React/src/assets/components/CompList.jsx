"use client"

import { useState, useEffect } from "react"
import { getComponentes, createComponente, updateComponente, deleteComponente } from "../../api/conmponentes"
import MedicionesList from "./MedicionesList"
import ComponentesChart from "./ComponentesChart"
import "./CompList.css"

export default function CompList() {
  const [componentes, setComponentes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editComponente, setEditComponente] = useState(null)
  const [form, setForm] = useState({
    descripcion: "",
    unidad: "",
    valor_maximo: "",
    valor_minimo: "",
  })
  const [selectedComponente, setSelectedComponente] = useState(null)
  const [componenteGrafica, setComponenteGrafica] = useState(null)

  const loadComponentes = async () => {
    const response = await getComponentes()
    console.log(response.data)
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
      valor_minimo: componente.valor_minimo,
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
    <div className="app-container">
      <div className="main-content">
        <div className="content-card">
          <div className="page-header">
            <h1 className="page-title">Gestión de Componentes</h1>
            <p className="page-subtitle">Administra los componentes y sus mediciones</p>
          </div>

          <div className="layout-grid">
            {/* Panel de Control */}
            <div className="control-panel">
              <div className="form-section">
                <h2 className="section-title">{editComponente ? "Editar Componente" : "Nuevo Componente"}</h2>

                <form className="component-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Descripción</label>
                      <input
                        className="form-input"
                        name="descripcion"
                        placeholder="Ingresa la descripción"
                        value={form.descripcion}
                        onChange={handleChange}
                        required
                        disabled={!showForm && !editComponente}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Unidad</label>
                      <input
                        className="form-input"
                        name="unidad"
                        placeholder="Ej: mg/L, °C, pH"
                        value={form.unidad}
                        onChange={handleChange}
                        required
                        disabled={!showForm && !editComponente}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Valor Máximo</label>
                      <input
                        className="form-input"
                        name="valor_maximo"
                        type="number"
                        step="any"
                        placeholder="0.00"
                        value={form.valor_maximo}
                        onChange={handleChange}
                        required
                        disabled={!showForm && !editComponente}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Valor Mínimo</label>
                      <input
                        className="form-input"
                        name="valor_minimo"
                        type="number"
                        step="any"
                        placeholder="0.00"
                        value={form.valor_minimo}
                        onChange={handleChange}
                        required
                        disabled={!showForm && !editComponente}
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    {!showForm && !editComponente && (
                      <button type="button" className="btn btn-primary" onClick={handleAdd}>
                        <span className="btn-icon">➕</span>
                        Agregar Componente
                      </button>
                    )}
                    {(showForm || editComponente) && (
                      <>
                        <button type="submit" className="btn btn-success">
                          <span className="btn-icon">💾</span>
                          {editComponente ? "Actualizar" : "Guardar"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setShowForm(false)
                            setEditComponente(null)
                          }}
                        >
                          <span className="btn-icon">❌</span>
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>

              {/* Tabla de Componentes */}
              <div className="table-section">
                <h2 className="section-title">Lista de Componentes</h2>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Descripción</th>
                        <th>Unidad</th>
                        <th>Rango</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {componentes.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="empty-state">
                            <div className="empty-content">
                              <span className="empty-icon">📊</span>
                              <p>No hay componentes registrados</p>
                              <small>Agrega tu primer componente para comenzar</small>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        componentes.map((componente) => (
                          <tr key={componente.id}>
                            <td>
                              <div className="component-info">
                                <strong>{componente.descripcion}</strong>
                              </div>
                            </td>
                            <td>
                              <span className="unit-badge">{componente.unidad}</span>
                            </td>
                            <td>
                              <div className="range-info">
                                <span className="range-min">{componente.valor_minimo}</span>
                                <span className="range-separator">-</span>
                                <span className="range-max">{componente.valor_maximo}</span>
                              </div>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="btn-action btn-edit"
                                  title="Editar componente"
                                  onClick={() => handleEdit(componente)}
                                >
                                  ✏️
                                </button>
                                <button
                                  className="btn-action btn-delete"
                                  title="Eliminar componente"
                                  onClick={() => handleDelete(componente.id)}
                                >
                                  🗑️
                                </button>
                                <button
                                  className="btn-action btn-measurements"
                                  title="Ver mediciones"
                                  onClick={() => setSelectedComponente(componente.id)}
                                >
                                  📐
                                </button>
                                <button
                                  className="btn-action btn-chart"
                                  title="Ver gráfica"
                                  onClick={() => setComponenteGrafica(componente)}
                                >
                                  📊
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

            {/* Panel de Visualización */}
            <div className="visualization-panel">
              {componenteGrafica ? (
                <div className="chart-section">
                  <h2 className="section-title">Gráfica del Componente</h2>
                  <ComponentesChart componentes={[componenteGrafica]} />
                </div>
              ) : (
                <div className="chart-placeholder">
                  <div className="placeholder-content">
                    <span className="placeholder-icon">📈</span>
                    <h3>Visualización de Datos</h3>
                    <p>Selecciona un componente para ver su gráfica</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedComponente && <MedicionesList componenteId={selectedComponente} />}
    </div>
  )
}
