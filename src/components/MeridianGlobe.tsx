import { useMemo, useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Sphere, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { geoLocations, meridianHub } from "@/lib/geo-locations";

type Loc = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: string;
  entity_id?: string | null;
  details: string;
  hub_rel: string;
};

const R = 2;

export function geoToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.sin(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.cos(theta),
  );
}

function arcPoints(from: THREE.Vector3, to: THREE.Vector3, segments = 24): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = new THREE.Vector3().lerpVectors(from, to, t);
    const elev = Math.sin(t * Math.PI) * 0.35;
    p.normalize().multiplyScalar(R + elev);
    pts.push(p);
  }
  return pts;
}

function CameraController({
  target,
  zooming,
}: {
  target: THREE.Vector3 | null;
  zooming: boolean;
}) {
  useFrame((state) => {
    if (zooming && target) {
      const desired = target.clone().multiplyScalar(1.55);
      state.camera.position.lerp(desired, 0.05);
      state.camera.lookAt(target);
    }
  });
  return null;
}

function Earth() {
  return (
    <Sphere args={[R, 48, 48]}>
      <meshStandardMaterial
        color="#0f172a"
        wireframe
        transparent
        opacity={0.28}
        emissive="#1e293b"
        emissiveIntensity={0.15}
      />
    </Sphere>
  );
}

function HubPin({ pos }: { pos: THREE.Vector3 }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.8;
  });
  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color="#f59e0b" />
    </mesh>
  );
}

function LocationPins({
  locations,
  hub,
  onSelect,
  activeId,
}: {
  locations: Loc[];
  hub: THREE.Vector3;
  onSelect: (loc: Loc, v: THREE.Vector3) => void;
  activeId: string | null;
}) {
  return (
    <>
      {locations.map((loc) => {
        const v = geoToVector3(loc.lat, loc.lng, R);
        const pts = arcPoints(v, hub);
        const solid = loc.status === "SOLID";
        const active = activeId === loc.id;
        return (
          <group key={loc.id}>
            <Line
              points={pts}
              color={solid ? "#34d399" : "#fbbf24"}
              lineWidth={active ? 2 : 1}
              transparent
              opacity={active ? 0.95 : 0.55}
            />
            <mesh
              position={v}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(loc, v);
              }}
              onPointerOver={() => {
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "default";
              }}
            >
              <sphereGeometry args={[active ? 0.045 : 0.032, 16, 16]} />
              <meshBasicMaterial color={solid ? "#ef4444" : "#a78bfa"} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

export function MeridianInvestigationGlobe({
  locations = geoLocations as unknown as Loc[],
}: {
  locations?: Loc[];
}) {
  const hub = useMemo(
    () => geoToVector3(meridianHub.lat, meridianHub.lng, R),
    [],
  );
  const [focus, setFocus] = useState<THREE.Vector3 | null>(null);
  const [active, setActive] = useState<Loc | null>(null);
  const [zooming, setZooming] = useState(false);

  return (
    <div className="w-full h-[520px] bg-[#06070a] border border-white/5 rounded relative overflow-hidden">
      <div className="absolute top-3 left-3 z-20 font-mono text-[11px] text-slate-400 pointer-events-none space-y-0.5">
        <div>
          ORBIT_RENDERER: <span className="text-amber-400">ACTIVE</span></div>
        <div>CONVERGENCE_TARGET: <span className="text-slate-200">PRIMARY_HUB (NYC)</span></div>
        <div>
          HUB: <span className="text-slate-200">{meridianHub.name}</span>
        </div>
        <div>
          NODES: <span className="text-emerald-400">{locations.length}</span> · arcs → NYC axis
        </div>
        <div className="text-[10px] text-slate-600 max-w-xs leading-snug mt-1">
          Public-record / lead geo only. Association ≠ guilt. Click pin for telemetry.
        </div>
      </div>

      <div className="absolute top-3 right-3 z-20 flex gap-2 font-mono text-[9px]">
        <span className="px-1.5 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 rounded-sm">
          SOLID ARC
        </span>
        <span className="px-1.5 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-400 rounded-sm">
          MAYBE ARC
        </span>
        <span className="px-1.5 py-0.5 border border-violet-500/30 bg-violet-500/10 text-violet-300 rounded-sm">
          LEAD PIN
        </span>
      </div>

      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.75]}>
        <color attach="background" args={["#06070a"]} />
        <ambientLight intensity={0.65} />
        <pointLight position={[8, 10, 6]} intensity={1.4} />
        <pointLight position={[-6, -4, -8]} intensity={0.4} color="#3b82f6" />
        <Stars radius={80} depth={40} count={1200} factor={2} saturation={0} fade speed={0.4} />
        <Suspense fallback={null}>
          <Earth />
          <HubPin pos={hub} />
          <LocationPins
            locations={locations}
            hub={hub}
            activeId={active?.id ?? null}
            onSelect={(loc, v) => {
              setActive(loc);
              setFocus(v);
              setZooming(true);
            }}
          />
          <CameraController target={focus} zooming={zooming} />
          <OrbitControls
            enablePan={false}
            minDistance={2.6}
            maxDistance={9}
            onStart={() => setZooming(false)}
          />
        </Suspense>
      </Canvas>

      {active && (
        <div className="absolute bottom-3 right-3 left-3 md:left-auto md:w-80 z-20 bg-[#0b0f19]/95 backdrop-blur-md border border-white/10 p-3 rounded shadow-2xl font-mono">
          <div className="flex justify-between items-center border-b border-white/10 pb-1.5 mb-2">
            <span className="text-[10px] text-amber-400 uppercase tracking-widest">
              Target telemetry
            </span>
            <button
              type="button"
              onClick={() => {
                setFocus(null);
                setActive(null);
                setZooming(false);
              }}
              className="text-slate-500 hover:text-slate-200 text-xs px-1"
            >
              ×
            </button>
          </div>
          <h4 className="text-xs font-bold text-slate-200 mb-1">{active.name}</h4>
          <div className="text-[11px] text-slate-400 space-y-1 bg-black/30 p-2 rounded border border-white/5">
            <div>
              LAT / LNG:{" "}
              <span className="text-slate-300">
                {active.lat.toFixed(4)}, {active.lng.toFixed(4)}
              </span>
            </div>
            <div>
              STATUS:{" "}
              <span className={active.status === "SOLID" ? "text-emerald-400" : "text-amber-400"}>
                {active.status}
              </span>
            </div>
            <div>
              HUB_REL: <span className="text-slate-300">{active.hub_rel}</span>
            </div>
            {active.entity_id ? (
              <div>
                ENTITY: <span className="text-sky-400">{active.entity_id}</span>
              </div>
            ) : null}
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed border-t border-white/5 pt-1">
              {active.details}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
