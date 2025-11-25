'use client';

import { useState } from 'react';

const DYSLEXIA_DESCRIPTIONS = [
  "Letters and words seem to move, blur, or swap positions when I read",
  "I struggle to distinguish between similar-looking letters like b, d, p, q",
  "Reading dense blocks of text is overwhelming and exhausting",
  "I lose my place frequently and have to re-read lines multiple times"
];

export default function Home() {
  const [selectedDescriptions, setSelectedDescriptions] = useState<string[]>([]);
  const [customDescription, setCustomDescription] = useState('');
  const [inputText, setInputText] = useState('');
  const [formattedText, setFormattedText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleDescription = (description: string) => {
    setSelectedDescriptions(prev => 
      prev.includes(description)
        ? prev.filter(d => d !== description)
        : [...prev, description]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFormattedText('');

    const descriptions = [...selectedDescriptions];
    if (customDescription.trim()) {
      descriptions.push(customDescription.trim());
    }

    if (descriptions.length === 0) {
      setError('Please select at least one description or add your own');
      setIsLoading(false);
      return;
    }

    if (!inputText.trim()) {
      setError('Please paste some text to format');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/format-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descriptions,
          text: inputText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show detailed error from API
        const errorMsg = data.details || data.error || 'Failed to format text';
        throw new Error(errorMsg);
      }

      setFormattedText(data.formattedText);
      setExplanation(data.explanation || '');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedDescriptions([]);
    setCustomDescription('');
    setInputText('');
    setFormattedText('');
    setExplanation('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Text-Lexic
          </h1>
          <p className="text-lg text-gray-600">
            Make text easier to read for your unique needs
          </p>
        </div>

        {!formattedText ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
            {/* Step 1: Dyslexia Descriptions */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Step 1: Tell us about your reading experience
              </h2>
              <p className="text-gray-600 mb-6">
                Select any descriptions that reflect your experience with reading:
              </p>
              
              <div className="space-y-3 mb-6">
                {DYSLEXIA_DESCRIPTIONS.map((description, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleDescription(description)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedDescriptions.includes(description)
                        ? 'border-indigo-600 bg-indigo-50 shadow-md'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 w-6 h-6 rounded border-2 mr-3 flex items-center justify-center ${
                        selectedDescriptions.includes(description)
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedDescriptions.includes(description) && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-800">{description}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label htmlFor="custom" className="block text-sm font-medium text-gray-700 mb-2">
                  Or describe your own experience (optional):
                </label>
                <textarea
                  id="custom"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="e.g., I find it easier to read with more spacing between lines..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Step 2: Text Input */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Step 2: Paste your text
              </h2>
              <p className="text-gray-600 mb-4">
                Copy and paste the text you'd like to make more readable:
              </p>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={8}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Formatting your text...
                </span>
              ) : (
                'Make Text Readable'
              )}
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Your Readable Text
              </h2>
              <button
                onClick={handleReset}
                className="bg-gray-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-700 transition-all"
              >
                Format Another Text
              </button>
            </div>

            {explanation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  Formatting Decisions
                </h3>
                <div 
                  className="text-blue-800"
                  dangerouslySetInnerHTML={{ __html: explanation }}
                />
              </div>
            )}
            
            <div className="prose max-w-none">
              <div 
                className="p-6 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: formattedText }}
              />
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={() => {
                  const textContent = new DOMParser().parseFromString(formattedText, 'text/html').body.textContent || '';
                  navigator.clipboard.writeText(textContent);
                }}
                className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-all"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
