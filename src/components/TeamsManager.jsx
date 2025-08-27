import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getTeams, addTeam, updateTeam, deleteTeam, uploadTeamLogo } from '../services/database';
import { Button } from '@/components/ui/button';
import { XCircle, Edit2, Plus, Upload } from 'lucide-react';

const TeamsManager = () => {
  const { t } = useTranslation();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTeam, setEditingTeam] = useState(null);
  const [newTeam, setNewTeam] = useState({
    name: '',
    fieldAddress: '',
    logo: null,
    colors: ['', '']
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const teamsData = await getTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    try {
      await addTeam(newTeam);
      setNewTeam({ name: '', fieldAddress: '', logo: null, colors: ['', ''] });
      fetchTeams();
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    try {
      await updateTeam(editingTeam.id, editingTeam);
      setEditingTeam(null);
      fetchTeams();
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm(t('admin.teams.confirmDelete'))) {
      try {
        await deleteTeam(teamId);
        fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const handleLogoUpload = async (file, teamId) => {
    try {
      const logoUrl = await uploadTeamLogo(file, teamId);
      await updateTeam(teamId, { logo: logoUrl });
      fetchTeams();
    } catch (error) {
      console.error('Error uploading logo:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('admin.teams.title')}</h2>

      {/* Add New Team Form */}
      <form onSubmit={handleAddTeam} className="bg-white p-4 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-semibold">{t('admin.teams.addNew')}</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder={t('admin.teams.name')}
            value={newTeam.name}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder={t('admin.teams.fieldAddress')}
            value={newTeam.fieldAddress}
            onChange={(e) => setNewTeam({ ...newTeam, fieldAddress: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder={t('admin.teams.primaryColor')}
              value={newTeam.colors[0]}
              onChange={(e) => setNewTeam({ ...newTeam, colors: [e.target.value, newTeam.colors[1]] })}
              className="w-1/2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder={t('admin.teams.secondaryColor')}
              value={newTeam.colors[1]}
              onChange={(e) => setNewTeam({ ...newTeam, colors: [newTeam.colors[0], e.target.value] })}
              className="w-1/2 p-2 border rounded"
            />
          </div>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            {t('admin.teams.add')}
          </Button>
        </div>
      </form>

      {/* Teams List */}
      <div className="space-y-4">
        {teams.map((team) => (
          <div key={team.id} className="bg-white p-4 rounded-lg shadow">
            {editingTeam?.id === team.id ? (
              <form onSubmit={handleUpdateTeam} className="space-y-4">
                <input
                  type="text"
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  value={editingTeam.fieldAddress}
                  onChange={(e) => setEditingTeam({ ...editingTeam, fieldAddress: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder={t('admin.teams.fieldAddress')}
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={editingTeam.colors[0] || ''}
                    onChange={(e) => setEditingTeam({
                      ...editingTeam,
                      colors: [e.target.value, editingTeam.colors[1] || '']
                    })}
                    className="w-1/2 p-2 border rounded"
                    placeholder={t('admin.teams.primaryColor')}
                  />
                  <input
                    type="text"
                    value={editingTeam.colors[1] || ''}
                    onChange={(e) => setEditingTeam({
                      ...editingTeam,
                      colors: [editingTeam.colors[0] || '', e.target.value]
                    })}
                    className="w-1/2 p-2 border rounded"
                    placeholder={t('admin.teams.secondaryColor')}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    {t('admin.teams.save')}
                  </Button>
                  <Button type="button" onClick={() => setEditingTeam(null)} variant="outline" className="flex-1">
                    {t('admin.teams.cancel')}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{team.name}</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditingTeam(team)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      {t('admin.teams.edit')}
                    </Button>
                    <Button
                      onClick={() => handleDeleteTeam(team.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <XCircle className="w-4 h-4" />
                      {t('admin.teams.delete')}
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600">{team.fieldAddress}</p>
                <div className="flex items-center gap-4">
                  {team.logo ? (
                    <img src={team.logo} alt={team.name} className="w-16 h-16 object-contain" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded">
                      <span className="text-gray-400">No logo</span>
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e.target.files[0], team.id)}
                    />
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      {t('admin.teams.uploadLogo')}
                    </Button>
                  </label>
                </div>
                {team.colors?.length > 0 && (
                  <div className="flex gap-2">
                    {team.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsManager;
