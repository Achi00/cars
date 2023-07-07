"use client";
import * as THREE from "three";
import { useLayoutEffect, useRef, useState } from "react";
import { Canvas, applyProps, useFrame, useLoader } from "@react-three/fiber";
import {
  PerformanceMonitor,
  AccumulativeShadows,
  RandomizedLight,
  Environment,
  Lightformer,
  Float,
  useGLTF,
  Text,
  MeshReflectorMaterial,
} from "@react-three/drei";
import { LayerMaterial, Color, Depth } from "lamina";
import { Mustang } from "./Mustang";
import { EffectComposer, LUT, Bloom } from "@react-three/postprocessing";
import { useControls } from "leva";
import { LUTCubeLoader } from "postprocessing";
import { Perf } from "r3f-perf";

const Scene = () => {
  const [degraded, degrade] = useState(false);
  // const texture = useLoader(LUTCubeLoader, "/F-6800-STD.cube");
  return (
    <Canvas shadows camera={{ position: [5, 0, 8], fov: 35 }}>
      <color attach="background" args={["#15151a"]} />
      <Perf />
      <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        castShadow
        intensity={8}
        shadow-bias={-0.0001}
      />
      <ambientLight intensity={0.5} />
      <Mustang />
      <Info />
      <AccumulativeShadows
        position={[0, -1.16, 0]}
        frames={100}
        alphaTest={0.9}
        scale={10}
      >
        <RandomizedLight
          amount={8}
          radius={10}
          ambient={0.5}
          position={[1, 5, -1]}
        />
      </AccumulativeShadows>
      {/** PerfMon will detect performance issues */}
      <PerformanceMonitor onDecline={() => degrade(true)} />
      {/* Renders contents "live" into a HDRI environment (scene.environment). */}
      <Environment
        frames={degraded ? 1 : Infinity}
        resolution={256}
        background
        blur={1}
      >
        <Lightformers />
      </Environment>
      <CameraRig />
    </Canvas>
  );
};

const Info = () => {
  return (
    <>
      <group position={[-2.5, 1.7, -2]}>
        <Text font="/Kanit-SemiBold.ttf" color="#171D22">
          Car Details
        </Text>
      </group>
      <group position={[-2.5, 0.9, -2]}>
        <Text font="/Cairo-Medium.ttf" color="#171D22">
          Information
        </Text>
      </group>
      <group position={[0, 2, -10]}>
        <Text font="/Kanit-Thin.ttf" fontSize={4} color="#f2f2f2">
          Mustang
        </Text>
      </group>
      <group position={[4, 1.9, 0]}>
        <Text font="/Cairo-Medium.ttf" fontSize={0.15} color="#585858">
          {`Get All Info You Need About Any Car`}
        </Text>
      </group>
      <group position={[4, 1.7, 0]}>
        <Text font="/Cairo-Medium.ttf" fontSize={0.15} color="#000">
          {`Explore Useful Information And`}
        </Text>
      </group>
      <group position={[4, 1.5, 0]}>
        <Text font="/Cairo-Medium.ttf" fontSize={0.15} color="#585858">
          {`be informed about problem you might face`}
        </Text>
      </group>
    </>
  );
};

function CameraRig({ v = new THREE.Vector3() }) {
  return useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.lerp(
      v.set(Math.sin(t / 5), 0, 10 + Math.cos(t / 5) / 2),
      0.05
    );
    state.camera.lookAt(0, 0, 0);
  });
}

function Lightformers({ positions = [2, 0, 2, 0, 2, 0, 2, 0] }) {
  const group = useRef();
  useFrame(
    (state, delta) =>
      (group.current.position.z += delta * 10) > 20 &&
      (group.current.position.z = -60)
  );
  return (
    <>
      {/* Ceiling */}
      <Lightformer
        intensity={0.75}
        rotation-x={Math.PI / 2}
        position={[0, 5, -9]}
        scale={[10, 10, 1]}
      />
      <group rotation={[0, 0.5, 0]}>
        <group ref={group}>
          {positions.map((x, i) => (
            <Lightformer
              key={i}
              form="circle"
              intensity={2}
              rotation={[Math.PI / 2, 0, 0]}
              position={[x, 4, i * 4]}
              scale={[3, 1, 1]}
            />
          ))}
        </group>
      </group>
      {/* Sides */}
      <Lightformer
        intensity={2}
        rotation-y={Math.PI / 2}
        position={[-5, 1, -1]}
        scale={[20, 0.1, 1]}
      />
      <Lightformer
        rotation-y={Math.PI / 2}
        position={[-5, -1, -1]}
        scale={[20, 0.5, 1]}
      />
      <Lightformer
        rotation-y={-Math.PI / 2}
        position={[10, 1, 0]}
        scale={[20, 1, 1]}
      />
      {/* Accent (red) */}
      <Float speed={5} floatIntensity={2} rotationIntensity={2}>
        <Lightformer
          form="ring"
          color="white"
          intensity={5}
          scale={10}
          position={[-15, 4, -18]}
          target={[0, 0, 0]}
        />
      </Float>
      {/* Background */}
      <mesh scale={100}>
        <sphereGeometry args={[1, 64, 64]} />
        <LayerMaterial side={THREE.BackSide}>
          <Color color="#212529" alpha={1} mode="normal" />
          <Depth
            colorA="black"
            colorB="#f2f2f2"
            alpha={0.5}
            mode="normal"
            near={0}
            far={300}
            origin={[100, 100, 100]}
          />
        </LayerMaterial>
      </mesh>
    </>
  );
}

export default Scene;
