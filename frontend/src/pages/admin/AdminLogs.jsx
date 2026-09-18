import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import PageTransition from '../../components/layout/PageTransition';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Tooltip from '../../components/ui/Tooltip';

const AdminLogs = () => {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuthStore();
  const [logs, setLogs] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [filterLevel, setFilterLevel] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  
  const eventSourceRef = useRef(null);
  const isFirstLoad = useRef(true);

  // Helper to fetch standard logs (non-streaming)
  const getAdminId = () => {
    if (user?.id) return user.id;
    try {
      const stored = localStorage.getItem('border_auth_session');
      if (stored) return JSON.parse(stored)?.id;
    } catch(e) {}
    return null;
  };

  const fetchLogs = async () => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/admin/logs?t=${Date.now()}`;
      if (filterLevel) url += `&level=${filterLevel}`;
      if (filterAction) url += `&action=${filterAction}`;

      const adminId = getAdminId();
      const res = await fetch(url, {
        headers: { 'X-User-ID': adminId }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error('Error fetching logs', e);
    }
  };

  // On mount and filter changes
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login', { replace: true });
      return;
    }
    fetchLogs();
  }, [filterLevel, filterAction]);

  // Live streaming logic
  useEffect(() => {
    if (!isLive) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    const startStream = () => {
      const adminId = getAdminId();
      let url = `${import.meta.env.VITE_API_URL}/admin/logs/stream?userId=${adminId}`;
      eventSourceRef.current = new EventSource(url);

      eventSourceRef.current.onmessage = (event) => {
        try {
          const newLog = JSON.parse(event.data);
          setLogs(prev => {
            // Avoid duplicates
            if (prev.find(l => l.id === newLog.id)) return prev;
            return [newLog, ...prev].slice(0, 100); // Keep last 100
          });
        } catch (e) {}
      };

      eventSourceRef.current.onerror = () => {
        eventSourceRef.current.close();
        // Reconnect after 3s
        setTimeout(() => { if (isLive) startStream(); }, 3000);
      };
    };

    startStream();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [isLive]);

  const handleExport = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/admin/logs/export`;
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'ERROR': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'WARN': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'SUCCESS': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
      default: return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
    }
  };

  return (
    <PageTransition className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/admin')} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-black font-mono tracking-wider">SYSTEM LOGS</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          
          <div className="flex gap-4 flex-wrap">
            <select
              value={filterLevel}
              onChange={e => setFilterLevel(e.target.value)}
              className="bg-black border border-white/20 text-white text-sm font-mono p-2 outline-none focus:border-primary uppercase h-10"
            >
              <option value="">ALL LEVELS</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </select>
            
            <input 
              type="text" 
              placeholder="ACTION (e.g. POST /api/login)"
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
              className="bg-black border border-white/20 text-white text-sm font-mono p-2 outline-none focus:border-primary min-w-[250px] uppercase h-10 placeholder:text-gray-600"
            />
          </div>

          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-2 px-4 h-10 border font-bold text-xs uppercase tracking-wider transition-colors ${
                isLive ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-white/20 text-gray-400 hover:text-white hover:border-white'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
              {isLive ? 'LIVE STREAM: ON' : 'LIVE STREAM: OFF'}
            </button>
            
            <Button variant="outline" onClick={handleExport} className="h-10 text-xs">
              <span className="material-symbols-outlined text-[16px] mr-2">download</span>
              EXPORT CSV
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 overflow-x-auto rounded">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10 bg-black/50 font-mono text-xs tracking-wider text-gray-400">
                <th className="p-4 uppercase">Date (UTC)</th>
                <th className="p-4 uppercase">Level</th>
                <th className="p-4 uppercase">Actor</th>
                <th className="p-4 uppercase">Action</th>
                <th className="p-4 uppercase">Status</th>
                <th className="p-4 uppercase text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 font-mono text-sm transition-colors cursor-pointer" onClick={() => setSelectedLog(log)}>
                  <td className="p-4 text-gray-300">{log.created_at}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold border rounded ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-xs">{log.actor_id}</td>
                  <td className="p-4 text-white truncate max-w-[200px]" title={log.action}>{log.action}</td>
                  <td className="p-4">
                    <span className={log.status === 'SUCCESS' ? 'text-emerald-500' : 'text-red-500'}>{log.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-gray-500 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-lg">code</span>
                    </button>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 font-mono uppercase text-sm">
                    No logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black">
              <h2 className="font-mono font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">data_object</span> 
                LOG DETAILS
              </h2>
              <button onClick={() => setSelectedLog(null)} className="text-gray-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto font-mono text-xs">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div><span className="text-gray-500 block">ID</span>{selectedLog.id}</div>
                <div><span className="text-gray-500 block">DATE</span>{selectedLog.created_at}</div>
                <div><span className="text-gray-500 block">ACTOR</span>{selectedLog.actor_id}</div>
                <div><span className="text-gray-500 block">STATUS</span>{selectedLog.status}</div>
              </div>
              <div className="mb-2 text-gray-500">METADATA</div>
              <pre className="bg-black border border-white/10 p-4 rounded text-emerald-400 overflow-x-auto">
                {JSON.stringify(selectedLog.metadata, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default AdminLogs;

