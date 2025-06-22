import { Inngest } from 'inngest';
import User from '../models/user.js';

// Initialize Inngest instance (not exported unless needed)
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest function to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        _id: id,
        email: email_addresses?.[0]?.email_address ?? null,
        name: `${first_name} ${last_name}`,
        image: image_url,
      };
      await User.create(userData);
      console.log(`User created: ${userData.email}`);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }
);

// Inngest function to delete user from database
const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-with-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    try {
      const { id } = event.data;
      await User.findByIdAndDelete(id);
      console.log(`User deleted: ${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
);

// Inngest function to update user data in database
const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        email: email_addresses?.[0]?.email_address ?? null,
        name: `${first_name} ${last_name}`,
        image: image_url,
      };
      await User.findByIdAndUpdate(id, userData);
      console.log(`User updated: ${userData.email}`);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }
);

// Export all Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];
