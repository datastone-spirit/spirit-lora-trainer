/*
 * @Author: mulingyuer
 * @Date: 2024-12-26 10:15:13
 * @LastEditTime: 2024-12-26 10:34:19
 * @LastEditors: mulingyuer
 * @Description: 获取git最后一次提交时间
 * @FilePath: \frontend\vite-plugins\git-commit-time.ts
 * 怎么可能会有bug！！！
 */
import { execSync } from "child_process";

export function gitCommitTime(): string {
	try {
		const stdout = execSync("git log -1 --format=%cI").toString().trim();
		return new Date(stdout).toISOString();
	} catch (error) {
		console.error("获取git最后一次提交时间失败", error);
		return new Date().toString();
	}
}
