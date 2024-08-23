Text Blocks to Files Splitter
=============================

Takes a passage of text as input, splits it into blocks separated
by any number of blank lines (or other delimiters), and attempts
to save each of those blocks as an entry in a .TAR archive file.
If so specified, each block may also be downloaded as an individual file,
though if there are very many blocks, the load may become inpractical.

<img src="Screenshot.png" />


Running
-------

This repository makes use of the thiscouldbebetter/TarFileExplorer repository
as a Git submodule, so in order to run TextBlocksToFileSplitter,
it will be necessary to clone the repository with the --recursive switch
on the command line, or, if it's already been cloned without the submodule,
by running "git submodule update --init ." from within the TarFileExplorer
directory.