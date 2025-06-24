/*
 * @Author: Claude Code Assistant
 * @Date: 2025-01-24
 * @Description: GPU API client for multi-GPU training support
 */

import { request } from "@/request";
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
		return request<GPUInfoResponse>({
			url: "/gpu/info",
			method: "GET"
		});
	},

	/**
	 * Validate GPU configuration
	 * @param data GPU validation parameters
	 * @returns Promise with validation results
	 */
	validateGPUConfig(data: GPUValidationRequest): Promise<GPUValidationResponse> {
		return request<GPUValidationResponse>({
			url: "/gpu/validate",
			method: "POST",
			data
		});
	},

	/**
	 * Get optimal GPU selection
	 * @param data GPU selection parameters
	 * @returns Promise with optimal GPU selection
	 */
	getOptimalGPUSelection(data: OptimalGPUSelectionRequest): Promise<OptimalGPUSelectionResponse> {
		return request<OptimalGPUSelectionResponse>({
			url: "/gpu/optimal_selection",
			method: "POST",
			data
		});
	},

	/**
	 * Estimate memory requirements
	 * @param data Memory estimation parameters
	 * @returns Promise with memory estimation
	 */
	estimateMemoryRequirements(data: MemoryEstimationRequest): Promise<MemoryEstimationResponse> {
		return request<MemoryEstimationResponse>({
			url: "/gpu/memory_estimation",
			method: "POST",
			data
		});
	},

	/**
	 * Monitor GPU usage
	 * @param data GPU monitoring parameters
	 * @returns Promise with monitoring data
	 */
	monitorGPUUsage(data: GPUMonitoringRequest): Promise<GPUMonitoringResponse> {
		return request<GPUMonitoringResponse>({
			url: "/gpu/monitoring",
			method: "POST",
			data
		});
	}
};

export * from "./types";