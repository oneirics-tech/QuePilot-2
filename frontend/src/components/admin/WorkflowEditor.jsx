// frontend/src/components/admin/WorkflowEditor.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card, Button, Input, Modal } from '../shared';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const WorkflowEditor = () => {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [steps, setSteps] = useState([]);
  const [showAddStep, setShowAddStep] = useState(false);
  const [newStep, setNewStep] = useState({ name: '' });

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const { data } = await api.get('/workflows');
      setWorkflows(data);
      if (data.length > 0) {
        setSelectedWorkflow(data[0]);
        setSteps(data[0].steps);
      }
    } catch (error) {
      console.error('Error fetching workflows:', error);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order
    items.forEach((item, index) => {
      item.order = index + 1;
    });

    setSteps(items);
  };

  const handleAddStep = () => {
    const newStepObj = {
      id: `step_${Date.now()}`,
      name: newStep.name,
      order: steps.length + 1
    };
    setSteps([...steps, newStepObj]);
    setNewStep({ name: '' });
    setShowAddStep(false);
  };

  const handleRemoveStep = (stepId) => {
    if (stepId === 'assigned') {
      alert('The "Assigned" step cannot be removed');
      return;
    }
    setSteps(steps.filter(s => s.id !== stepId));
  };

  const handleSaveWorkflow = async () => {
    try {
      await api.patch(`/workflows/${selectedWorkflow.id}`, { steps });
      alert('Workflow saved successfully');
      fetchWorkflows();
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };

  return (
    <div className="workflow-editor">
      <div className="section-header">
        <h2>Workflow Editor</h2>
        <Button onClick={handleSaveWorkflow}>Save Changes</Button>
      </div>

      <Card>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="workflow-steps">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="workflow-steps"
              >
                {steps.map((step, index) => (
                  <Draggable 
                    key={step.id} 
                    draggableId={step.id} 
                    index={index}
                    isDragDisabled={step.id === 'assigned'}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`workflow-step ${snapshot.isDragging ? 'dragging' : ''}`}
                      >
                        <span className="step-order">{step.order}</span>
                        <span className="step-name">{step.name}</span>
                        {step.id === 'assigned' && (
                          <Badge variant="info">Required</Badge>
                        )}
                        {step.id !== 'assigned' && (
                          <Button
                            size="small"
                            variant="danger"
                            onClick={() => handleRemoveStep(step.id)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Button 
          variant="secondary" 
          onClick={() => setShowAddStep(true)}
          className="add-step-button"
        >
          + Add Step
        </Button>
      </Card>

      <Modal
        isOpen={showAddStep}
        onClose={() => setShowAddStep(false)}
        title="Add Workflow Step"
      >
        <Input
          label="Step Name"
          value={newStep.name}
          onChange={(e) => setNewStep({ name: e.target.value })}
          placeholder="e.g., Payment, Consultation"
        />
        <div className="modal-actions">
          <Button variant="secondary" onClick={() => setShowAddStep(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddStep}>Add Step</Button>
        </div>
      </Modal>
    </div>
  );
};

export default WorkflowEditor;
