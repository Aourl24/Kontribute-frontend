'use client';
import { useState } from 'react';
import { Loader2, Wallet, Zap, DollarSign, CheckCircle, Info, CreditCard, Building2, Sparkles, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createCollection } from '../api';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function CreateCollectionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
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
    total_amount: '',
    collection_type: 'flexible',
    payment_method: 'manual',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        organizer_name: formData.organizer_name,
        organizer_phone: formData.organizer_phone,
        organizer_email: formData.organizer_email,
        type: formData.payment_method === 'automated' ? 'automatic' : 'manual',
      };

      // Add amount fields based on collection type
      if (formData.collection_type === 'fixed' && formData.amount_per_person) {
        payload.amount_per_person = parseFloat(formData.amount_per_person);
      }
      
      if (formData.number_of_people) {
        payload.number_of_people = parseInt(formData.number_of_people);
      }

      if (formData.total_amount) {
        payload.total_amount = parseFloat(formData.total_amount);
      }

      // Add bank details for manual payments
      if (formData.payment_method === 'manual') {
        payload.organizer_bank_name = formData.organizer_bank_name;
        payload.organizer_account_number = formData.organizer_account_number;
        payload.organizer_account_name = formData.organizer_account_name;
      }

      const response = await createCollection(payload);

      if (response.status === 'success') {
        toast.success('Collection created successfully!');
        const slug = response.data.slug;
        setTimeout(() => {
          router.push(`/${slug}`);
        }, 1000);
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
    const fee = formData.payment_method === 'automated' ? total * 0.005 : 0;
    return { total, fee, youReceive: total - fee };
  };

  const { total, fee, youReceive } = calculateFees();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 backdrop-blur-sm bg-white/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  Kontribute
                </span>
              </div>
            </Link>
            <div className="text-sm text-gray-500">
              Step 1 of 1
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Create Your Collection
            </h1>
            <p className="text-lg text-gray-600">
              Set up your collection in just a few simple steps
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
              
              {/* Step 1: Collection Type */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Collection Type</h3>
                  <p className="text-sm text-gray-500">How should contributors pay?</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, collection_type: 'flexible'})} 
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      formData.collection_type === 'flexible' 
                        ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-100' 
                        : 'border-gray-200 bg-white hover:border-teal-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        formData.collection_type === 'flexible' ? 'bg-teal-100' : 'bg-gray-100'
                      }`}>
                        <Wallet className={`w-6 h-6 ${
                          formData.collection_type === 'flexible' ? 'text-teal-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">Flexible Amount</h4>
                          {formData.collection_type === 'flexible' && (
                            <CheckCircle className="w-5 h-5 text-teal-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Contributors choose their amount</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, collection_type: 'fixed'})} 
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      formData.collection_type === 'fixed' 
                        ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100' 
                        : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        formData.collection_type === 'fixed' ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}>
                        <DollarSign className={`w-6 h-6 ${
                          formData.collection_type === 'fixed' ? 'text-emerald-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">Fixed Amount</h4>
                          {formData.collection_type === 'fixed' && (
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Everyone pays the same amount</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Step 2: Payment Method */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Payment Method</h3>
                  <p className="text-sm text-gray-500">How will you receive payments?</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, payment_method: 'automated'})} 
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      formData.payment_method === 'automated' 
                        ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100' 
                        : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        formData.payment_method === 'automated' ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}>
                        <CreditCard className={`w-6 h-6 ${
                          formData.payment_method === 'automated' ? 'text-emerald-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">Automatic</h4>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full hidden">
                              Recommended
                            </span>
                          </div>
                          {formData.payment_method === 'automated' && (
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Instant payment confirmation</p>
                        <p className="text-xs font-medium text-emerald-700">0.5% platform fee</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, payment_method: 'manual'})} 
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      formData.payment_method === 'manual' 
                        ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-100' 
                        : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        formData.payment_method === 'manual' ? 'bg-amber-100' : 'bg-gray-100'
                      }`}>
                        <Building2 className={`w-6 h-6 ${
                          formData.payment_method === 'manual' ? 'text-amber-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">Manual Transfer</h4>
                          {formData.payment_method === 'manual' && (
                            <CheckCircle className="w-5 h-5 text-amber-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Direct bank transfer</p>
                        <p className="text-xs font-medium text-amber-700">No platform fees</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Info Box */}
                <div className={`p-4 rounded-xl border ${
                  formData.payment_method === 'automated' 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      formData.payment_method === 'automated' ? 'text-emerald-600' : 'text-amber-600'
                    }`} />
                    <div className="text-sm">
                      {formData.payment_method === 'automated' ? (
                        <div className="space-y-1">
                          <p className="font-semibold text-emerald-900">With Automatic Payment:</p>
                          <ul className="list-disc list-inside text-emerald-800 space-y-0.5 ml-1">
                            <li>Contributors pay with cards, bank transfer, or USSD</li>
                            <li>Instant automatic confirmation via Paystack</li>
                            <li>Withdraw to your bank anytime</li>
                            <li>0.5% fee covers secure processing</li>
                          </ul>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="font-semibold text-amber-900">With Manual Transfer:</p>
                          <ul className="list-disc list-inside text-amber-800 space-y-0.5 ml-1">
                            <li>Contributors transfer directly to your bank</li>
                            <li>You confirm payments manually</li>
                            <li>100% of contributions go to you</li>
                            <li>Requires manual tracking</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Step 3: Collection Details */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Collection Details</h3>
                  <p className="text-sm text-gray-500">Tell us about your collection</p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collection Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="e.g., Tunde's Bachelor Party Fund" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white" 
                    required 
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="What are you collecting money for?" 
                    rows={3} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white resize-none" 
                  />
                </div>

                {/* Amount Fields - Conditional based on collection type */}
                <div className="grid md:grid-cols-2 gap-4">
                  {formData.collection_type === 'fixed' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount per Person (₦) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="number" 
                        name="amount_per_person" 
                        value={formData.amount_per_person} 
                        onChange={handleChange} 
                        placeholder="5,000" 
                        min="100" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white" 
                        required 
                      />
                    </div>
                  )}
                  
                  <div className={formData.collection_type === 'flexible' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formData.collection_type === 'fixed' ? (
                        <>Number of Contributors <span className="text-red-500">*</span></>
                      ) : (
                        <>Expected Contributors <span className="text-gray-400 text-xs">(Optional)</span></>
                      )}
                    </label>
                    <input 
                      type="number" 
                      name="number_of_people" 
                      value={formData.number_of_people} 
                      onChange={handleChange} 
                      placeholder="10" 
                      min="1" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white" 
                      required={formData.collection_type === 'fixed'} 
                    />
                  </div>
                </div>

                {/* Target Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Amount (₦) <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input 
                    type="number" 
                    name="total_amount" 
                    value={formData.total_amount} 
                    onChange={handleChange} 
                    placeholder="100,000" 
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white" 
                  />
                </div>

                {/* Collection Summary - Only for Fixed Amount */}
                {formData.collection_type === 'fixed' && total > 0 && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-xl border border-emerald-200">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Collection Summary</h4>
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">Total Collection:</span>
                        <span className="font-semibold text-gray-900">₦{total.toLocaleString()}</span>
                      </div>
                      {formData.payment_method === 'automated' && (
                        <>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">Platform Fee (2.5%):</span>
                            <span className="font-semibold text-red-600">-₦{fee.toLocaleString()}</span>
                          </div>
                          <div className="pt-2.5 border-t border-emerald-200">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-900">You Receive:</span>
                              <span className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                ₦{youReceive.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Step 4: Your Details */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Information</h3>
                  <p className="text-sm text-gray-500">How can contributors reach you?</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="organizer_name" 
                    value={formData.organizer_name} 
                    onChange={handleChange} 
                    placeholder="John Doe" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white" 
                    required 
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      name="organizer_email" 
                      value={formData.organizer_email} 
                      onChange={handleChange} 
                      placeholder="john@example.com" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input 
                      type="tel" 
                      name="organizer_phone" 
                      value={formData.organizer_phone} 
                      onChange={handleChange} 
                      placeholder="08012345678" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white" 
                    />
                  </div>
                </div>
              </div>

              {/* Step 5: Bank Details (Only for Manual) */}
              {formData.payment_method === 'manual' && (
                <>
                  <div className="border-t border-gray-200"></div>
                  
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Bank Account Details</h3>
                      <p className="text-sm text-gray-500">Where should contributors send payments?</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="organizer_bank_name" 
                        value={formData.organizer_bank_name} 
                        onChange={handleChange} 
                        placeholder="e.g., GTBank, First Bank, Access Bank" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white" 
                        required 
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="organizer_account_number" 
                          value={formData.organizer_account_number} 
                          onChange={handleChange} 
                          placeholder="0123456789" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white" 
                          required 
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="organizer_account_name" 
                          value={formData.organizer_account_name} 
                          onChange={handleChange} 
                          placeholder="John Doe" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white" 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={loading} 
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating Collection...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Create Collection</span>
                    </>
                  )}
                </button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  By creating a collection, you agree to our Terms of Service
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-12 border-t border-gray-200">
        <div className="text-center text-gray-600 text-sm">
          <p>© 2024 Kontribute. Making group payments simple and secure.</p>
        </div>
      </footer>
    </div>
  );
}