"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCollection, makeContribution } from '../api';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Users, Target, Copy, CheckCircle, Clock } from 'lucide-react';

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
    amount:""
  });

  useEffect(() => {
    fetchCollection();
  }, [slug]);
  
  // useEffect(()=>{
  //   if (collection){
  //   !collection.amount_per_person && setFormData({...formData,amount:""})}
    
  // },[collection])

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
      const response = await makeContribution(slug, formData);

      if (response.status === 'success') {
        setPaymentDetails(response.data);
        setShowSuccess(true);
        toast.success('Contribution registered! Please complete payment.');
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!collection) {
    return null;
  }

  const stats = collection.stats || {};
  const progressPercentage = stats.completion_percentage || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
      <Toaster position="top-right" />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{collection.title}</h1>
          {collection.description && (
            <p className="text-lg text-gray-600">{collection.description}</p>
          )}
          
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-sm text-gray-500">Organized by {collection.organizer_name}</span>
            <button
              onClick={copyLink}
              className="flex items-center space-x-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-emerald-100">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-sm font-bold text-emerald-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-emerald-50">
              <p className="text-2xl font-bold text-emerald-700">
                ₦{stats.total_collected?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-600">Collected</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-teal-50">
              <p className="text-2xl font-bold text-teal-700">
                ₦{collection.total_amount?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-600">Target</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-50">
              <p className="text-2xl font-bold text-green-700">{stats.paid_count || 0}</p>
              <p className="text-sm text-gray-600">Paid</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-amber-50">
              <p className="text-2xl font-bold text-amber-700">{stats.pending_count || 0}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>

        {/* Payment Success / Instructions */}
        {showSuccess && paymentDetails ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-emerald-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost Done!</h2>
              <p className="text-gray-600">Please complete your payment to finalize your contribution</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Payment Instructions</h3>
                  <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    {paymentDetails.instructions?.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
                <p className="text-sm text-gray-600 mb-2">Transfer To:</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Bank:</span>
                    <div className="flex items-center space-x-2">
                      <span>{paymentDetails.bank_details?.bank_name}</span>
                      <button
                        onClick={() => copyToClipboard(paymentDetails.bank_details?.bank_name)}
                        className="text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Account Number:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono">{paymentDetails.bank_details?.account_number}</span>
                      <button
                        onClick={() => copyToClipboard(paymentDetails.bank_details?.account_number)}
                        className="text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Account Name:</span>
                    <div className="flex items-center space-x-2">
                      <span>{paymentDetails.bank_details?.account_name}</span>
                      <button
                        onClick={() => copyToClipboard(paymentDetails.bank_details?.account_name)}
                        className="text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-4 text-center shadow-md">
                <p className="text-sm text-emerald-50 mb-1">Amount to Pay</p>
                <p className="text-3xl font-bold text-white">₦{paymentDetails.amount?.toLocaleString()}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Your Reference:</p>
                <div className="flex items-center justify-between bg-white p-3 rounded border border-emerald-200">
                  <span className="font-mono font-semibold text-emerald-700">{paymentDetails.payment_reference}</span>
                  <button
                    onClick={() => copyToClipboard(paymentDetails.payment_reference)}
                    className="text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Your contribution will be confirmed within a few minutes after payment.</p>
            </div>
          </div>
        ) : (
          /* Contribution Form */
          <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Make Your Contribution</h2>
            
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 mb-6 border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Your contribution amount:</span>
                <span className="text-2xl font-bold text-emerald-600">
                  ₦{ collection.amount_per_person ? collection.amount_per_person?.toLocaleString()
                  :formData.amount}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08012345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                />
              </div>
              
              {
                !collection.amount_per_person &&  <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to be paid *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="08012345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                />
              </div>
              }

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={submitting} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Continue to Payment</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
