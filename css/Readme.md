This folder contains css files which are intended to be processed by postcss with openprops plugin. 
The best way for this right now (2023-03-05) is to ahve a postcss route handler in fresh routes which transform and memoize css files from this folder.

See this repo for the proof of concept: https://github.com/codemonument/openprops-in-fresh-poc