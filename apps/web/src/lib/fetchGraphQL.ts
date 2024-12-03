export async function fetchGraphQL<T>(
  query: string,
  variables = {}
): Promise<T> {
  const response = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    console.error("GraphQL Error:", await response.text());
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors) {
    console.error("GraphQL Errors:", json.errors);
    throw new Error(json.errors.map((e: Error) => e.message).join("\n"));
  }

  return json.data;
}
