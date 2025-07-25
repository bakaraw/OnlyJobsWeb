//import Echo from 'laravel-echo';
//
//import Pusher from 'pusher-js';
//window.Pusher = Pusher;
//
////window.Echo = new Echo({
////    broadcaster: 'reverb',
////    key: import.meta.env.VITE_REVERB_APP_KEY,
////    wsHost: import.meta.env.VITE_REVERB_HOST,
////    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
////    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
////    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
////    enabledTransports: ['ws', 'wss'],
////});
//
//window.Echo = new Echo({
//    broadcaster: 'pusher',
//    key: import.meta.env.VITE_PUSHER_APP_KEY,
//    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
//    forceTLS: true,
//});

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    encrypted: true,
    forceTLS: true,
    authEndpoint: '/broadcasting/auth',
    auth: {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    }
});

