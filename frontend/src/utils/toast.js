/**
 * Dispatch a custom event to show a toast notification.
 * @param {string} message - The message to display.
 */
export const showToast = (message) => {
  window.dispatchEvent(new CustomEvent('show_toast', { detail: { message } }));
};
