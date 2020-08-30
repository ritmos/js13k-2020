import { debug_time, debug_timeEnd } from './debug'
import { gl_createTexture, gl_bindTexture, gl_texImage2D, gl_pixelStorei, gl_activeTexture } from './gl/gl-context'
import { objectAssign, newProxyBinder } from './core/objects'
import {
  GL_TEXTURE3,
  GL_TEXTURE_2D,
  GL_RGBA,
  GL_UNSIGNED_BYTE,
  GL_UNPACK_ALIGNMENT,
  GL_CLAMP_TO_EDGE
} from './gl/gl-constants'
import { glSetTextureLinearSampling } from './gl/gl-utils'

export const SCREEN_TEXTURE_SIZE = 512

const screenTextures: WebGLTexture[] = [gl_createTexture(), gl_createTexture(), gl_createTexture()]
let lastBoundTexture = -1

export const bindScreenTexture = (index: number) => {
  const texture = screenTextures[index]
  if (lastBoundTexture !== index) {
    lastBoundTexture = index
    gl_activeTexture(GL_TEXTURE3)
    gl_bindTexture(GL_TEXTURE_2D, texture)
  }
  return texture
}

export const buildScreenTextures = () => {
  debug_time(buildScreenTextures)

  const canvas = document.createElement('canvas')
  canvas.width = SCREEN_TEXTURE_SIZE
  canvas.height = SCREEN_TEXTURE_SIZE

  objectAssign(canvas.style, {
    width: `${SCREEN_TEXTURE_SIZE}px`,
    height: `${SCREEN_TEXTURE_SIZE}px`,
    opacity: '.01',
    zIndex: '-1',
    position: 'absolute'
  } as Partial<CSSStyleDeclaration>)

  document.body.appendChild(canvas)

  const context = canvas.getContext('2d')
  const { strokeRect, fillText, fillRect, getImageData } = newProxyBinder(context)
  const setFontSize = (size: number) => {
    context.font = `${size}px monospace`
  }
  const setFillColor = (color: string) => {
    context.fillStyle = `#${color}`
  }

  const captureScreenTexture = (index: number) => {
    bindScreenTexture(index)
    const imageData = getImageData(0, 0, SCREEN_TEXTURE_SIZE, SCREEN_TEXTURE_SIZE)
    gl_pixelStorei(GL_UNPACK_ALIGNMENT, 1)
    gl_texImage2D(
      GL_TEXTURE_2D,
      0,
      GL_RGBA,
      SCREEN_TEXTURE_SIZE,
      SCREEN_TEXTURE_SIZE,
      0,
      GL_RGBA,
      GL_UNSIGNED_BYTE,
      imageData
    )

    glSetTextureLinearSampling(GL_CLAMP_TO_EDGE)
  }

  context.lineWidth = 5

  setFontSize(17)

  fillRect(0, 0, SCREEN_TEXTURE_SIZE, SCREEN_TEXTURE_SIZE)

  setFillColor('4f8aff')
  fillText('JS13K Modular Bios v.13', 10, 30)

  setFillColor('bbb')
  fillText('Memory Core: 131072K', 10, 100)
  fillText('Launching xx142-b2.exe', 10, 124)
  fillText('Antenna self test', 10, 146)
  fillText('Activating radio', 10, 170)

  setFillColor('8f8')
  fillText('OK', 245, 100)
  fillText('OK', 245, 124)
  fillText('OK', 245, 146)

  setFillColor('f66')
  fillText('FAIL', 245, 170)

  setFontSize(17)
  fillText('Insert floppy disk and press E to continue', 42, 280)

  setFontSize(20)
  fillText('💾 ERROR 404 - data disk not found', 48, 250)

  captureScreenTexture(0)

  context.strokeStyle = '#f00'
  strokeRect(20, 220, 472, 80)

  captureScreenTexture(1)

  context.strokeStyle = '#bb0'
  setFillColor('000')
  fillRect(20, 220, 472, 80)
  strokeRect(20, 220, 472, 80)
  setFillColor('bb0')
  fillText('Loading data disk...', 150, 265)

  captureScreenTexture(2)

  canvas.remove()

  debug_timeEnd(buildScreenTextures)
}