const SubtitleDownloader = require('./js/modules/subtitle_downloader.js')

const downloader = new SubtitleDownloader('/Users/bertrand/Downloads/Vice.Principals.S01E09.720p.HDTV.x264-KILLERS[eztv].mkv')
downloader.saveAs('/Users/bertrand/Downloads/Vice.Principals.S01E09.720p.HDTV.x264-KILLERS[eztv].srt')
