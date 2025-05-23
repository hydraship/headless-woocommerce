import { BlockComponentProps } from '@src/components/blocks';
import { BlockAttributes } from '@src/lib/block/types';
import { useState } from 'react';
import axios from 'axios';

export const GruumMarketingOptin = ({ block }: BlockComponentProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if ('sg-gutenberg-customisations/sg-marketing-optin' !== block.blockName) {
    return null;
  }

  const attrs = block.attrs as BlockAttributes;
  if (attrs.blockVisibility && attrs.blockVisibility.hideBlock) {
    return null;
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage({ text: 'Please enter your email address', type: 'error' });
      return;
    }

    if (!validateEmail(email)) {
      setMessage({ text: 'Please enter a valid email address', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Use our Next.js API route instead of calling WordPress directly
      const response = await axios.post('/api/newsletter-subscribe/', { email });

      if (response.data.status === 'success') {
        setMessage({ text: response.data.message, type: 'success' });
        setEmail('');
      } else {
        setMessage({
          text: response.data.message || 'Something went wrong. Please try again.',
          type: 'error',
        });
      }
    } catch (error) {
      setMessage({
        text: 'Something went wrong. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={attrs.className}>
      <div className="marketing-optin-content">
        <form
          onSubmit={handleSubmit}
          className="marketing-optin-form mt-4 max-w-xl mx-auto"
        >
          {message && (
            <div
              className={`text-sm mb-3 p-2 rounded ${
                message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <div className="flex-grow">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                disabled={loading}
                aria-label="Email address"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 whitespace-nowrap"
                aria-label="Sign up"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Sign Up Now'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
