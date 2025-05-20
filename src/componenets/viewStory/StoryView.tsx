import React, { useEffect, useRef, useState } from "react";
import type { Story } from "../../data/StoryData";
import { DURATION, USERID } from "../../utils/Constants";
import { Imageload } from "./ImageLoad";

interface StoryViewerProps {
  storyList: Story[];
  activeStoryIndex: number;
  onNext: (nextIndex: number) => void;
  onClose: () => void;
}

const durationMs = DURATION;

const StoryView: React.FC<StoryViewerProps> = ({
  storyList,
  activeStoryIndex,
  onNext,
  onClose,
}) => {
  const story = storyList[activeStoryIndex];
  const userId = USERID;

  const [isPaused, setIsPaused] = useState(false);
  const [mediaLoaded,setMediaLoaded] = Imageload(story.media);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pauseStartTimeRef = useRef<number | null>(null);

  // timer logic
  const clearStoryTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const startStoryTimer = (delay: number) => {
    clearStoryTimer();
    timeoutRef.current = setTimeout(() => {
      if (activeStoryIndex < storyList.length - 1) {
        onNext(activeStoryIndex + 1);
      } else {
        onClose();
      }
    }, delay);
  };

  useEffect(() => {
    clearStoryTimer();
    setIsPaused(true);
    setMediaLoaded(false);
    startTimeRef.current = null;
    pauseStartTimeRef.current = null;
  }, [activeStoryIndex]);

  useEffect(() => {
    if (mediaLoaded) {
      setIsPaused(false);
      const now = performance.now();
      startTimeRef.current = now;
      startStoryTimer(durationMs);
    }
  }, [mediaLoaded]);

  const handleHoldStart = () => {
    setIsPaused(true);
    pauseStartTimeRef.current = performance.now();
    clearStoryTimer();
  };

  const handleHoldEnd = () => {
    if (pauseStartTimeRef.current && startTimeRef.current) {
      const now = performance.now();
      const totalDiff = pauseStartTimeRef.current - startTimeRef.current;

      setIsPaused(false);

      const remaining = durationMs - totalDiff;
      startTimeRef.current = now - totalDiff;
      startStoryTimer(remaining > 0 ? remaining : 0);
    }
  };

  // resetting everything when user clicks on close btn... 
  const handleClose = () => {
    clearStoryTimer();
    setIsPaused(true);
    onClose();
  };

  return (
    <div className="story-viewer-modal" key={activeStoryIndex}>
      {/* header- includes (pfp name and cross symbol) */}
      <div className="story-header">
        <div className="story-user-info">
          <img src={story.pfp} alt="User profile" className="story-user-avatar" />
          <span className="story-user-name">
            {story.userId === userId ? "Your Story" : story.name}
          </span>
        </div>
        <button className="story-close-button" onClick={handleClose}>
          ×
        </button>
      </div>

      {/* progress bar */}
      <div
        className={`story-progress-bar ${isPaused ? "paused" : ""}`}
        key={activeStoryIndex}
      />

      {/* story content */}
      <div
        className="story-content"
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
      >

        {!mediaLoaded && <div className="story-media-loader"></div>}

        <img
          key={story.media}
          src={story.media}
          alt="Story media"
          onContextMenu={(e) => e.preventDefault()}
          onLoad={() => setMediaLoaded(true)}
          onError={() => setMediaLoaded(true)}
          style={{ display: mediaLoaded ? "block" : "none" }}
        />

        {/* story controls -> left and right */}
        <div
          className="left"
          onClick={() => {
            if (activeStoryIndex > 0) onNext(activeStoryIndex - 1);
          }}
        />
        <div
          className="right"
          onClick={() => {
            if (activeStoryIndex < storyList.length - 1) {
              onNext(activeStoryIndex + 1);
            } else {
              onClose();
            }
          }}
        />
      </div>
    </div>
  );
};

export default StoryView;
