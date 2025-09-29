# VNeST - Finnish Language Learning App

A React Native/Expo app for learning Finnish verb-subject-object combinations with offline-first data storage and modular component architecture.

## Architecture Overview

The app uses a modular, component-based architecture with offline-first data persistence using AsyncStorage for cross-platform compatibility.

### Component Architecture
- **Modular Design**: Game components are split into reusable, focused modules
- **Separation of Concerns**: UI components separated from business logic
- **Type Safety**: Full TypeScript implementation with proper interfaces
- **Reusability**: Components can be easily reused across different screens

### Local Storage (AsyncStorage)
- **Primary storage**: All data is stored locally first using React Native AsyncStorage
- **Cross-platform**: Works seamlessly on iOS, Android, and Web
- **Always available**: App works completely offline
- **Fast performance**: No network delays for basic operations
- **Simple implementation**: No complex database setup or WASM dependencies

### Data Synchronization
- **Background sync**: Automatically syncs when online
- **Conflict resolution**: Last-write-wins strategy
- **Pending changes**: Tracks unsynced local changes

## Key Components

### 1. Game Components (`components/game/`)
Modular UI components for the game interface:
- **GameHeader**: Navigation header with home button
- **LoadingView**: Loading state with spinner
- **ErrorView**: Error display with retry options
- **CongratsView**: Set completion celebration
- **GameView**: Main game interface with card selection
- **FeedbackView**: Post-selection feedback display
- **GameCard**: Reusable card component for words
- **ProgressBar**: Progress indicator with percentage

### 2. Data Service (`services/simpleDataService.ts`)
Manages offline data storage and game logic:
- Word sets management
- Correct combinations tracking
- Current set persistence
- Development data reloading
- Verb-keyed combination storage

### 3. useWordData Hook (`hooks/useWordData.ts`)
React hook providing:
- Word data state management
- Manual initialization control
- Loading and error states
- Data refresh capabilities
- Combination validation

## Data Storage Format

### AsyncStorage Keys
- `@wordSets` - Array of WordSet objects
- `@combinations` - Verb-keyed correct combinations
- `@currentSet` - Currently selected set ID

### WordSet Structure
```typescript
interface WordSet {
  id: number;
  name: string;
  verbs: string[];
  subjects: string[];
  objects: string[];
}
```

### Combinations Structure (Verb-Keyed)
```typescript
interface VerbCombinations {
  [verb: string]: {
    [subject: string]: string[]; // Array of valid objects
  };
}

interface AllCombinations {
  [setId: string]: VerbCombinations;
}
```

### Game Data Structure
```typescript
interface WordData {
  verbs: string[];
  subjects: string[];
  objects: string[];
}
```

## Game Flow

### Set-Based Learning
1. **Set Selection**: Users choose from numbered sets (1, 2, 3, 4...)
2. **Verb Practice**: Each set contains multiple verbs to practice
3. **Card Matching**: Users match subjects and objects with verbs
4. **Progress Tracking**: Visual progress bar shows completion status
5. **Set Completion**: Congratulations screen with replay/next set options

### Combination Validation
```typescript
// Check if a combination is correct
const isCorrect = await isCorrectCombination(subject, verb, object);
```

### Set Management
```typescript
// Get available word sets
const wordSets = await dataService.getWordSets();

// Set current active set
await dataService.setCurrentSet(setId);

// Get current set ID
const currentSetId = await dataService.getCurrentSet();
```

## Component Usage Examples

### Using Game Components
```typescript
import { 
  GameHeader, 
  GameView, 
  CongratsView 
} from '@/components/game';

// In your screen component
function GameScreen() {
  return (
    <>
      <GameHeader />
      <GameView
        subjects={subjects}
        objects={objects}
        currentVerb={currentVerb}
        selectedSubject={selectedSubject}
        selectedObject={selectedObject}
        onSelect={handleSelect}
      />
    </>
  );
}
```

### Using the Data Hook
```typescript
import { useWordData } from '@/hooks/useWordData';

function PlayScreen() {
  const { 
    wordData, 
    isLoading, 
    error, 
    refreshData,
    isCorrectCombination,
    initializeManually 
  } = useWordData();

  // Manual initialization
  useEffect(() => {
    initializeManually();
  }, []);

  if (isLoading) return <LoadingView />;
  if (error) return <ErrorView error={error} />;

  return (
    <GameView
      subjects={wordData.subjects}
      objects={wordData.objects}
      currentVerb={wordData.verbs[currentIndex]}
      onSelect={handleSelect}
    />
  );
}
```

### Validating Combinations
```typescript
const handleSubmit = async () => {
  const isCorrect = await isCorrectCombination(
    selectedSubject,
    currentVerb,
    selectedObject
  );
  
  setFeedback(isCorrect ? '✅ Hyvin tehty!' : '❌ Yritä uudelleen');
};
```

## Features & Benefits

### Core Features
1. **Set-Based Learning**: Organized learning with numbered sets
2. **Interactive Matching**: Drag-and-drop style card matching
3. **Progress Tracking**: Visual progress bars and completion tracking
4. **Congratulations System**: Celebration screen for set completion
5. **Offline-First**: Works completely without internet connection
6. **Cross-Platform**: Runs on iOS, Android, and Web via Expo

### Technical Benefits
1. **Modular Architecture**: Easy to maintain and extend
2. **Type Safety**: Full TypeScript implementation
3. **Component Reusability**: Modular components for consistent UI
4. **Fast Performance**: Local storage with no network delays
5. **Reliable Data**: Persistent storage with AsyncStorage
6. **Development Friendly**: Hot reload support and debug logging

## App Screens

### Main Navigation
- **Home**: Welcome screen with app introduction
- **Play**: Main game interface with card matching
- **Progress**: Set selection screen with numbered options
- **Settings**: App configuration and preferences

### Game Flow
1. **Set Selection** → **Verb Practice** → **Progress Tracking** → **Completion**
2. **Replay Option** or **Next Set** progression
3. **Home Navigation** available from any screen

## Development Features

### Debug & Development
- **Force Reload**: Development flag for data reset during testing
- **Debug Logging**: Comprehensive console logging for troubleshooting
- **Manual Initialization**: Controlled data loading to prevent race conditions
- **Error Recovery**: Robust error handling with retry mechanisms

## Future Enhancements

### Gameplay Features
- Multiple difficulty levels
- Timed challenges
- Achievement system
- Learning statistics and analytics
- Audio pronunciation support
- Spaced repetition algorithm

### Technical Improvements
- Server synchronization for multi-device support
- Advanced progress tracking
- Offline analytics
- Performance optimizations
- Accessibility improvements
- Internationalization support

### UI/UX Enhancements
- Animations and transitions
- Dark mode support
- Customizable themes
- Better responsive design
- Haptic feedback
- Sound effects