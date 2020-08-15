import React, { useRef, useState } from 'react'
import { Canvas, extend, useThree, useFrame } from 'react-three-fiber'
import { OrbitControls, Line } from 'drei'
import styled from 'styled-components'

/**
 * Conf the game
 */
const QB_CONF = {
    side: 8, // int
    height: 13, // int
}

/**
 * Play Ground, target label 0
 */
const PGround = () => {
    const sz = QB_CONF.side
    const ground = useRef()

    const PGrid = () => {
        const lines = []
        for (let i = 1; i <= sz - 1; i++) {
            lines.push([
                [0, 0, i],
                [sz, 0, i],
            ])
            lines.push([
                [i, 0, 0],
                [i, 0, sz],
            ])
        }
        return lines.map((vec3, index) => <Line key={index} points={vec3} color="#0F4C81" linewidth={1} />)
    }

    const Perimeter = () => {
        const lines = [
            [
                [0, 0, 0],
                [0, 0, sz],
            ],
            [
                [0, 0, sz],
                [sz, 0, sz],
            ],
            [
                [sz, 0, sz],
                [sz, 0, 0],
            ],
            [
                [sz, 0, 0],
                [0, 0, 0],
            ],
        ]
        return lines.map((vec3, index) => <Line key={index} points={vec3} color="#0F4C81" linewidth={1} />)
    }

    return (
        <group ref={ground}>
            <Perimeter />
            <PGrid />
        </group>
    )
}

export default function QBRICK() {
    return (
        <THREETRIS>
            <Canvas
                orthographic
                camera={{
                    zoom: 50,
                    position: [200, 100, 200],
                }}
                style={{ background: '#19140E' }}
                colorManagement>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <PGround />
                <OrbitControls />
            </Canvas>
        </THREETRIS>
    )
}

const THREETRIS = styled.div`
    width: 100%;
    height: 100%;
`
