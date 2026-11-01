import React, { useState, useEffect } from 'react';
import { DatabaseOverview, TableMeta } from '../types';
import { api } from '../services/api';

interface DatabaseStudioViewProps {
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  onDataChanged: () => void;
}

export const DatabaseStudioView: React.FC<DatabaseStudioViewProps> = ({
  onShowToast,
  onDataChanged,
}) => {
  const [overview, setOverview] = useState<DatabaseOverview | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>('repository');
  const [tableRecords, setTableRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tableSearch, setTableSearch] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [showNewRecordModal, setShowNewRecordModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'tables' | 'api_docs' | 'import_export'>('tables');
  const [importJsonText, setImportJsonText] = useState<string>('');

  const loadDatabaseData = async () => {
    try {
      setLoading(true);
      const ov = await api.getDatabaseOverview();
      setOverview(ov);

      if (activeTab === 'tables') {
        const data = await api.getDatabaseTable(selectedTable);
        setTableRecords(data.records || []);
      }
    } catch (err) {
      console.error('Error fetching database info:', err);
      onShowToast('Failed to load database records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseData();
  }, [selectedTable, activeTab]);

  const handleSelectTable = (tbl: string) => {
    setSelectedTable(tbl);
    setTableSearch('');
    setSelectedRecord(null);
    setIsEditing(false);
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Reset database to pristine campus demo records? Any custom entries will be restored to seed state.')) {
      return;
    }
    try {
      const res = await api.resetDatabase();
      if (res.success) {
        onShowToast('Database successfully reset to demo seed state', 'success');
        await loadDatabaseData();
        onDataChanged();
      }
    } catch (err) {
      onShowToast('Error resetting database', 'error');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!window.confirm(`Delete record with ID "${id}" from ${selectedTable}?`)) return;

    try {
      const res = await api.deleteDatabaseRecord(selectedTable, id);
      if (res.success) {
        onShowToast(`Record ${id} removed from database`, 'success');
        setTableRecords((prev) => prev.filter((r) => r.id !== id));
        if (selectedRecord?.id === id) {
          setSelectedRecord(null);
          setIsEditing(false);
        }
        await loadDatabaseData();
        onDataChanged();
      }
    } catch (err) {
      onShowToast('Error deleting record', 'error');
    }
  };

  const handleStartEdit = (record: any) => {
    setSelectedRecord(record);
    setEditFormData({ ...record });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await api.updateDatabaseRecord(selectedTable, selectedRecord.id, editFormData);
      if (res.success) {
        onShowToast(`Record ${selectedRecord.id} updated`, 'success');
        setIsEditing(false);
        setSelectedRecord(res.record);
        await loadDatabaseData();
        onDataChanged();
      }
    } catch (err) {
      onShowToast('Error saving record edits', 'error');
    }
  };

  const handleImportJson = async () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const res = await api.importDatabase(parsed);
      if (res.success) {
        onShowToast('Database imported successfully!', 'success');
        setImportJsonText('');
        setActiveTab('tables');
        await loadDatabaseData();
        onDataChanged();
      }
    } catch (err: any) {
      onShowToast('Invalid JSON format: ' + (err.message || 'Check syntax'), 'error');
    }
  };

  // Filter records by search query
  const filteredRecords = tableRecords.filter((record) => {
    if (!tableSearch) return true;
    const q = tableSearch.toLowerCase();
    return JSON.stringify(record).toLowerCase().includes(q);
  });

  const currentMeta = overview?.tables.find((t) => t.name === selectedTable);

  return (
    <div className="view-section py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <i className="fa-solid fa-database"></i>
              <span>Live Campus Data Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Database Studio
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              User-friendly database manager with direct CRUD, persistent file storage, inspection, export & reset controls.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleResetDatabase}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
              title="Restore demo seed records"
            >
              <i className="fa-solid fa-rotate-left text-amber-400"></i>
              <span>Reset to Seed Data</span>
            </button>

            <a
              href={api.exportDatabaseUrl()}
              download="studentsphere_database.json"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 transition flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-download"></i>
              <span>Export JSON</span>
            </a>
          </div>
        </div>

        {/* Database Engine Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-emerald-500">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Storage Engine</span>
            <div className="text-base font-bold text-white mt-1 flex items-center gap-2">
              <i className="fa-solid fa-hard-drive text-emerald-400 text-sm"></i>
              <span>Persistent JSON</span>
            </div>
            <p className="text-[10px] text-emerald-400/80 font-mono mt-0.5">/data/database.json</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-teal-500">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Database Size</span>
            <div className="text-base font-bold text-white mt-1">
              {overview?.fileSizeKB || '12.4'} <span className="text-xs font-normal text-gray-400">KB</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">Automated synchronization</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-amber-500">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total Tables</span>
            <div className="text-base font-bold text-white mt-1">
              {overview?.tables.length || 4} <span className="text-xs font-normal text-gray-400">collections</span>
            </div>
            <p className="text-[10px] text-amber-400 mt-0.5">Full relational integrity</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-blue-500">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Health Status</span>
            <div className="text-base font-bold text-white mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Online &amp; Synced</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">Server read/write active</p>
          </div>
        </div>

        {/* View Mode Switching Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'tables'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            <i className="fa-solid fa-table"></i>
            <span>Visual Table Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('api_docs')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'api_docs'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            <i className="fa-solid fa-code"></i>
            <span>REST API &amp; Schema Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab('import_export')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'import_export'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            <i className="fa-solid fa-file-import"></i>
            <span>Import / Backup Data</span>
          </button>
        </div>

        {/* MODE 1: VISUAL TABLE EXPLORER */}
        {activeTab === 'tables' && (
          <div className="space-y-6">
            {/* Table Selection Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {overview?.tables.map((tbl) => (
                <button
                  key={tbl.name}
                  onClick={() => handleSelectTable(tbl.name)}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    selectedTable === tbl.name
                      ? 'glass-card border-emerald-500/60 bg-emerald-950/40 shadow-md'
                      : 'glass-card border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white uppercase">{tbl.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-emerald-400 font-mono">
                      {tbl.count} rows
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 line-clamp-1">{tbl.label}</p>
                </button>
              ))}
            </div>

            {/* Current Table Description & Action Bar */}
            <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <i className="fa-solid fa-magnifying-glass text-gray-400 text-xs pl-2"></i>
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder={`Search in ${selectedTable} table...`}
                  className="bg-black/40 text-white placeholder-gray-500 px-3 py-1.5 rounded-xl border border-white/10 text-xs focus:outline-none focus:border-emerald-500 w-full sm:w-64"
                />
                {tableSearch && (
                  <button
                    onClick={() => setTableSearch('')}
                    className="text-gray-500 hover:text-white text-xs px-2"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs text-gray-400 font-mono">
                  Showing {filteredRecords.length} of {tableRecords.length} records
                </span>
                <button
                  onClick={() => loadDatabaseData()}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs border border-white/10 cursor-pointer"
                  title="Reload table"
                >
                  <i className="fa-solid fa-arrows-rotate"></i>
                </button>
              </div>
            </div>

            {/* Table Records Grid / Data View */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/60 border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Record ID</th>
                      <th className="py-3 px-4">Primary Title / Action</th>
                      <th className="py-3 px-4">Key Properties</th>
                      <th className="py-3 px-4">Status / Metrics</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-400">
                          <div className="inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                          <p>Loading table rows...</p>
                        </td>
                      </tr>
                    ) : filteredRecords.length > 0 ? (
                      filteredRecords.map((record) => (
                        <tr
                          key={record.id}
                          className="hover:bg-white/5 transition duration-150 cursor-pointer"
                          onClick={() => setSelectedRecord(record)}
                        >
                          {/* ID Column */}
                          <td className="py-3 px-4 font-mono text-[11px] text-emerald-400 whitespace-nowrap">
                            {record.id}
                          </td>

                          {/* Primary Title / Action */}
                          <td className="py-3 px-4 font-medium text-white max-w-xs truncate">
                            {record.title || record.name || record.action || record.details || 'Record'}
                          </td>

                          {/* Key Properties */}
                          <td className="py-3 px-4 text-gray-400 text-[11px]">
                            {selectedTable === 'repository' && (
                              <span>
                                {record.code} &bull; {record.semester} &bull; {record.type}
                              </span>
                            )}
                            {selectedTable === 'lost_found' && (
                              <span>
                                {record.category} &bull; {record.zone}
                              </span>
                            )}
                            {selectedTable === 'announcements' && (
                              <span>
                                {record.dept} &bull; {record.tag}
                              </span>
                            )}
                            {selectedTable === 'users' && (
                              <span>
                                {record.email} &bull; {record.department} &bull; {record.studentId}
                              </span>
                            )}
                            {selectedTable === 'activity_logs' && (
                              <span>
                                Entity: <strong className="text-gray-300">{record.entity}</strong> &bull; {record.details}
                              </span>
                            )}
                          </td>

                          {/* Status / Metrics */}
                          <td className="py-3 px-4 text-[11px]">
                            {selectedTable === 'repository' && (
                              <div className="flex items-center gap-2">
                                <span className="text-emerald-400"><i className="fa-solid fa-thumbs-up mr-1"></i>{record.upvotes}</span>
                                <span className="text-gray-400"><i className="fa-solid fa-download mr-1"></i>{record.downloads}</span>
                              </div>
                            )}
                            {selectedTable === 'lost_found' && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                                  record.status === 'Lost'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : record.status === 'Claimed'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                {record.status}
                              </span>
                            )}
                            {selectedTable === 'announcements' && (
                              <span className="text-teal-400">{record.date}</span>
                            )}
                            {selectedTable === 'users' && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                                  record.role === 'admin'
                                    ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                    : record.role === 'faculty'
                                    ? 'bg-teal-950 text-teal-300 border border-teal-800'
                                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                }`}
                              >
                                {record.role}
                              </span>
                            )}
                            {selectedTable === 'activity_logs' && (
                              <span className="font-mono text-[10px] text-gray-500">
                                {new Date(record.timestamp).toLocaleTimeString()}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleStartEdit(record)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-emerald-400 text-xs transition cursor-pointer"
                                title="Edit record"
                              >
                                <i className="fa-solid fa-pen"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteRecord(record.id)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 text-xs transition cursor-pointer"
                                title="Delete record"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          No records match search in table "{selectedTable}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Record Inspector Drawer / Modal */}
            {selectedRecord && (
              <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700">
                      {selectedTable}
                    </span>
                    <h3 className="text-sm font-bold text-white">Record Inspector: {selectedRecord.id}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(selectedRecord)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                      >
                        <i className="fa-solid fa-pen text-[10px]"></i> Edit Fields
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedRecord(null);
                        setIsEditing(false);
                      }}
                      className="text-gray-400 hover:text-white text-xs px-2 py-1"
                    >
                      <i className="fa-solid fa-xmark text-sm"></i>
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  /* Edit Form */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.keys(editFormData).map((key) => {
                        if (key === 'id') return null;
                        const val = editFormData[key];
                        return (
                          <div key={key}>
                            <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                              {key}
                            </label>
                            <input
                              type="text"
                              value={typeof val === 'object' ? JSON.stringify(val) : String(val ?? '')}
                              onChange={(e) =>
                                setEditFormData({ ...editFormData, [key]: e.target.value })
                              }
                              className="w-full bg-black/50 text-white text-xs px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white border border-white/10"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                      >
                        Save Record Updates
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Formatted JSON Display */
                  <pre className="bg-black/70 p-4 rounded-xl text-emerald-300 font-mono text-xs overflow-x-auto max-h-80 border border-emerald-950">
                    {JSON.stringify(selectedRecord, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODE 2: REST API & SCHEMA INSPECTOR */}
        {activeTab === 'api_docs' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-network-wired text-emerald-400"></i>
                <span>Backend REST API Endpoints</span>
              </h3>
              <p className="text-xs text-gray-400">
                All data accessed through standard JSON HTTP endpoints hosted on the full-stack Express server.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3 bg-black/50 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">GET</span>
                    <span className="font-mono text-xs text-white">/api/repository</span>
                  </div>
                  <span className="text-xs text-gray-400">Fetches notes with optional query, subject, semester, type filters</span>
                </div>

                <div className="p-3 bg-black/50 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">POST</span>
                    <span className="font-mono text-xs text-white">/api/repository</span>
                  </div>
                  <span className="text-xs text-gray-400">Uploads and publishes new study material with auto-virus scan</span>
                </div>

                <div className="p-3 bg-black/50 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">GET</span>
                    <span className="font-mono text-xs text-white">/api/lost-found</span>
                  </div>
                  <span className="text-xs text-gray-400">Queries lost and found items with zone, status, and category tags</span>
                </div>

                <div className="p-3 bg-black/50 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">PATCH</span>
                    <span className="font-mono text-xs text-white">/api/lost-found/:id/status</span>
                  </div>
                  <span className="text-xs text-gray-400">Updates status to 'Lost', 'Claimed', or 'Returned'</span>
                </div>

                <div className="p-3 bg-black/50 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">GET</span>
                    <span className="font-mono text-xs text-white">/api/database/overview</span>
                  </div>
                  <span className="text-xs text-gray-400">Returns live storage metrics, table schemas, and disk status</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: IMPORT / BACKUP DATA */}
        {activeTab === 'import_export' && (
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-file-import text-emerald-400"></i>
              <span>Import &amp; Restore Database JSON</span>
            </h3>
            <p className="text-xs text-gray-400">
              Paste exported database JSON below to restore records or bulk-load university data.
            </p>

            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='{ "repository": [...], "lost_found": [...], "announcements": [...] }'
              className="w-full bg-black/50 text-white font-mono text-xs p-4 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500"
            ></textarea>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setImportJsonText('')}
                className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white border border-white/10"
              >
                Clear
              </button>
              <button
                onClick={handleImportJson}
                disabled={!importJsonText.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                Apply Import
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
