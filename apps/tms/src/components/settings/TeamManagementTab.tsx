import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Team, User, RoleType } from '../../types';
import {
  Shield,
  Plus,
  Users,
  Building,
  UserPlus,
  UserMinus,
  Edit2,
  Trash2,
  Lock,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  FolderKanban,
} from 'lucide-react';

export const TeamManagementTab: React.FC = () => {
  const {
    teams,
    users,
    projects,
    customRoles,
    currentUser,
    createTeam,
    updateTeam,
    deleteTeam,
    addUserToTeam,
    removeUserFromTeam,
    addToast,
  } = useApp();

  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // New Team Form
  const [teamName, setTeamName] = useState('');
  const [teamHandle, setTeamHandle] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [teamColor, setTeamColor] = useState('#2563eb');
  const [teamLeadUserId, setTeamLeadUserId] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [teamRoleGrant, setTeamRoleGrant] = useState<string>('qa');

  // Add Member to Team modal state
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [memberToAddId, setMemberToAddId] = useState('');

  const selectedTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];
  const isOwnerOrAdmin = currentUser.role === 'owner' || currentUser.isOwner || currentUser.role === 'admin';

  const COLOR_PALETTE = [
    '#2563eb', // Blue
    '#7c3aed', // Purple
    '#059669', // Emerald
    '#ea580c', // Orange
    '#e11d48', // Rose
    '#0891b2', // Cyan
    '#4f46e5', // Indigo
    '#64748b', // Slate
  ];

  const handleOpenCreateModal = () => {
    setTeamName('');
    setTeamHandle('');
    setTeamDescription('');
    setTeamColor('#2563eb');
    setTeamLeadUserId(currentUser.id);
    setSelectedMemberIds([currentUser.id]);
    setTeamRoleGrant('qa');
    setIsCreateModalOpen(true);
  };

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    const newTeam = createTeam({
      name: teamName.trim(),
      handle: teamHandle.trim() || teamName.trim().toLowerCase().replace(/\s+/g, '-'),
      description: teamDescription.trim(),
      color: teamColor,
      leadUserId: teamLeadUserId || currentUser.id,
      memberIds: selectedMemberIds,
    });

    if (newTeam) {
      setSelectedTeamId(newTeam.id);
    }
    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (team: Team) => {
    setTeamName(team.name);
    setTeamHandle(team.handle || '');
    setTeamDescription(team.description);
    setTeamColor(team.color);
    setTeamLeadUserId(team.leadUserId || '');
    setIsEditModalOpen(true);
  };

  const handleEditTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;

    updateTeam(selectedTeam.id, {
      name: teamName.trim(),
      handle: teamHandle.trim(),
      description: teamDescription.trim(),
      color: teamColor,
      leadUserId: teamLeadUserId,
    });

    setIsEditModalOpen(false);
  };

  const handleAddMember = () => {
    if (!selectedTeam || !memberToAddId) return;
    addUserToTeam(selectedTeam.id, memberToAddId);
    setMemberToAddId('');
    setIsAddMemberOpen(false);
  };

  const teamMembers = users.filter((u) => selectedTeam?.memberIds.includes(u.id));
  const availableUsers = users.filter((u) => !selectedTeam?.memberIds.includes(u.id));
  const teamLead = users.find((u) => u.id === selectedTeam?.leadUserId);

  return (
    <div className="space-y-6 text-xs">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Team & Squad Management</h2>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              {teams.length} Squads Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Organize engineering and QA squads, assign role grants, and manage collective access across projects and test runs.
          </p>
        </div>

        {isOwnerOrAdmin && (
          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Team</span>
          </button>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Team Directory List */}
        <div className="md:col-span-4 bg-white rounded-xl border border-slate-200 shadow-2xs p-3 space-y-2">
          <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Active Squads ({teams.length})
          </div>

          <div className="space-y-1">
            {teams.map((t) => {
              const isSelected = selectedTeam?.id === t.id;
              const count = t.memberIds.length;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTeamId(t.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-400'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: t.color }}
                    />
                    <div className="truncate">
                      <div className="font-bold text-slate-900 truncate text-xs">{t.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{t.description || 'No description'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {count} member{count !== 1 ? 's' : ''}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-300'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Team Detail & Membership Management */}
        <div className="md:col-span-8 space-y-4">
          {selectedTeam ? (
            <>
              {/* Team Profile Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-2xs"
                      style={{ backgroundColor: selectedTeam.color }}
                    >
                      {selectedTeam.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{selectedTeam.name}</h3>
                        {selectedTeam.handle && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                            @{selectedTeam.handle}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedTeam.description}</p>
                    </div>
                  </div>

                  {isOwnerOrAdmin && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(selectedTeam)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Edit Squad</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete team "${selectedTeam.name}"? Members will remain in workspace.`)) {
                            deleteTeam(selectedTeam.id);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-700 text-slate-400 transition-colors"
                        title="Delete Team"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Team Details Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Squad Lead
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      {teamLead ? (
                        <>
                          <img
                            src={teamLead.avatar}
                            alt={teamLead.name}
                            className="w-5 h-5 rounded-full object-cover border border-slate-300"
                          />
                          <span className="font-bold text-slate-900 text-xs">{teamLead.name}</span>
                        </>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Unassigned</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Total Roster
                    </span>
                    <span className="font-bold text-slate-900 text-xs mt-1 block">
                      {selectedTeam.memberIds.length} Engineers / QA
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Default Role Grant
                    </span>
                    <span className="font-bold text-blue-700 text-xs mt-1 block flex items-center gap-1">
                      <Lock className="w-3 h-3 text-blue-600" />
                      {selectedTeam.grants?.[0]?.roleId ? selectedTeam.grants[0].roleId.toUpperCase() : 'QA'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Roster & Members Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <h4 className="font-bold text-slate-900 text-xs">Team Roster ({teamMembers.length})</h4>
                  </div>

                  {isOwnerOrAdmin && (
                    <button
                      onClick={() => setIsAddMemberOpen(true)}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1 border border-blue-200 transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Add Member</span>
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100">
                  {teamMembers.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      No members assigned to this squad yet. Click "Add Member" above.
                    </div>
                  ) : (
                    teamMembers.map((member) => {
                      const isLead = member.id === selectedTeam.leadUserId;
                      return (
                        <div key={member.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">{member.name}</span>
                                {isLead && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                    Lead
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500">{member.email} • {member.title}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                              {member.role}
                            </span>

                            {isOwnerOrAdmin && (
                              <button
                                onClick={() => removeUserFromTeam(selectedTeam.id, member.id)}
                                className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Remove from squad"
                              >
                                <UserMinus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              Select or create a squad to view its membership.
            </div>
          )}
        </div>
      </div>

      {/* MODAL: CREATE TEAM */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Create New Team / Squad</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTeamSubmit} className="p-5 space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Core Banking QA Squad"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Handle / Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. core-banking-qa"
                    value={teamHandle}
                    onChange={(e) => setTeamHandle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Squad Color</label>
                  <div className="flex items-center gap-2 py-1">
                    {COLOR_PALETTE.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setTeamColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          teamColor === c ? 'scale-110 border-slate-900 ring-2 ring-blue-400' : 'border-white'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mission / Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the squad scope, test ownership, and regression responsibilities..."
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Squad Lead</label>
                <select
                  value={teamLeadUserId}
                  onChange={(e) => setTeamLeadUserId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-semibold"
                >
                  <option value="">Select Team Lead...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Members</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
                  {users.map((u) => {
                    const isSelected = selectedMemberIds.includes(u.id);
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          setSelectedMemberIds((prev) =>
                            isSelected ? prev.filter((id) => id !== u.id) : [...prev, u.id]
                          );
                        }}
                        className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 border transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span>{u.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  Create Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT TEAM */}
      {isEditModalOpen && selectedTeam && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Edit Squad: {selectedTeam.name}</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditTeamSubmit} className="p-5 space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Squad Name</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Handle / Slug</label>
                  <input
                    type="text"
                    value={teamHandle}
                    onChange={(e) => setTeamHandle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Color</label>
                  <div className="flex items-center gap-2 py-1">
                    {COLOR_PALETTE.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setTeamColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          teamColor === c ? 'scale-110 border-slate-900 ring-2 ring-blue-400' : 'border-white'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Squad Lead</label>
                <select
                  value={teamLeadUserId}
                  onChange={(e) => setTeamLeadUserId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-semibold"
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MEMBER */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-sm w-full overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Add Member to {selectedTeam.name}</h3>
              <button
                onClick={() => setIsAddMemberOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Engineer</label>
                <select
                  value={memberToAddId}
                  onChange={(e) => setMemberToAddId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-semibold"
                >
                  <option value="">Choose team member...</option>
                  {availableUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email}) - {u.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!memberToAddId}
                  onClick={handleAddMember}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs"
                >
                  Add to Squad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
