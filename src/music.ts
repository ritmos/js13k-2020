import { CPlayer } from './soundbox/player'
import { song } from './soundbox/song'

const player = new CPlayer()
player.init(song)
while (player.generate() < 1) {
  //ignore the error
}
const musicWave = player.createWave()

const mAudio = new Audio()
mAudio.loop = true
mAudio.src = URL.createObjectURL(new Blob([musicWave], { type: 'audio/wav' }))

const play = (): void => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  mAudio.play()
}

export { play }