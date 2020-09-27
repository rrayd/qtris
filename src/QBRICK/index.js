import * as THREE from 'three'
import React, {
    createRef,
    forwardRef,
    useRef,
    useEffect,
    useState,
} from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import { Line, OrbitControls } from 'drei'
import styled from 'styled-components'
import { BufferGeometry, Geometry, ShapeBufferGeometry } from 'three'

import { HUD } from './HUD/HUD'

/**
 * Conf the
 */
const QB_CONF = {
    sides: 8, // int
    topFloor: 13, // int
    scale: 1.3, // float
    hard: 0.96, // float

    // --
    get boxSide() {
        return this.sides * this.scale
    },
    set boxSide(w) {
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
const sh = QB_CONF.topFloor
const sw = QB_CONF.boxSide

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
        console.count('QGround.Grid')

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
        console.count('QGround.Perimeter')

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

    return (
        <group>
            <Perimeter />
            <Grid />
        </group>
    )
}

/**
 * Figures
 */
const QFigureSource = (name) => {
    console.count('QFigureSource')

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
 * One cell reference
 */
const QVox = () => {
    console.count('QVox')

    return <boxBufferGeometry attach="geometry" args={[sc, sc, sc]} />
}

/**
 * Vox Tetris Figures
 */
const QFigure = (props) => {
    console.count('QFigure')

    const { source, position } = props

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

    return voxels.map((vox, i) => (
        <mesh
            key={i}
            // onUpdate={fixedMesh}
            rotation={[-1.5708, 0, 0]}
            position={vox}>
            <QVox />
            <meshStandardMaterial attach="material" color="#0BDCFF" />
        </mesh>
    ))
}

/**
 * Action Figure layer
 */
const QFigureLayer = React.forwardRef((props, ref) => {
    console.count('QFigureLayer')

    const { source } = props

    const [position, setPosition] = useState([
        randomRangeInt(0, sz - 1) * sc,
        0,
        randomRangeInt(0, sz - 1) * sc,
    ])

    // const [rotation, setRoration] = useState([-1,5708, 0, 0])

    const keyDownHandler = (e) => {
        console.log(e)
    }

    useEffect(() => {
        console.count('QFigureLayer.useEffect[0]')

        window.addEventListener('keydown', keyDownHandler)
        return () => {
            window.removeEventListener('keydown', keyDownHandler)
        }
    }, [0])

    useEffect(() => {
        console.count('QFigureLayer.useEffect[position, rotation]')

        // const boundingBox = new THREE.Box3()
        // const mesh = figureRef.current.children[0]
        // boundingBox.copy(mesh.geometry.boundingBox)
        // mesh.updateMatrixWorld(true)
        // boundingBox.applyMatrix4(mesh.matrixWorld)
    }, [position])

    return (
        <group
            ref={ref}
            position={[
                position[0] + sc / 2,
                position[1] + sc / 2,
                position[2] + sc / 2,
            ]}>
            <QFigure source={source} />
        </group>
    )
})

/**
 * Cursor
 */
const QActiveLabel = () => {
    console.count('QActiveLabel')

    const [source, setSource] = useState(QFigureSource())
    const figureLayer = createRef()

    let label = sh

    let ticker = setInterval(() => {
        if (label > 0) {
            label -= 1
        } else {
            clearInterval(ticker)
            setSource(QFigureSource())
        }
    }, sp)

    useFrame(() => {
        if (figureLayer && figureLayer.current) {
            figureLayer.current.position.y = label * sc + sc / 2
        }
    })

    return <QFigureLayer ref={figureLayer} source={source} />
}

/**
 * Runtime
 */
export default function QBRICK() {
    console.count('QBRICK')

    return (
        <THREETRIS>
            <Canvas
                orthographic
                camera={{
                    zoom: 30,
                    position: [600, 500, 600],
                }}
                style={{ background: '#19140E' }}
                colorManagement>
                <ambientLight />
                <pointLight position={[-200, 50, 200]} />
                <QGround />
                <QActiveLabel />
                <OrbitControls />
            </Canvas>
            <HUD />
        </THREETRIS>
    )
}

const THREETRIS = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`
