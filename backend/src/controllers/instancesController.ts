import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/ErrorHandler.js';
import { AuthRequest } from '../middleware/auth.js';

export const getAllInstances = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tenantId = req.user!.tenantId;

    const instances = await prisma.instance.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: instances,
    });
  } catch (error) {
    next(error);
  }
};

export const getInstanceById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const instance = await prisma.instance.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!instance) {
      throw new AppError('Instância não encontrada', 404);
    }

    res.json({
      success: true,
      data: instance,
    });
  } catch (error) {
    next(error);
  }
};

export const createInstance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, provider, region, status = 'healthy' } = req.body;
    const userId = req.user!.id;
    const tenantId = req.user!.tenantId;

    if (!name || !provider || !region) {
      throw new AppError('Nome, provider e região são obrigatórios', 400);
    }

    const instance = await prisma.instance.create({
      data: {
        name,
        provider,
        region,
        status,
        userId,
        tenantId,
      },
    });

    res.status(201).json({
      success: true,
      data: instance,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInstance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, provider, region, status } = req.body;
    const tenantId = req.user!.tenantId;

    // Verifica se a instância existe
    const existingInstance = await prisma.instance.findFirst({
      where: { id, tenantId },
    });

    if (!existingInstance) {
      throw new AppError('Instância não encontrada', 404);
    }

    const updated = await prisma.instance.update({
      where: { id },
      data: {
        name: name || existingInstance.name,
        provider: provider || existingInstance.provider,
        region: region || existingInstance.region,
        status: status || existingInstance.status,
      },
    });

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInstance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existingInstance = await prisma.instance.findFirst({
      where: { id, tenantId },
    });

    if (!existingInstance) {
      throw new AppError('Instância não encontrada', 404);
    }

    await prisma.instance.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Instância removida com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

export const updateInstanceStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const tenantId = req.user!.tenantId;

    if (!status || !['healthy', 'warning', 'critical'].includes(status)) {
      throw new AppError('Status inválido. Use: healthy, warning ou critical', 400);
    }

    const existingInstance = await prisma.instance.findFirst({
      where: { id, tenantId },
    });

    if (!existingInstance) {
      throw new AppError('Instância não encontrada', 404);
    }

    const updated = await prisma.instance.update({
      where: { id },
      data: { status },
    });

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};