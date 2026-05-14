import { Op } from 'sequelize';
import { Task } from '../models/index.js';

export async function listTasks(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const offset = (page - 1) * limit;
    const { search, status, priority } = req.query;

    const where = { userId: req.user.id };

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (status && status !== 'all') {
      where.status = status;
    }
    if (priority && priority !== 'all') {
      where.priority = priority;
    }

    const { rows, count } = await Task.findAndCountAll({
      where,
      order: [
        ['dueDate', 'ASC NULLS LAST'],
        ['createdAt', 'DESC'],
      ],
      limit,
      offset,
    });

    return res.json({
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.create({
      title,
      description: description ?? null,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      userId: req.user.id,
    });
    return res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const task = await Task.findOne({
      where: { id, userId: req.user.id },
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const { title, description, status, priority, dueDate } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    await task.save();
    return res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await Task.destroy({
      where: { id, userId: req.user.id },
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
