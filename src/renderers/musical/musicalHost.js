// import { fabric } from 'fabric'
import MusicalDoc, {Elements} from './musicalDOM'
import { toPascalCase, getEventProps } from './utils'
import { isEmpty, omit } from 'lodash'

const musicalDoc = new MusicalDoc()

// fabric.Object.prototype.selectable = false

/**
 *
 * @param {string} type
 * @param {any} props
 * @param {fabric.Canvas} rootContainer
 */
export function createInstance(type, props, rootContainer) {
  const children = props.children
  props = omit(props,'children')
  const host = new Elements[type](props, null)
  // const host = new fabric[toPascalCase(type)](props)
  // const eventProps = getEventProps(props)
  // if (!isEmpty(eventProps)) {
  //   Object.keys(eventProps).forEach(eventName => {
  //       host.on(eventName, eventProps[eventName]);
  //   })
  // }
  return {
    type,
    host,
    playBtn: rootContainer
  }

  return { type, host, canvas: rootContainer }
}

/**
 *
 * @param {fabric.Canvas | fabric.Group} parent
 * @param {fabric.Object} child
 */
export function appendChild(parent, child) {
  parent.appendChild(child)
  // if (child.canvas) {
  //   child.canvas.requestRenderAll()
  // }
}

export function createTextInstance(text, rootContainer) {
  const props = {
    text
  }
  return {
    type: 'lyrics',
    host: new Elements.lyrics(props, null),
    playBtn: rootContainer
  }
}

/**
 *
 * @param {fabric.Canvas | fabric.Group} parent
 * @param {fabric.Object} child
 */
export function removeChild(parent, child) {
    parent.remove(child)
}

/**
 *
 * @param {fabric.Object} instance
 * @param {Object} propsToUpdate
 * @param {fabric.Canvas} canvas
 */
export function updateItem(instance, propsToUpdate, canvas) {
  instance.set(propsToUpdate)
  // canvas.requestRenderAll()
}

/**
 *
 * @param {fabric.Object} child
 * @param {fabric.Object} beforeChild
 * @param {fabric.Canvas} canvas
 */
function reOrderBeforeChild(child, beforeChild, parent) {
  const objects = parent.getObjects()
  const index = objects.indexOf(beforeChild)
  child.moveTo(index)
  // child.canvas.requestRenderAll()
}

/**
 *
 * @param {fabric.Object} child
 * @param {fabric.Object} beforeChild
 * @param {fabric.Group|fabric.Canvas} parent
 * @param {fabric.Canvas} canvas
 */
export function insertBefore(child, beforeChild, parent) {
  const exists = parent.getObjects().indexOf(child) != -1
  if (!exists) {
    appendChild(parent, child)
  }
  reOrderBeforeChild(child, beforeChild, parent)
}
