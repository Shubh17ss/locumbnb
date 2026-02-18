interface ApplicationConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assignmentDetails: {
    specialty: string;
    dates: string;
    pay: string;
  };
}

export default function ApplicationConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  assignmentDetails 
}: ApplicationConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm your application</h2>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Specialty:</span>
              <span className="font-medium text-gray-900">{assignmentDetails.specialty}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Dates:</span>
              <span className="font-medium text-gray-900">{assignmentDetails.dates}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pay:</span>
              <span className="font-medium text-teal-600">{assignmentDetails.pay}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-6 leading-relaxed">
          By applying, you confirm your availability and intent for this block.
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm}
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold whitespace-nowrap"
          >
            Sign &amp; submit application
          </button>
          <button 
            onClick={onClose}
            className="w-full bg-white text-gray-700 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium whitespace-nowrap"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
