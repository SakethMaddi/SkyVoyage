# JavaScript Concepts Covered

## 1. Variables & Declarations

- `const` declarations
- `let` declarations
- Block scoping
- Module-level state variables
- Constants & configuration objects

## 2. Functions

- Arrow functions
- Function declarations
- Function expressions
- Default parameters
- Rest parameters (`...args`)
- Higher-order functions (functions returning functions)
- Callback functions
- Immediately invoked patterns
- `this` binding with `Function.prototype.apply()`

## 3. ES6 Modules

- Named exports (`export const`)
- Named imports (`import { x } from`)
- Default exports / imports
- Dynamic imports (`await import()`)
- Module-level encapsulation
- Barrel / re-export patterns

## 4. Template Literals

- String interpolation (`${expression}`)
- Multi-line strings
- HTML template generation
- Nested template literals
- Tagged expressions in conditional rendering

## 5. Destructuring

- Object destructuring
- Object destructuring in function parameters
- Array destructuring
- Nested destructuring
- Destructuring with default values

## 6. Spread & Rest Operators

- Array spreading (`[...array]`)
- Object spreading (`{...object}`)
- Shallow copying arrays and objects
- Merging objects
- Rest parameters in functions

## 7. Optional Chaining & Nullish Coalescing

- Optional chaining (`?.`)
- Optional chaining on arrays (`?.[index]`)
- Optional chaining on methods (`?.method()`)
- Fallback values with `||`
- Default value patterns

## 8. Async JavaScript

### Fetch API
- `fetch()` with URL construction
- `Response.ok` status checking
- `Response.status` code checking
- `Response.json()` parsing
- Request headers and options
- Simulated POST/PUT requests

### Promises
- `new Promise()` constructor
- `Promise.all()` (parallel execution)
- `Promise.allSettled()` (resilient batch fetching)
- Promise chaining
- Promise resolution / rejection

### Async/Await
- `async` function declarations
- `await` expressions
- Sequential async operations
- Parallel async with `Promise.all`
- Async arrow functions
- Async event handlers

### Error Handling
- `try` / `catch` blocks
- `try` / `catch` / `finally` blocks
- Error throwing (`throw new Error()`)
- Error propagation
- Graceful degradation on API failure
- `console.error` / `console.warn`

## 9. Array Methods

### Transformation
- `Array.map()`
- `Array.flatMap()`
- `Array.from()`

### Filtering
- `Array.filter()`
- `Array.find()`
- `Array.findIndex()`
- `Array.includes()`
- `Array.some()`
- `Array.every()`

### Aggregation
- `Array.reduce()`
- `Array.join()`

### Sorting
- `Array.sort()` with comparator functions
  - Numeric sort (ascending / descending)
  - String sort with `localeCompare()`
  - Multi-field sorting

### Mutation
- `Array.push()`
- `Array.unshift()`
- `Array.splice()`

### Slicing & Copying
- `Array.slice()` (pagination, limiting results)
- Spread operator for shallow copy
- `Array.isArray()` type checking

### Iteration
- `Array.forEach()`
- `for` loops (traditional)
- `for...of` loops

## 10. Object Methods

- `Object.keys()`
- `Object.values()`
- `Object.entries()`
- Object shorthand property names
- Object shorthand method notation
- Computed property names
- Object literal creation

## 11. String Methods

- `String.toLowerCase()`
- `String.toUpperCase()`
- `String.trim()`
- `String.includes()`
- `String.replace()`
- `String.replaceAll()`
- `String.split()`
- `String.slice()`
- `String.substring()`
- `String.charAt()`
- `String.padStart()`
- `String.match()`
- `String.localeCompare()`
- `String.startsWith()` / `String.endsWith()`
- `String.toString()` with radix parameter

## 12. Regular Expressions

- Regex literals (`/pattern/flags`)
- `RegExp.test()` for validation
- `String.match()` with regex
- `String.replace()` with regex
- Regex escaping user input
- Patterns: email, phone, credit card, date, name, passport, promo code, CVV, expiry

## 13. Number & Math

- `Math.floor()` / `Math.ceil()` / `Math.round()`
- `Math.max()` / `Math.min()`
- `Math.random()`
- `Math.sin()` (seeded randomness)
- `Number.parseFloat()` / `Number.parseInt()`
- `Number.toFixed()`
- `Number.toLocaleString()`
- Arithmetic operators
- Type coercion (string to number)

## 14. Date & Time

- `new Date()` constructor
- `Date.now()` timestamp
- `Date.getTime()`
- `Date.toISOString()`
- `Date.toLocaleDateString()` with options
- Date arithmetic and manipulation
- Relative time formatting (custom)
- `setInterval()` / `clearInterval()` (countdown timers)
- `setTimeout()` / `clearTimeout()` (delayed execution)

## 15. Set & Map

### Set
- `new Set()`
- `Set.add()`
- `Set.delete()`
- `Set.has()`
- `Set.size`
- Spreading a Set to Array (`[...set]`)
- Deduplication with Set

### Map
- `new Map()`
- `Map.set()` / `Map.get()`
- `Map.has()`
- `Map.values()`
- Caching patterns with Map

## 16. DOM Manipulation

### Selection
- `document.querySelector()`
- `document.querySelectorAll()`
- `element.querySelector()` (scoped)
- `element.closest()`

### Creation & Insertion
- `document.createElement()`
- `element.appendChild()`
- `element.insertAdjacentHTML()`
- `element.innerHTML`
- `element.textContent`

### Attributes
- `element.setAttribute()`
- `element.getAttribute()`
- `element.removeAttribute()`
- `element.dataset` (data attributes)
- `element.value`

### CSS Classes
- `element.classList.add()`
- `element.classList.remove()`
- `element.classList.toggle()`
- `element.classList.contains()`

### Styling
- `element.style` property (inline styles)
- `element.className`

### Other
- `document.title` manipulation
- `document.documentElement.dataset`
- `requestAnimationFrame()`
- Child node removal / clearing

## 17. Event Handling

### Event Listeners
- `element.addEventListener()`
- `addEventListener` with options object (`{ once: true }`)
- `DOMContentLoaded` event
- `transitionend` event

### Event Types
- `click`
- `input`
- `change`
- `submit`
- `blur`
- `keydown` / `keyup`

### Event Object
- `event.target`
- `event.target.closest()` (delegation)
- `event.preventDefault()`
- `event.stopPropagation()`

### Event Delegation
- Single parent listener for child elements
- `closest()` method for target identification
- `data-*` attribute-driven delegation
- Grid/list delegation for dynamic elements

### Keyboard Navigation
- Arrow key handling (ArrowUp / ArrowDown)
- Enter key handling
- Escape key handling

## 18. Design Patterns

### Closure Pattern
- Private state encapsulation
- Factory functions returning objects with methods
- Timer management in closures

### Singleton Pattern
- Module-level single instances
- Shared state across modules

### Debounce Pattern
- Delaying function execution
- Search input debouncing
- Filter change debouncing
- Configurable delay

### Observer / Pub-Sub Pattern
- Custom events for cross-component communication
- `new CustomEvent()`
- `document.dispatchEvent()`
- Event-driven state updates

### Event Delegation Pattern
- Parent-level listeners
- Dynamic child element handling
- Button/card click handling

### Component Pattern
- Functional component creation
- HTML string-returning render functions
- Component composition

### Page Router Pattern
- `data-page` attribute routing
- Dynamic module loading per page
- Switch-based page initialization

### Module Pattern
- ES6 module encapsulation
- Private module-level variables
- Exported public API

## 19. State Management

- Closure-based state
- Module-level state variables
- localStorage persistence & sync
- State initialization from storage
- State update with re-render
- Cart state (add / remove / update quantity / clear)
- Wishlist state (add / remove / toggle)
- Custom event-driven state notifications

## 20. localStorage & Persistence

- `localStorage.getItem()`
- `localStorage.setItem()`
- `localStorage.removeItem()`
- `JSON.stringify()` serialization
- `JSON.parse()` deserialization
- Error handling for storage operations
- Storage key prefixing
- Storage wrapper utilities

## 21. URL & Navigation

- `URLSearchParams` constructor
- `URLSearchParams.get()`
- `window.location.search`
- `window.location.href` (navigation)
- `window.history.replaceState()`
- `encodeURIComponent()` for API queries
- Query parameter-driven page state

## 22. Internationalization (Intl)

- `Intl.NumberFormat()` for currency formatting
- `Intl.DateTimeFormat()` for date formatting
- Locale-aware number formatting
- `toLocaleString()` for numbers

## 23. IntersectionObserver

- `new IntersectionObserver()` constructor
- `entry.isIntersecting`
- `rootMargin` configuration
- `observer.observe()`
- `observer.disconnect()`
- Infinite scroll implementation

## 24. Clipboard API

- `navigator.clipboard.writeText()`
- Copy-to-clipboard functionality

## 25. Conditional Logic

- `if` / `else` / `else if`
- Ternary operators
- Nested ternary for conditional rendering
- `switch` statements
- Short-circuit evaluation (`&&`, `||`)
- Truthy / falsy checks

## 26. Form Handling

- Form submission with `event.preventDefault()`
- Input value reading
- Input validation patterns
- Real-time input formatting
- `form.reset()` for clearing forms
- Hidden input for custom dropdowns
- Disabled state management (`setAttribute('disabled')`)
- Multi-step form flow

## 27. Custom Dropdown (Non-Native Select)

- Trigger button with chevron icon
- Hidden input for value storage
- Dropdown list toggle (show/hide)
- Active item state management
- Outside-click-to-close pattern
- Chevron rotation on open/close
- `aria-haspopup` accessibility attribute
- Event delegation for item selection

## 28. Pagination

- Skip/limit based pagination
- "Load More" button pattern
- Infinite scroll with IntersectionObserver
- Product/item count tracking
- Append vs replace rendering

## 29. Search

- Debounced search input
- API-driven search
- Client-side filtering by search term
- Search mode toggling
- Search result count display
- Clear search on category change

## 30. Sorting

- Client-side sort by price (ascending / descending)
- Sort by rating
- Sort by name (alphabetical with `localeCompare`)
- Sort by date
- Default/original order reset
- Custom dropdown for sort selection

## 31. Filtering

- Category-based filtering
- Active filter pill/tab styling
- API-driven category filtering
- Client-side array filtering
- Multi-criteria filter combination
- Filter reset

## 32. Rendering Patterns

- HTML string generation with `map().join()`
- Conditional rendering in templates
- Empty state rendering
- Loading state (spinner) management
- Show/hide with `hidden` attribute
- Dynamic element creation and insertion
- Re-render on state change
- Live preview (content creation)

## 33. Animation & Transitions

- CSS class toggling for transitions
- `requestAnimationFrame()` for smooth animations
- `setTimeout()` for timed UI feedback
- `transitionend` event listening
- Button feedback ("Added!" state with auto-revert)
- Toast notification enter/exit animations

## 34. Error & Edge Cases

- API failure graceful handling
- Empty state displays
- Loading state indicators
- Fallback values for missing data
- Partial failure handling (`Promise.allSettled`)
- Console error logging
- User-facing error toasts

## 35. Miscellaneous

- `typeof` operator
- `Number()` type conversion
- Seeded pseudo-random number generation
- `SVG` inline rendering in templates
- `loading="lazy"` attribute for images
- Unicode escape sequences (`\u00B2`, `\u2026`)
- Comma-separated number display
- Deterministic pricing from IDs (modulo-based)
- Timer-based countdowns
- Unique ID generation (`Date.now() + Math.random()`)
