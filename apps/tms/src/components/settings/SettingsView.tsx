import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserManagementTab } from './UserManagementTab';
import { TeamManagementTab } from './TeamManagementTab';
import { LabelManagementTab } from './LabelManagementTab';
import { CustomFieldsManagementTab } from './CustomFieldsManagementTab';
import { CreateProjectModal } from '../projects/CreateProjectModal';
import {
  Settings,
  Users,
  Shield,
  Tag,
  Sliders,
  FolderPlus,
  Briefcase,
  Plus,
  Trash2,
  Server,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    navSection,
    setNavSection,
    currentProject,
    projects,
    setCurrentProjectId,
    environments,
    createEnvironment,
    deleteEnvironment,
    updateProject,
    deleteProject,
    addToast,
  } = useApp();

  // Tab routing
  const [activeTab, setActiveTab] = useState<
    'users' | 'teams' | 'labels' | 'custom-fields' | 'projects' | 'environments'
  >(() => {
    if (navSection === 'users') return 'users';
    if (navSection === 'teams') return 'teams';
    if (navSection === 'labels') return 'labels';
    if (navSection === 'custom-fields') return 'custom-fields';
    return 'users';
  });

  // Keep active tab in sync if navSection changes from sidebar
  React.useEffect(() => {
    if (navSection === 'users') setActiveTab('users');
    else if (navSection === 'teams') setActiveTab('teams');
    else if (navSection === 'labels') setActiveTab('labels');
    else if (navSection === 'custom-fields') setActiveTab('custom-fields');
    else if (navSection === 'settings') setActiveTab('projects');
  }, [navSection]);

  const [projectName, setProjectName] = useState(currentProject.name);
  const [projectDesc, setProjectDesc] = useState(currentProject.description);
  const [newEnvName, setNewEnvName] = useState('');
  const [newEnvType, setNewEnvType] = useState<'qa' | 'dev' | 'staging' | 'uat' | 'prod'>('qa');
  const [newEnvUrl, setNewEnvUrl] = useState('');
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  // Sync state if currentProject changes
  React.useEffect(() => {
    setProjectName(currentProject.name);
    setProjectDesc(currentProject.description);
  }, [currentProject.id]);

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject(currentProject.id, {
      name: projectName,
      description: projectDesc,
    });
    addToast({ type: 'success', title: 'Project Updated', message: 'Project configuration saved successfully.' });
  };

  const handleAddEnvironment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnvName.trim()) return;

    createEnvironment({
      name: newEnvName,
      type: newEnvType,
      url: newEnvUrl,
    });

    setNewEnvName('');
    setNewEnvUrl('');
    addToast({ type: 'success', title: 'Environment Added', message: `Environment "${newEnvName}" created.` });
  };

  const projectEnvs = environments.filter((e) => e.projectId === currentProject.id);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Workspace Administration & Settings</h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 font-mono">
              {currentProject.key}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise user management, squad creation, label registry, custom fields engine, and project scopes.
          </p>
        </div>

        <button
          onClick={() => setIsCreateProjectOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <FolderPlus className="w-4 h-4" />
          <span>+ Create New Project</span>
        </button>
      </div>

      {/* Main Admin Tab Navigation Bar */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 overflow-x-auto text-xs">
        {[
          { id: 'users', label: 'User Management', icon: <Users className="w-4 h-4" /> },
          { id: 'teams', label: 'Teams & Squads', icon: <Shield className="w-4 h-4" /> },
          { id: 'labels', label: 'Labels & Tag Registry', icon: <Tag className="w-4 h-4" /> },
          { id: 'custom-fields', label: 'Custom Fields Engine', icon: <Sliders className="w-4 h-4" /> },
          { id: 'projects', label: 'Projects & Workspaces', icon: <Briefcase className="w-4 h-4" /> },
          { id: 'environments', label: 'Environments', icon: <Server className="w-4 h-4" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE TAB CONTENT */}
      {activeTab === 'users' && <UserManagementTab />}
      {activeTab === 'teams' && <TeamManagementTab />}
      {activeTab === 'labels' && <LabelManagementTab />}
      {activeTab === 'custom-fields' && <CustomFieldsManagementTab />}

      {activeTab === 'projects' && (
        <div className="space-y-6">
          {/* Projects Management Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>All Projects in Workspace ({projects.length})</span>
                </h3>
                <p className="text-slate-500 mt-0.5">Switch active scope or create distinct QA workspaces for different applications.</p>
              </div>

              <button
                onClick={() => setIsCreateProjectOpen(true)}
                className="px-2.5 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {projects.map((proj) => {
                const isSelected = proj.id === currentProject.id;
                return (
                  <div
                    key={proj.id}
                    className={`p-3.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-7 h-7 rounded-md text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs"
                          style={{ backgroundColor: proj.color }}
                        >
                          {proj.key.substring(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{proj.name}</div>
                          <div className="text-[10px] font-mono text-slate-500">{proj.key}</div>
                        </div>
                      </div>

                      {isSelected ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shrink-0">
                          Active
                        </span>
                      ) : (
                        <button
                          onClick={() => setCurrentProjectId(proj.id)}
                          className="px-2 py-1 rounded text-[11px] font-semibold text-blue-600 hover:bg-blue-100/60 transition-colors shrink-0"
                        >
                          Switch
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                      {proj.description || 'No description provided.'}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Key: <strong className="text-slate-600 font-mono">{proj.key}</strong></span>
                      {projects.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete project "${proj.name}" (${proj.key}) and all associated test assets?`)) {
                              deleteProject(proj.id);
                            }
                          }}
                          className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Project Details Form */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Current Project Configuration</h3>
              <p className="text-slate-500 mt-0.5">Edit naming and description for active project "{currentProject.name}".</p>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Project Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'environments' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-600" />
                <span>Test Execution Environments ({projectEnvs.length})</span>
              </h3>
              <p className="text-slate-500 mt-0.5">Target hosts, staging servers, and local sandbox configurations.</p>
            </div>
          </div>

          <form onSubmit={handleAddEnvironment} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Environment Name</label>
              <input
                type="text"
                placeholder="e.g. Staging US-East"
                value={newEnvName}
                onChange={(e) => setNewEnvName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Environment Type</label>
              <select
                value={newEnvType}
                onChange={(e) => setNewEnvType(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white text-slate-900 font-semibold"
              >
                <option value="qa">QA / Automation</option>
                <option value="dev">Development</option>
                <option value="staging">Staging</option>
                <option value="uat">UAT</option>
                <option value="prod">Production</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Base URL</label>
              <input
                type="text"
                placeholder="https://staging.app.io"
                value={newEnvUrl}
                onChange={(e) => setNewEnvUrl(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white text-slate-900 font-mono"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Environment</span>
              </button>
            </div>
          </form>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
            {projectEnvs.map((env) => (
              <div key={env.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{env.name}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {env.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{env.url}</div>
                </div>

                <button
                  onClick={() => deleteEnvironment(env.id)}
                  className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete Environment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {isCreateProjectOpen && (
        <CreateProjectModal
          isOpen={isCreateProjectOpen}
          onClose={() => setIsCreateProjectOpen(false)}
        />
      )}
    </div>
  );
};
