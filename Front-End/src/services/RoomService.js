import axios from "../config/AxiosHelper.jsx";

export const findOrCreateRoom = async (email) => {
  try {
    const response = await axios.post("/chat/find-or-create-room", { email });
    return response.data; // Expected to return { roomId: "roomId123" }
  } catch (error) {
    console.error("Error finding or creating room:", error);
    throw error;
  }
};

export const getMessages = async (roomId) => {
  try {
    const response = await axios.get(`/chat/messages/${roomId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};
