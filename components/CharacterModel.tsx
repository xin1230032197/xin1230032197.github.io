"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  AnimationMixer,
  Box3,
  Group,
  MathUtils,
  PerspectiveCamera,
  Vector3,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

const MODEL_URL = "/models/character.glb";
const MODEL_HEIGHT = 3;

type CharacterModelProps = {
  reduceMotion: boolean;
  onReady: () => void;
};

function fitCameraToModel(
  camera: PerspectiveCamera,
  canvasWidth: number,
  canvasHeight: number,
  model: { depth: number; height: number; width: number },
) {
  const verticalFov = MathUtils.degToRad(camera.fov);
  const aspect = Math.max(canvasWidth / Math.max(canvasHeight, 1), 0.1);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
  const heightDistance = model.height / 2 / Math.tan(verticalFov / 2);
  const widthDistance = model.width / 2 / Math.tan(horizontalFov / 2);
  const distance = Math.max(heightDistance, widthDistance) * 1.18 + model.depth / 2;

  camera.position.set(0, 0.08, distance);
  camera.near = Math.max(0.01, distance - model.depth * 2 - 4);
  camera.far = distance + model.depth * 2 + 12;
  camera.lookAt(0, 0.04, 0);
  camera.updateProjectionMatrix();
}

export function CharacterModel({ reduceMotion, onReady }: CharacterModelProps) {
  const floatGroup = useRef<Group>(null);
  const gltf = useLoader(GLTFLoader, MODEL_URL);
  const { camera, size: canvasSize } = useThree();

  const scene = useMemo(() => clone(gltf.scene) as Group, [gltf.scene]);

  const modelMetrics = useMemo(() => {
    const bounds = new Box3().setFromObject(scene);
    const dimensions = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const scale = dimensions.y > 0 ? MODEL_HEIGHT / dimensions.y : 1;

    return {
      depth: Math.max(dimensions.z * scale, 0.1),
      height: Math.max(dimensions.y * scale, MODEL_HEIGHT),
      position: [
        -center.x * scale,
        -bounds.min.y * scale - MODEL_HEIGHT / 2,
        -center.z * scale,
      ] as [number, number, number],
      scale,
      width: Math.max(dimensions.x * scale, 0.1),
    };
  }, [scene]);

  const mixer = useMemo(
    () => (gltf.animations.length > 0 ? new AnimationMixer(scene) : null),
    [gltf.animations.length, scene],
  );

  useEffect(() => {
    if (!mixer || !gltf.animations[0]) return;

    const action = mixer.clipAction(gltf.animations[0]);
    action.reset().fadeIn(0.25).play();

    return () => {
      action.stop();
      mixer.stopAllAction();
      mixer.uncacheRoot(scene);
    };
  }, [gltf.animations, mixer, scene]);

  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;

    fitCameraToModel(camera, canvasSize.width, canvasSize.height, modelMetrics);
    onReady();
  }, [camera, canvasSize.height, canvasSize.width, modelMetrics, onReady]);

  useFrame((state, delta) => {
    mixer?.update(delta);

    if (!mixer && !reduceMotion && floatGroup.current) {
      floatGroup.current.position.y = Math.sin(state.clock.elapsedTime * 1.05) * 0.035;
    }
  });

  return (
    <group ref={floatGroup}>
      <group position={modelMetrics.position} scale={modelMetrics.scale}>
        <primitive object={scene} dispose={null} />
      </group>
    </group>
  );
}
