# 3D models (GLB)

| File | Notes |
|------|--------|
| `disinfection-robot-m2.min.glb` | Draco ~2.9MB — used by site (companion + AI stage) |
| `disinfection-robot-m2.web.glb` | Meshopt ~2.5MB — alternate |

```bash
npx @gltf-transform/cli optimize input.glb public/models/name.web.glb --compress meshopt --texture-compress webp
```
