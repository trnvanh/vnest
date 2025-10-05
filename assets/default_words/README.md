# Finnish Language Learning Data Documentation

This document explains the structure and content of the Finnish language learning data used in the app.

## Data Files Overview

### verbs.json
Contains common Finnish verbs in first person singular form:
- `luen` (I read)
- `kirjoitan` (I write)
- `ostan` (I buy)
- `syön` (I eat)
- `juon` (I drink)
- `kuuntelen` (I listen)

### agents.json
Contains Finnish subjects/agents (who performs the action):
- **Pronouns**: `minä` (I), `sinä` (you), `hän` (he/she), `me` (we), `te` (you plural), `he` (they)
- **Nouns**: `opettaja` (teacher), `opiskelija` (student), `lapsi` (child), `äiti` (mother), `isä` (father), `koira` (dog)

### patients.json
Contains Finnish objects/patients in correct case forms (what receives the action):
- `kirjan` (book - accusative)
- `kirjeen` (letter - accusative)
- `auton` (car - accusative)
- `ruokaa` (food - partitive)
- `vettä` (water - partitive)
- `musiikkia` (music - partitive)
- `taloa` (house - partitive)
- `elokuvaa` (movie - partitive)
- `kahvia` (coffee - partitive)
- `teetä` (tea - partitive)
- `leipää` (bread - partitive)
- `pitsaa` (pizza - partitive)

### avp_trios.json
Defines valid and invalid Finnish sentence combinations:

**Structure:**
- `verbId`: References index in verbs.json
- `agentId`: References index in agents.json
- `patientId`: References index in patients.json
- `isFitting`: true = grammatically correct, false = incorrect combination

**Examples of correct combinations:**
- `"minä luen kirjan"` (I read a book)
- `"sinä kirjoitat kirjeen"` (You write a letter)
- `"hän syö ruokaa"` (He/she eats food)
- `"me ostamme auton"` (We buy a car)
- `"opettaja kuuntelee musiikkia"` (Teacher listens to music)

**Examples of incorrect combinations:**
- `"minä luen auton"` (I read a car) - semantically incorrect
- `"sinä kirjoitat ruokaa"` (You write food) - semantically incorrect

## Learning Sets (Verb-focused exercises)

1. **Set 1: Lukeminen** - Reading exercises (`luen`)
2. **Set 2: Kirjoittaminen** - Writing exercises (`kirjoitan`)
3. **Set 3: Ostaminen** - Buying exercises (`ostan`)
4. **Set 4: Syöminen** - Eating exercises (`syön`)
5. **Set 5: Juominen** - Drinking exercises (`juon`)
6. **Set 6: Kuunteleminen** - Listening exercises (`kuuntelen`)

## Finnish Grammar Notes

### Case Usage
- **Accusative** (mostly -n ending): Used for definite, complete objects
  - `kirjan` (the book), `auton` (the car)
- **Partitive** (mostly -a/-ä ending): Used for indefinite amounts or mass nouns
  - `ruokaa` (some food), `vettä` (some water), `musiikkia` (some music)

### Verb Conjugation
All verbs are provided in first person singular form to simplify the learning experience:
- `minä luen` (I read) - but can also work with other pronouns in context
- The app focuses on sentence structure rather than verb conjugation complexity

## Data Validation

The app validates sentence combinations by checking:
1. Subject-verb semantic compatibility
2. Verb-object semantic compatibility  
3. Proper Finnish case usage
4. Real-world logical combinations

This ensures learners practice both grammatically correct and meaningful Finnish sentences.