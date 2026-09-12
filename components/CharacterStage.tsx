"use client";

import { Box, Shuffle } from "lucide-react";
import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { characterModels } from "@/data/characterModels";

const CharacterCanvas = lazy(() =>
  import("@react-three/fiber").then(({ Canvas }) => ({ default: Canvas })),
);
const CharacterModel = lazy(() =>
  import("@/components/CharacterModel").then((module) => ({
    default: module.CharacterModel,
  })),
);

type ModelStatus = "checking" | "available" | "missing";

type ModelErrorBoundaryProps = {
  children: ReactNode;
  onError: () => void;
};

class ModelErrorBoundary extends Component<
  ModelErrorBoundaryProps,
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function CharacterStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const [modelStatus, setModelStatus] = useState<ModelStatus>("checking");
  const [modelReady, setModelReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const selectedModel = characterModels[selectedModelIndex];

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 640px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreferences = () => {
      setIsMobile(mobileQuery.matches);
      setReduceMotion(motionQuery.matches);
    };

    updatePreferences();
    mobileQuery.addEventListener("change", updatePreferences);
    motionQuery.addEventListener("change", updatePreferences);

    return () => {
      mobileQuery.removeEventListener("change", updatePreferences);
      motionQuery.removeEventListener("change", updatePreferences);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch(selectedModel.url, {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => setModelStatus(response.ok ? "available" : "missing"))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setModelStatus("missing");
        }
      });

    return () => controller.abort();
  }, [selectedModel.url]);

  const handleModelReady = useCallback(() => setModelReady(true), []);
  const handleModelError = useCallback(() => {
    setModelReady(false);
    setModelStatus("missing");
  }, []);

  const chooseRandomModel = useCallback(() => {
    if (characterModels.length < 2) return;

    setModelReady(false);
    setModelStatus("checking");
    setSelectedModelIndex((currentIndex) => {
      const offset = 1 + Math.floor(Math.random() * (characterModels.length - 1));
      return (currentIndex + offset) % characterModels.length;
    });
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stageRef.current?.style.setProperty("--shift-x", `${x * 9}px`);
    stageRef.current?.style.setProperty("--shift-y", `${y * 7}px`);
  };

  const resetParallax = () => {
    stageRef.current?.style.setProperty("--shift-x", "0px");
    stageRef.current?.style.setProperty("--shift-y", "0px");
  };

  return (
    <div ref={stageRef} onPointerMove={handlePointerMove} onPointerLeave={resetParallax} className="character-stage relative mx-auto aspect-[0.96] w-full max-w-[620px] [--shift-x:0px] [--shift-y:0px]" aria-label={`角色展示舞台：${selectedModel.name}`}>
      <div className="absolute inset-[6%] rounded-[48%_48%_44%_44%/42%_42%_52%_52%] border border-[var(--rule)] bg-[rgba(249,248,244,0.62)] shadow-[inset_0_0_80px_rgba(132,205,183,0.09)]" />
      <div className="character-model-frame absolute inset-x-[22%] bottom-[20%] top-[17%] transition-transform duration-500" style={{ translate: "var(--shift-x) var(--shift-y)" }}>
        <div className="relative grid h-full place-items-center overflow-hidden rounded-[45%_45%_40%_40%/34%_34%_48%_48%] border border-[rgba(32,35,31,0.18)] bg-[linear-gradient(145deg,rgba(255,255,255,0.88),rgba(220,238,232,0.72))] shadow-[0_34px_70px_rgba(32,35,31,0.12)]">
          <div className="absolute inset-5 rounded-[inherit] border border-[rgba(53,119,98,0.16)]" />
          {modelStatus === "available" && (
            <ModelErrorBoundary key={selectedModel.id} onError={handleModelError}>
              <Suspense fallback={null}>
                <CharacterCanvas
                  className={`character-canvas ${modelReady ? "is-ready" : ""}`}
                  camera={{ fov: 32, near: 0.1, far: 100, position: [0, 0.08, 7] }}
                  dpr={isMobile ? 1 : [1, 1.5]}
                  frameloop={reduceMotion ? "demand" : "always"}
                  gl={{ alpha: true, antialias: !isMobile, powerPreference: "low-power" }}
                  onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
                >
                  <ambientLight intensity={1.15} />
                  <hemisphereLight args={["#fffaf0", "#9cbfb2", 1.1]} />
                  <directionalLight color="#fff8e8" intensity={1.45} position={[4, 6, 5]} />
                  <CharacterModel
                    modelUrl={selectedModel.url}
                    reduceMotion={reduceMotion}
                    onReady={handleModelReady}
                  />
                </CharacterCanvas>
              </Suspense>
            </ModelErrorBoundary>
          )}
          {!modelReady && (
            <div className="stage-placeholder stage-float grid size-20 place-items-center rounded-full border border-[var(--rule)] bg-[var(--paper)] shadow-sm sm:size-24">
              <Box aria-hidden="true" className="size-8 text-[var(--mint-dark)] sm:size-10" strokeWidth={1.4} />
            </div>
          )}
        </div>
      </div>
      <div className="absolute inset-x-[14%] bottom-[11%] h-[13%] rounded-[50%] border border-[rgba(32,35,31,0.16)] bg-[rgba(233,230,222,0.85)] shadow-[0_25px_35px_rgba(32,35,31,0.13),inset_0_8px_18px_rgba(255,255,255,0.65)]" />
      <button
        type="button"
        onClick={chooseRandomModel}
        className="absolute bottom-[12%] right-[12%] z-20 grid size-11 place-items-center rounded-full border border-[var(--rule)] bg-[rgba(249,248,244,0.94)] text-[var(--mint-dark)] shadow-[0_10px_24px_rgba(32,35,31,0.12)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(53,119,98,0.36)] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--mint-dark)] active:translate-y-0 sm:size-12"
        aria-label="随机切换角色"
        title="随机切换角色"
      >
        <Shuffle aria-hidden="true" className="size-4.5" strokeWidth={1.7} />
      </button>
    </div>
  );
}
