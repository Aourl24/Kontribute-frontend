'use client';
<<<<<<< HEAD

import { useState, useRef } from 'react';
import { Loader2, Users, Wallet, Zap, DollarSign, CheckCircle, X, AlertCircle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createCollection } from './api';
import toast, { Toaster } from 'react-hot-toast';


export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount_per_person: '',
    number_of_people: '',
    organizer_name: '',
    organizer_phone: '',
    organizer_email: '',
    organizer_bank_name: '',
    organizer_account_number: '',
    organizer_account_name: '',
    total_amount: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        amount_per_person: parseFloat(formData.amount_per_person),
        number_of_people: parseInt(formData.number_of_people),
      };

      const response = await createCollection(payload);

      if (response.status === 'success') {
        toast.success('Collection created successfully!');
        const slug = response.data.slug;
        router.push(`/${slug}`);
      } else {
        toast.error(response.message || 'Failed to create collection');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateFees = () => {
    if (formData.collection_type !== 'fixed' || !formData.amount_per_person || !formData.number_of_people) {
      return { total: 0, fee: 0, youReceive: 0 };
    }
    const total = parseFloat(formData.amount_per_person) * parseInt(formData.number_of_people);
    const fee = formData.payment_method === 'automated' ? total * 0.025 : 0;
    return { total, fee, youReceive: total - fee };
  };

  const { total, fee, youReceive } = calculateFees();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Toaster position="top-right" />
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">Kontribute</span>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Collect Money from Groups,<span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Stress-Free</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Stop tracking payments in WhatsApp. Create a link, share it, and collect automatically.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Quick Setup</h3>
            <p className="text-gray-600">Create your collection in under 2 minutes</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Easy Sharing</h3>
            <p className="text-gray-600">Share one link with your entire group</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Track Everything</h3>
            <p className="text-gray-600">See who paid and who hasn't in real-time</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Create Your Collection</h2>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <button type="button" onClick={() => setFormData({...formData, collection_type: 'fixed'})} className={`p-4 rounded-xl border-2 text-left transition-all ${formData.collection_type === 'fixed' ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-gray-200 bg-white hover:border-emerald-200'}`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.collection_type === 'fixed' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                        <DollarSign className={`w-5 h-5 ${formData.collection_type === 'fixed' ? 'text-emerald-600' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Fixed Amount</h4>
                        <p className="text-sm text-gray-600 mt-1">Everyone pays the same</p>
                      </div>
                      {formData.collection_type === 'fixed' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                    </div>
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, collection_type: 'flexible'})} className={`p-4 rounded-xl border-2 text-left transition-all ${formData.collection_type === 'flexible' ? 'border-teal-500 bg-teal-50 shadow-sm' : 'border-gray-200 bg-white hover:border-teal-200'}`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.collection_type === 'flexible' ? 'bg-teal-100' : 'bg-gray-100'}`}>
                        <Wallet className={`w-5 h-5 ${formData.collection_type === 'flexible' ? 'text-teal-600' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Flexible Amount</h4>
                        <p className="text-sm text-gray-600 mt-1">Any amount allowed</p>
                      </div>
                      {formData.collection_type === 'flexible' && <CheckCircle className="w-5 h-5 text-teal-600" />}
                    </div>
                  </button>
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <button type="button" onClick={() => setFormData({...formData, payment_method: 'automated'})} className={`p-4 rounded-xl border-2 text-left transition-all ${formData.payment_method === 'automated' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 bg-white hover:border-blue-200'}`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.payment_method === 'automated' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Zap className={`w-5 h-5 ${formData.payment_method === 'automated' ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">Automated</h4>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">Best</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Instant confirmation</p>
                        <p className="text-xs text-blue-600 font-medium mt-2">2.5% fee</p>
                      </div>
                      {formData.payment_method === 'automated' && <CheckCircle className="w-5 h-5 text-blue-600" />}
                    </div>
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, payment_method: 'manual'})} className={`p-4 rounded-xl border-2 text-left transition-all ${formData.payment_method === 'manual' ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-gray-200 bg-white hover:border-purple-200'}`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.payment_method === 'manual' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                        <Wallet className={`w-5 h-5 ${formData.payment_method === 'manual' ? 'text-purple-600' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Manual Transfer</h4>
                        <p className="text-sm text-gray-600 mt-1">Direct to your bank</p>
                        <p className="text-xs text-purple-600 font-medium mt-2">No fees</p>
                      </div>
                      {formData.payment_method === 'manual' && <CheckCircle className="w-5 h-5 text-purple-600" />}
                    </div>
                  </button>
                </div>
                <div className={`p-4 rounded-lg border ${formData.payment_method === 'automated' ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'}`}>
                  <div className="flex items-start space-x-2">
                    <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${formData.payment_method === 'automated' ? 'text-blue-600' : 'text-purple-600'}`} />
                    <div className="text-sm">
                      {formData.payment_method === 'automated' ? (
                        <div>
                          <p className="font-semibold text-blue-900 mb-1">Automated Benefits:</p>
                          <ul className="list-disc list-inside text-blue-800 space-y-0.5">
                            <li>Secure payment gateway processing</li>
                            <li>Real-time automatic confirmation</li>
                            <li>Withdraw to bank anytime</li>
                            <li>2.5% fee covers processing costs</li>
                          </ul>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold text-purple-900 mb-1">Manual Transfer:</p>
                          <ul className="list-disc list-inside text-purple-800 space-y-0.5">
                            <li>Direct bank transfers</li>
                            <li>Manual payment confirmation</li>
                            <li>No platform fees (100% yours)</li>
                            <li>Requires tracking</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Collection Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Collection Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Tunde's Bachelor Party" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} placeholder="What is this collection for?" rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount </label>
                    <input type="text" name="total_amount" value={formData.total_amount} onChange={handleChange} placeholder="Enter your target" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" type="number" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {formData.collection_type === 'fixed' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amount per Person (₦) *</label>
                      <input type="number" name="amount_per_person" value={formData.amount_per_person} onChange={handleChange} placeholder="5000" min="100" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" required />
                    </div>
                  )}
                  <div className={formData.collection_type === 'flexible' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{formData.collection_type === 'fixed' ? 'Number of People *' : 'Expected Contributors (Optional)'}</label>
                    <input type="number" name="number_of_people" value={formData.number_of_people} onChange={handleChange} placeholder="10" min="1" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" required={formData.collection_type === 'fixed'} />
                  </div>
                </div>
                
                {formData.collection_type === 'fixed' && total > 0 && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Collection:</span>
                        <span className="font-semibold text-gray-900">₦{total.toLocaleString()}</span>
                      </div>
                      {formData.payment_method === 'automated' && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Processing Fee (2.5%):</span>
                            <span className="font-semibold text-red-600">-₦{fee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-lg border-t border-emerald-200 pt-2">
                            <span className="font-semibold text-gray-900">You Receive:</span>
                            <span className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">₦{youReceive.toLocaleString()}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Your Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                    <input type="text" name="organizer_name" value={formData.organizer_name} onChange={handleChange} placeholder="John Doe" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input type="tel" name="organizer_phone" value={formData.organizer_phone} onChange={handleChange} placeholder="08012345678" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                  <input type="email" name="organizer_email" value={formData.organizer_email} onChange={handleChange} placeholder="john@example.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                </div>
                
               
              </div>

              {formData.payment_method === 'manual' && (
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Bank Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                    <input type="text" name="organizer_bank_name" value={formData.organizer_bank_name} onChange={handleChange} placeholder="e.g., GTBank" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" required />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                      <input type="text" name="organizer_account_number" value={formData.organizer_account_number} onChange={handleChange} placeholder="0123456789" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Name *</label>
                      <input type="text" name="organizer_account_name" value={formData.organizer_account_name} onChange={handleChange} placeholder="John Doe" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" required />
                    </div>
                  </div>
                </div>
              )}

              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Collection...</span>
                  </>
                ) : (
                  <span>Create Collection</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-8 mt-12 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>© 2026 Kontribute. Making group payments simple.</p>
        </div>
      </footer>
    </div>
  );
}