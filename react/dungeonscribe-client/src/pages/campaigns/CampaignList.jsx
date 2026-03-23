import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import ConfirmDialog from '../../components/ConfirmDialog'
import { campaignService } from '../../api/campaignService'

function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
    document.title = 'DungeonScribe | Campaigns';
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await campaignService.getAll()
      setCampaigns(response.data)
    } catch {
      setError('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }
const handleDelete = (id, e) => {
  e.stopPropagation()
  setConfirmDialog({
    message: 'Are you sure you want to delete this campaign? This cannot be undone.',
    onConfirm: async () => {
      setConfirmDialog(null)
      await campaignService.delete(id)
      setCampaigns(campaigns.filter(c => c.id !== id))
    },
    onCancel: () => setConfirmDialog(null)
  })
}
  if (loading) return (
    <Layout>
      <div className="text-center text-gray-400 mt-20">Loading campaigns...</div>
    </Layout>
  )

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">My Campaigns</h1>
        <button
          onClick={() => navigate('/campaigns/new')}
          className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded transition-colors"
        >
          + New Campaign
        </button>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchCampaigns}
        />
      )}

        {campaigns.length === 0 ? (
          <EmptyState
            icon="⚔️"
            message="No campaigns yet — your adventure awaits"
            actionLabel="Create your first campaign"
            onAction={() => navigate('/campaigns/new')}
          />
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(campaign => (
            <div
              key={campaign.id}
              onClick={() => navigate(`/campaigns/${campaign.id}`)}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-amber-500 cursor-pointer transition-colors"
            >
              <h2 className="text-xl font-semibold text-white mb-2">
                {campaign.name}
              </h2>
              <p className="text-amber-500 text-sm mb-3">{campaign.setting}</p>
              <p className="text-gray-400 text-sm line-clamp-2">
                {campaign.description}
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/campaigns/${campaign.id}/edit`)
                  }}
                  className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded border border-gray-600 hover:border-gray-400 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => handleDelete(campaign.id, e)}
                  className="text-gray-400 hover:text-red-400 text-sm px-3 py-1 rounded border border-gray-600 hover:border-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}
    </Layout>
  )
}

export default CampaignList