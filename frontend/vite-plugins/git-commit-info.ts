/*
 * @Author: mulingyuer
 * @Date: 2024-12-26 10:15:13
 * @LastEditTime: 2024-12-31 11:38:50
 * @LastEditors: mulingyuer
 * @Description: 获取git最后一次提交时间
 * @FilePath: \frontend\vite-plugins\git-commit-info.ts
 * 怎么可能会有bug！！！
 */
import { execSync } from "child_process";

/** 获取git最后一次提交时间 */
function getGitLastCommitTime(): string {
	const stdout = execSync("git log -1 --format=%cI").toString().trim();
	return new Date(stdout).toISOString();
}

/** 获取git最后一次commit id */
function getGitLastCommitId(): string {
	return execSync("git log -1 --format=%h").toString().trim();
}

export function getCommitInfo() {
	try {
		return {
			lastTime: getGitLastCommitTime(),
			lastId: getGitLastCommitId()
		};
	} catch (error) {
		throw new Error(`获取git最后一次提交时间失败: ${error}`);
	}
}
