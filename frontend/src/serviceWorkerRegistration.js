// Registro del Service Worker para funcionalidad offline

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          // En desarrollo, siempre actualizar
          if (process.env.NODE_ENV === 'development') {
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker == null) {
                return;
              }

              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('Nuevo contenido disponible; por favor actualiza.');
                  } else {
                    console.log('Contenido cacheado para uso offline.');
                  }
                }
              };
            };
          } else {
            // En producción, manejar actualizaciones
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker == null) {
                return;
              }

              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // Hay una nueva versión disponible
                    console.log('Nueva versión disponible');
                    // Aquí podrías mostrar una notificación al usuario
                  } else {
                    console.log('Aplicación cacheada para uso offline');
                  }
                }
              };
            };
          }
        })
        .catch((error) => {
          console.error('Error durante el registro del Service Worker:', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
