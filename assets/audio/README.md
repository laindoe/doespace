# Audio

`love-language.mp3` is the temporary test track for the profile media player.
It is referenced from `_data/modules.yml` (`now_playing.audio`) and resolved
through Jekyll's `relative_url`, so it loads correctly under `/doespace`.

To swap in the final recording, drop the file here and update
`now_playing.audio`, `title`, and `artist` in `_data/modules.yml`. No player
or stylesheet changes are needed.
