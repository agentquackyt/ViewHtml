import { ViewHtml } from ".";

const raw_html_string = "<p>$greeting, $name!</p> <ul> @for:advanced{<li>$key : $key2</li>} </ul>";
const data = {
  greeting: "Hello",
  name: "Name",
  advanced: [
    { key: "key1", key2: "value1" },
    { key: "key2", key2: "value2" },
  ]
}
const dictionary = {
  EN: { greeting: "Hello", name: "Name"},
  DE: { greeting: "Hallo", name: "Name"},
};


async function renderTranslated() {
  const view = new ViewHtml(raw_html_string, "$");
  await view.translate(dictionary, "DE");
  const translated_html = view.toHTML();
  console.log(translated_html);
  // Output: <p>Hallo, Name!</p> <ul> @for:advanced{<li>$key : $key2</li>} </ul>
}

async function renderWithData() {
  const view = new ViewHtml(raw_html_string, "$");
  view.interpret(data);
  const translated_html = view.toHTML();
  console.log(translated_html);
  // Output: <p>Hello, Name!</p> <ul> <li>key1 : value1</li><li>key2 : value2</li> </ul>
}

await renderTranslated();
await renderWithData();
