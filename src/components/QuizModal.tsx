import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Quiz } from '../types';
import { X, Award, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizModalProps {
  quiz: Quiz | null;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ quiz, onClose }) => {
  const { updateSkillScore } = useApp();
  
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [scorePercentage, setScorePercentage] = useState<number>(0);

  if (!quiz) return null;

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScorePercentage(calculatedScore);
    setSubmitted(true);

    if (calculatedScore >= quiz.passingScore) {
      // Trigger Confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log('Confetti effect triggered');
      }

      // Update skill score in student profile
      updateSkillScore(quiz.skill, Math.max(80, calculatedScore));
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScorePercentage(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" /> Skill Verification Quiz — {quiz.skill}
          </div>
          <h2 className="text-2xl font-bold text-white font-outfit">{quiz.title}</h2>
          <p className="text-xs text-slate-400 mt-1">Passing score: {quiz.passingScore}% (Passing updates your verified skill badge)</p>
        </div>

        {/* RESULTS SCREEN */}
        {submitted ? (
          <div className="text-center py-8 space-y-6">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center border-4 ${
              scorePercentage >= quiz.passingScore
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500 text-rose-400'
            }`}>
              {scorePercentage >= quiz.passingScore ? (
                <CheckCircle2 className="w-10 h-10" />
              ) : (
                <AlertCircle className="w-10 h-10" />
              )}
            </div>

            <div>
              <h3 className="text-3xl font-extrabold text-white font-outfit mb-1">
                {scorePercentage}%
              </h3>
              <p className={`text-base font-semibold ${scorePercentage >= quiz.passingScore ? 'text-emerald-400' : 'text-rose-400'}`}>
                {scorePercentage >= quiz.passingScore ? 'Skill Assessment Passed! Skill Verified 🎉' : 'Assessment Not Passed. Keep Practicing!'}
              </p>
              {scorePercentage >= quiz.passingScore && (
                <p className="text-xs text-slate-300 mt-2 bg-emerald-500/10 border border-emerald-500/30 py-2 px-4 rounded-xl inline-block">
                  ✨ Your {quiz.skill} score has been updated to {Math.max(80, scorePercentage)}% on your profile!
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleRetry}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-medium text-xs rounded-xl flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Retake Test
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* QUESTION LIST */
          <div className="space-y-6">
            {quiz.questions.map((q, qIdx) => (
              <div key={q.id} className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3">
                <p className="text-sm font-semibold text-white font-outfit">
                  Q{qIdx + 1}. {q.text}
                </p>
                <div className="space-y-2">
                  {q.options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[qIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`w-full text-left p-3 rounded-lg text-xs font-medium border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>{option}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Submit Skill Assessment
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
