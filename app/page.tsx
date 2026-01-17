'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createCollection } from './api';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Users, Wallet, Zap } from 'lucide-react';

export default function HomePage() {
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
  });
  const [collectionType , setCollectionType] = useState(1)
  const type = useRef()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" /> <i className="fas fa-wallet sz-30 color-black"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900">Kontribute </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Collect Money from Groups,
            <span className="text-primary-600"> Stress-Free</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stop tracking payments in WhatsApp. Create a link, share it, and collect automatically.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Quick Setup</h3>
            <p className="text-gray-600">Create your collection in under 2 minutes</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Sharing</h3>
            <p className="text-gray-600">Share one link with your entire group</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Everything</h3>
            <p className="text-gray-600">See who paid and who hasn't in real-time</p>
          </div>
        </div>

        {/* Create Collection Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Create Your Collection</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Collection Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Collection Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collection Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Tunde's Bachelor Party"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What is this collection for?"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"> Collection Type </label>
                    <select ref={type} onChange={()=>setCollectionType(type.current.value)} className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 mb-2">
                      <option value={1} > Public Collection </option>
                      <option value={2} > Amount Per Person </option>
                    </select>
                  </div>
                </div>

                 {collectionType == 3 &&
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Amount (₦) *
                    </label>
                    <input
                      type="number"
                      name="amount_per_person"
                      value={formData.amount_per_person}
                      onChange={handleChange}
                      placeholder="5000"
                      min="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              }

                {collectionType == 3 &&
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount per Person (₦) *
                    </label>
                    <input
                      type="number"
                      name="amount_per_person"
                      value={formData.amount_per_person}
                      onChange={handleChange}
                      placeholder="5000"
                      min="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of People
                    </label>
                    <input
                      type="number"
                      name="number_of_people"
                      value={formData.number_of_people}
                      onChange={handleChange}
                      placeholder="10"
                      min="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <span class="text-muted text-sm font-small text-gray-500">(Leave Blank if the Number of people is indefinite)</span>
                  </div>
                </div>
              }

                {/* Total Display */}
                {formData.amount_per_person && formData.number_of_people && (
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Collection Target</p>
                    <p className="text-2xl font-bold text-primary-600">
                      ₦{(parseFloat(formData.amount_per_person || 0) * parseInt(formData.number_of_people || 0)).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Organizer Details */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900">Your Details</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="organizer_name"
                      value={formData.organizer_name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="organizer_phone"
                      value={formData.organizer_phone}
                      onChange={handleChange}
                      placeholder="08012345678"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="organizer_email"
                    value={formData.organizer_email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900">Bank Details (Where money will be sent)</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    name="organizer_bank_name"
                    value={formData.organizer_bank_name}
                    onChange={handleChange}
                    placeholder="e.g., GTBank"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      name="organizer_account_number"
                      value={formData.organizer_account_number}
                      onChange={handleChange}
                      placeholder="0123456789"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Name *
                    </label>
                    <input
                      type="text"
                      name="organizer_account_name"
                      value={formData.organizer_account_name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-700 text-white color-bg-p py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Collection...</span>
                  </>
                ) : (
                  <span>Create Collection</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-12 border-t">
        <div className="text-center text-gray-600">
          <p>© 2026 Kontribute. Making group payments simple.</p>
        </div>
      </footer>
    </div>)}