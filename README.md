# ELO Calculator
This package makes using the ELO ranking system easy. To get started you just need to decide what you want your starting 
ELO. After that, you can start calculating win probabilities based on two player's ELO scores and also determining the
ELO of a player after a match.

It's very simple.

### Installation
To install this package.

`npm i toefungi-elo-calculator`

### Usage
You're first going to want to import the relevant files and instantiate a new instance of the `EloCalculator`.
```typescript
import { EloCalculator } from '/'

const eloCalculator: EloCalculator = new EloCalculator()
```

Here is a basic example of calculating a new ELO value.
```typescript
import { ScoringBonus } from '/'

// Declared player variables
const playerElo = 2149
const opponentElo = 2084

// Calculate ELO based on the outcome of the game
eloCalculator.calculateElo(playerElo, opponentElo, ScoringBonus.WIN)
  .then((elo: number) => {
    console.log(elo) // The new ELO
  })
```

Here is a basic example of calculating win probabilities between two players.
```typescript
import { Probabilities } from '/'

// Declared player variables
const playerElo = 2149
const opponentElo = 2084

// Calculate ELO based on the outcome of the game
eloCalculator.caluclateWinProbability(playerElo, opponentElo)
  .then((probability: Probabilities) => {
    console.log(probability.player) // Probability player will win
    console.log(probability.opponent) // Probability opponent will win
  })
```

### Testing
This package includes unit tests which cover 100% of the code and all tests are working. 
The testing framework being used is `mocha` and using `chai-as-promised`to test the promise returns from the package.

The test suite can be run using the conventional `npm test`

The package uses `nyc` for code coverage.
