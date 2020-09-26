import * as THREE from 'three'
import React, {
    useRef,
    useEffect,
    useState,
    useUpdate,
    forwardRef,
} from 'react'
import { Canvas } from 'react-three-fiber'
import { Line, OrbitControls } from 'drei'
import styled from 'styled-components'
import { BufferGeometry, Geometry, ShapeBufferGeometry } from 'three'

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

    const ground = useRef()
    return (
        <group ref={ground}>
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

// /**
//  * Figure Vector Representation
//  */
// const FVR = (source) => ({
//     width: source[0].length,
//     height: source.length,
//     depth: 1,
//     get data() {
//         const substrate = new Uint8Array(this.width * this.height * this.depth)
//         const flatSource = source.reduce((acc, val) => acc.concat(val), [])
//         for (let i = 0; i < flatSource.length; i++) {
//             substrate[i] = flatSource[i]
//         }
//         return substrate
//     },
//     get texture() {
//         return new THREE.DataTexture2DArray(
//             this.data,
//             this.width,
//             this.height,
//             this.depth
//         )
//     },
// })

/**
 * One cell reference
 */
const QVox = () => {
    console.count('QVox')
    return <boxBufferGeometry attach="geometry" args={[sc, sc, sc]} />
    // return <planeBufferGeometry attach="geometry" args={[sc, sc]} />
    // return new THREE.PlaneGeometry([sc, sc])
}

/**
 * Vox Tetris Figures with bounding troubles
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

    // const fixedMesh = (self) => {
    //     const size = new THREE.Vector3()
    //     self.geometry.computeBoundingBox()
    //     self.geometry.boundingBox.getSize(size)
    //     self.updateMatrixWorld(true)
    // }

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
 * Classic Shape Tetris Figures
 */
const QFigureShape = ({ source }) => {
    console.count('QFigureShape')

    const flatSource = source.reduce((acc, val) => acc.concat(val), [])

    // TODO memo
    const cellPoints = []
    for (let i = 0, x = 0, y = 0; i < flatSource.length; i++) {
        if (flatSource[i]) {
            cellPoints.push([x, 0, y])
        }
        if (x < source[0].length - 1) {
            x += sc
        } else {
            y += sc
            x = 0
        }
    }

    // TODO memo
    const shape = new THREE.Shape()
    shape.autoClose = true
    shape.currentPoint = new THREE.Vector2(0, 0)
    shape.lineTo(1, 0)
    shape.lineTo(2, 0)
    shape.lineTo(2, 2)
    // cellPoints.forEach((vec3) => {
    //     !before
    //         ? shape.quadraticCurveTo(0, 0, vec3[0], vec3[2])
    //         : shape.quadraticCurveTo(before[0], before[2], vec3[0], vec3[2])
    //     before = vec3
    // })
    const extrudeSettings = {
        depth: 8,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 1,
        bevelThickness: 1,
    }

    return (
        <mesh>
            <shapeBufferGeometry
                attach={"geometry"}
                args={shape}
                extrudeSettings={extrudeSettings}
                side={THREE.DoubleSide}
            />
            <meshPhongMaterial attach="material" color="#0BDCFF" />
        </mesh>
    )
}

/**
 * Action Figure layer
 */
const QFigureLayer = (props) => {
    console.count('QFigureLayer')

    const { source } = props

    const figureRef = useRef()

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
            ref={figureRef}
            position={[
                position[0] + sc / 2,
                position[1] + sc / 2,
                position[2] + sc / 2,
            ]}>
            <QFigure source={source} />
        </group>
    )
}

/**
 * Cursor
 */
const QActiveLabel = ({ playing }) => {
    console.count('QActiveLabel')

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
    return <QFigureLayer source={source} />
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
                    zoom: 60,
                    position: [200, 100, 200],
                }}
                style={{ background: '#19140E' }}
                colorManagement>
                <ambientLight />
                <pointLight position={[-200, 50, 200]} />
                <QGround />
                <QActiveLabel />
                <OrbitControls />
            </Canvas>
        </THREETRIS>
    )
}

const THREETRIS = styled.div`
    width: 100%;
    height: 100%;
`
