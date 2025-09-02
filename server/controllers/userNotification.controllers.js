// export function getNotifications() {
//   let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
//   const now = new Date().getTime();

//   // Filter expired
//   notifications = notifications.filter(n => now < n.expiry);

//   // Update storage (remove expired)
//   localStorage.setItem("notifications", JSON.stringify(notifications));


//   notifications = JSON.parse(localStorage.getItem("notifications")) || [];
//   return notifications;
// }