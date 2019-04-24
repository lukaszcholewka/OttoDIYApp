
import Bluetooth from 'App/Services/Bluetooth'

const STOP = 'stop'

const DELAY = 600 // Delay between commands

const sounds = [
  {key: '1', name: 'Beep'},
  {key: '2', name: 'Bye'},
  {key: '3', name: 'Surprise'},
  {key: '4', name: 'OhOoh'},
  {key: '6', name: 'Cuddly'},
  {key: '7', name: 'Sleeping'},
  {key: '8', name: 'Happy'},
  {key: '9', name: 'Super Happy'},
  {key: '11', name: 'Sad'},
  {key: '12', name: 'Confused'},
  {key: '14', name: 'Fart'}
]

const cmdFromTouch = (touch) => {
  if (touch.dy <= -40) {
    return 'M 1' // up
  } else if (touch.dy >= 40) {
    return 'M 2' // down
  } else if (touch.dx >= 40) {
    return 'M 3' // right
  } else if (touch.dx <= -40) {
    return 'M 4' // left
  } else {
    return 'M 0'
  }
}

const cmdFromInstruction = (instruction) => {
  if (instruction === 'up') {
    return 'M 1' // up
  } else if (instruction === 'down') {
    return 'M 2' // down
  } else if (instruction === 'right') {
    return 'M 3' // right
  } else if (instruction === 'left') {
    return 'M 4' // left
  } else if (instruction === STOP) {
    return 'M 0' // stop
  } else {
    return 'M 0'
  }
}

export default class Otto {
  lastCmdSent = null

  getSounds = () => {
    return sounds
  }

  stop = async (delay) => {
    if (!delay) {
      const cmd = cmdFromInstruction(STOP)
      return Bluetooth.write(cmd)
    }
    setTimeout(() => { this.stop() }, delay)
  }

  play = async (sound) => {
    return Bluetooth.write('K ' + sound.key)
  }

  move = (touch) => {
    const cmd = cmdFromTouch(touch)
    if (!this.lastCmdSent || this.lastCmdSent !== cmd) {
      Bluetooth.write(cmd)
      this.lastCmdSent = cmd
    }
  }

  moveAndStop = (touch) => {
    this.move(touch)
    this.stop(DELAY)
  }

  run = (instructions) => {
    let delay = 0
    instructions.push(STOP) // Always finish with stop
    instructions.forEach((instruction) => {
      setTimeout(() => {
        const cmd = cmdFromInstruction(instruction)
        Bluetooth.write(cmd)
      }, delay)
      delay += DELAY
    })
  }
}