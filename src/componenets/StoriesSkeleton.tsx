import { useState } from 'react'
import type { Story } from '../data/StoryData'
import { USERID } from '../utils/Constants'

interface StorySkeletonProps {
    story: Story
    onClick: () => void
}

const StorySkeleton: React.FC<StorySkeletonProps> = ({ story, onClick }) => {
    const userId = USERID
    const [isLoaded, setLoaded] = useState(true)
    return (
        <div className='story-skeleton' onClick={onClick}>
            <div className='avatar-wrapper'>
                {!isLoaded && <div className='circle-loader'></div>}
                <img
                    src={story.pfp}
                    alt={`Story by user ${story.pfp}`}
                    className='story-thumbnail'
                    style={{ display: isLoaded ? 'block' : 'none' }}
                    onLoad={() => setLoaded(true)}
                    onError={() => setLoaded(true)}
                />
            </div>
            <p>{story.userId === userId ? 'Your Story' : story.name}</p>
        </div>
    )
}

export default StorySkeleton
