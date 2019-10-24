import { EloCalculator, Probabilities, ScoringBonus } from '../../src'

describe('EloCalculator', () => {
  let eloCalculator: EloCalculator

  const playerElo: number = 2000
  const opponentElo: number = 2000
  const shouldRound: boolean = true

  beforeEach(() => {
    eloCalculator = new EloCalculator(shouldRound)
  })

  describe('#constructor', () => {
    const kFactorDefault = 32
    const shouldRoundDefault = true

    const kFactorSet = 10
    const shouldRoundSet = false

    it('defaults both `shouldRound` and `kFactor` when no values are passed', () => {
      const eloCalculator = new EloCalculator()

      eloCalculator.kFactor.should.deep.equal(kFactorDefault)
      eloCalculator.shouldRound.should.deep.equal(shouldRoundDefault)
    })

    it('defaults `kFactor` and sets `shouldRound` when `shouldRound` is passed', () => {
      const eloCalculator = new EloCalculator(shouldRoundSet)

      eloCalculator.kFactor.should.deep.equal(kFactorDefault)
      eloCalculator.shouldRound.should.deep.equal(shouldRoundSet)
    })

    it('defaults `shouldRound` and sets `kFactor` when `kFactor` is passed', () => {
      const eloCalculator = new EloCalculator(shouldRoundDefault, kFactorSet)

      eloCalculator.kFactor.should.deep.equal(kFactorSet)
      eloCalculator.shouldRound.should.deep.equal(shouldRoundDefault)
    })

    it('sets both `shouldRound` and `kFactor` when both values are passed', () => {
      const eloCalculator = new EloCalculator(shouldRoundSet, kFactorSet)

      eloCalculator.kFactor.should.deep.equal(kFactorSet)
      eloCalculator.shouldRound.should.deep.equal(shouldRoundSet)
    })
  })

  describe('#calculateElo', () => {
    describe('win', () => {
      it('returns a specific ELO which is higher after a win', () => {
        const expectedElo: number = 2016

        return eloCalculator.calculateElo(playerElo, opponentElo, ScoringBonus.WIN)
          .should.become(expectedElo)
      })

      it('returns a specific ELO which is higher after a win and takes into account score difference', () => {
        const expectedElo: number = 2026

        return eloCalculator.calculateElo(playerElo, opponentElo, ScoringBonus.WIN, 4)
          .should.become(expectedElo)
      })
    })

    describe('draw', () => {
      it('returns a higher ELO when the opponent has a higher ELO and the game was a draw', () => {
        const opponentElo: number = 2400
        const expectedElo: number = 2013

        return eloCalculator.calculateElo(playerElo, opponentElo, ScoringBonus.DRAW)
          .should.become(expectedElo)
      })

      it('returns the same ELO when both players have equal ELO and the game was a draw', () => {
        const expectedElo: number = 2000

        return eloCalculator.calculateElo(playerElo, opponentElo, ScoringBonus.DRAW)
          .should.become(expectedElo)
      })

      it('returns a lower ELO when the opponent has a lower ELO and the game was a draw', () => {
        const playerElo: number = 2400
        const expectedElo: number = 2387

        return eloCalculator.calculateElo(playerElo, opponentElo, ScoringBonus.DRAW)
          .should.become(expectedElo)
      })
    })

    describe('loss', () => {
      it('returns a specific ELO which is lower after a loss', () => {
        const expectedElo: number = 1984

        return eloCalculator.calculateElo(playerElo, opponentElo, ScoringBonus.LOSS)
          .should.become(expectedElo)
      })

      it('returns a specific ELO which is lower after a loss and takes into account score difference', () => {
        const expectedElo: number = 1969

        return eloCalculator.calculateElo(playerElo, opponentElo, ScoringBonus.LOSS, 6)
          .should.become(expectedElo)
      })
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

  describe('#caluclateWinProbability', () => {
    it('returns a 50 / 50 probability of winning', () => {
      const expectedProbability: Probabilities = {
        player: 50,
        opponent: 50
      }

      return eloCalculator.caluclateWinProbability(playerElo, opponentElo)
        .should.become(expectedProbability)
    })

    it('returns a high probability when the player has a higher ELO than the opponent', () => {
      const playerElo: number = 2364
      const expectedProbability: Probabilities = {
        player: 89,
        opponent: 11
      }

      return eloCalculator.caluclateWinProbability(playerElo, opponentElo)
        .should.become(expectedProbability)
    })

    it('returns a low probability when the player has a lower ELO than the opponent', () => {
      const playerElo: number = 1800
      const expectedProbability: Probabilities = {
        player: 24,
        opponent: 76
      }

      return eloCalculator.caluclateWinProbability(playerElo, opponentElo)
        .should.become(expectedProbability)
    })
  })
})
