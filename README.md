# CodeWorks into Exam

JQuery & commonjs Blackjack app

## Focus

clean code, not necessarily on the css...

-   Game run from state machine
-   Generic item manager used for tokens and cards
-   Error handling with understandable warnings
-   Well documented with comments and jsDocs
-   Typechecking via Typescript using inference from jsDocs (in vs code)

## Architecture

The game state is managed by a small state machine following loosely after xState.
States are defined as objects with events. Events can have a target as well as conditions and actions.
If an event has conditions, these are evaluated first.
If the conditions are met, the action functions are run.
Finally if there is a valid transition, the current state is changed.

The state machine model is defined in model.js and initialized in app.js

Tokens(chips) and cards are both treated as items and managed by classes extended from a generic item manager class Collection.
The collections manage item ownership based on an agent model defined externally.

The tokens and cards agent models are defined in constants and initialized in app.js

UI buttons are bound to state machine actions in app.js

## Things to improve

-   CSS sadness
-   Import. Not sure how to properly do imports for commonjs with CORS
-   Checking game state next to the state machine with a interval loop is not elegant
-   Animation jump when transferring items

## Credits

Emoji playing cards assets from [Ghiffari Haris](https://www.behance.net/gallery/122032769/Emoji-Playing-Cards?tracking_source=search_projects%7Cemoji+playing+cards)
