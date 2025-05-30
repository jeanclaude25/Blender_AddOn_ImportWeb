import { Instances, Instance } from "@react-three/drei";

export function ObjectInstance({ Positions = [], object, Scales = [], Rotations = [], ...props }) {
  const { position = [0, 0, 0], rotation = [0, 0, 0] } = props;

  return (
    <Instances
      limit={Positions.length}
      material={object.material}
      geometry={object.geometry}
    >
      <group position={position} rotation={rotation}>
        {Positions.map((pos, i) => (
          <Instance
            key={i}
            position={pos}
            scale={Scales[i] || [1, 1, 1]}
            rotation={Rotations[i] || [0, 0, 0]}
          />
        ))}
      </group>
    </Instances>
  );
}