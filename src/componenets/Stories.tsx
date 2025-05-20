import { useState } from "react"
import { StoryData } from "../data/StoryData";
import type { Story } from "../data/StoryData";
import StorySkeleton from "./StoriesSkeleton";
import '../styles/story.css'
import StoryView from "./viewStory/StoryView";

function Stories() {

    const stories: Story[] = StoryData;
    const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null)


    return (
        <div className="Story">
            <>
                {
                    stories.map((story, indx) => (
                        <StorySkeleton key={story.id}
                            story={story}
                            onClick={() => setActiveStoryIndex(indx)} />
                    ))
                }
                {activeStoryIndex !== null && (
                    <StoryView
                        storyList={stories}
                        activeStoryIndex={activeStoryIndex}
                        onClose={() => setActiveStoryIndex(null)}
                        onNext={(nextIndex) => setActiveStoryIndex(nextIndex)}
                    />
                )}
            </>
        </div>
    )
}

export default Stories