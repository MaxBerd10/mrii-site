# 3D models (GLB)

| File | Notes |
|------|--------|
| `disinfection-robot-m2.web.glb` | Meshopt ~2.5MB — used by site (companion + AI stage) |
| `disinfection-robot-m2.min.glb` | Draco alternate (~3MB) |

```bash
npx @gltf-transform/cli optimize input.glb public/models/name.web.glb --compress meshopt --texture-compress webp
```
