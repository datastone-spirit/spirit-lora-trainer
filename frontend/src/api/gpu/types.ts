/*
 * @Author: Claude Code Assistant
 * @Date: 2025-01-24
 * @Description: GPU API types for multi-GPU training support
 */

/** GPU information */
export interface GPUInfo {
	index: number;
	name: string;
	memory_total_mb: number;
	memory_used_mb: number;
	memory_free_mb: number;
	power_draw_watts: number;
	power_limit_watts: number;
	temperature_celsius: number | null;
	utilization_percent: number | null;
	memory_utilization_percent: number;
	power_utilization_percent: number;
	uuid: string | null;
	driver_version: string | null;
}

/** System information */
export interface SystemInfo {
	driver_version: string;
	cuda_version: string;
	gpu_count: number;
	total_gpu_memory_mb: number;
}

/** GPU info response */
export interface GPUInfoResponse {
	gpus: GPUInfo[];
	system_info: SystemInfo;
	total_gpus: number;
}

/** GPU validation request */
export interface GPUValidationRequest {
	gpu_ids: number[];
	memory_requirement_mb?: number;
	batch_size_per_gpu?: number;
}

/** GPU validation details */
export interface GPUValidationDetails {
	total_gpus_detected: number;
	requested_gpus: number;
	gpu_validations: Array<{
		gpu_id: number;
		gpu_name: string;
		memory_total_mb: number;
		memory_free_mb: number;
		memory_required_mb: number;
		is_suitable: boolean;
		reason: string;
		temperature_celsius: number | null;
		utilization_percent: number | null;
	}>;
	topology_warning?: string;
	total_memory_available_mb: number;
	estimated_memory_usage_mb: number;
}

/** GPU validation response */
export interface GPUValidationResponse {
	is_valid: boolean;
	error_message: string | null;
	validation_details: GPUValidationDetails;
}

/** Optimal GPU selection request */
export interface OptimalGPUSelectionRequest {
	num_gpus: number;
	memory_requirement_mb?: number;
	prefer_low_utilization?: boolean;
}

/** Optimal GPU selection response */
export interface OptimalGPUSelectionResponse {
	optimal_gpu_ids: number[];
	selected_gpus: GPUInfo[];
	total_memory_mb: number;
	total_free_memory_mb: number;
}

/** Memory estimation request */
export interface MemoryEstimationRequest {
	batch_size: number;
	num_gpus?: number;
	sequence_length?: number;
	model_size?: string;
	precision?: string;
}

/** Memory estimation per GPU */
export interface MemoryEstimationPerGPU {
	model_memory_mb: number;
	activation_memory_mb: number;
	optimizer_memory_mb: number;
	total_memory_mb: number;
	recommended_memory_mb: number;
}

/** Memory estimation response */
export interface MemoryEstimationResponse {
	per_gpu_estimate: MemoryEstimationPerGPU;
	total_memory_mb: number;
	recommended_memory_mb: number;
	configuration: {
		batch_size: number;
		num_gpus: number;
		sequence_length: number;
		model_size: string;
		precision: string;
	};
}

/** GPU monitoring request */
export interface GPUMonitoringRequest {
	gpu_ids: number[];
	duration_seconds: number;
}

/** GPU monitoring data point */
export interface GPUMonitoringDataPoint {
	timestamp: number;
	memory_used_mb: number;
	memory_free_mb: number;
	power_draw_watts: number;
	temperature_celsius: number | null;
	utilization_percent: number | null;
}

/** GPU monitoring response */
export interface GPUMonitoringResponse {
	monitoring_data: Record<string, GPUMonitoringDataPoint[]>;
	duration_seconds: number;
	monitored_gpus: number[];
}