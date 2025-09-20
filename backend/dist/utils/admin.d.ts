import { Request, Response } from 'express';
export interface AdminAuthRequest extends Request {
    body: {
        password: string;
    };
}
export interface AdminDataRequest extends Request {
    query: {
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        eventFilter?: string;
        search?: string;
        page?: string;
        limit?: string;
    };
}
export interface AdminExportRequest extends Request {
    query: {
        eventFilter?: string;
        startDate?: string;
        endDate?: string;
    };
}
export declare const authenticateAdmin: (req: Request, res: Response, next: any) => Response<any, Record<string, any>> | undefined;
export declare const adminLogin: (req: AdminAuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllRegistrations: (req: AdminDataRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const exportRegistrationsExcel: (req: AdminExportRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getRegistrationStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=admin.d.ts.map