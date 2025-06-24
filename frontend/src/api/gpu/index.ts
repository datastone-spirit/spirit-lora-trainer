/*
 * @Author: Claude Code Assistant
 * @Date: 2025-01-24
 * @Description: GPU API client for multi-GPU training support
 */

import { requestInstance } from "../common";
import type {
	GPUInfoResponse,
	GPUValidationRequest,
	GPUValidationResponse,
	OptimalGPUSelectionRequest,
	OptimalGPUSelectionResponse,
	MemoryEstimationRequest,
	MemoryEstimationResponse,
	GPUMonitoringRequest,
	GPUMonitoringResponse
} from "./types";

/** GPU API endpoints */
export const gpuApi = {
	/**
	 * Get GPU information
	 * @returns Promise with GPU info and system details
	 */
	getGPUInfo(): Promise<GPUInfoResponse> {
		return requestInstance.get("/gpu/info");
	},

	/**
	 * Validate GPU configuration
	 * @param data GPU validation parameters
	 * @returns Promise with validation results
	 */
	validateGPUConfig(data: GPUValidationRequest): Promise<GPUValidationResponse> {
		return requestInstance.post("/gpu/validate", data);
	},

	/**
	 * Get optimal GPU selection
	 * @param data GPU selection parameters
	 * @returns Promise with optimal GPU selection
	 */
	getOptimalGPUSelection(data: OptimalGPUSelectionRequest): Promise<OptimalGPUSelectionResponse> {
		return requestInstance.post("/gpu/optimal_selection", data);
	},

	/**
	 * Estimate memory requirements
	 * @param data Memory estimation parameters
	 * @returns Promise with memory estimation
	 */
	estimateMemoryRequirements(data: MemoryEstimationRequest): Promise<MemoryEstimationResponse> {
		return requestInstance.post("/gpu/memory_estimation", data);
	},

	/**
	 * Monitor GPU usage
	 * @param data GPU monitoring parameters
	 * @returns Promise with monitoring data
	 */
	monitorGPUUsage(data: GPUMonitoringRequest): Promise<GPUMonitoringResponse> {
		return requestInstance.post("/gpu/monitoring", data);
	}
};

export * from "./types";