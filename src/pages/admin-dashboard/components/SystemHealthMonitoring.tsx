import { useState, useEffect } from 'react';
import { systemHealthMonitor } from '../../../utils/systemHealthMonitor';
import { workflowManager } from '../../../utils/workflowManager';
import { SystemHealthMetrics, WorkflowState } from '../../../types/event';

export default function SystemHealthMonitoring() {
  const [metrics, setMetrics] = useState<SystemHealthMetrics | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowState[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowState | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'workflows' | 'components' | 'alerts'>('overview');

  useEffect(() => {
    // Initial load
    updateData();

    // Update every 10 seconds
    const interval = setInterval(updateData, 10000);

    return () => clearInterval(interval);
  }, []);

  const updateData = () => {
    const currentMetrics = systemHealthMonitor.getMetrics();
    const allWorkflows = workflowManager.getAllWorkflows();
    
    setMetrics(currentMetrics);
    setWorkflows(allWorkflows);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'degraded':
      case 'in_progress':
        return 'text-amber-600 bg-amber-50';
      case 'critical':
      case 'down':
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
      case 'completed':
        return 'ri-checkbox-circle-fill';
      case 'degraded':
      case 'in_progress':
        return 'ri-error-warning-fill';
      case 'critical':
      case 'down':
      case 'failed':
        return 'ri-close-circle-fill';
      default:
        return 'ri-time-fill';
    }
  };

  const formatStage = (stage: string) => {
    return stage.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-teal-600 animate-spin"></i>
          <p className="mt-4 text-gray-600">Loading system health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Health Monitoring</h2>
          <p className="text-gray-600 mt-1">Real-time platform health and workflow tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-gray-500">Last Updated</div>
            <div className="text-sm font-medium text-gray-900">
              {new Date(metrics.timestamp).toLocaleTimeString()}
            </div>
          </div>
          <button
            onClick={updateData}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <i className="ri-refresh-line"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* System Status Banner */}
      <div className={`p-6 rounded-xl border-2 ${
        metrics.systemStatus === 'healthy' ? 'bg-green-50 border-green-200' :
        metrics.systemStatus === 'degraded' ? 'bg-amber-50 border-amber-200' :
        'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              metrics.systemStatus === 'healthy' ? 'bg-green-100' :
              metrics.systemStatus === 'degraded' ? 'bg-amber-100' :
              'bg-red-100'
            }`}>
              <i className={`${getStatusIcon(metrics.systemStatus)} text-3xl ${
                metrics.systemStatus === 'healthy' ? 'text-green-600' :
                metrics.systemStatus === 'degraded' ? 'text-amber-600' :
                'text-red-600'
              }`}></i>
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${
                metrics.systemStatus === 'healthy' ? 'text-green-900' :
                metrics.systemStatus === 'degraded' ? 'text-amber-900' :
                'text-red-900'
              }`}>
                System Status: {metrics.systemStatus.charAt(0).toUpperCase() + metrics.systemStatus.slice(1)}
              </h3>
              <p className={`mt-1 ${
                metrics.systemStatus === 'healthy' ? 'text-green-700' :
                metrics.systemStatus === 'degraded' ? 'text-amber-700' :
                'text-red-700'
              }`}>
                {metrics.systemStatus === 'healthy' && 'All systems operational'}
                {metrics.systemStatus === 'degraded' && 'Some components experiencing issues'}
                {metrics.systemStatus === 'critical' && 'Critical issues detected - immediate attention required'}
              </p>
            </div>
          </div>
          {systemHealthMonitor.getAlerts().length > 0 && (
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">Active Alerts</div>
              <div className="text-3xl font-bold text-red-600">{systemHealthMonitor.getAlerts().length}</div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {[
            { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
            { id: 'workflows', label: 'Workflows', icon: 'ri-flow-chart' },
            { id: 'components', label: 'Components', icon: 'ri-server-line' },
            { id: 'alerts', label: 'Alerts', icon: 'ri-alarm-warning-line' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <i className={tab.icon}></i>
              {tab.label}
              {tab.id === 'alerts' && systemHealthMonitor.getAlerts().length > 0 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                  {systemHealthMonitor.getAlerts().length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <i className="ri-file-list-3-line text-2xl text-blue-600"></i>
              </div>
              <div className="text-3xl font-bold text-blue-900">{metrics.activeAssignments}</div>
              <div className="text-sm text-blue-700 mt-1">Active Assignments</div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <i className="ri-time-line text-2xl text-amber-600"></i>
              </div>
              <div className="text-3xl font-bold text-amber-900">{metrics.pendingApplications}</div>
              <div className="text-sm text-amber-700 mt-1">Pending Applications</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <i className="ri-shield-check-line text-2xl text-green-600"></i>
              </div>
              <div className="text-3xl font-bold text-green-900">${(metrics.escrowedFunds / 1000).toFixed(0)}K</div>
              <div className="text-sm text-green-700 mt-1">Escrowed Funds</div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <i className="ri-alert-line text-2xl text-red-600"></i>
              </div>
              <div className="text-3xl font-bold text-red-900">{metrics.activeDisputes}</div>
              <div className="text-sm text-red-700 mt-1">Active Disputes</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <i className="ri-stack-line text-2xl text-purple-600"></i>
              </div>
              <div className="text-3xl font-bold text-purple-900">{metrics.eventQueueSize}</div>
              <div className="text-sm text-purple-700 mt-1">Event Queue Size</div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Avg Processing Time</div>
                <div className="text-2xl font-bold text-gray-900">{metrics.averageProcessingTime.toFixed(1)} days</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Error Rate</div>
                <div className="text-2xl font-bold text-gray-900">{metrics.errorRate.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">System Uptime</div>
                <div className="text-2xl font-bold text-gray-900">99.9%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflows Tab */}
      {activeTab === 'workflows' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {workflows.map(workflow => {
                    const progress = workflowManager.calculateProgress(workflow.assignmentId);
                    const duration = workflowManager.getWorkflowDuration(workflow.assignmentId);
                    
                    return (
                      <tr key={workflow.assignmentId} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-mono text-sm text-gray-900">
                            {workflow.assignmentId.substring(0, 12)}...
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{formatStage(workflow.currentStage)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-teal-600 h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700 w-12">{progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{duration} days</div>
                        </td>
                        <td className="px-6 py-4">
                          {workflow.blockedBy ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                              Blocked
                            </span>
                          ) : workflow.completedAt ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                              Completed
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedWorkflow(workflow)}
                            className="text-teal-600 hover:text-teal-700 font-medium text-sm whitespace-nowrap"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Components Tab */}
      {activeTab === 'components' && (
        <div className="grid grid-cols-2 gap-4">
          {metrics.components.map(component => (
            <div key={component.name} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    component.status === 'operational' ? 'bg-green-100' :
                    component.status === 'degraded' ? 'bg-amber-100' :
                    'bg-red-100'
                  }`}>
                    <i className={`ri-server-line text-xl ${
                      component.status === 'operational' ? 'text-green-600' :
                      component.status === 'degraded' ? 'text-amber-600' :
                      'text-red-600'
                    }`}></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{component.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(component.status)}`}>
                      <i className={getStatusIcon(component.status)}></i>
                      {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-medium text-gray-900">{component.responseTime}ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Error Count</span>
                  <span className="font-medium text-gray-900">{component.errorCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Check</span>
                  <span className="font-medium text-gray-900">
                    {new Date(component.lastCheck).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {systemHealthMonitor.getAlerts().length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-12 text-center">
              <i className="ri-checkbox-circle-line text-5xl text-green-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-green-900 mb-2">No Active Alerts</h3>
              <p className="text-green-700">All systems are operating normally</p>
            </div>
          ) : (
            systemHealthMonitor.getAlerts().map((alert, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-alarm-warning-line text-xl text-red-600"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 mb-1">System Alert</h3>
                    <p className="text-red-700">{alert}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-xs text-red-600">
                        {new Date().toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm whitespace-nowrap">
                    Investigate
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Workflow Details Modal */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Workflow Details</h3>
              <button
                onClick={() => setSelectedWorkflow(null)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="ri-close-line text-xl text-gray-500"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Workflow Info */}
              <div>
                <div className="text-sm text-gray-600 mb-1">Assignment ID</div>
                <div className="font-mono text-sm text-gray-900">{selectedWorkflow.assignmentId}</div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                  <span className="text-sm font-bold text-gray-900">
                    {workflowManager.calculateProgress(selectedWorkflow.assignmentId)}%
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-teal-600 h-3 rounded-full transition-all"
                    style={{ width: `${workflowManager.calculateProgress(selectedWorkflow.assignmentId)}%` }}
                  ></div>
                </div>
              </div>

              {/* Stages */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Workflow Stages</h4>
                <div className="space-y-3">
                  {selectedWorkflow.stages.map((stage, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        stage.status === 'completed' ? 'bg-green-100' :
                        stage.status === 'in_progress' ? 'bg-blue-100' :
                        stage.status === 'failed' ? 'bg-red-100' :
                        'bg-gray-100'
                      }`}>
                        <i className={`${getStatusIcon(stage.status)} ${
                          stage.status === 'completed' ? 'text-green-600' :
                          stage.status === 'in_progress' ? 'text-blue-600' :
                          stage.status === 'failed' ? 'text-red-600' :
                          'text-gray-400'
                        }`}></i>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{formatStage(stage.stage)}</div>
                        {stage.startedAt && (
                          <div className="text-xs text-gray-500">
                            Started: {new Date(stage.startedAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(stage.status)}`}>
                        {stage.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Errors */}
              {selectedWorkflow.errors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Errors</h4>
                  <div className="space-y-2">
                    {selectedWorkflow.errors.map((error, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-red-900">{formatStage(error.stage)}</div>
                            <div className="text-sm text-red-700 mt-1">{error.error}</div>
                            <div className="text-xs text-red-600 mt-2">
                              {new Date(error.timestamp).toLocaleString()}
                            </div>
                          </div>
                          {error.resolved && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded whitespace-nowrap">
                              Resolved
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
