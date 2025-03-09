
/**
 * A class for processing HTML strings with keywords and translations.
 * Keywords are prefixed with a specified character (e.g., '$') and can be replaced with values.
 * Translations are loaded from a JSON dictionary and applied based on a specified language.
 * @example
 * const html = new ViewHtml("<h1>$title</h1>", "$");
 * html.interpret({ title: "Hello, World!" }).toHTML(); // "<h1>Hello, World!</h1>"
 * html.translate("dictionary.json", "EN").toHTML(); // "<h1>Hello, World!</h1>"
 * @version 1.0.0
 * @since 1.0.0
 */
export class ViewHtml {
    private html: string;
    private prefix: string;

    /**
     * Constructs a ViewHtml instance with the raw HTML string and a prefix character.
     * @param html The raw HTML string containing keywords prefixed with the specified character.
     * @param prefix The character used to identify keywords (e.g., '$').
     */
    constructor(html: string, prefix: string) {
        this.html = html;
        this.prefix = prefix;
    }

    /**
     * Interprets keywords in the HTML and replaces them with values from a provided object.
     * @param data An object with keywords as keys and their replacement values.
     * @returns The instance itself for command chaining.
     */
    interpret(data: Record<string, string>): ViewHtml {
        const regex = new RegExp(`\\${this.prefix}(\\w+)`, "g");
        this.html = this.html.replace(regex, (match, keyword) => {
            // Replace with the value if the keyword exists in data, otherwise keep the original match
            return keyword in data ? data[keyword] : match;
        });
        return this;
    }

    /**
     * Translates keywords in the HTML using a dictionary and a specified language.
     * @param dictionary Either a path to a JSON file or an object containing translations.
     * @param language The language key (e.g., 'EN', 'DE') to select translations from the dictionary.
     * @returns A promise that resolves to the instance itself for chaining.
     */
    async translate(
        dictionary: string | Record<string, Record<string, string>>,
        language: string
    ): Promise<ViewHtml> {
        let dict: Record<string, Record<string, string>>;

        // Load dictionary from file if a string path is provided, otherwise use the object directly
        if (typeof dictionary === "string") {
            const file = Bun.file(dictionary);
            dict = await file.json();
        } else {
            dict = dictionary;
        }

        // Determine the translations to use
        let translations: Record<string, string>;
        if (language in dict) {
            translations = dict[language];
        } else if ('EN' in dict) {
            translations = dict['EN'];
        } else {
            translations = {};
        }

        // Replace keywords with translations
        const regex = new RegExp(`\\${this.prefix}(\\w+)`, "g");
        this.html = this.html.replace(regex, (match, keyword) => {
            return keyword in translations ? translations[keyword] : match;
        });

        return this;
    }

    /**
     * Returns the processed HTML string.
     * @returns The final HTML string after all interpretations and translations.
     */
    toHTML(): string {
        return this.html;
    }
}