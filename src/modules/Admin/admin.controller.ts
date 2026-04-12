import { Request, Response } from 'express';

import sendResponse from '../../utils/sendResponse';
import { adminService } from './admin.service';
import catchAsync from '../../errors/catchAsync';

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAdminDashboardStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admin dashboard stats retrieved successfully',
        data: result,
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllUsersFromDB();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Users retrieved successfully',
        data: result,
    });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await adminService.updateUserStatusInDB(id as string, status);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User status updated successfully',
        data: result,
    });
});

// Get All orders
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllOrdersFromDB();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All orders retrieved successfully',
        data: result,
    });
});



export const adminController =
{
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
    getAllOrders
};