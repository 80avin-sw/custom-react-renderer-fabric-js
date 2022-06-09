import { isEmpty, omit } from 'lodash';
import { Instrument } from 'musical.js'
import {getEventProps} from './utils'

class BasicElement extends EventTarget {
  static type;
  /**
   *
   */
  props = {};
  children = [];
  /**
   * @type {import('musical.js/src/instrument')}
   */
  instrument = null;
  static EVENTS = ["done"];
  events = [];
  constructor(props, children) {
    super();
    this.init(props, children);
  }
  init(props, children) {
    this.props = props;
    this.children = Array.isArray(children) ? children : [children].filter(Boolean);
    this.off();
    Object.entries(getEventProps(props)).forEach(([event, listener]) => {
      this.addEventListener(event, listener);
    });
  }

  appendChild(child) {
    this.children.push(child);
  }
  remove(child) {
    const childIdx = this.children.findIndex((v) => v === child);
    if (childIdx === -1) return;
    this.children.splice(childIdx, 1);
  }
  set(props) {
    props = omit(props, "children");
    this.init(
      {
        ...this.props,
        ...props,
      },
      props.children,
      this.instrument
    );
  }
  getObjects(){
    return this.children;
  }
  reOrderBeforeChild(child, beforeChild){
    const childIdx = this.children.findIndex(b => b===child)
    if(childIdx !== -1) this.children.splice(childIdx, 1)
    const beforeIdx = this.children.findIndex(b => b===beforeChild)
    if(beforeIdx === -1) return;
    this.children.splice(beforeIdx, 0, child)
  }
  on(event, cb, options = undefined) {
    this.events.push({
      event,
      cb,
      options,
    });
    this.addEventListener(event, cb, options);
  }
  off(event = undefined, cb = undefined, options = undefined) {
    let removeEvents = [];
    if (typeof event === "undefined") {
      removeEvents = this.events;
    } else if (typeof cb === "undefined") {
      removeEvents = this.events.filter((ev) => ev.event === event);
    } else if (typeof options === "undefined") {
      removeEvents = this.events.filter((ev) => ev.event === event && ev.cb === cb);
    } else {
      removeEvents = this.events.filter(
        (ev) => ev.event === event && ev.cb == cb && JSON.stringify(ev.options) === JSON.stringify(options)
      );
    }
    removeEvents.forEach((e) => {
      this.removeEventListener(e.event, e.cb, e.options);
    });
  }
}

class Delay extends BasicElement {
  static type = 'delay'
  constructor(props, children){
    props = props || {}
    props.duration = props.duration || 0
    super(props, children)
  }
  async run(instrument){
    const promise = new Promise(r => {
      setTimeout(r, this.props.duration)
    })
    await promise
    this.dispatchEvent(new Event('done'))
    return instrument
  }
}

class Timbre extends BasicElement {
  static type = 'timbre'
  async run(instrument){
    instrument.setTimbre({
      ...this.instrument?._timbre,
      ...this.props
    })
    this.dispatchEvent(new Event('done'))
    return instrument
  }
}

class Lyrics extends BasicElement {
  static type = 'lyrics'
  async run(instrument){
    const promise = new Promise(r => {
      const text = this.props?.text
      const props = omit(this.props, 'text')
      const args = [
        ...isEmpty(props)?[]:[props],
        text,
      ]
      instrument.play(...args, r)
    })
    await promise
    this.dispatchEvent(new Event('done'))
    return instrument
  }
}

class SeqSong extends BasicElement {
  static type = 'seqSong'
  async run(instrument){
    // let instrument = new Instrument(this.inst.getTimbre())
    for (const el of this.children){
      instrument = await el.run(instrument)
    }
    this.dispatchEvent(new Event('done'))
    return instrument
  }
  /**
   * 
   * @param {BasicElement} child 
   */
  // appendChild(child){
  //   this.children.push(child)
  //   // child.instrument = this.instrument
  // }
}

class ParallelSong extends BasicElement {
  static type = 'parallelSong'
  async run(instrument){
    await Promise.all(this.children.map(c => c.run(instrument)));
    this.dispatchEvent(new Event('done'))
    return instrument
  }
  /**
   * 
   * @param {BasicElement} child 
   */
  // appendChild(child){
  //   this.children.push(child)
  //   // child.instrument = new Instrument(this.instrument._timbre)
  // }
}

export const Elements = {
  timbre: Timbre,
  lyrics: Lyrics,
  seqSong: SeqSong,
  parallelSong: ParallelSong,
  delay: Delay,
}

export class Musical extends BasicElement {
  static type = 'musical'
}

export default class MusicalDoc extends BasicElement {
  constructor(){
    super({})
    this.inst = new Instrument()
    this.data = [];
  }
  createInstance(type, props){
    const el = new Elements[type](omit(props, 'children', this.inst))
    // el.init()

  }
  async run(){
    let instrument = new Instrument(this.inst.getTimbre())
    for (const el of this.children){
      instrument = await el.run(instrument)
    }
    this.dispatchEvent(new Event('done'))
    return instrument
  }
  /**
   * 
   * @param {BasicElement} child 
   */
  appendChild(child){
    this.children.push(child)
    // child.instrument = new Instrument(this.instrument._timbre)
  }
};
export const musicalDoc = new MusicalDoc()