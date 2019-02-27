import { EloCalculator } from '../../src/EloCalculator'
import { ScoringBonus } from '../../src/enums/ScoringBonus'

describe('EloCalculator', () => {
  let eloCalculator: EloCalculator

  const playerElo: number = 2000
  const opponentElo: number = 2000
  const shouldRound: boolean = true

  beforeEach(() => {
    eloCalculator = new EloCalculator(shouldRound)
  })

  describe('#calculateElo', () => {
    it('returns a specific ELO which is higher after a win', () => {
      const expectedElo: number = 2016

      return eloCalculator.calculateElo(playerElo, opponentElo, ScoringBonus.WIN)
        .should.become(expectedElo)
    })

    it('returns a specific ELO which is lower after a loss', () => {
      const expectedElo: number = 1984

      return eloCalculator.calculateElo(playerElo, opponentElo, ScoringBonus.LOSS)
        .should.become(expectedElo)
    })

    it('returns the same ELO when both players have equal ELO and the game was a draw', () => {
      const expectedElo: number = 2000

      return eloCalculator.calculateElo(playerElo, opponentElo, ScoringBonus.DRAW)
        .should.become(expectedElo)
    })

    it('returns a higher ELO when the opponent has a higher ELO and the game was a draw', () => {
      const opponentElo: number = 2400
      const expectedElo: number = 2013

      return eloCalculator.calculateElo(playerElo, opponentElo, ScoringBonus.DRAW)
        .should.become(expectedElo)
    })

    it('returns a lower ELO when the opponent has a lower ELO and the game was a draw', () => {
      const playerElo: number = 2400
      const expectedElo: number = 2387

      return eloCalculator.calculateElo(playerElo, opponentElo, ScoringBonus.DRAW)
        .should.become(expectedElo)
    })

    it('returns an ELO that is not rounded', () => {
      const playerElo = 2400
      const shouldRound = false
      const expectedElo = 2386.909090909091

      eloCalculator = new EloCalculator(shouldRound)

      return eloCalculator.calculateElo(playerElo, opponentElo, ScoringBonus.DRAW)
        .should.become(expectedElo)
    })
  })
})
