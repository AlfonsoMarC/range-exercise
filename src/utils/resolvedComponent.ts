export async function resolvedComponent(Component: () => Promise<JSX.Element>) {
  const ComponentResolved = await Component();
  return () => ComponentResolved;
}
