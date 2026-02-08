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
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Sparkles,
  Calendar,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(null);
  const [sendingReminders, setSendingReminders] = useState(false);

  useEffect(() => {
    fetchDashboard();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchDashboard(true), 30000);
    return () => clearInterval(interval);
  }, [slug]);

  const fetchDashboard = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) setLoading(true);
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
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboard(true);
    toast.success('Dashboard refreshed!');
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
        fetchDashboard(true);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const { collection, stats, contributors } = dashboard;
  const progressPercentage = stats.completion_percentage || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 backdrop-blur-sm bg-white/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                Kontribute
              </span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh dashboard"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <Link
                href={`/${slug}`}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-all border border-emerald-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Collection</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {collection.title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  collection.type === 'automatic'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {collection.type === 'automatic' ? 'Automatic' : 'Manual'}
                </span>
              </div>
              <p className="text-gray-600 flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Organizer Dashboard</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={copyCollectionLink}
                className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-emerald-300 transition-all shadow-sm"
              >
                <Copy className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Copy Link</span>
              </button>
              <button
                onClick={downloadCSV}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Collected */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-700" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Collected</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              ₦{stats.total_collected?.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              of ₦{stats.total_target?.toLocaleString()} target
            </p>
          </div>

          {/* Paid Contributors */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-700" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Confirmed Payments</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.paid_count}</p>
            <p className="text-xs text-gray-500">
              of {collection.number_of_people || stats.total_contributors} contributors
            </p>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-700" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.pending_count}</p>
            <p className="text-xs text-gray-500">awaiting confirmation</p>
          </div>

          {/* Progress */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-emerald-50 mb-1">Progress</p>
            <p className="text-3xl font-bold text-white mb-2">{progressPercentage}%</p>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all shadow-sm"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Collection Info Banner */}
        {collection.deadline && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Collection Deadline</p>
                <p className="text-sm text-gray-600">
                  {new Date(collection.deadline).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-1 gap-6">
          {/* Pending Contributors */}
          {contributors.pending.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                      <span>Pending Payments</span>
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                        {contributors.pending.length}
                      </span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Awaiting payment confirmation</p>
                  </div>
                  <button
                    onClick={handleSendReminders}
                    disabled={sendingReminders}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                  >
                    {sendingReminders ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">Send Reminders</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {contributors.pending.map((contributor) => (
                    <div
                      key={contributor.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl hover:border-amber-300 transition-all gap-4"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{contributor.name}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                          <span className="text-gray-600">{contributor.phone}</span>
                          {contributor.email && (
                            <>
                              <span className="hidden sm:inline text-gray-400">•</span>
                              <span className="text-gray-500">{contributor.email}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-lg">
                            ₦{contributor.amount_owed?.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(contributor.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleConfirmPayment(contributor.id)}
                          disabled={confirmingPayment === contributor.id}
                          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all shadow-sm hover:shadow-md flex-shrink-0"
                        >
                          {confirmingPayment === contributor.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm">Confirming...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Confirm</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Paid Contributors */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <span>Confirmed Payments</span>
                    <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      {contributors.paid.length}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Successfully verified contributions</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {contributors.paid.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No confirmed payments yet</p>
                  <p className="text-sm text-gray-400 mt-1">Payments will appear here once confirmed</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contributors.paid.map((contributor) => (
                    <div
                      key={contributor.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl hover:border-emerald-300 transition-all gap-4"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">{contributor.name}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                            <span className="text-gray-600">{contributor.phone}</span>
                            {contributor.email && (
                              <>
                                <span className="hidden sm:inline text-gray-400">•</span>
                                <span className="text-gray-500">{contributor.email}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right sm:text-right">
                        <p className="font-bold text-emerald-700 text-lg">
                          ₦{contributor.amount_paid?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(contributor.paid_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}