import { v4 as uuidv4 } from 'uuid';

const GUEST_ID_KEY = 'women_street_guest_id';

// Generate or retrieve guest ID
export const getGuestId = () => {
  let guestId = localStorage.getItem(GUEST_ID_KEY);
  
  if (!guestId) {
    // Generate new UUID for new visitor
    guestId = uuidv4();
    localStorage.setItem(GUEST_ID_KEY, guestId);
    console.log('🆔 New guest ID generated:', guestId);
  } else {
    console.log('🔄 Existing guest ID found:', guestId);
  }
  
  return guestId;
};

// Clear guest ID (useful for testing or cart reset)
export const clearGuestId = () => {
  localStorage.removeItem(GUEST_ID_KEY);
  console.log('🗑️ Guest ID cleared');
};

// Check if guest ID exists
export const hasGuestId = () => {
  return !!localStorage.getItem(GUEST_ID_KEY);
};
