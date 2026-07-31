import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/ErrorHandler.js';
import { AuthRequest } from '../middleware/auth.js';

export const getMetrics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { instanceId, hours = '24', limit = '200' } = req.query;
    const tenantId = req.user!.tenantId;

    if (!instanceId) {
      throw new AppError('instanceId é obrigatório', 400);
    }

    // Verifica se a instância pertence ao tenant
    const instance = await prisma.instance.findFirst({
      where: {
        id: instanceId as string,
        tenantId,
      },
    });

    if (!instance) {
      throw new AppError('Instância não encontrada', 404);
    }

    const cutoffTime = new Date(Date.now() - parseInt(hours as string) * 60 * 60 * 1000);

    const metrics = await prisma.metric.findMany({
      where: {
        instanceId: instanceId as string,
        timestamp: { gte: cutoffTime },
        tenantId,
      },
      orderBy: {
        timestamp: 'asc',
      },
      take: parseInt(limit as string),
    });

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
};

export const createMetric = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { instanceId, cpuUsage, memoryUsage, latencyMs } = req.body;
    const userId = req.user!.id;
    const tenantId = req.user!.tenantId;

    if (!instanceId || cpuUsage === undefined || memoryUsage === undefined || latencyMs === undefined) {
      throw new AppError('Todos os campos são obrigatórios', 400);
    }

    // Verifica se a instância pertence ao tenant
    const instance = await prisma.instance.findFirst({
      where: {
        id: instanceId,
        tenantId,
      },
    });

    if (!instance) {
      throw new AppError('Instância não encontrada', 404);
    }

    const metric = await prisma.metric.create({
      data: {
        instanceId,
        cpuUsage,
        memoryUsage,
        latencyMs,
        userId,
        tenantId,
      },
    });

    res.status(201).json({
      success: true,
      data: metric,
    });
  } catch (error) {
    next(error);
  }
};

export const createMetricsBatch = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { metrics } = req.body;
    const userId = req.user!.id;
    const tenantId = req.user!.tenantId;

    if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
      throw new AppError('Métricas inválidas ou vazias', 400);
    }

    // Verifica todas as instâncias
    const instanceIds = [...new Set(metrics.map((m: any) => m.instanceId))];
    const instances = await prisma.instance.findMany({
      where: {
        id: { in: instanceIds },
        tenantId,
      },
    });

    if (instances.length !== instanceIds.length) {
      throw new AppError('Uma ou mais instâncias não encontradas', 404);
    }

    const createdMetrics = await prisma.$transaction(
      metrics.map((metric: any) =>
        prisma.metric.create({
          data: {
            instanceId: metric.instanceId,
            cpuUsage: metric.cpuUsage,
            memoryUsage: metric.memoryUsage,
            latencyMs: metric.latencyMs,
            userId,
            tenantId,
          },
        })
      )
    );

    res.status(201).json({
      success: true,
      data: createdMetrics,
      count: createdMetrics.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getLatestMetrics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tenantId = req.user!.tenantId;

    const instances = await prisma.instance.findMany({
      where: { tenantId },
      include: {
        metrics: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    const latestMetrics = instances.map((instance) => ({
      instanceId: instance.id,
      instanceName: instance.name,
      ...instance.metrics[0],
    }));

    res.json({
      success: true,
      data: latestMetrics,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOldMetrics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { days = '30' } = req.query;
    const tenantId = req.user!.tenantId;

    const cutoffTime = new Date(Date.now() - parseInt(days as string) * 24 * 60 * 60 * 1000);

    const deleted = await prisma.metric.deleteMany({
      where: {
        timestamp: { lt: cutoffTime },
        tenantId,
      },
    });

    res.json({
      success: true,
      data: {
        deleted: deleted.count,
        message: `${deleted.count} métricas antigas removidas`,
      },
    });
  } catch (error) {
    next(error);
  }
};