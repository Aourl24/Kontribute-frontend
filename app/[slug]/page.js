"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCollection, makeContribution, makeAutomaticContribution } from '../api';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Loader2, 
  Copy, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Building2, 
  Sparkles,
  Share2,
  TrendingUp,
  Users,
  Target,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function CollectionPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    amount: ""
  });

  useEffect(() => {
    fetchCollection();
  }, [slug]);

  const fetchCollection = async () => {
    try {
      const response = await getCollection(slug);
      if (response.status === 'success') {
        setCollection(response.data);
      } else {
        toast.error('Collection not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load collection');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const isAutomatic = collection.type === 'automatic';
      
      if (isAutomatic && !formData.email) {
        toast.error('Email is required for automatic payments');
        setSubmitting(false);
        return;
      }

      const response = isAutomatic 
        ? await makeAutomaticContribution(slug, formData)
        : await makeContribution(slug, formData);

      if (response.status === 'success') {
        if (isAutomatic) {
          const paymentUrl = response.data.payment_url;
          if (paymentUrl) {
            toast.success('Redirecting to payment page...');
            setTimeout(() => {
              window.location.href = paymentUrl;
            }, 1000);
          } else {
            toast.error('Payment URL not received. Please try again.');
          }
        } else {
          setPaymentDetails(response.data);
          setShowSuccess(true);
          toast.success('Contribution registered! Please complete payment.');
        }
      } else {
        toast.error(response.message || 'Failed to register contribution');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const copyLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    toast.success('Link copied! Share with your group.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
        <p className="text-gray-600">Loading collection...</p>
      </div>
    );
  }

  if (!collection) {
    return null;
  }

  const stats = collection.stats || {};
  const progressPercentage = stats.completion_percentage || 0;
  const isAutomatic = collection.type === 'automatic';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 backdrop-blur-sm bg-white/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  Kontribute
                </span>
              </div>
            </Link>
            
            <button
              onClick={copyLink}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-all border border-emerald-200 hover:border-emerald-300"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Collection Info & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Collection Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{collection.title}</h1>
                  {collection.description && (
                    <p className="text-gray-600 leading-relaxed">{collection.description}</p>
                  )}
                </div>
                <div className={`px-3 py-1.5 rounded-full flex items-center space-x-1.5 flex-shrink-0 ml-4 ${
                  isAutomatic 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {isAutomatic ? (
                    <>
                      <CreditCard className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Instant</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Manual</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-1.5">
                  <Users className="w-4 h-4" />
                  <span>Organized by {collection.organizer_name}</span>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Collection Progress</h3>
                <span className="text-sm font-bold text-emerald-600">{progressPercentage}%</span>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-3 mb-6">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200">
                  <div className="w-10 h-10 mx-auto mb-2 bg-emerald-200 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-700" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-700 mb-1">
                    ₦{stats.total_collected?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-gray-600">Collected</p>
                </div>

                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-200">
                  <div className="w-10 h-10 mx-auto mb-2 bg-teal-200 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-teal-700" />
                  </div>
                  <p className="text-2xl font-bold text-teal-700 mb-1">
                    ₦{collection.total_amount?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-gray-600">Target</p>
                </div>

                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200">
                  <div className="w-10 h-10 mx-auto mb-2 bg-green-200 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-700" />
                  </div>
                  <p className="text-2xl font-bold text-green-700 mb-1">{stats.paid_count || 0}</p>
                  <p className="text-xs text-gray-600">Paid</p>
                </div>

                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200">
                  <div className="w-10 h-10 mx-auto mb-2 bg-amber-200 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-700" />
                  </div>
                  <p className="text-2xl font-bold text-amber-700 mb-1">{stats.pending_count || 0}</p>
                  <p className="text-xs text-gray-600">Pending</p>
                </div>
              </div>
            </div>

            {/* Payment Instructions for Manual (After Success) */}
            {showSuccess && paymentDetails && !isAutomatic && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-200">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost Done!</h2>
                  <p className="text-gray-600">Complete your payment to finalize your contribution</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Payment Instructions</h3>
                      <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                        {paymentDetails.instructions?.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200">
                    <p className="text-sm font-medium text-gray-700 mb-3">Transfer To:</p>
                    <div className="space-y-3">
                      {[
                        { label: 'Bank', value: paymentDetails.bank_details?.bank_name },
                        { label: 'Account Number', value: paymentDetails.bank_details?.account_number, mono: true },
                        { label: 'Account Name', value: paymentDetails.bank_details?.account_name }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                          <span className="text-sm text-gray-600">{item.label}:</span>
                          <div className="flex items-center space-x-2">
                            <span className={`font-semibold text-gray-900 ${item.mono ? 'font-mono' : ''}`}>
                              {item.value}
                            </span>
                            <button
                              onClick={() => copyToClipboard(item.value)}
                              className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
                            >
                              <Copy className="w-4 h-4 text-emerald-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-center shadow-lg">
                    <p className="text-sm text-emerald-50 mb-1">Amount to Pay</p>
                    <p className="text-4xl font-bold text-white">₦{paymentDetails.amount?.toLocaleString()}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Your Reference:</p>
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-emerald-200">
                      <span className="font-mono font-semibold text-emerald-700">
                        {paymentDetails.payment_reference}
                      </span>
                      <button
                        onClick={() => copyToClipboard(paymentDetails.payment_reference)}
                        className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4 text-emerald-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Your contribution will be confirmed within a few minutes after payment.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contribution Form */}
          <div className="lg:col-span-1">
            {!showSuccess && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Make Your Contribution</h2>
                  
                  {/* Payment Type Info */}
                  <div className={`rounded-xl p-4 mb-5 ${
                    isAutomatic 
                      ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200' 
                      : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {isAutomatic ? (
                        <CreditCard className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Building2 className="w-5 h-5 text-amber-600" />
                      )}
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {isAutomatic ? 'Instant Payment' : 'Bank Transfer'}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {isAutomatic 
                        ? 'Pay securely with card, bank transfer, or USSD. Instant confirmation.'
                        : 'You will receive bank details to complete your transfer manually.'}
                    </p>
                  </div>

                  {/* Amount Display */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 mb-5 border border-emerald-200">
                    <p className="text-sm text-gray-600 mb-1">Your Contribution</p>
                    <p className="text-3xl font-bold text-emerald-700">
                      ₦{collection.amount_per_person 
                        ? collection.amount_per_person?.toLocaleString()
                        : (formData.amount || '0')}
                    </p>
                  </div>

                  {/* Contribution Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="08012345678"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                        required
                      />
                    </div>
                    
                    {!collection.amount_per_person && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleChange}
                          placeholder="Enter amount"
                          min="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email {isAutomatic ? <span className="text-red-500">*</span> : <span className="text-gray-400 text-xs">(Optional)</span>}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                        required={isAutomatic}
                      />
                      {isAutomatic && (
                        <p className="text-xs text-gray-500 mt-1.5">
                          Required for payment processing
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className={`w-full py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
                        isAutomatic
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                          : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white'
                      }`}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          {isAutomatic ? (
                            <>
                              <CreditCard className="w-5 h-5" />
                              <span>Pay Now</span>
                            </>
                          ) : (
                            <>
                              <Building2 className="w-5 h-5" />
                              <span>Continue</span>
                            </>
                          )}
                        </>
                      )}
                    </button>

                    <p className="text-xs text-center text-gray-500 pt-2">
                      By contributing, you agree to our terms
                    </p>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}