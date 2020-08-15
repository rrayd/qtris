import * as THREE from 'three'
import { Canvas, extend, useThree, useFrame } from 'react-three-fiber'
import React, { useRef, useState } from 'react'
import { OrbitControls } from 'drei'

const QB_CONF = {
    side: 8, // int
    height: 8, // int
}

const PlayGround = () => {
    const sz = QB_CONF.side
    const ground = useRef()

    const perimeter_vertices = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, sz, 0),
        new THREE.Vector3(sz, sz, 0),
        new THREE.Vector3(sz, 0, 0),
    ]

    const PGrid = () => {
        const lines = []
        for (let i = 1; i <= sz - 1; i++) {
            lines.push([new THREE.Vector3(0, i, 0), new THREE.Vector3(sz, i, 0)])
            lines.push([new THREE.Vector3(i, 0, 0), new THREE.Vector3(i, sz, 0)])
        }
        return lines.map((vec, index) => (
            <line key={index}>
                <geometry attach="geometry" vertices={vec} />
                <lineBasicMaterial attach="material" color="white" />
            </line>
        ))
    }

    return (
        <group ref={ground}>
            <lineLoop>
                <geometry attach="geometry" vertices={perimeter_vertices} />
                <lineBasicMaterial attach="material" color="white" />
            </lineLoop>
            <PGrid />
        </group>
    )
}

function Box(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef()

    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
            onClick={(e) => setActive(!active)}
            onPointerOver={(e) => setHover(true)}
            onPointerOut={(e) => setHover(false)}>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
            <meshStandardMaterial attach="material" color={hovered ? '#0BDCFF' : '#0F4C81'} />
        </mesh>
    )
}

export default function QBRICK() {
    return (
        <Canvas
            orthographic
            camera={{
                zoom: 50,
                position: [0, 180, 100],
            }}
            style={{ background: '#19140E' }}
            colorManagement>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <PlayGround position={[0, 0, 0]} />
            <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} />
            <OrbitControls />
        </Canvas>
    )
}
