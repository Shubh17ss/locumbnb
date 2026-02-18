import React, { useState, useEffect } from 'react';

interface QuestionnaireAnswer {
  questionId: string;
  answer: string;
  details?: string;
}

interface Questionnaire {
  id: string;
  name: string;
  version: string;
  questions: Question[];
}

interface Question {
  id: string;
  text: string;
  type: 'yes-no' | 'text' | 'multiple-choice' | 'date';
  required: boolean;
  requiresDetails?: boolean;
  options?: string[];
}

interface StandardQuestionnairesData {
  facilityQuestionnaire: QuestionnaireAnswer[];
  insuranceQuestionnaire: QuestionnaireAnswer[];
}

interface StandardQuestionnairesSectionProps {
  data: StandardQuestionnairesData | null;
  onUpdate: (data: StandardQuestionnairesData, isComplete: boolean) => void;
}

const StandardQuestionnairesSection: React.FC<StandardQuestionnairesSectionProps> = ({
  data,
  onUpdate,
}) => {
  const [answers, setAnswers] = useState<StandardQuestionnairesData>({
    facilityQuestionnaire: data?.facilityQuestionnaire || [],
    insuranceQuestionnaire: data?.insuranceQuestionnaire || [],
  });

  const [activeTab, setActiveTab] = useState<'facility' | 'insurance'>('facility');

  // Facility-required questionnaire (versioned and reusable)
  const facilityQuestionnaire: Questionnaire = {
    id: 'facility-standard-v1',
    name: 'Facility Standard Questionnaire',
    version: '1.0',
    questions: [
      {
        id: 'malpractice-history',
        text: 'Have you ever had a malpractice claim or settlement?',
        type: 'yes-no',
        required: true,
        requiresDetails: true,
      },
      {
        id: 'license-discipline',
        text: 'Has any medical license ever been suspended, revoked, or subject to disciplinary action?',
        type: 'yes-no',
        required: true,
        requiresDetails: true,
      },
      {
        id: 'hospital-privileges',
        text: 'Have you ever been denied hospital privileges or had privileges suspended or revoked?',
        type: 'yes-no',
        required: true,
        requiresDetails: true,
      },
      {
        id: 'dea-action',
        text: 'Has your DEA registration ever been suspended, revoked, or subject to disciplinary action?',
        type: 'yes-no',
        required: true,
        requiresDetails: true,
      },
      {
        id: 'criminal-history',
        text: 'Have you ever been convicted of a felony or misdemeanor (excluding minor traffic violations)?',
        type: 'yes-no',
        required: true,
        requiresDetails: true,
      },
      {
        id: 'health-limitations',
        text: 'Do you have any physical or mental health conditions that would limit your ability to perform clinical duties?',
        type: 'yes-no',
        required: true,
        requiresDetails: true,
      },
      {
        id: 'peer-review',
        text: 'Have you ever been subject to peer review action resulting in restriction of privileges?',
        type: 'yes-no',
        required: true,
        requiresDetails: true,
      },
    ],
  };

  // Insurance-related questionnaire (versioned and reusable)
  const insuranceQuestionnaire: Questionnaire = {
    id: 'insurance-standard-v1',
    name: 'Insurance Standard Questionnaire',
    version: '1.0',
    questions: [
      {
        id: 'current-coverage',
        text: 'Do you currently have malpractice insurance coverage?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'coverage-type',
        text: 'What type of malpractice coverage do you have?',
        type: 'multiple-choice',
        required: true,
        options: [
          'Claims-Made',
          'Occurrence',
          'Tail Coverage',
          'No Current Coverage',
          'Other',
        ],
      },
      {
        id: 'coverage-limits',
        text: 'What are your current coverage limits?',
        type: 'multiple-choice',
        required: true,
        options: [
          '$1M / $3M',
          '$2M / $4M',
          '$3M / $5M',
          'Other',
          'Not Applicable',
        ],
      },
      {
        id: 'carrier-name',
        text: 'Current insurance carrier name',
        type: 'text',
        required: false,
      },
      {
        id: 'policy-expiration',
        text: 'Policy expiration date',
        type: 'date',
        required: false,
      },
      {
        id: 'claims-history',
        text: 'Number of malpractice claims in the past 10 years',
        type: 'multiple-choice',
        required: true,
        options: ['0', '1', '2', '3', '4 or more'],
      },
      {
        id: 'tail-coverage-needed',
        text: 'Will you need tail coverage for assignments?',
        type: 'yes-no',
        required: true,
      },
    ],
  };

  const getAnswer = (questionnaireType: 'facility' | 'insurance', questionId: string) => {
    const questionnaireKey =
      questionnaireType === 'facility' ? 'facilityQuestionnaire' : 'insuranceQuestionnaire';
    return answers[questionnaireKey]?.find((a) => a.questionId === questionId);
  };

  const handleAnswerChange = (
    questionnaireType: 'facility' | 'insurance',
    questionId: string,
    answer: string,
    details?: string
  ) => {
    const questionnaireKey =
      questionnaireType === 'facility' ? 'facilityQuestionnaire' : 'insuranceQuestionnaire';

    const updatedAnswers = { ...answers };
    const existingIndex = updatedAnswers[questionnaireKey].findIndex(
      (a) => a.questionId === questionId
    );

    const newAnswer: QuestionnaireAnswer = {
      questionId,
      answer,
      details,
    };

    if (existingIndex >= 0) {
      updatedAnswers[questionnaireKey][existingIndex] = newAnswer;
    } else {
      updatedAnswers[questionnaireKey].push(newAnswer);
    }

    setAnswers(updatedAnswers);
  };

  const checkCompletion = (data: StandardQuestionnairesData): boolean => {
    // Check facility questionnaire completion
    const facilityComplete = facilityQuestionnaire.questions.every((question) => {
      if (!question.required) return true;
      const answer = data.facilityQuestionnaire.find((a) => a.questionId === question.id);
      if (!answer || !answer.answer) return false;
      // If answer is "Yes" and details are required, check details
      if (question.requiresDetails && answer.answer === 'Yes') {
        return answer.details && answer.details.trim() !== '';
      }
      return true;
    });

    // Check insurance questionnaire completion
    const insuranceComplete = insuranceQuestionnaire.questions.every((question) => {
      if (!question.required) return true;
      const answer = data.insuranceQuestionnaire.find((a) => a.questionId === question.id);
      return answer && answer.answer;
    });

    return facilityComplete && insuranceComplete;
  };

  useEffect(() => {
    const isComplete = checkCompletion(answers);
    onUpdate(answers, isComplete);
  }, [answers]);

  const renderQuestion = (
    question: Question,
    questionnaireType: 'facility' | 'insurance'
  ) => {
    const answer = getAnswer(questionnaireType, question.id);

    return (
      <div key={question.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          {question.text}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {question.type === 'yes-no' && (
          <div className="space-y-3">
            <div className="flex space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value="Yes"
                  checked={answer?.answer === 'Yes'}
                  onChange={(e) =>
                    handleAnswerChange(questionnaireType, question.id, e.target.value)
                  }
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value="No"
                  checked={answer?.answer === 'No'}
                  onChange={(e) =>
                    handleAnswerChange(questionnaireType, question.id, e.target.value)
                  }
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>

            {question.requiresDetails && answer?.answer === 'Yes' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Please provide details:
                </label>
                <textarea
                  value={answer?.details || ''}
                  onChange={(e) =>
                    handleAnswerChange(
                      questionnaireType,
                      question.id,
                      answer.answer,
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Provide brief details..."
                />
              </div>
            )}
          </div>
        )}

        {question.type === 'text' && (
          <input
            type="text"
            value={answer?.answer || ''}
            onChange={(e) =>
              handleAnswerChange(questionnaireType, question.id, e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter your answer..."
          />
        )}

        {question.type === 'date' && (
          <input
            type="date"
            value={answer?.answer || ''}
            onChange={(e) =>
              handleAnswerChange(questionnaireType, question.id, e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        )}

        {question.type === 'multiple-choice' && question.options && (
          <select
            value={answer?.answer || ''}
            onChange={(e) =>
              handleAnswerChange(questionnaireType, question.id, e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select an option</option>
            {question.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Standard Questionnaires</h3>
        <p className="text-sm text-gray-600">
          Complete these standard questionnaires once. Your responses will be reusable across all
          assignments.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('facility')}
          className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'facility'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Facility Questionnaire
        </button>
        <button
          onClick={() => setActiveTab('insurance')}
          className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'insurance'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Insurance Questionnaire
        </button>
      </div>

      {/* Questionnaire Content */}
      <div className="space-y-4">
        {activeTab === 'facility' && (
          <>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <p className="text-xs text-blue-800">
                <i className="ri-information-line mr-1"></i>
                <strong>Version {facilityQuestionnaire.version}</strong> - These questions are
                required by facilities for credentialing purposes.
              </p>
            </div>
            {facilityQuestionnaire.questions.map((question) =>
              renderQuestion(question, 'facility')
            )}
          </>
        )}

        {activeTab === 'insurance' && (
          <>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <p className="text-xs text-blue-800">
                <i className="ri-information-line mr-1"></i>
                <strong>Version {insuranceQuestionnaire.version}</strong> - These questions help
                insurance providers prepare accurate quotes.
              </p>
            </div>
            {insuranceQuestionnaire.questions.map((question) =>
              renderQuestion(question, 'insurance')
            )}
          </>
        )}
      </div>

      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          <i className="ri-shield-check-line mr-1"></i>
          Your responses are versioned and reusable. You can update them anytime, and changes will
          apply to future applications.
        </p>
      </div>
    </div>
  );
};

export { StandardQuestionnairesSection };
