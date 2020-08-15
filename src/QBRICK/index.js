import React, { useRef, useState } from 'react'
import { Canvas, useThree, useFrame } from 'react-three-fiber'
import { OrbitControls, Line } from 'drei'
import styled from 'styled-components'

/**
 * Conf the game
 */
const QB_CONF = {
    sides: 8, // int
    height: 13, // int
    scale: 1.3, // float

    get width() {
        return this.sides * this.scale
    },
    set width(w) {
        this.scale = w / this.sides
    },
}
const sz = QB_CONF.sides
const sc = QB_CONF.scale
const sw = QB_CONF.width

/**
 * Play Ground, target label 0
 */
const QGround = () => {
    const Grid = () => {
        const lines = []
        for (let i = sc; i <= sz * sc - 1 * sc; i += sc) {
            lines.push([
                [0, 0, i],
                [sw, 0, i],
            ])
            lines.push([
                [i, 0, 0],
                [i, 0, sw],
            ])
        }
        return lines.map((vec3, index) => <Line key={index} points={vec3} color="#0F4C81" linewidth={1} />)
    }

    const Perimeter = () => {
        const lines = [
            [
                [0, 0, 0],
                [0, 0, sw],
            ],
            [
                [0, 0, sw],
                [sw, 0, sw],
            ],
            [
                [sw, 0, sw],
                [sw, 0, 0],
            ],
            [
                [sw, 0, 0],
                [0, 0, 0],
            ],
        ]
        return lines.map((vec3, index) => <Line key={index} points={vec3} color="#0F4C81" linewidth={1} />)
    }

    const ground = useRef()
    return (
        <group ref={ground}>
            <Perimeter />
            <Grid />
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
                <QGround />
                <OrbitControls />
            </Canvas>
        </THREETRIS>
    )
}

const THREETRIS = styled.div`
    width: 100%;
    height: 100%;
`
