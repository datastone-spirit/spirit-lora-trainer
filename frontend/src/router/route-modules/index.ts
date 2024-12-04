/*
 * @Author: mulingyuer
 * @Date: 2024-09-26 17:46:30
 * @LastEditTime: 2024-09-29 09:10:42
 * @LastEditors: mulingyuer
 * @Description: 模块路由路口
 * @FilePath: \spirit-app-microservice-admin\src\router\route-modules\index.ts
 * 怎么可能会有bug！！！
 */
import { getModulesRoutes } from "../helpers";

const globData: Record<string, any> = import.meta.glob("./!(index)*.ts", { eager: true });

export const modulesRoutes = getModulesRoutes(globData);
