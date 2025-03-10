
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
     * Sets a new prefix character for identifying keywords in the HTML.
     * @param prefix The new prefix character to use for identifying keywords.
     * @returns The instance itself for command chaining.
     */
    selector(prefix: string) {
        this.prefix = prefix;
        return this;
    }

    /**
     * Sets a new prefix character for identifying keywords in the HTML.
     * @param prefix The new prefix character to use for identifying keywords.
     * @returns The instance itself for command chaining.
     * @alias selector
     */
    s(prefix: string) {
        this.prefix = prefix;
        return this;
    }

    /**
     * Interprets keywords in the HTML and replaces them with values from a provided object.
     * Now supports advanced data arrays with syntax:
     *   @for:<arrayKey>{...template...}
     * Each occurrence will be repeated for every element in the array, replacing inner keywords.
     * @param data An object with keywords as keys and their replacement values. Array values trigger for-loop processing.
     * @returns The instance itself for command chaining.
     */
    interpret(data: Record<string, any>): ViewHtml {
        // Process advanced array loops first.
        const forLoopRegex = /@for:(\w+)\{([\s\S]*?)\}/g;
        this.html = this.html.replace(forLoopRegex, (match, arrayKey, template) => {
            const arrayData = data[arrayKey];
            if (Array.isArray(arrayData)) {
                return arrayData.map(item => {
                    // Replace keywords within the loop block using the current array item.
                    return template.replace(new RegExp(`\\${this.prefix}(\\w+)`, "g"), (m: any, innerKey: string) => {
                        return innerKey in item ? item[innerKey] : m;
                    });
                }).join('');
            }
            // If the data for arrayKey is not an array, return the original block.
            return match;
        });

        // Process simple keyword replacements.
        const simpleRegex = new RegExp(`\\${this.prefix}(\\w+)`, "g");
        this.html = this.html.replace(simpleRegex, (match, keyword) => {
            // Only replace if the value exists and is not an array (to avoid overwriting for-loops).
            if (keyword in data && !Array.isArray(data[keyword])) {
                return data[keyword];
            }
            return match;
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