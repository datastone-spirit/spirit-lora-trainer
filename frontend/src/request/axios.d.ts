/*
 * @Author: mulingyuer
 * @Date: 2025-01-21 09:10:49
 * @LastEditTime: 2025-01-21 09:10:49
 * @LastEditors: mulingyuer
 * @Description: 扩展axios类型
 * @FilePath: \frontend\src\request\axios.d.ts
 * 怎么可能会有bug！！！
 */
import "axios"; // 必须确保模块扩展的上下文是在 Axios 模块内

declare module "axios" {
	interface AxiosRequestConfig {
		/** 是否允许失败重试 */
		enableRetry?: boolean;
		/** 是否显示错误消息弹窗 */
		showErrorMessage?: boolean;
		/** 取消请求是否显示错误消息，注意：`showErrorMessage` 优先级大于该设置。
		 *  这个配置你得在cancel的时候设置，例：
		 * ```typescript
		 *  const CancelToken = axios.CancelToken;
		 *  const source = CancelToken.source();
		 *  source.cancel("取消的原因", { showCancelErrorMessage: false });
		 *  ```
		 */
		showCancelErrorMessage?: boolean;
	}
}
