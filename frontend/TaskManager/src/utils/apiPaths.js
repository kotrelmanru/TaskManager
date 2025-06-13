export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    GET_USER_INFO: "/api/v1/auth/getUser",
  },
  // === New Tasks Endpoints ===
  TASKS: {
    GET_ALL: "/api/v1/tasks",
    CREATE: "/api/v1/tasks",
    PATCH: (id) => `/api/v1/tasks/${id}`,
    UPDATE: (id) => `/api/v1/tasks/${id}`,
    DELETE: (id) => `/api/v1/tasks/${id}`,
    INVITE: (id) => `/api/v1/tasks/${id}/invite`,
    GET_ONE: (id) => `/api/v1/tasks/${id}`,
  }
};