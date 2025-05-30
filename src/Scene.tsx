import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {ObjectInstance} from './utils/ObjectInstance';

// Component to render a single GLTF model for instancing
function Model({ path, positions, rotations, scales }) {
  const { scene } = useGLTF(`/export/${path}`);
  
  // Extract geometry and material from the loaded GLTF
  let geometry, material;
  scene.traverse((child) => {
    if (child.isMesh) {
      geometry = child.geometry;
      material = child.material;
    }
  });

  return (
    <ObjectInstance
      object={{ geometry, material }}
      Positions={positions}
      Rotations={rotations}
      Scales={scales}
    />
  );
}

// Main Scene component
export default function Scene() {
  const [sceneData, setSceneData] = useState(null);

  // Load scene.json and process coordinate system
  useEffect(() => {
    fetch('/export/scene.json')
      .then(response => response.json())
      .then(data => {
        const orientation = data.scene?.up || 'YUP'; // Default to YUP if not specified

        // Group meshes by path and adjust coordinates based on orientation
        const groupedByPath = data.mesh3d.reduce((acc, mesh) => {
          if (!acc[mesh.path]) {
            acc[mesh.path] = {
              path: mesh.path,
              positions: [],
              rotations: [],
              scales: []
            };
          }

          // Adjust position based on scene orientation
          const position = [...mesh.position]; // [x, y, z]
          if (orientation !== 'YUP') {
            // For ZUP, swap Y and Z (index 1 and 2)
            [position[1], position[2]] = [position[2], position[1]];
          }

          acc[mesh.path].positions.push(position);
          acc[mesh.path].rotations.push(mesh.rotation);
          acc[mesh.path].scales.push(mesh.scale);
          return acc;
        }, {});

        setSceneData({
          orientation,
          meshes: Object.values(groupedByPath)
        });
      })
      .catch(error => console.error('Error loading scene.json:', error));
  }, []);

  if (!sceneData) return <div>Loading...</div>;

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60 }}
        style={{ background: '#f0f0f0' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* Render instanced models grouped by path */}
        {sceneData.meshes.map((group, index) => (
          <Model
            key={index}
            path={group.path}
            positions={group.positions}
            rotations={group.rotations}
            scales={group.scales}
          />
        ))}
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>
    </div>
  );
}