import { useState } from 'react';

interface InsuranceQuestion {
  id: string;
  question: string;
  type: 'text' | 'select' | 'textarea' | 'date' | 'boolean';
  options?: string[];
  required: boolean;
}

interface InsuranceQuote {
  id: string;
  provider: string;
  assignmentId?: string;
  assignmentTitle?: string;
  coverageType: string;
  coverageAmount: string;
  premium: string;
  deductible: string;
  effectiveDate: string;
  expirationDate: string;
  status: 'pending' | 'accepted' | 'declined';
  submittedDate: string;
  details: string;
}

const standardQuestions: InsuranceQuestion[] = [
  {
    id: 'current_coverage',
    question: 'Do you currently have malpractice insurance?',
    type: 'boolean',
    required: true
  },
  {
    id: 'current_provider',
    question: 'Current insurance provider (if applicable)',
    type: 'text',
    required: false
  },
  {
    id: 'coverage_type',
    question: 'Preferred coverage type',
    type: 'select',
    options: ['Claims-Made', 'Occurrence', 'Tail Coverage', 'Not Sure'],
    required: true
  },
  {
    id: 'coverage_amount',
    question: 'Desired coverage amount',
    type: 'select',
    options: [
      '$1M / $3M',
      '$2M / $4M',
      '$3M / $5M',
      'Other'
    ],
    required: true
  },
  {
    id: 'specialty_coverage',
    question: 'Do you require specialty-specific coverage?',
    type: 'boolean',
    required: true
  },
  {
    id: 'specialty_details',
    question: 'Specialty coverage details',
    type: 'textarea',
    required: false
  },
  {
    id: 'claims_history',
    question: 'Have you had any malpractice claims in the past 10 years?',
    type: 'boolean',
    required: true
  },
  {
    id: 'claims_details',
    question: 'Claims history details (if applicable)',
    type: 'textarea',
    required: false
  },
  {
    id: 'license_sanctions',
    question: 'Have you ever had license sanctions or disciplinary actions?',
    type: 'boolean',
    required: true
  },
  {
    id: 'sanctions_details',
    question: 'Sanctions/disciplinary details (if applicable)',
    type: 'textarea',
    required: false
  }
];

const mockQuotes: InsuranceQuote[] = [
  {
    id: 'quote-1',
    provider: 'MedPro Group',
    assignmentId: 'assign-001',
    assignmentTitle: 'Emergency Medicine - Memorial Hospital',
    coverageType: 'Claims-Made',
    coverageAmount: '$1M / $3M',
    premium: '$4,200/year',
    deductible: '$5,000',
    effectiveDate: '2025-02-01',
    expirationDate: '2026-02-01',
    status: 'pending',
    submittedDate: '2025-01-15',
    details: 'Comprehensive coverage for emergency medicine with tail coverage option available. Includes legal defense costs and risk management resources.'
  },
  {
    id: 'quote-2',
    provider: 'The Doctors Company',
    coverageType: 'Occurrence',
    coverageAmount: '$2M / $4M',
    premium: '$5,800/year',
    deductible: '$10,000',
    effectiveDate: '2025-02-01',
    expirationDate: '2026-02-01',
    status: 'pending',
    submittedDate: '2025-01-18',
    details: 'Occurrence-based policy with no tail coverage needed. Includes consent-to-settle clause and 24/7 risk management hotline.'
  }
];

export default function InsuranceQuestions() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quotes, setQuotes] = useState<InsuranceQuote[]>(mockQuotes);
  const [isSaved, setIsSaved] = useState(false);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    setIsSaved(false);
  };

  const handleSaveAnswers = () => {
    // Save answers logic here
    console.log('Saving insurance answers:', answers);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleQuoteAction = (quoteId: string, action: 'accept' | 'decline') => {
    setQuotes(prev =>
      prev.map(quote =>
        quote.id === quoteId
          ? { ...quote, status: action === 'accept' ? 'accepted' : 'declined' }
          : quote
      )
    );
  };

  const isFormComplete = standardQuestions
    .filter(q => q.required)
    .every(q => answers[q.id]);

  return (
    <div className="space-y-8">
      {/* Insurance Questionnaire Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Insurance Questionnaire
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Answer these questions once. Your responses will be reusable across all assignments.
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
              Reusable
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {standardQuestions.map((question) => (
            <div key={question.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                {question.question}
                {question.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>

              {question.type === 'boolean' && (
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name={question.id}
                      value="yes"
                      checked={answers[question.id] === 'yes'}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name={question.id}
                      value="no"
                      checked={answers[question.id] === 'no'}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              )}

              {question.type === 'text' && (
                <input
                  type="text"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  placeholder="Enter your answer"
                />
              )}

              {question.type === 'select' && question.options && (
                <select
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                >
                  <option value="">Select an option</option>
                  {question.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {question.type === 'textarea' && (
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
                  placeholder="Provide details"
                />
              )}

              {question.type === 'date' && (
                <input
                  type="date"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              )}
            </div>
          ))}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {isFormComplete ? (
                <span className="flex items-center text-green-600">
                  <i className="ri-checkbox-circle-fill mr-2"></i>
                  All required questions answered
                </span>
              ) : (
                <span className="flex items-center text-amber-600">
                  <i className="ri-error-warning-fill mr-2"></i>
                  Please answer all required questions
                </span>
              )}
            </div>
            <button
              onClick={handleSaveAnswers}
              disabled={!isFormComplete}
              className="px-6 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {isSaved ? (
                <span className="flex items-center">
                  <i className="ri-check-line mr-2"></i>
                  Saved
                </span>
              ) : (
                'Save Answers'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Insurance Quotes Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Insurance Quotes
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Review and respond to insurance quotes from providers
          </p>
        </div>

        <div className="p-6">
          {quotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-file-shield-2-line text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No quotes yet
              </h3>
              <p className="text-sm text-gray-600">
                Insurance providers will submit quotes based on your questionnaire responses
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className={`border rounded-lg p-6 ${
                    quote.status === 'accepted'
                      ? 'border-green-200 bg-green-50'
                      : quote.status === 'declined'
                      ? 'border-gray-200 bg-gray-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {quote.provider}
                      </h3>
                      {quote.assignmentTitle && (
                        <p className="text-sm text-gray-600 mt-1">
                          For: {quote.assignmentTitle}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted: {new Date(quote.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                        quote.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : quote.status === 'accepted'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {quote.status === 'pending'
                        ? 'Pending Review'
                        : quote.status === 'accepted'
                        ? 'Accepted'
                        : 'Declined'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Coverage Type</p>
                      <p className="text-sm font-medium text-gray-900">
                        {quote.coverageType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Coverage Amount</p>
                      <p className="text-sm font-medium text-gray-900">
                        {quote.coverageAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Premium</p>
                      <p className="text-sm font-medium text-teal-600">
                        {quote.premium}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Deductible</p>
                      <p className="text-sm font-medium text-gray-900">
                        {quote.deductible}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-1">Coverage Period</p>
                    <p className="text-sm text-gray-900">
                      {new Date(quote.effectiveDate).toLocaleDateString()} -{' '}
                      {new Date(quote.expirationDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2">Quote Details</p>
                    <p className="text-sm text-gray-700">{quote.details}</p>
                  </div>

                  {quote.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleQuoteAction(quote.id, 'accept')}
                        className="flex-1 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
                      >
                        <i className="ri-check-line mr-2"></i>
                        Accept Quote
                      </button>
                      <button
                        onClick={() => handleQuoteAction(quote.id, 'decline')}
                        className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                      >
                        <i className="ri-close-line mr-2"></i>
                        Decline Quote
                      </button>
                    </div>
                  )}

                  {quote.status === 'accepted' && (
                    <div className="flex items-center text-sm text-green-700">
                      <i className="ri-checkbox-circle-fill mr-2"></i>
                      You accepted this quote
                    </div>
                  )}

                  {quote.status === 'declined' && (
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="ri-close-circle-fill mr-2"></i>
                      You declined this quote
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
