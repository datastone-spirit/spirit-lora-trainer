import av
import numpy as np

from typing import Optional, List
from app.api.model.wan_paramter import FrameExtractionMethod, WanDataSetConfig, is_blank
from app.api.common.utils import get_dataset_contents

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

class WanDatasetService:
    
    def eastimate_video_dataset_images_count(self, datasets: WanDataSetConfig)-> int:
        exts = [".mp4", ".avi", ".mov", ".mkv", ".flv", ".wmv"]
        total_images = 0 
        for dataset in datasets.datasets:
            if is_blank(dataset.video_directory):
                continue
            for video_path, _, _ in get_dataset_contents(dataset.video_directory, exts):
                total_images += self._estimate_video_frame_count(video_path,
                                                            dataset.frame_extraction,
                                                            dataset.target_frames,
                                                            dataset.frame_stride,
                                                            dataset.frame_sample,
                                                            dataset.max_frames)
        return total_images
    
    def _estimate_video_frame_count(
        self,
        video_path: str,
        frame_extraction: Optional[FrameExtractionMethod] = None,
        target_frames: Optional[List[int]] = None,
        frame_stride: Optional[int] = None,
        frame_sample: Optional[int] = None,
        max_frames: Optional[int] = None,
    ) -> int:
        """
        Estimate the number of frames that will be extracted based on the frame extraction method.
        
        Args:
            video_path: Path to the video file
            frame_extraction: Method for extracting frames (HEAD, CHUNK, SLIDE, UNIFORM, FULL)
            target_frames: List of frame indices to extract when using specific extraction methods
            frame_stride: Step size for SLIDE extraction method
            frame_sample: Number of frames to sample when using UNIFORM extraction
            max_frames: Maximum number of frames to extract when using FULL method
            chunk_size: Number of consecutive frames to extract in CHUNK mode
        
        Returns:
            int: Estimated number of frames that will be extracted
        """
        
        # Get total frame count in video
        try:
            with av.open(video_path) as container:
                total_frames = container.streams.video[0].frames
                # If total_frames is 0 (some containers don't report frames), estimate from duration and fps
                if total_frames == 0:
                    fps = container.streams.video[0].average_rate
                    duration = container.duration / av.time_base
                    if fps and duration:
                        total_frames = int(fps * duration / 1000000)
                    else:
                        # Count frames manually if we can't determine otherwise
                        total_frames = sum(1 for _ in container.decode(video=0))
        except Exception as e:
            logger.warning(f"Error getting frame count for {video_path}", exc_info=e)
            return 0
        
        # Default to FULL if not specified
        if frame_extraction is None:
            frame_extraction = FrameExtractionMethod.FULL
        
        total_extracted = 0
        # Calculate frames based on extraction method
        if frame_extraction == FrameExtractionMethod.HEAD:
            for target_frame in target_frames:
                if total_frames >= target_frame:
                    total_extracted += target_frame
        elif frame_extraction == FrameExtractionMethod.CHUNK:
            # CHUNK extracts chunk_size consecutive frames starting from each target frame
            if not target_frames:
                return 0
            
            for target_frame in target_frames:
                for i in range(0, total_frames, target_frame):
                    if i + target_frame <= total_frames:
                        total_extracted += target_frame
                
        elif frame_extraction == FrameExtractionMethod.SLIDE:
            for target_frame in target_frames:
                if total_frames >= target_frame:
                    for i in range(0, total_frames - target_frame + 1, frame_stride):
                        total_extracted += target_frame
            # Extract frames with stride
        
        elif frame_extraction == FrameExtractionMethod.UNIFORM:
            # select N frames uniformly
            for target_frame in target_frames:
                if total_frames >= target_frame:
                    frame_indices = np.linspace(0, total_frames - target_frame, frame_sample, dtype=int)
                    for i in frame_indices:
                        total_extracted += target_frame
        
        elif frame_extraction == FrameExtractionMethod.FULL:
            # select all frames
            target_frame = min(total_frames, max_frames)
            total_extracted = (target_frame - 1) // 4 * 4 + 1  # round to N*4+1
        
        return total_extracted