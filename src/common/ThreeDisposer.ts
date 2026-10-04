import * as THREE from 'three';

/**
 * Traverses a Three.js scene and disposes of all geometries, materials, and textures,
 * then forces WebGL context release to prevent memory leaks in Single Page Applications.
 */
export function disposeThreeScene(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene
): void {
  scene.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((mat) => disposeMaterial(mat));
      } else if (mesh.material) {
        disposeMaterial(mesh.material);
      }
    }
    if ((object as THREE.Line).isLine) {
      const line = object as THREE.Line;
      line.geometry?.dispose();
      if (Array.isArray(line.material)) {
        line.material.forEach((mat) => disposeMaterial(mat));
      } else if (line.material) {
        disposeMaterial(line.material);
      }
    }
  });

  renderer.dispose();
  renderer.forceContextLoss();
}

function disposeMaterial(mat: THREE.Material): void {
  // Dispose textures attached to material if present
  const record = mat as unknown as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    const value = record[key];
    if (value && typeof value === 'object' && (value as THREE.Texture).isTexture) {
      (value as THREE.Texture).dispose();
    }
  }
  mat.dispose();
}
