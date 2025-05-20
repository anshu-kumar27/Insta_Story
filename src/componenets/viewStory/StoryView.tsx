import React, { useEffect, useRef, useState } from "react";
import type { Story } from "../../data/StoryData";
import { DURATION, USERID } from "../../utils/Constants";

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
  const [isStoryMediaLoaded, setIsStoryMediaLoaded] = useState(false);
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
    setIsStoryMediaLoaded(false);
    startTimeRef.current = null;
    pauseStartTimeRef.current = null;
  }, [activeStoryIndex]);

  useEffect(() => {
    if (isStoryMediaLoaded) {
      setIsPaused(false);
      const now = performance.now();
      startTimeRef.current = now;
      startStoryTimer(durationMs);
    }
  }, [isStoryMediaLoaded]);

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

  //  image loading screen incase of failure to prevent endless loading... 
  useEffect(() => {
    const img = new Image();
    img.src = story.media;
    if (img.complete) {
      setIsStoryMediaLoaded(true);
    }

    const timeout = setTimeout(() => {
      setIsStoryMediaLoaded(true);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [story.media]);

  // handing close removing everything... 
  const handleClose = () => {
    clearStoryTimer();
    setIsPaused(true);
    onClose();
  };

  return (
    <div className="story-viewer-modal">
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

        {!isStoryMediaLoaded && <div className="story-media-loader"></div>}

        <img
          key={story.media}
          src={story.media}
          alt="Story media"
          onContextMenu={(e) => e.preventDefault()}
          onLoad={() => setIsStoryMediaLoaded(true)}
          onError={() => setIsStoryMediaLoaded(true)}
          style={{ display: isStoryMediaLoaded ? "block" : "none" }}
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
