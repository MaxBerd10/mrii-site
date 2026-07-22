# 3D models (GLB)

| File | Notes |
|------|--------|
| `disinfection-robot-m2.min.glb` | Draco-compressed for web (~3MB). Used by AI section. |

Source files over ~15MB should be optimized before commit:

```bash
npx @gltf-transform/cli optimize input.glb public/models/name.min.glb --compress draco --texture-compress webp
```
