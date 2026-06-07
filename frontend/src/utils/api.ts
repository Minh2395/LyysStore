import queryString from "query-string";

export interface IRequest {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  queryParams?: Record<string, any>;
  useCredentials?: boolean;
  headers?: Record<string, string>;
  nextOption?: RequestInit;
}

// ======================
// JSON REQUEST
// ======================
export const sendRequest = async <T>(props: IRequest): Promise<T> => {
  let {
    url,
    method,
    body,
    queryParams = {},
    useCredentials = false,
    headers = {},
    nextOption = {},
  } = props;

  // query params safe
  if (queryParams && Object.keys(queryParams).length > 0) {
    url += `?${queryString.stringify(queryParams)}`;
  }

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...nextOption,
  };

  // attach body safely
  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  if (useCredentials) {
    options.credentials = "include";
  }

  const res = await fetch(url, options);

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw {
      statusCode: res.status,
      message: data?.message || "Request failed",
      error: data?.error || "",
    };
  }

  return data as T;
};

// ======================
// FILE UPLOAD REQUEST
// ======================
export const sendRequestFile = async <T>(props: IRequest): Promise<T> => {
  let {
    url,
    method,
    body,
    queryParams = {},
    useCredentials = false,
    headers = {},
    nextOption = {},
  } = props;

  // query params safe
  if (queryParams && Object.keys(queryParams).length > 0) {
    url += `?${queryString.stringify(queryParams)}`;
  }

  const options: RequestInit = {
    method,
    headers: {
      ...headers,
    },
    ...nextOption,
  };

  if (body) {
    options.body = body;
  }

  if (useCredentials) {
    options.credentials = "include";
  }

  const res = await fetch(url, options);

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw {
      statusCode: res.status,
      message: data?.message || "Request failed",
      error: data?.error || "",
    };
  }

  return data as T;
};
