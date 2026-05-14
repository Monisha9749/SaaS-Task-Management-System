import { body, param, query } from 'express-validator';

export const createTaskRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').optional({ nullable: true }).isString(),
  body('status').optional().isIn(['pending', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional({ nullable: true }).isISO8601().toDate(),
];

export const updateTaskRules = [
  param('id').isInt({ min: 1 }).withMessage('Invalid task id'),
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('description').optional({ nullable: true }).isString(),
  body('status').optional().isIn(['pending', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional({ nullable: true }).isISO8601().toDate(),
];

export const taskIdParamRules = [param('id').isInt({ min: 1 }).withMessage('Invalid task id')];

export const listTasksQueryRules = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().trim().isLength({ max: 200 }),
  query('status').optional().isIn(['pending', 'completed', 'all']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'all']),
];
