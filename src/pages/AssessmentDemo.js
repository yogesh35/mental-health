import React from 'react';
import AssessmentForm from '../components/AssessmentForm';

// Simple demo component for testing individual assessments
const AssessmentDemo = () => {
  const handleComplete = (result) => {
    console.log('Assessment completed:', result);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* PHQ-9 Demo */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            PHQ-9 Depression Screening Demo
          </h2>
          <AssessmentForm 
            type="PHQ9" 
            onComplete={handleComplete}
          />
        </div>

        <hr className="my-12 border-gray-300" />

        {/* GAD-7 Demo */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            GAD-7 Anxiety Screening Demo
          </h2>
          <AssessmentForm 
            type="GAD7" 
            onComplete={handleComplete}
          />
        </div>

        <hr className="my-12 border-gray-300" />

        {/* GHQ-12 Demo */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            GHQ-12 General Health Demo
          </h2>
          <AssessmentForm 
            type="GHQ12" 
            onComplete={handleComplete}
          />
        </div>

      </div>
    </div>
  );
};

export default AssessmentDemo;
