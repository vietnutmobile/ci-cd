export const createCurlMiddleware = () => (store) => (next) => (action) => {
  // const endpointName = JSON.stringify(action, null, 2);
  // console.log('endpointName', endpointName);
  //
  // if (rootApi.endpoints[endpointName]?.matchPending(action)) {
  //   console.log('action', action);
  //   const { method, url, headers, body } = action?.meta?.arg?.originalArgs ?? {};
  //   const curlCommand = generateCurlCommand(method, url, headers, body);
  //   console.log('curlCommand', curlCommand);
  // }

  return next(action);
};

const generateCurlCommand = (method, url, headers, body) => {
  let curl = `curl -X ${method.toUpperCase()} "${url}"`;

  for (const [key, value] of Object.entries(headers)) {
    curl += ` -H "${key}: ${value}"`;
  }

  if (body) {
    curl += ` -d '${JSON.stringify(body)}'`;
  }

  return curl;
};
