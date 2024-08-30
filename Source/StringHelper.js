
class StringHelper
{
	constructor()
	{
		var asciiCharAndUnicodeVariantsArray =
		[
			[ "A", "Á À Â Ā Ä" ],
			[ "E", "É È Ê Ē Ë" ],
			[ "I", "Í Ì Î Ī Ï" ],
			[ "O", "Ó Ò Ô Ō Ö" ],
			[ "U", "Ú Ù Û Ū Ü" ],

			[ "a", "á à	â ā ä" ],
			[ "e", "é è	ê ē ë" ],
			[ "i", "í ì	î ī ï" ],
			[ "o", "ó ò	ô ō ö" ],
			[ "u", "ú ù	û ū ü" ],
		];

		var asciiCharsByUnicodeVariant = new Map();

		for (var i = 0; i < asciiCharAndUnicodeVariantsArray.length; i++)
		{
			var asciiCharAndUnicodeVariants =
				asciiCharAndUnicodeVariantsArray[i];
			var asciiChar = asciiCharAndUnicodeVariants[0];
			var unicodeVariantsAsString = asciiCharAndUnicodeVariants[1];
			var unicodeVariants = unicodeVariantsAsString.split(" ");
			for (var v = 0; v < unicodeVariants.length; v++)
			{
				var unicodeVariant = unicodeVariants[v];
				asciiCharsByUnicodeVariant.set(unicodeVariant, asciiChar);
			}
		}

		this.asciiCharsByUnicodeVariant = asciiCharsByUnicodeVariant;
	}

	static Instance()
	{
		if (this._instance == null)
		{
			this._instance = new StringHelper();
		}
		return this._instance;
	}

	unicodeStringConvertToAscii(stringToConvert)
	{
		var stringConverted =
			stringToConvert
				.split("")
				.map
				(
					x =>
						this.asciiCharsByUnicodeVariant.has(x)
						? this.asciiCharsByUnicodeVariant.get(x)
						: x
				)
				.join("");

		var stringConvertedHasNonAsciiCharCodes =
			stringConverted.split("").some(x => x.charCodeAt(0) > 127);

		if (stringConvertedHasNonAsciiCharCodes)
		{
			stringConverted =
				stringConverted
					.split("")
					.filter(x => x.charCodeAt(0) <= 127)
					.join("");
		}

		return stringConverted;
	}
}
