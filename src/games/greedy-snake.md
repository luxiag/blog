<script setup>

class Food {
  constructor(option) {
    this.foods = []
    this.width = option.width
    this.height = option.height
    this.color = option.color
  }
  create(map){
    this.remove()

    this.x =  Math.parseInt(Math.random() * (map.width/this.width) -1)  * this.width
    this.y =  Math.parseInt(Math.random() * (map.height/this.height) -1) * this.height

    this.food = document.createElement('div')
    this.food.style.width = this.width + 'px'
    this.food.style.height = this.height + 'px'
    this.food.style.backgroundColor = this.color
    this.food.style.position = 'absolute'
    this.food.style.left = this.x + 'px'
    this.food.style.top = this.y + 'px'
    this.food.remove = function(){
      this.parentNode.removeChild(this)
    }
    this.foods.push(this.food)
    map.map.appendChild(this.food)
  }
  remove(){
    for(let i = this.foods.length - 1; i >= 0; i--) {
      this.foods[i].remove()
      this.foods.splice(i, 1)
    }
  }
}

class Map {
  constructor(option) {
    this.width = option.width
    this.height = option.height
  }
  create(option){
    this.map = document.createElement('div')
    this.map.style.width = this.width + 'px'
    this.map.style.height = this.height + 'px'
    this.map.style.border = '1px solid #000'
    this.map.style.position = 'relative'
    this.map.style.margin = '0 auto'
    this.map.style.overflow = 'hidden'
    this.map.style.backgroundColor = option.backgroundColor || '#ccc'
    if(option.parent) {
      if(option.parent instanceof HTMLElement) {
        option.parent.appendChild(this.map)
      }else if(typeof option.parent === 'string') { 
        document.querySelector(option.parent).appendChild(this.map)
      }
    }else {
        document.body.appendChild(this.map)
    }
  
  }
}

class Snake {
  constructor(option){
    this.width = option.width
    this.height = option.height
    this.map = option.map
    this.headColor = option.headColor || 'pinkblue'
    this.elements = []
  }
  move(direction) {
    let moveX = 0
    let moveY = 0
    switch(direction) {
      case 'up':
       moveY = -this.height
        break
      case 'down':
       moveY = this.height
        break
      case 'left':
       moveX = -this.width
        break
      case 'right':
       moveX = this.width
        break
    }
    this.elements.forEach(element => {
      element.style.left = element.style.left + moveX + 'px'
      element.style.top = element.style.top + moveY + 'px'
    })
  }
  create(length){
    const element = this.elements[this.elements.length - 1] 
    const newElement = element.cloneNode()
    
    newElement.style.left = element.style.left - this.width + 'px'
    newElement.style.top = element.style.top + 'px'
  }
  header(){

  }
  body(){

  }
}

class Game {
  constructor(option) {
    this.map.width = option.width
    this.map.height = option.height
    this.gap = option.gap

    this.create()
  }
  create(){

  }
}

function getRandom(a,b) {
  const max = Math.max(a,b)
  const min = Math.min(a,b)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
</script>
