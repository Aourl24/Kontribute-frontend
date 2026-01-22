'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDashboard, confirmPayment, sendReminders } from '../../api';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Loader2, 
  CheckCircle, 
  Clock, 
  Send, 
  Download,
  Copy,
  ArrowLeft,
  TrendingUp
} from 'lucide-react';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmingPayment, setConfirmingPayment] = useState(null);
  const [sendingReminders, setSendingReminders] = useState(false);

  useEffect(() => {
    fetchDashboard();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, [slug]);

  const fetchDashboard = async () => {
    try {
      const response = await getDashboard(slug);
      if (response.status === 'success') {
        setDashboard(response.data);
      } else {
        toast.error('Failed to load dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (contributorId) => {
    setConfirmingPayment(contributorId);
    try {
      const response = await confirmPayment(slug, {
        contributor_id: contributorId,
        payment_proof: 'Confirmed via dashboard',
        verified_by: 'organizer'
      });

      if (response.status === 'success') {
        toast.success('Payment confirmed!');
        fetchDashboard(); // Refresh data
      } else {
        toast.error(response.message || 'Failed to confirm payment');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to confirm payment');
    } finally {
      setConfirmingPayment(null);
    }
  };

  const handleSendReminders = async () => {
    setSendingReminders(true);
    try {
      const response = await sendReminders(slug);
      
      if (response.status === 'success') {
        toast.success(`Reminders sent to ${response.data.reminded_count} people!`);
      } else {
        toast.error(response.message || 'Failed to send reminders');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send reminders');
    } finally {
      setSendingReminders(false);
    }
  };

  const copyCollectionLink = () => {
    const link = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(link);
    toast.success('Collection link copied!');
  };

  const downloadCSV = () => {
    if (!dashboard) return;

    const allContributors = [
      ...dashboard.contributors.paid.map(c => ({ ...c, status: 'Paid' })),
      ...dashboard.contributors.pending.map(c => ({ ...c, status: 'Pending' }))
    ];

    const csv = [
      ['Name', 'Phone', 'Email', 'Amount', 'Status', 'Paid At'],
      ...allContributors.map(c => [
        c.name,
        c.phone,
        c.email || 'N/A',
        c.amount_paid || c.amount_owed,
        c.status,
        c.paid_at ? new Date(c.paid_at).toLocaleString() : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dashboard.collection.title}-contributors.csv`;
    a.click();
    toast.success('CSV downloaded!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const { collection, stats, contributors } = dashboard;
  const progressPercentage = stats.completion_percentage || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100">
      <Toaster position="top-right" />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/${slug}`)}
            className="flex items-center space-x-2 text-teal-700 hover:text-teal-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Collection</span>
          </button>

          <div className="flx justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {collection.title}
              </h1>
              <p className="text-gray-600">Organizer Dashboard</p>
            </div>
            <div class="py-3">
            <div className="flex space-x-3">
              <button
                onClick={copyCollectionLink}
                className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-teal-200 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition-all"
              >
                <Copy className="w-4 h-4 text-teal-600" />
                <span className="text-teal-700">Copy Link</span>
              </button>
              <button
                onClick={downloadCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-teal-200 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition-all"
              >
                <Download className="w-4 h-4 text-teal-600" />
                <span className="text-teal-700">Export CSV</span>
              </button>
            </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-teal-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Total Collected</span>
              <TrendingUp className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-3xl font-bold text-teal-600">
              ₦{stats.total_collected?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              of ₦{stats.total_target?.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-teal-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Paid</span>
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.paid_count}</p>
            <p className="text-sm text-gray-500 mt-1">
              of {collection.number_of_people} people
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-teal-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Pending</span>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pending_count}</p>
            <p className="text-sm text-gray-500 mt-1">awaiting payment</p>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-teal-50 font-medium">Progress</span>
            </div>
            <p className="text-3xl font-bold text-white">{progressPercentage}%</p>
            <div className="w-full bg-teal-300/30 rounded-full h-2 mt-2">
              <div
                className="bg-white h-2 rounded-full transition-all shadow-sm"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pending Contributors */}
        {contributors.pending.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-teal-100 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Pending Payments ({contributors.pending.length})
              </h2>
              <button
                onClick={handleSendReminders}
                disabled={sendingReminders}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 transition-all shadow-sm"
              >
                {sendingReminders ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Send Reminders</span>
              </button>
            </div>

            <div className="space-y-3">
              {contributors.pending.map((contributor) => (
                <div
                  key={contributor.id}
                  className="flex items-center justify-between p-4 bg-amber-50 border-2 border-amber-200 rounded-lg hover:border-amber-300 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{contributor.name}</p>
                    <p className="text-sm text-gray-600">{contributor.phone}</p>
                    {contributor.email && (
                      <p className="text-sm text-gray-500">{contributor.email}</p>
                    )}
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-bold text-gray-900">
                      ₦{contributor.amount_owed?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(contributor.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleConfirmPayment(contributor.id)}
                    disabled={confirmingPayment === contributor.id}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all shadow-sm"
                  >
                    {confirmingPayment === contributor.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    <span className="text-sm">Confirm</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paid Contributors */}
        <div className="bg-white rounded-xl shadow-md border border-teal-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Confirmed Payments ({contributors.paid.length})
          </h2>

          {contributors.paid.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-teal-300" />
              <p>No confirmed payments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contributors.paid.map((contributor) => (
                <div
                  key={contributor.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-lg hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-sm">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{contributor.name}</p>
                      <p className="text-sm text-gray-600">{contributor.phone}</p>
                      {contributor.email && (
                        <p className="text-sm text-gray-500">{contributor.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-teal-600">
                      ₦{contributor.amount_paid?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(contributor.paid_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}