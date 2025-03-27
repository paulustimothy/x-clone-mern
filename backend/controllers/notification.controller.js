import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({to: userId})
        .populate({
            path: "from",
            select: "username profilePicture"
        });

        // update all notifications to read
        await Notification.updateMany({to:userId}, {read: true});

        res.status(200).json(notifications);

    } catch (error) {
        console.log("Error in getNotifications controller", error.message);
        return res.status(500).json({error: "Internal server error"});  
    }
}

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({to: userId});

        res.status(200).json({message: "Notifications deleted"});   

    } catch (error) {
        console.log("Error in deleteNotifications controller", error.message);
        return res.status(500).json({error: "Internal server error"});
    }
}

export const deleteNotification = async (req, res) => {
    try {
        // get notification id from params, params is from the route that is a object that contains the id
        const notificationId = req.params.id;
        const userId = req.user._id;
        const notification = await Notification.findById(notificationId);

        if(!notification) return res.status(404).json({error: "Notification not found"});

        // check if the notification is for the current user
        if(notification.to.toString() !== userId.toString()) return res.status(403).json({error: "Unauthorized"});

        await Notification.findByIdAndDelete(notificationId);

        res.status(200).json({message: "Notification deleted"});

    } catch (error) {
        console.log("Error in deleteNotification controller", error.message);
        return res.status(500).json({error: "Internal server error"});
    }
}
