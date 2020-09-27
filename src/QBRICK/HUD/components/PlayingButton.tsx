import React from 'react'
import PlayButtonImage from '../../assets/svg/icons/play.svg'
import PauseButtonImage from '../../assets/svg/icons/pause.svg'

const PlayingButton: React.FC<{
    playing: boolean
    playingToggle: (
        event: React.MouseEvent<HTMLImageElement, MouseEvent>
    ) => void
}> = ({ playing, playingToggle }) => (
    <img
        onClick={playingToggle}
        src={playing ? PauseButtonImage : PlayButtonImage}
        alt={playing ? 'Pause' : 'Play'}
    />
)

export default PlayingButton
