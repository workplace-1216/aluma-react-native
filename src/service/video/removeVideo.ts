import axiosInstance from "../axiosInstance";

export const removeVideo = async (videoId: string) => {
  // Codifica o parâmetro para não “quebrar” a rota quando for uma URL
  const encoded = encodeURIComponent(videoId);
  const response = await axiosInstance.delete(`/user-video/${encoded}`);
  return response.data; // { success, message, data }
};