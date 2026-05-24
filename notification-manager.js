/**
 * Neural Link Notification System
 * Handles scheduling and triggering of technical protocol alerts.
 */

const NotificationManager = {
    checkInterval: null,

    init() {
        console.log("Initializing Neural Notification System...");
        this.requestPermission();
        this.startMonitoring();
    },

    async requestPermission() {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
            return;
        }

        if (Notification.permission === "default") {
            await Notification.requestPermission();
        }
    },

    startMonitoring() {
        // Check every 60 seconds
        if (this.checkInterval) clearInterval(this.checkInterval);

        this.checkInterval = setInterval(() => this.checkSchedules(), 60000);
        this.checkSchedules(); // Initial check
    },

    checkSchedules() {
        const storedPlan = localStorage.getItem('active_boxing_plan_v2');
        if (!storedPlan) return;

        const plan = JSON.parse(storedPlan);
        const today = new Date();
        const dateStr = today.getDate().toString();

        // Find today's day in the plan
        const todayPlan = plan.days.find(d => d.date === dateStr || d.day_name.toUpperCase() === today.toLocaleString('en-us', { weekday: 'short' }).toUpperCase());

        if (!todayPlan || !todayPlan.protocol) return;

        todayPlan.protocol.forEach((session, index) => {
            if (this.isTimeToNotify(session.time)) {
                this.triggerNotification(session, index);
            }
        });
    },

    isTimeToNotify(timeStr) {
        // timeStr format: "06:00 AM"
        const now = new Date();
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');

        hours = parseInt(hours);
        minutes = parseInt(minutes);

        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        // Check if current hour and minute match
        // We also check if we already notified for this exact minute today
        const notificationKey = `notified_${new Date().toDateString()}_${timeStr}`;
        if (localStorage.getItem(notificationKey)) return false;

        if (now.getHours() === hours && now.getMinutes() === minutes) {
            localStorage.setItem(notificationKey, 'true');
            return true;
        }

        return false;
    },

    triggerNotification(session, index) {
        const title = "STRATEGIC UPLINK: " + session.title;
        const options = {
            body: `Focus: ${session.impact}\nDuration: ${session.duration}\nInitiate protocol now.`,
            icon: '/favicon.ico', // Fallback icon path
            badge: '/favicon.ico',
            vibrate: [200, 100, 200],
            tag: 'boxing-drill-' + index,
            requireInteraction: true
        };

        if (Notification.permission === "granted") {
            new Notification(title, options);

            // Play a synthetic sound if AudioEngine is available
            if (window.AudioEngine) {
                window.AudioEngine.playClick();
                setTimeout(() => window.AudioEngine.playClick(), 200);
            }
        } else {
            console.log("Notification: " + title);
            alert(title + "\n" + options.body);
        }
    }
};

// Auto-init 
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => NotificationManager.init());
} else {
    NotificationManager.init();
}
