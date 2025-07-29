// backend/src/controllers/workflow.controller.js
const { Workflow, ActivityLog } = require('../models');

class WorkflowController {
  async create(req, res, next) {
    try {
      const { name, steps } = req.body;
      const businessId = req.user.businessId;

      // Ensure 'assigned' step is included
      const hasAssignedStep = steps.some(step => step.id === 'assigned');
      if (!hasAssignedStep) {
        return res.status(400).json({ 
          error: 'Workflow must include the "assigned" step' 
        });
      }

      const workflow = await Workflow.create({
        businessId,
        name,
        steps
      });

      await ActivityLog.create({
        businessId,
        action: 'workflow_created',
        details: { name, stepCount: steps.length }
      });

      res.status(201).json(workflow);
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const workflows = await Workflow.findAll({
        where: { 
          businessId: req.user.businessId,
          isActive: true
        }
      });

      res.json(workflows);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { workflowId } = req.params;
      const { steps } = req.body;
      const businessId = req.user.businessId;

      const workflow = await Workflow.findOne({
        where: { id: workflowId, businessId }
      });

      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      // Ensure 'assigned' step is included
      const hasAssignedStep = steps.some(step => step.id === 'assigned');
      if (!hasAssignedStep) {
        return res.status(400).json({ 
          error: 'Workflow must include the "assigned" step' 
        });
      }

      workflow.steps = steps;
      await workflow.save();

      res.json(workflow);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WorkflowController();
