import img0 from './../../img/memory/info.png'
import img1 from './../../img/memory/dog.png'
import img2 from './../../img/memory/whale.png'
import img3 from './../../img/memory/cow.png'
import img4 from './../../img/memory/frog.png'
import img5 from './../../img/memory/jellyfish.png'
import img6 from './../../img/memory/penguin.png'
import img7 from './../../img/memory/tiger.png'
import img8 from './../../img/memory/lion.png'
import img9 from './../../img/memory/cat.png'
import img10 from './../../img/memory/turtle.png'

export default class MemoryGame {
  constructor (rows, cols, container) {
    this.rows = rows
    this.cols = cols
    this.maxTime = 0
    if (rows === 2 && cols === 2) {
      this.maxTime = 30
    }
    if (rows === 2 && cols === 4) {
      this.maxTime = 60
    }
    if (rows === 4 && cols === 4) {
      this.maxTime = 120
    }
    this.num = 0
    this.gap = 0
    this.item = null
    this.imagesArray = []
    this.theFirstGo = null
    this.theSecondGo = null
    this.theLastImage = null
    this.numberOfPairs = 0
    this.numberOfAttempts = 0
    this.container = container
    this.result = null
    this.timer = null
    this.secondsText = null
    this.passTime = 0
    this.theTrueImageArray = [img0, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10]
    this.imagesLength = this.theTrueImageArray.length - 1
  }

  /**
   * This function starts the timer and although hidden it runs on the same page as the question one.
   *
   * @param {number} duration Duration is the amount of time.
   * @param {document} display Display is the element that will be used to show the content.
   */
  startTimer (duration, display) {
    this.cntDown = duration
    this.gap = setInterval(() => {
      display.textContent = this.cntDown
      if (--this.cntDown < 0) {
        this.cntDown = 0
      }
    }, 1000)
  }

  /**
   * Simply stops the timer that is going.
   */
  stopTimer () {
    clearInterval(this.gap)
    this.passTime += this.maxTime - this.cntDown
  }

  /**
   * A function used to initialize the memory game and start up the text and timer.
   */
  init () {
    this.imagesArray = this.generateGameArr(this.rows, this.cols)
    const cards = document.querySelector('#memory-template-card').content.firstElementChild
    cards.firstElementChild.src = img0
    this.result = document.createElement('p')
    this.timer = document.createElement('p')
    this.result.textContent = 'Attempts: 0'
    const secondsText = document.createTextNode('Seconds remaining: ')
    this.secondsText = secondsText
    this.imagesArray.forEach((_card, index) => {
      this.item = document.importNode(cards, true)
      this.item.firstElementChild.setAttribute('data-cardnumber', index)
      this.container.appendChild(this.item)
      if ((index + 1) % this.cols === 0) {
        this.container.appendChild(document.createElement('br'))
      }
    })
    this.startTimer(this.maxTime, this.timer)
    this.container.appendChild(this.result)
    this.container.appendChild(this.timer)
    this.timer.parentNode.insertBefore(secondsText, this.timer)
    this.container.addEventListener('click', (event) => {
      event.preventDefault()
      const img = event.target.nodeName === 'IMG' ? event.target : event.target.firstElementChild
      const index = parseInt(img.getAttribute('data-cardnumber'))
      this.revealCard(this.imagesArray[index], img)
    })
  }

  /**
   * A function used to reveal the card and decide for the course of the game accordingly.
   *
   * @param {string} card The name of the image to be selected.
   * @param {image} image The image that is to be attached to the card.
   */
  revealCard (card, image) {
    if (this.theSecondGo) {
      return
    }
    image.src = this.theTrueImageArray[card]
    if (!this.theFirstGo) {
      this.theFirstGo = image
      this.theLastImage = card
    } else {
      if (image === this.theFirstGo) {
        return
      }
      this.numberOfAttempts += 1
      this.theSecondGo = image
      this.result.textContent = 'At attempt: ' + this.numberOfAttempts
      this.container.appendChild(this.result)
      if (card === this.theLastImage) {
        this.numberOfPairs += 1
        if (this.numberOfPairs === (this.cols * this.rows) / 2) {
          this.stopTimer()
          this.timer.remove()
          this.secondsText.remove()
          if (this.passTime === this.maxTime) {
            this.result.textContent = 'You lost, but the effort is appreciated nevertheless.'
          } else {
            this.result.textContent = 'You won! It took you ' + this.numberOfAttempts + ' attempts and ' + this.passTime + ' seconds.'
          }
        }
        setTimeout(() => {
          this.theFirstGo.parentNode.classList.add('removed')
          this.theSecondGo.parentNode.classList.add('removed')
          this.theFirstGo = null
          this.theSecondGo = null
        }, 1000)
      } else {
        setTimeout(() => {
          this.theFirstGo.src = this.theTrueImageArray[0]
          this.theSecondGo.src = this.theTrueImageArray[0]
          this.theFirstGo = null
          this.theSecondGo = null
        }, 1000)
      }
    }
  }

  /**
   * A shuffling function to take the images and randomize the selection in order for them to be attached to cards.
   *
   * @param {number} rows The number of rows to be selected in the memory game.
   * @param {number} cols The number of columns to be selected in the memory game.
   * @returns {Array} The random image array to be returned.
   */
  generateGameArr (rows, cols) {
    const imagesArray = []
    for (let i = 1; i <= (rows * cols) / 2; i += 1) {
      imagesArray.push(i)
      imagesArray.push(i)
    }
    let curIndex = imagesArray.length
    const zero = 0
    while (zero !== curIndex) {
      const randIndex = Math.floor(Math.random() * curIndex)
      curIndex -= 1
      const tempResult = imagesArray[curIndex]
      imagesArray[curIndex] = imagesArray[randIndex]
      imagesArray[randIndex] = tempResult
    }
    return imagesArray
  }
}
