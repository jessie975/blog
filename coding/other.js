class LoadImg {
  constructor(fileName) {
    this.fileName = fileName
    this.load()
  }
  load() {
    console.log('loading... img: ' + this.fileName)
  }
  display() {
    console.log('display... img: ' + this.fileName)
  }
}

class ProxyImg {
  constructor(fileName) {
    this.realImg = new LoadImg(fileName)
  }
  display() {
    this.realImg.display()
  }
}
const aImg = new ProxyImg('a.png')
aImg.display()
