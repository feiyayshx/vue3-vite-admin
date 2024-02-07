# Three.js

了解threejs整体结构，学习及理解threejs基础概念：场景，摄像机，渲染器，图元，材质，纹理，物体，光照，阴影等。
学习核心API对象。

## 使用流程

核心对象：场景(scene), 摄像机(camera), 渲染器(renderer)

1. 创建场景scene，摄像机camera，渲染器renderer
2. 将渲染器的dom元素添加到文档中
3. 创建模型
4. 将模型添加到场景中
5. 借助摄像机将场景渲染到页面

## API分类

### 材质

1. LineBasicMaterial,基础线条材质

```js
const material = new THREE.LineBasicMaterial({
  color: '0xffffff',
  linewidth: 1,
  linecap: 'round',
  linejoin: 'round'
})
```

2. LineDashedMaterial,虚线材质

```js
const material = new THREE.LineDashedMaterial({
  color: '0xffffff',
  linewidth: 1,
  scale: 1,
  dashSize: 3,
  gapSize: 1
})
```

3. MeshBasicMaterial,基础网格材质，以简单着色方式绘制几何体,不受光照影响

```js
const material = new THREE.MeshBasicMaterial({
  color: '0xffffff', // 材质颜色
  map: new THREE.TextureLoader().load('/demo.png'), // 颜色贴图
  envMap: null, // 环境贴图
  lightMap: null // 光照贴图
})
```

4. MeshDepthMaterial, 深度网格材质，按深度绘制几何体材质,深度基于相机远近平面，白色最近，黑色最远

5. MeshDistanceMaterial, 实现物体阴影投射，物体透明部分不投射阴影

6. MeshLamberMaterial, lamber网格材质，一种非光泽表面的材质，没有镜面高光

7. MeshPhongMaterial, phong网格材质， 一种用于具有镜面高光的光泽表面的材质

8. MeshPhysicalMaterial，物理网格材质，渲染更费性能，使用此材质应始终指定environment map

9. MeshStandardMaterial, 一种基于物理的标准材质，使用此材质应始终指定environment map

10. PointMaterial, 点材质

11. ShaderMaterial, 着色器材质

12. RawShaderMaterial, 着色器材质，且uniforms和attributes 不会自动添加到GLSL shader中

13. ShadowMaterial, 阴影材质

14. MeshToonMaterial， 一种卡通着色材质

### 几何体

1. BoxGeometry, 立体缓冲几何体

```js
const geometry = new THREE.BoxGeometry(
  width,
  height,
  depth,
  widthSegments,
  heightSegments,
  depthSegments
)
```

- width: x轴上面的宽度
- height: y轴上面的宽度
- depth: z轴上面的宽度
- widthSegments: 宽度的分段数
- heightSegments: 高度的分段数
- depthSegments: 深度的分段数

2. SphereGeometry: 球缓冲立方体，用于生成球体的类

```js
const geometry = new THREE.SphereGeometry(
  radius,
  widthSegments,
  heightSegments,
  phiStart,
  phiLength,
  thetaStart,
  thetaLength
)
```

- radius: 球体半径，默认值1
- widthSegments: 水平分段数，最小值3，默认值32
- heightSegments: 垂直分段数，最小值2，默认值未16
- phiStart: 水平起始角度，默认值0
- phiLength: 水平扫描角度的大小，默认值Math.PI\*2
- thetaStart: 垂直起始角度，默认值0
- thetaLength: 垂直扫描角度大小，默认值Math.PI

3. ConeGeometry，圆锥缓冲几何体，用于生成圆锥几何体的类

```js
const geometry = new THREE.ConeGeometry(
  radius,
  height,
  radialSegments,
  heightSegments,
  openEnded,
  thetaStart,
  thetaLength
)
```

- radius: 圆锥底部的半径，默认值1
- height: 圆锥的高度，默认值1
- radialSegments: 圆锥侧面周围的分段数，默认值32
- heightSegments: 圆锥侧面沿着其高度的分段数，默认值1
- openEnded: 圆锥的底面是开放的还是封顶的，默认值为false,封顶
- thetaStart: 第一个分段的起始角度，默认0
- thetaLength: 圆锥底面圆扇区的中心角，默认值2\*PI

### 物体

1. Mesh, 网格

```js
new THREE.Mesh(geometry:BufferGeometry,material: Material)
```

2. BatchedMesh,批处理网格，支持多绘制批量渲染（相同材质不同几何形状的对象），提高渲染性能

```js
new THREE.BatchedMesh(maxGeometryCount, maxVertexCount, maxIndexCount, material)
```

3.

### 纹理

使用纹理，是占用内存最多的部分，有隐性成本。纹理占用内存：宽度 \* 高度 \* 4 \* 1.33。

例如图片尺寸：1920\*1080，占用内存：1920\*1080\*4\*1.33=11,031,552, 大约11M内存。

图片大小较小，下载速度快；图片尺寸小，占用内存少。

**纹理映射**

## 核心对象

**轨道控制器OrbitControls：**

作用：

- 响应鼠标事件(旋转，平移，缩放)
- 调整相机在坐标系中的位置
- 坐标改变重新渲染

压缩/解压缩模型DRACOLoader

环境贴图RoomEnvironment

如何确定相机位置，控制器位置，模型位置？

## 坐标系

- 公共场景是世界坐标
- 物体自身是本地坐标
- 相机默认在世界坐标的原点

threejs坐标系：x正向-右，y正向-上，z正向-外
blender坐标系：x正向-右，y正向-里，z正向-上

## 使用后期处理

## 矩阵变换

## 动画系统

## 数学库

1. Euler, 欧拉角,三维旋转的一种表示方式

2. Quaternion, 四元数
   表示：h=a+bi+cj+dk, i,j,k有如下关系：
   i^2=-1, i^2 = j^2 = k^2 = ijk =-1

3. Vector3, 三维向量

4. Matrix4,四维矩阵

## 全景漫游实现方案
