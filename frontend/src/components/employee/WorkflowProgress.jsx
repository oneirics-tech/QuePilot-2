// frontend/src/components/employee/WorkflowProgress.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Button } from '../shared';

const WorkflowProgress = ({ customer, onStepChange }) => {
  const [workflow, setWorkflow] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    fetchWorkflow();
  }, []);

  useEffect(() => {
    if (workflow) {
      const index = workflow.steps.findIndex(s => s.id === customer.currentWorkflowStep);
      setCurrentStepIndex(index >= 0 ? index : 0);
    }
  }, [customer.currentWorkflowStep, workflow]);

  const fetchWorkflow = async () => {
    try {
      const { data } = await api.get('/workflows');
      if (data.length > 0) {
        setWorkflow(data[0]); // Use first active workflow
      }
    } catch (error) {
      console.error('Error fetching workflow:', error);
    }
  };

  const handleStepChange = async (stepId) => {
    try {
      await api.patch(`/customers/${customer.id}/workflow`, { step: stepId });
      if (onStepChange) onStepChange(stepId);
    } catch (error) {
      console.error('Error updating workflow step:', error);
    }
  };

  if (!workflow) return null;

  return (
    <div className="workflow-progress">
      <div className="workflow-steps">
        {workflow.steps.map((step, index) => (
          <div 
            key={step.id}
            className={`workflow-step ${
              index === currentStepIndex ? 'current' : 
              index < currentStepIndex ? 'completed' : 'pending'
            }`}
          >
            <div className="step-indicator">
              {index < currentStepIndex ? '✓' : index + 1}
            </div>
            <div className="step-name">{step.name}</div>
          </div>
        ))}
      </div>

      <div className="workflow-actions">
        {currentStepIndex > 0 && (
          <Button
            size="small"
            variant="secondary"
            onClick={() => handleStepChange(workflow.steps[currentStepIndex - 1].id)}
          >
            Previous
          </Button>
        )}
        
        {currentStepIndex < workflow.steps.length - 1 && (
          <Button
            size="small"
            onClick={() => handleStepChange(workflow.steps[currentStepIndex + 1].id)}
          >
            Next: {workflow.steps[currentStepIndex + 1].name}
          </Button>
        )}

        {currentStepIndex === workflow.steps.length - 1 && (
          <Button
            size="small"
            variant="success"
            onClick={() => handleStepChange('completed')}
          >
            Complete
          </Button>
        )}
      </div>
    </div>
  );
};

export default WorkflowProgress;
