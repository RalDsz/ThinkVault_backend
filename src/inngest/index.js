import User from "../models/User.js";
import { Inngest } from "inngest";

// Initialize Inngest
export const inngest = new Inngest({ id: "thinkvault" });

// ✅ Create user in DB on Clerk user creation
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image: image_url,
    };

    await User.create(userData);
  }
);

// ✅ Delete user in DB on Clerk user deletion
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

// ✅ Update user in DB on Clerk user update
const syncUserUpdate = inngest.createFunction(
  { id: "update-user-with-clerk" }, // ❗️Corrected ID
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const updatedUserData = {
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image: image_url,
    };

    await User.findByIdAndUpdate(id, updatedUserData, { new: true });
  }
);

// ✅ Export all webhook sync functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate];
