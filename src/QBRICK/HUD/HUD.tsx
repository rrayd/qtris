import React, { useState } from 'react'
import styled from 'styled-components'

import LogoImage from '../assets/svg/QBrickLogo.svg'
import PlayingButton from './hud-components/PlayingButton'

export const HUD: React.FC = () => {
    console.count('HUD')

    const [playing, setPlaying] = useState(true)
    const togglePlaying = (
        e: React.MouseEvent<HTMLImageElement, MouseEvent>
    ) => {
        setPlaying(!playing)
    }
    return (
        <CONTAINER>
            <LOGO>
                <img src={LogoImage} alt="QBRICK" />
            </LOGO>
            <OPTIONS>
                <PlayingButton
                    playing={playing}
                    playingToggle={togglePlaying}
                />
            </OPTIONS>
        </CONTAINER>
    )
}

const CONTAINER = styled.div`
    position: absolute;
    display: flex;
    top: 24%;
    left: 0;
    right: 0;
    padding: 0 14%;
    pointer-events: none;
    justify-content: space-between;
`
const LOGO = styled.span``
const OPTIONS = styled.span`
    pointer-events: auto;
`
