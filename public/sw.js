self.addEventListener('install', () => {
    console.log("Hello...I am a service worker...I am getting installed");
})

import {registerRoute} from 'workbox-routing'
import {CacheableResponsePlugin} from 'workbox-cacheable-response';
import {
    CacheFirst,
} from 'workbox-strategies';

import {ExpirationPlugin} from 'workbox-expiration';
import {precacheAndRoute} from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
    ({request}) => 
    request.destination === "style" ||
    request.destination === "script",
    new CacheFirst({
        cacheName:'assets',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [200]
            }),
            new ExpirationPlugin({
                maxEntries:50,
                maxAgeSeconds: 60*60*24
            })   
        ]
    })
)

registerRoute(
    ({request}) => request.destination === 'image',
    new CacheFirst({
        cacheName:'picture',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [200]
            }),
            new ExpirationPlugin({
                maxEntries:5,
                maxAgeSeconds: 10*60*24
            })   
        ]
    })
)