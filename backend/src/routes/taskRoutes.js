import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import {
  createTaskRules,
  updateTaskRules,
  taskIdParamRules,
  listTasksQueryRules,
} from '../validations/taskValidation.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.use(authenticate);

router.get('/', listTasksQueryRules, validateRequest, listTasks);
router.post('/', createTaskRules, validateRequest, createTask);
router.put('/:id', [...taskIdParamRules, ...updateTaskRules], validateRequest, updateTask);
router.delete('/:id', taskIdParamRules, validateRequest, deleteTask);

export default router;
