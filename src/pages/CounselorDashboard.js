import React, { useState, useEffect } from 'react';
import { CounselorAlertService } from '../services/counselorAlertService';

const CounselorDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all'); // all, emergency, moderate, handled
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [counselorNotes, setCounselorNotes] = useState('');

  useEffect(() => {
    loadAlerts();
    // Refresh alerts every 30 seconds
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = () => {
    const allAlerts = CounselorAlertService.getAllAlerts();
    setAlerts(allAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'emergency') return alert.alertLevel === 'emergency';
    if (filter === 'moderate') return alert.alertLevel === 'moderate';
    if (filter === 'handled') return alert.status === 'handled';
    if (filter === 'unhandled') return alert.status !== 'handled';
    return true;
  });

  const handleMarkAsHandled = (alertId) => {
    const success = CounselorAlertService.markAlertAsHandled(alertId, counselorNotes);
    if (success) {
      loadAlerts();
      setSelectedAlert(null);
      setCounselorNotes('');
    }
  };

  const getAlertBadgeColor = (alertLevel) => {
    switch (alertLevel) {
      case 'emergency': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const unhandledEmergencyCount = alerts.filter(alert => 
    alert.alertLevel === 'emergency' && alert.status !== 'handled'
  ).length;

  const unhandledModerateCount = alerts.filter(alert => 
    alert.alertLevel === 'moderate' && alert.status !== 'handled'
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🩺 Counselor Dashboard - Mental Health Alerts
          </h1>
          
          {/* Alert Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-2xl font-bold text-gray-800">{alerts.length}</div>
              <div className="text-sm text-gray-600">Total Alerts</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 shadow border border-red-200">
              <div className="text-2xl font-bold text-red-600">{unhandledEmergencyCount}</div>
              <div className="text-sm text-red-700">Emergency (Unhandled)</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 shadow border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">{unhandledModerateCount}</div>
              <div className="text-sm text-orange-700">Moderate (Unhandled)</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 shadow border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {alerts.filter(a => a.status === 'handled').length}
              </div>
              <div className="text-sm text-green-700">Handled</div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Alerts', count: alerts.length },
              { key: 'emergency', label: 'Emergency', count: alerts.filter(a => a.alertLevel === 'emergency').length },
              { key: 'moderate', label: 'Moderate', count: alerts.filter(a => a.alertLevel === 'moderate').length },
              { key: 'unhandled', label: 'Unhandled', count: alerts.filter(a => a.status !== 'handled').length },
              { key: 'handled', label: 'Handled', count: alerts.filter(a => a.status === 'handled').length }
            ].map(filterOption => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } shadow`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAlerts.map((alert, index) => (
            <div
              key={alert.timestamp}
              className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${
                alert.alertLevel === 'emergency' 
                  ? 'border-red-500' 
                  : alert.alertLevel === 'moderate'
                  ? 'border-orange-500'
                  : 'border-gray-300'
              } ${alert.status === 'handled' ? 'opacity-60' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getAlertBadgeColor(alert.alertLevel)}`}>
                      {alert.alertLevel.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">{getTimeAgo(alert.timestamp)}</span>
                    {alert.status === 'handled' && (
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                        HANDLED
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {alert.studentName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {alert.assessmentType} Assessment - Score: {alert.score}
                  </p>
                </div>
                <div className="text-2xl">
                  {alert.alertLevel === 'emergency' ? '🚨' : '🔔'}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <strong>Risk Factors:</strong>
                  <ul className="list-disc list-inside text-gray-700 mt-1">
                    {alert.riskFactors.map((factor, idx) => (
                      <li key={idx}>{factor}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-sm">
                  <strong>Recommended Action:</strong>
                  <p className="text-gray-700 mt-1">{alert.recommendedAction}</p>
                </div>
              </div>

              {alert.status !== 'handled' ? (
                <button
                  onClick={() => setSelectedAlert(alert)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Mark as Handled
                </button>
              ) : (
                <div className="text-sm text-gray-600">
                  <p><strong>Handled:</strong> {new Date(alert.handledAt).toLocaleString()}</p>
                  {alert.counselorNotes && (
                    <p><strong>Notes:</strong> {alert.counselorNotes}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No alerts found
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "No mental health alerts have been generated yet."
                : `No ${filter} alerts found.`
              }
            </p>
          </div>
        )}

        {/* Mark as Handled Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Mark Alert as Handled
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Student: <strong>{selectedAlert.studentName}</strong><br />
                Assessment: <strong>{selectedAlert.assessmentType}</strong><br />
                Score: <strong>{selectedAlert.score}</strong>
              </p>
              <textarea
                value={counselorNotes}
                onChange={(e) => setCounselorNotes(e.target.value)}
                placeholder="Enter counselor notes (optional)..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 h-24 resize-none"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => handleMarkAsHandled(selectedAlert.timestamp)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Mark as Handled
                </button>
                <button
                  onClick={() => {
                    setSelectedAlert(null);
                    setCounselorNotes('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounselorDashboard;
