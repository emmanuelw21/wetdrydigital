/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
 */

// You can delete this file if you're not using it
import './src/styles/global.css'

export const onClientEntry = () => {
  if (typeof window !== 'undefined') {
    // Prevent mobile browsers from handling touch events in unintended ways
    document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    // Remove any existing service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister();
        }
      });
    }
  }
}