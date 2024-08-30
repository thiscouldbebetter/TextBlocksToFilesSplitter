
class UiEventHandler
{
	static buttonSplit_Clicked()
	{
		var d = document;
		var textareaTextToSplit =
			d.getElementById("textareaTextToSplit");
		var textToSplit = textareaTextToSplit.value;

		var inputBlockDelimiter =
			d.getElementById("inputBlockDelimiter");
		var blockDelimiter = inputBlockDelimiter.value;

		var textareaTitleDelimiters =
			d.getElementById("textareaTitleDelimiters");
		var titleDelimitersAsString = textareaTitleDelimiters.value;
		var newline = "\n";
		var titleDelimiters = titleDelimitersAsString.split(newline);

		var charPairsEscapedAndUnescaped =
		[
			[ "\\n", "\n" ],
			[ "\\r", "\r" ],
			[ "\\t", "\t" ]
		];

		for (var i = 0; i < charPairsEscapedAndUnescaped.length; i++)
		{
			var charPair =
				charPairsEscapedAndUnescaped[i];

			var charEscaped = charPair[0];
			var charUnescaped = charPair[1];

			blockDelimiter =
				blockDelimiter
					.split(charEscaped).join(charUnescaped);

			titleDelimiters =
				titleDelimiters.map
				(
					x => x.split(charEscaped).join(charUnescaped)
				);
		}

		var textBlocks = textToSplit.split(blockDelimiter);

		var inputFileNamePrefix =
			d.getElementById("inputFileNamePrefix");

		var fileNamePrefix = inputFileNamePrefix.value || "Blocks_";

		var checkboxBlockFileNamesShouldBePrefixedWithNumber =
			d.getElementById("checkboxBlockFileNamesShouldBePrefixedWithNumber");

		var blockNumberShouldBeIncludedInFileName =
			checkboxBlockFileNamesShouldBePrefixedWithNumber.checked;

		var checkboxConsolidateIntoSingleTarFile =
			d.getElementById("checkboxConsolidateIntoSingleTarFile");

		var blocksShouldBeDownloadedAsTarFileNotIndividually =
			checkboxConsolidateIntoSingleTarFile.checked;

		var textBlockFiles = TextBlockFile.fromTextBlocks
		(
			fileNamePrefix,
			titleDelimiters,
			blocksShouldBeDownloadedAsTarFileNotIndividually,
			blockNumberShouldBeIncludedInFileName,
			textBlocks
		);

		var textBlocksAsDownloadLinks =
			textBlockFiles.map(x => x.toLink() );

		// todo
		// Might need to space these out, because
		// only a certain number of files can be downloaded at once.
		textBlocksAsDownloadLinks.forEach(x => x.click() );
	}

	static buttonTextToSplitClear_Clicked()
	{
		var d = document;
		var textareaTextToSplit =
			d.getElementById("textareaTextToSplit");
		textareaTextToSplit.value = "";
	}

	static buttonTextToSplitLoadDemo_Clicked()
	{
		var d = document;
		var textareaTextToSplit =
			d.getElementById("textareaTextToSplit");

		var textDemoAsLines =
		[
			"This is the first block.",
			"",
			"This is the second block.",
			"It has two lines.",
			"",
			"This is the third block.",
			"It has three lines.",
			"Each block is delimited by a blank line.",
			"",
			"This is the fourth and final block."
		];
		
		var newline = "\n";
		var textDemo = textDemoAsLines.join(newline);

		textareaTextToSplit.value = textDemo;
	}

	static inputFile_Changed(inputFile)
	{
		var file = inputFile.files[0];
		if (file != null)
		{
			var fileReader = new FileReader();
			fileReader.onload = (event) =>
			{
				var fileText = event.target.result;
				var d = document;
				var textareaTextToSplit =
					d.getElementById("textareaTextToSplit");
				textareaTextToSplit.value = fileText;
				
				var inputFileNamePrefix =
					d.getElementById("inputFileNamePrefix");
				inputFileNamePrefix.value = file.name.split(".")[0];
			};
			fileReader.readAsText(file);
		}
	}
}
