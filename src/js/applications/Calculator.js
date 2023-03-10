import { template } from '../template/CalculatorTemplate.js'

class Calculator extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.resultBox = this.shadowRoot.querySelector("input[type='text']")
    this.buttons = this.shadowRoot.querySelectorAll("input[type='button']")
    this.buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        if (e.target.value === 'C') {
          this.resultBox.value = ''
        } else if (e.target.value === '=') {
          if (this.resultBox.value.indexOf('-') > -1) {
            const fields = this.resultBox.value.split('-')
            this.resultBox.value = fields[0] - fields[1]
          } else if (this.resultBox.value.indexOf('+') > -1) {
            const fields = this.resultBox.value.split('+')
            this.resultBox.value = Number(fields[0]) + Number(fields[1])
          } else if (this.resultBox.value.indexOf('*') > -1) {
            const fields = this.resultBox.value.split('*')
            this.resultBox.value = fields[0] * fields[1]
          } else if (this.resultBox.value.indexOf('/') > -1) {
            const fields = this.resultBox.value.split('/')
            this.resultBox.value = fields[0] / fields[1]
          } else if (this.resultBox.value.indexOf('%') > -1) {
            const fields = this.resultBox.value.split('%')
            this.resultBox.value = fields[0] % fields[1]
          } else {
            this.resultBox.value = 'Error'
          }
        } else if (e.target.value === 'Clr') {
          if (this.resultBox.value) this.resultBox.value = this.resultBox.value.slice(0, -1)
        } else {
          this.resultBox.value += e.target.value
        }
      })
    })
  }
}
window.customElements.define('calculator-app', Calculator)
