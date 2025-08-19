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
npm install --legacy-peer-deps

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

1. **Incomplete API data**  
   The Rick & Morty API can be patchy/polluted the `type` field is missing, origins show up as “unknown,” or gender data is inconsistent. If you get an unlucky character, this messy data can throw off the flow of the game.  

2. **Heavy character images**  
   Character images are ~35kb each (300x300), but could easily be compressed down to ~6kb. With smaller images, we could preload all 826 characters and ditch the need for pagination/infinite scroll. That alone would make filters and gameplay feel way smoother.  

3. **All hints match, but still not correct**  
   Occasionally, you’ll hit a situation where every hint matches but the guess still isn’t the right character and you’ve got lots of guesses left. A nice solution here would be letter reveal to give players a better indication.  

4. **No give-up option**  
   Right now, if you want to quit mid-game, you pretty much have to restart the app. A “give up” button would be nice.

## 🤝 Credits

- **Rick and Morty API**: [rickandmortyapi.com](https://rickandmortyapi.com/)
- **Character Data**: All character information and images provided by the API
- **Icons**: Emoji icons for simplicity and universal compatibility

## 📄 License

This project is for educational and demonstration purposes. Rick and Morty characters and imagery are property of their respective owners.

---