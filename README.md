# ViewHtml - Template Engine Middleware

`ViewHtml` is a lightweight, type-safe TypeScript class that interprets keywords in HTML templates, replaces them with values from a JavaScript object or JSON file, and supports translations with a fallback mechanism. It’s perfect for generating dynamic content in web applications, especially when paired with the Bun runtime.

## Features

- **Keyword Replacement**: Replace keywords in HTML (e.g., `$keyword`) with values from an object or JSON file.
- **Translation Support**: Translate keywords using a dictionary with fallback to English or the original keyword if translations are missing.
- **Type-Safe**: Built with TypeScript for reliable data handling.
- **Fluent API**: Supports method chaining for streamlined operations.
- **Bun Compatibility**: Leverages Bun’s file API for efficient file operations.

## Installation

To use `ViewHtml`, you’ll need [Bun](https://bun.sh/), a fast JavaScript runtime. Install Bun by following the instructions on the [official Bun website](https://bun.sh/).

Once Bun is installed, add the `ViewHtml` class to your TypeScript project by copying the class definition into your codebase.

## Usage

### Basic Keyword Replacement

Replace keywords in an HTML string with values from a JavaScript object using the `interpret` method.

```typescript
const raw_html_string = "<p>$greeting, $name!</p>";
const data = { greeting: "Hello", name: "Max Mustermann" };

const interpreted_html = new ViewHtml(raw_html_string, "$")
  .interpret(data)
  .toHTML();

console.log(interpreted_html);
// Output: <p>Hello, Max Mustermann!</p>
```

### Translation with Fallback

Use the `translate` method to translate keywords with a dictionary (from a JSON file or object). If a translation isn’t available, it falls back to English ('EN') or the original keyword.

#### Using a JSON File

Suppose you have a `translations.json` file:

```json
{
  "EN": {
    "greeting": "Hello",
    "name": "Name"
  },
  "DE": {
    "greeting": "Hallo",
    "name": "Name"
  }
}
```

Here’s how to use it:

```typescript
const raw_html_string = "<p>$greeting, $name!</p>";

async function renderTranslated() {
  const view = new ViewHtml(raw_html_string, "$");
  await view.translate("path/to/translations.json", "DE");
  const translated_html = view.toHTML();
  console.log(translated_html);
  // Output: <p>Hallo, Name!</p>
}

renderTranslated();
```

#### Using an Object

Pass a dictionary object directly:

```typescript
const dictionary = {
  EN: { greeting: "Hello", name: "Name" },
  DE: { greeting: "Hallo", name: "Name" },
};

async function renderTranslated() {
  const translated_html = await new ViewHtml(raw_html_string, "$")
    .translate(dictionary, "EN")
    .then((view) => view.toHTML());
  console.log(translated_html);
  // Output: <p>Hello, Name!</p>
}

renderTranslated();
```

### Chaining Methods

`ViewHtml` supports method chaining. Since `translate` is asynchronous, handle it with `await` or `.then()`.

```typescript
const raw_html_string = "<p>$greeting, $name!</p>";
const data = { name: "Max Mustermann" };
const dictionary = { EN: { greeting: "Hello" } };

async function render() {
  const view = new ViewHtml(raw_html_string, "$");
  await view.translate(dictionary, "EN");
  view.interpret(data);
  const final_html = view.toHTML();
  console.log(final_html);
  // Output: <p>Hello, Max Mustermann!</p>
}

render();
```

## API

### Constructor

```typescript
new ViewHtml(html: string, prefix: string)
```

- `html`: Raw HTML string with keywords to replace.
- `prefix`: Character marking keywords (e.g., `$` for `$keyword`).

### Methods

#### `interpret(data: Record<string, string>): ViewHtml`

Replaces keywords with values from an object.

- `data`: Object with keys matching keywords (without prefix) and their replacement values.

Returns the instance for chaining.

#### `async translate(dictionary: string | Record<string, Record<string, string>>, language: string): Promise<ViewHtml>`

Translates keywords using a dictionary and specified language.

- `dictionary`: Path to a JSON file or an object with translations.
- `language`: Language code (e.g., 'EN', 'DE').

Falls back to 'EN' or the original keyword if translations are missing. Returns a promise resolving to the instance.

#### `toHTML(): string`

Returns the final processed HTML string.

## Fallback Mechanism

The `translate` method follows this fallback logic:

1. **Specified Language**: Uses translations from the requested language if available.
2. **English Fallback**: Switches to 'EN' if the specified language isn’t found.
3. **Original Keyword**: Retains the keyword (e.g., `$keyword`) if no translations exist.

This ensures smooth operation even with incomplete translation data.

## Requirements

- **Bun Runtime**: Needed for file operations like reading JSON files.
- **TypeScript**: Use in a TypeScript project for type safety.

## License

`ViewHtml` is open-source and licensed under the MIT License.