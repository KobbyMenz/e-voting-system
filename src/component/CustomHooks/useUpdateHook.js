import axios from "axios";
import app_api_url from "../../../APP_API_URL";


const useUpdateHook = () => {
  const updateData = async (
    id,
    dataToUpdate,
    apiEndPointName,
    refreshTable,
    toastModal,
  ) => {
    try {
      const response = await axios.put(
        `${app_api_url}/${apiEndPointName}/${id}`,
        dataToUpdate,
      );

      refreshTable();
      toastModal("success", response.data.message);
    } catch (err) {
      if (err.response?.data?.error) {
        toastModal("error", err.response.data.error);
      } else {
        toastModal("error", "Process Failed");
      }
    }
  };

  return { updateData };
};

export default useUpdateHook;
