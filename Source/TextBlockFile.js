class TextBlockFile
{
	constructor(fileName, dataAsUrl)
	{
		this.fileName = fileName;
		this.dataAsUrl = dataAsUrl;
	}

	static fromTextBlocks
	(
		fileNamePrefix,
		titleDelimiters,
		blocksShouldBeDownloadedAsTarFileNotIndividually,
		blockNumberShouldBeIncludedInFileName,
		textBlocks
	)
	{
		var textBlockCount = textBlocks.length;
		var textBlockNumberDigitCount =
			Math.ceil(Math.log(textBlockCount) / Math.log(10) );

		var blockTitleLengthMax = 64;

		var textBlockFiles = [];

		if (blocksShouldBeDownloadedAsTarFileNotIndividually)
		{
			var tfe = ThisCouldBeBetter.TarFileExplorer;
			var TarFile = tfe.TarFile;
			var TarFileEntry = tfe.TarFileEntry;

			var textBlockFileNames = [];
			var textBlockFileNamesLookup = new Map();

			var stringHelper = StringHelper.Instance();

			for (var i = 0; i < textBlocks.length; i++)
			{
				var textBlock = textBlocks[i];

				var blockTitle = textBlock;

				if (blockTitle.length > blockTitleLengthMax)
				{
					blockTitle = blockTitle.substr(0, blockTitleLengthMax);
				}

				var delimiterPosEarliestSoFar = blockTitle.length;

				for (var d = 0; d < titleDelimiters.length; d++)
				{
					var titleDelimiter = titleDelimiters[d];
					var titleDelimiterPos =
						blockTitle.indexOf(titleDelimiter);
					if
					(
						titleDelimiterPos >= 0
						&& titleDelimiterPos < delimiterPosEarliestSoFar
					)
					{
						delimiterPosEarliestSoFar = titleDelimiterPos
					}
				}

				blockTitle = blockTitle.substr(0, delimiterPosEarliestSoFar);

				blockTitle =
					blockTitle
						.split(" ").join("_")
						.split(".").join("")
						.split("\"").join("'");

				var blockNumberPrefix =
					blockNumberShouldBeIncludedInFileName
					? ("" + i).padStart(textBlockNumberDigitCount, "0") + "-"
					: "";
				var blockFileName =
					blockNumberPrefix + blockTitle + ".txt";
				blockFileName =
					stringHelper.unicodeStringConvertToAscii(blockFileName);

				var duplicateCount = 0;
				if (textBlockFileNamesLookup.has(blockFileName) )
				{
					var duplicateCount =
						textBlockFileNamesLookup.get(blockFileName);
					duplicateCount++;
					textBlockFileNamesLookup.set(blockFileName, duplicateCount);
					blockFileName =
						blockFileName.split(".txt")[0] + "-" + duplicateCount + ".txt";
				}
				else
				{
					textBlockFileNamesLookup.set(blockFileName, 1);
				}
				
				textBlockFileNames.push(blockFileName);
			}

			var textBlocksAsTarFileEntries =
				textBlocks.map
				(
					(textBlock, i) =>
					{
						var blockFileName = textBlockFileNames[i];
						var textBlockAsBytes =
							textBlock.split("").map(x => x.charCodeAt(0) );
						var textBlockAsTarFileEntry =
							TarFileEntry.fileNew(blockFileName, textBlockAsBytes);
						return textBlockAsTarFileEntry;
					}
				);

			var tarFileName = fileNamePrefix + ".tar";

			var textBlocksAsTarFile = new TarFile
			(
				tarFileName,
				textBlocksAsTarFileEntries
			);

			var tarFileAsBytes = textBlocksAsTarFile.toBytes();
			var tarFileAsArrayBuffer = new ArrayBuffer(tarFileAsBytes.length);
			var tarFileAsUIntArray = new Uint8Array(tarFileAsArrayBuffer);
			for (var i = 0; i < tarFileAsBytes.length; i++)
			{
				tarFileAsUIntArray[i] = tarFileAsBytes[i];
			}
			var tarFileAsBlob = new Blob
			(
				[ tarFileAsArrayBuffer ],
				{ type:"application/x-tar" }
			);

			var tarFileAsUrl =
				window.URL.createObjectURL(tarFileAsBlob);

			var tarFileAsTextBlockFile =
				new TextBlockFile(tarFileName, tarFileAsUrl);

			textBlockFiles.push(tarFileAsTextBlockFile);
		}
		else
		{
			for (var i = 0; i < textBlocks.length; i++)
			{
				var textBlock = textBlocks[i];
				var textBlockAsBlob =
					new Blob( [textBlock], { type: "text/plain" });
				var textBlockAsUrl =
					window.URL.createObjectURL(textBlockAsBlob);

				var textBlockTitle = textBlock.split(titleDelimiter)[0];
				textBlockTitle =
					textBlockTitle
						.split(" ").join("_")
						.split(".").join("");
				var blockNumberPrefix =
					blockNumberShouldBeIncludedInFileName
					? ("" + i).padStart(textBlockNumberDigitCount, "0") + "-"
					: "";
				var textBlockFileName =
					blockNumberPrefix + textBlockTitle + ".txt";

				var textBlockFile =
					new TextBlockFile(textBlockFileName, textBlockAsUrl);

				textBlockFiles.push(textBlockFile);
			}
		}

		return textBlockFiles;
	}

	toLink()
	{
		var link = document.createElement("a");
		link.download = this.fileName;
		link.href = this.dataAsUrl;
		return link;
	}
}
