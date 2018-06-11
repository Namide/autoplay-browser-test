autoplayVideoMuttedAllowed = null
autoplayVideoUnmuttedAllowed = null

/**
 * Remove the video
 * 
 * @param {HTMLMediaElement} video      Video element
 */
const removeVideo = video =>
{
    video.pause()
    video.src = ''
    video.remove()
}

/**
 * Test if the browser support autoplay for this video.
 * 
 * @example
 * autoplaySupport('BigBuckBunny_320x180.mp4', true)
 *    .then(isSupported => console.log('Autoplay supported:', isSupported))
 *    .catch(message => console.error('Autoplay test error:', message))
 * 
 * @param {String} videoSrc     Video path
 * @param {Boolean} muted       Test for muted video (optional, default false)
 * @return {Promise}            Information about autoplay support
 */
const autoplaySupport = (videoSrc, muted = false) =>
{
    const executor = (resolve, reject) =>
    {
        if (muted && typeof(autoplayVideoMuttedAllowed) === typeof(true)) {
            resolve(AutoPlay.supported)
        } else if (!muted && typeof(autoplayVideoUnmuttedAllowed) === typeof(true)) {
            resolve(AutoPlay.supported)
        } else {
            // Create video element
            const video = document.createElement('video')
            video.autoplay = true
            video.loop = true
            video.muted = muted
            video.playsinline = true
            video.src = videoSrc
            const onError = event => 
            {
                video.removeEventListener('error', onError, true)
                removeVideo(video)
                reject('Video load error')
            }
            video.addEventListener('error', onError, true)
            document.body.appendChild(video)

            // Test video element
            const playPromise = video.play()
            if (playPromise !== undefined)
            {
                playPromise
                    .then(() =>
                    {
                        if (muted) {
                            autoplayVideoMuttedAllowed = true
                        } else {
                            autoplayVideoUnmuttedAllowed = true
                        }

                        resolve(true)
                        removeVideo(video)
                    })
                    .catch(() =>
                    {
                        if (muted) {
                            autoplayVideoMuttedAllowed = false
                        } else {
                            autoplayVideoUnmuttedAllowed = false
                        }

                        supported = false
                        removeVideo(video)
                        resolve(false)
                    })
            } else {
                if (muted) {
                    autoplayVideoMuttedAllowed = false
                } else {
                    autoplayVideoUnmuttedAllowed = false
                }

                supported = false
                removeVideo(video)
                resolve(false)
            }
        }
    }

    return new Promise(executor)
}

// Simple js include
window.autoplaySupport = autoplaySupport

// Es6 module import
// export default autoplaySupport