import { ViewHtml } from ".";

const raw_html_string = "<p>$greeting, $name! $status</p>";
const dictionary = {
    EN: { greeting: "Hello", name: "Name", status: "How are you?" },
    DE: { greeting: "Hallo", name: "Name", status: "Wie gehts dir?" },
  };

async function renderTranslated() {
  const view = new ViewHtml(raw_html_string, "$");
  await view.translate(dictionary, "DE");
  const translated_html = view.toHTML();
  console.log(translated_html);
  // Output: <p>Hello, Name!</p>
}

renderTranslated();