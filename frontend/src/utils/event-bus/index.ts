/*
 * @Author: mulingyuer
 * @Date: 2024-12-23 17:05:53
 * @LastEditTime: 2024-12-23 17:29:46
 * @LastEditors: mulingyuer
 * @Description: 事件总线
 * @FilePath: \frontend\src\utils\event-bus\index.ts
 * 怎么可能会有bug！！！
 */
import mitt from "mitt";
import type { Events } from "./events";
export type { Events };

const mittInstance = mitt<Events>();

export { mittInstance as EventBus };
