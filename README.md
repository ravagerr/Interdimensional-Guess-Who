# 🌌 Interdimensional Guess Who
A React Native guessing game where you identify the Rick & Morty character based on hints and their attributes

Built with Typescript, Apollo Client, and the Rick & Morty GraphQL API

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd unmade-app

# Install dependencies
npm install

# Start the development server
npx expo start

# Scan the QR code with Expo Go app
```

## 🎮 How to Play

1. **Start a Game**: Navigate to the "Play" tab to begin a new round / Press on Play button on home screen lol
2. **Search & Guess**: Type character names to search and tap to make a guess, or choose from list
3. **Analyze Hints**: Each guess provides color-coded hints:
   - 🟢 **Green**: Exact match
   - 🟡 **Yellow**: Partial match (for species)
   - **Higher/Lower**: For episode count comparisons
4. **Win**: Identify the character within 8 guesses to score

### Hint Categories

- **Status**: Alive, Dead, or Unknown
- **Species**: Human, Alien, Robot, etc.
- **Type**: Subspecies or variant information
- **Gender**: Male, Female, Genderless, Unknown
- **Origin**: Birth/home dimension/planet
- **Location**: Current location
- **Episode Count**: Number of appearances (with higher/lower hints)

## Known issues

.... wait

## 🤝 Credits

- **Rick and Morty API**: [rickandmortyapi.com](https://rickandmortyapi.com/)
- **Character Data**: All character information and images provided by the API
- **Icons**: Emoji icons for simplicity and universal compatibility

## 📄 License

This project is for educational and demonstration purposes. Rick and Morty characters and imagery are property of their respective owners.

---