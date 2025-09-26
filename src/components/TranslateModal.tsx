import React from 'react';
import { X, Languages, Volume2 } from 'lucide-react';
import { speakText } from '../utils/tts';

interface TranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  translatedText: string;
  targetLanguage: string;
  languageLabel: string;
}

const TranslateModal: React.FC<TranslateModalProps> = ({
  isOpen,
  onClose,
  originalText,
  translatedText,
  targetLanguage,
  languageLabel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-xl font-bold flex items-center gap-2 text-blue-900">
            <Languages size={24} />
            Translation to {languageLabel}
          </h2>
          <button
            onClick={onClose}
            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Original Text */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">Original Text</h3>
              <button
                onClick={() => speakText(originalText)}
                className="inline-flex items-center gap-1 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
              >
                <Volume2 size={14} />
                Speak
              </button>
            </div>
            <p className="text-gray-800 leading-relaxed">{originalText}</p>
          </div>

          {/* Translated Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-blue-900">Translation ({languageLabel})</h3>
              {!translatedText.includes('unavailable') && (
                <button
                  onClick={() => speakText(translatedText, targetLanguage)}
                  className="inline-flex items-center gap-1 text-sm text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors"
                >
                  <Volume2 size={14} />
                  Speak
                </button>
              )}
            </div>
            <p className={`leading-relaxed font-medium ${translatedText.includes('unavailable') ? 'text-red-600' : 'text-blue-800'}`}>
              {translatedText}
            </p>
          </div>
        </div>
        
        <div className="border-t border-blue-100 p-6 bg-blue-50">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold shadow-lg"
          >
            Close Translation
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslateModal;