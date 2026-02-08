"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { verifyPayment } from '../../api';
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function PaymentVerificationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const slug = params.slug;
  const reference = params.reference;
  
  const [verifying, setVerifying] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (reference) {
      verifyPaymentStatus();
    }
  }, [reference]);

  const verifyPaymentStatus = async () => {
    try {
      const response = await verifyPayment(reference);
      
      if (response.status === 'success') {
        setPaymentData(response.data);
      } else {
        setError(response.message || 'Payment verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('An error occurred while verifying your payment');
    } finally {
      setVerifying(false);
    }
  };

  const goToCollection = () => {
    router.push(`/${slug}`);
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
          <Loader2 className="w-20 h-20 animate-spin text-emerald-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-amber-100 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600">{error || 'We could not verify your payment'}</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">
              Your payment was not successful. No charges have been made to your account.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={goToCollection}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Try Again</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Payment Successful
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600">Your contribution has been confirmed</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6 mb-6 border border-emerald-200">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Collection:</span>
              <span className="font-semibold text-gray-900">{paymentData.collection_title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Contributor:</span>
              <span className="font-semibold text-gray-900">{paymentData.contributor_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-bold text-emerald-600 text-xl">
                ₦{paymentData.amount_paid?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium text-gray-900 capitalize">{paymentData.payment_method}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium text-gray-900">
                {new Date(paymentData.paid_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-emerald-800 text-center">
            ✅ A confirmation has been sent to the organizer. Thank you for your contribution!
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={goToCollection}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <span>View Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
