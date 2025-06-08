const fetch = require('cross-fetch');
const { URLSearchParams } = require('url');

// 設置 fetch 相關的全局對象
global.fetch = fetch;
global.Headers = fetch.Headers;
global.Request = fetch.Request;
global.Response = fetch.Response;

// 設置 Blob polyfill
class Blob {
  constructor(array = [], options = {}) {
    this.array = array;
    this.type = options.type || '';
    this.size = array.reduce((acc, item) => acc + (item.length || 0), 0);
  }
  
  text() {
    return Promise.resolve(this.array.join(''));
  }
  
  arrayBuffer() {
    const buffer = Buffer.concat(this.array.map(item => 
      typeof item === 'string' ? Buffer.from(item) : item
    ));
    return Promise.resolve(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
  }
}

global.Blob = Blob;

// 設置 URLSearchParams
global.URLSearchParams = URLSearchParams;

// 設置 FormData polyfill
class FormData {
  constructor() {
    this.data = new Map();
  }
  
  append(name, value) {
    if (!this.data.has(name)) {
      this.data.set(name, []);
    }
    this.data.get(name).push(value);
  }
  
  get(name) {
    const values = this.data.get(name);
    return values ? values[0] : null;
  }
  
  getAll(name) {
    return this.data.get(name) || [];
  }
  
  has(name) {
    return this.data.has(name);
  }
  
  entries() {
    const entries = [];
    for (const [name, values] of this.data) {
      for (const value of values) {
        entries.push([name, value]);
      }
    }
    return entries[Symbol.iterator]();
  }
}

global.FormData = FormData;

console.log('✅ Polyfills loaded successfully');