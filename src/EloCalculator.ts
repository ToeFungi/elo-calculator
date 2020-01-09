import { RelativeRank } from './types/RelativeRank'
import { ScoringBonus } from './enums/ScoringBonus'
import { Probabilities } from './types/Probabilities'

/**
 * https://metinmediamath.wordpress.com/2013/11/27/how-to-calculate-the-elo-rating-including-example/
 *
 * EloCalculator class to do calculations to determine the elo of a player after a match.
 */
class EloCalculator {
  public readonly kFactor: number = 32
  public readonly shouldRound: boolean

  /**
   * Constructor method for the EloCalculator class.
   *
   * @param {boolean} shouldRound Whether or not the new ELO should be rounded before being returned.
   * @param {number} kFactor The factor the new ELO is calculated against.
   */
  constructor(shouldRound: boolean = true, kFactor: number = 32) {
    this.kFactor = kFactor
    this.shouldRound = shouldRound
  }

  /**
   * @private
   *
   * Takes a current ELO score and will convert it to it's equivalent base10 value which can be used
   * to determine ELO for a win, loss or draw.
   *
   * @param {number} elo An ELO score to be converted to base10.
   * @return {Promise<number>} The equivalent base10 rank of the given ELO.
   */
  private convertEloToBase10(elo: number): Promise<number> {
    const divide = () => elo / 400
    const convertToBase10 = (value: number) => Math.pow(10, value)

    return Promise.resolve()
      .then(divide)
      .then(convertToBase10)
  }

  /**
   * @private
   *
   * Calculates the base10 equivalent value of each player's ELO score which can then be used to determine the new ELO
   * score for the player.
   *
   * @param {number} playerElo The initial ELO of the player.
   * @param {number} opponentElo The initial ELO of the opponent.
   * @return {Promise<RelativeRank>} An object containing the equivalent base10 value of both player's ELO score.
   */
  private determineRelativeRank(playerElo: number, opponentElo: number): Promise<RelativeRank> {
    return Promise.all([
      this.convertEloToBase10(playerElo),
      this.convertEloToBase10(opponentElo)
    ]).then(([ player, opponent ]: [ number, number ]) => ({ player, opponent }))
  }

  /**
   * @private
   *
   * Determines the scoring factor of the player based on their rank against their opponents rank.
   *
   * @param {number} playerRank The base10 value of the player's ELO score.
   * @param {number} opponentRank The base10 value of the opponent's ELO score.
   * @return {Promise<number>} The determined scoring factor.
   */
  private determineScoreFactor(playerRank: number, opponentRank: number): Promise<number> {
    const add = () => playerRank + opponentRank
    const divide = (value: number) => playerRank / value

    return Promise.resolve()
      .then(add)
      .then(divide)
  }

  /**
   * @private
   *
   * Determines the new ELO of a player based on the score factor, a win or loss and current ELO score.
   *
   * @param {number} playerElo A player's current ELO score.
   * @param {number} scoringFactor A factor derived from the player's relative base10 ELO score with their opponent's .
   * @param {ScoringBonus} score Enum with [ WIN, LOSS, DRAW ].
   * @param {number} scoreDiff The difference in the score as a number.
   * @return {Promise<number>} The new calculated ELO.
   */
  private determineElo(playerElo: number, scoringFactor: number, score: ScoringBonus, scoreDiff?: number): Promise<number> {
    const getFactor = (difference?: number): number => {
      if (!difference) {
        return this.kFactor
      }

      return Math.log(Math.abs(difference) + 1) * this.kFactor
    }

    const subtract = () => score - scoringFactor

    const add = (value: number) => playerElo + value
    const multiply = (value: number) => value * getFactor(scoreDiff)

    return Promise.resolve()
      .then(subtract)
      .then(multiply)
      .then(add)
  }

  /**
   * @private
   *
   * Rounds off the ELO score before it is returned.
   *
   * @param {number} elo A value representing the ELO.
   * @return {Promise<number>} The rounded off ELO value.
   */
  private rounding(elo: number): Promise<number> {
    return Promise.resolve()
      .then(() => {
        if (!this.shouldRound) {
          return elo
        }

        return Math.round(elo)
      })
  }

  /**
   * @private
   *
   * Creates a probability object which will be returned to the user.
   *
   * @param {number} probability The probability of the `player` to win the game.
   * @return {Promise<Probabilities>} The probability of a win for either player based on the `player` ELO.
   */
  private createProbability(probability: number): Promise<Probabilities> {
    return Promise.resolve()
      .then(() => {
        const player = Math.round(probability * 100)
        const opponent = Math.round((1 - probability) * 100)

        return {
          player,
          opponent
        }
      })
  }

  /**
   * Calculate the ELO of a player after a match based on their opponent's ELO and whether or not the player won the game.
   *
   * @param {number} playerElo The ELO of the player.
   * @param {number} opponentElo The ELO of the opponent.
   * @param {ScoringBonus} score The outcome of the game for the player, enum with [ WIN, LOSS, DRAW ].
   * @param {number} scoreDiff The difference in the score as a number.
   * @return {Promise<number>} The new ELO of the player.
   */
  public calculateElo(playerElo: number, opponentElo: number, score: ScoringBonus, scoreDiff?: number): Promise<number> {
    return Promise.resolve()
      .then(() => this.determineRelativeRank(playerElo, opponentElo))
      .then((relativeRank: RelativeRank) => this.determineScoreFactor(relativeRank.player, relativeRank.opponent))
      .then((scoringFactor: number) => this.determineElo(playerElo, scoringFactor, score, scoreDiff))
      .then((elo: number) => this.rounding(elo))
  }

  /**
   * Calculate the win probability for players in a match up given their respective ELO's.
   *
   * @param {number} playerElo The ELO of the player.
   * @param {number} opponentElo The ELO of the opponent.
   * @return {Promise<Probabilities>} The win probability for each player respectively.
   */
  public caluclateWinProbability(playerElo: number, opponentElo: number): Promise<Probabilities> {
    const determineDiff = (): number => opponentElo - playerElo

    const determineProbability = (elo: number): number => 1 / (1 + elo)

    return Promise.resolve()
      .then(determineDiff)
      .then(this.convertEloToBase10)
      .then(determineProbability)
      .then(this.createProbability)
  }
}

export { EloCalculator }
