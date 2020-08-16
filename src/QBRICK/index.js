import * as THREE from 'three'
import React, { useRef, useEffect, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import { Line } from 'drei'
import styled from 'styled-components'

/**
 * Conf the
 */
const QB_CONF = {
    sides: 8, // int
    height: 13, // int
    scale: 1.3, // float
    hard: 0.96, // float

    // --
    get width() {
        return this.sides * this.scale
    },
    set width(w) {
        this.scale = w / this.sides
    },
    // --
    get speed() {
        return this.hard * 1000
    },
    set speed(s) {
        this.hard = s / 1000
    },
}
const sz = QB_CONF.sides
const sc = QB_CONF.scale
const sp = QB_CONF.speed
const sh = QB_CONF.height
const sw = QB_CONF.width

/**
 * util random range integer
 */
const randomRangeInt = (min, max) => {
    return min + Math.floor((max - min) * Math.random())
}

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
        return lines.map((vec3, index) => (
            <Line key={index} points={vec3} color="#0F4C81" linewidth={1} />
        ))
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
        return lines.map((vec3, index) => (
            <Line key={index} points={vec3} color="#0F4C81" linewidth={1} />
        ))
    }

    const ground = useRef()
    return (
        <group ref={ground}>
            <Perimeter />
            <Grid />
        </group>
    )
}

/**
 * One cell reference
 */
const QVox = (props) => {
    const vox = useRef()
    const [hovered, setHover] = useState(false)
    return (
        <mesh
            {...props}
            ref={vox}
            onPointerOver={(e) => setHover(true)}
            onPointerOut={(e) => setHover(false)}>
            <boxBufferGeometry attach="geometry" args={[sc, sc, sc]} />
            <meshStandardMaterial
                attach="material"
                color={hovered ? '#0BDCFF' : '#0BDCFF'}
            />
        </mesh>
    )
}

/**
 * Figures
 */
const QFigureSource = (name) => {
    const QF = ['I', 'O', 'S', 'Z', 'L', 'J', 'T'][randomRangeInt(0, 6)]
    switch (name || QF) {
        case 'I':
            return [[1, 1, 1, 1]]
        case 'O':
            return [
                [1, 1],
                [1, 1],
            ]
        case 'S':
            return [
                [0, 1, 1],
                [1, 1, 0],
            ]
        case 'Z':
            return [
                [1, 1, 0],
                [0, 1, 1],
            ]
        case 'L':
            return [
                [1, 0],
                [1, 0],
                [1, 1],
            ]
        case 'J':
            return [
                [0, 1],
                [0, 1],
                [1, 1],
            ]
        case 'T':
            return [
                [1, 1, 1],
                [0, 1, 0],
            ]
        default:
            console.error()
    }
}

/**
 * Figure Vector Representation
 */
const FVR = (source) => ({
    width: source[0].length,
    height: source.length,
    depth: 1,
    get data() {
        const substrate = new Uint8Array(this.width * this.height * this.depth)
        const flatSource = source.reduce((acc, val) => acc.concat(val), [])
        for (let i = 0; i < flatSource.length; i++) {
            substrate[i] = flatSource[i]
        }
        return substrate
    },
    get texture() {
        return new THREE.DataTexture2DArray(
            this.data,
            this.width,
            this.height,
            this.depth
        )
    },
})

/**
 * Figure
 */
const QFigure = ({ source }) => {
    const flatSource = source.reduce((acc, val) => acc.concat(val), [])
    const voxels = []
    for (let i = 0, x = 0, y = 0; i < flatSource.length; i++) {
        if (flatSource[i]) {
            voxels.push([x, 0, y])
        }
        if (x < source[0].length - 1) {
            x += sc
        } else {
            y += sc
            x = 0
        }
    }
    return voxels.map((vec3, i) => (
        <QVox key={i} position={[vec3[0] + sc / 2, sc / 2, vec3[2] + sc / 2]} />
    ))
}

/**
 * Action Figure layer
 */
const QFigureLayer = ({ source }) => {
    const [figureVector, setFigureVector] = useState(FVR(source))
    const [layerVector, setLayerVector] = useState()

    const keyDownHandler = (e) => {
        console.log(e)
    }

    useEffect(() => {
        window.addEventListener('keydown', keyDownHandler)
        return () => {
            window.removeEventListener('keydown', keyDownHandler)
        }
    }, [0])

    return <QFigure source={source} />
}

/**
 * Cursor
 */
const QActiveLabel = ({ playing }) => {
    const [label, nextLabel] = useState(sh)
    const [source, newSource] = useState(QFigureSource())

    let interval = null

    if (!interval && playing && label > 0) {
        interval = setInterval(() => {
            nextLabel((label) => label - 1)
        }, sp)
    } else if (playing && label === 0) {
        clearInterval(interval)
        nextLabel(sh)
        newSource(QFigureSource())
    } else if (!playing) {
        if (interval) {
            clearInterval(interval)
            interval = null
        }
    }

    const elementLayer = useRef()

    return <QFigureLayer source={source} />
}

/**
 * Runtime
 */
export default function QBRICK() {
    return (
        <THREETRIS>
            <Canvas
                orthographic
                camera={{
                    zoom: 60,
                    position: [200, 100, 200],
                }}
                style={{ background: '#19140E' }}
                colorManagement>
                <ambientLight />
                <pointLight position={[-200, 50, 200]} />
                <QGround />
                <QActiveLabel />
            </Canvas>
        </THREETRIS>
    )
}

const THREETRIS = styled.div`
    width: 100%;
    height: 100%;
`
