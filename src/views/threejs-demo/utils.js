/**
 * @desc 检查canvas内部尺寸(绘图缓冲区)与显示尺寸是否一样，如果不一样设置内部尺寸
 * @param {*} renderer 渲染器
 * @returns { Boolean }
 */
export const resizeRendererToDisplaySize = (renderer) => {
  const canvas = renderer.domElement
  const pixelRatio = window.devicePixelRatio
  const width = (canvas.clientWidth * pixelRatio) | 0
  const height = (canvas.clientHeight * pixelRatio) | 0
  const needResize = canvas.width !== width || canvas.height !== height
  if (needResize) {
    renderer.setSize(width, height, false)
  }
  return needResize
}

export const updateAspect = (renderer, camera) => {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }
}
