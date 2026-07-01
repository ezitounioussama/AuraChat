# AuraChat Agent Rules & Behavioral Constraints

## 1. Meta-Rules & Execution Boundaries
* **Strict Line Limit:** NO component or file may exceed 150 lines of code. If an implementation approaches 130 lines, you MUST extract sub-components, utility functions, or custom hooks immediately.
* **Zero Placeholder Policy:** Never output placeholders, incomplete structures, or `// TODO: implement later` comments. Every block must be fully typed and implemented.
* **Verification Before Import:** Before importing any new external npm package, you must run `npm list <package>` via the terminal to confirm its existence in the project. Never assume a package is present based on training data.
* **Defensive Commits:** Create an isolated git checkpoint before undertaking any multi-file structural refactoring. Do not modify more than 3 files in a single pass without prompting for user review.

## 2. Frontend Constraints (React + Zustand + Socket + MUI + Tailwind)
* **Interface-First Layout:** Define all TypeScript types and component `Props` interfaces at the top of the file before generating rendering code. 
* **State Hygiene:** Keep local UI states (toggles, transient inputs) in React `useState`. Global chat states, session syncs, and real-time event logs belong strictly in decoupled Zustand stores.
* **Styling Integration:** Combine Material UI structural layouts with Tailwind CSS utility classes. Utilize the `cn()` utility function (`clsx` + `tailwind-merge`) for all conditional and runtime-dependent styling expressions.
* **Strict Internationalization:** Hardcoded strings are banned in user-facing components. All copy must pull from localized files using `i18next` key definitions.

## 3. Backend Constraints (Express + MongoDB + Mongoose + Socket)
* **Decoupled Architecture:** Maintain an explicit separation of concerns: Routes execute validated controller pipelines; Controllers delegate to Mongoose models or custom services; Socket handlers map cleanly to standalone event namespaces.
* **Security Middleware Precedence:** Every dynamic Express route must pass through `helmet()` and a strictly defined, locked-down `cors()` origin policy. 
* **Atomic Operations:** Database mutations (especially complex many-to-many room joins) must utilize Mongoose transactions or atomic operators (`$addToSet`, `$pull`) to prevent race conditions.
* **Payload Sanitation:** Files handled via `multer` must undergo rigorous filename sanitization and explicit MIME-type whitelist verification before writing to disk.

## 4. Error Handling & Logging
* **Result Typings:** Never let business logic throw bare errors. Wrap controller and service returns in explicit `Result<T, E>` patterns or unified JSON response envelopes.
* **Structured Event Logging:** Production paths are strictly prohibited from utilizing standard `console.log`. Use structured JSON transport logging containing metadata, session footprints, and trace IDs.