import useRouterElements from "./routes/useRouterElements";

function App() {
  // nơi chứa router
  const routerElement = useRouterElements();

  return <>{routerElement}</>;
}

export default App;
