import * as ReactDOM from 'react-dom/client';
import { ViewProvider } from './context/viewProvider'
import { Layout } from './layout'

const App = () => {
  return (
    <ViewProvider>
      <Layout />
    </ViewProvider>
  )
};

function render() {
  const root = ReactDOM.createRoot(document.getElementById("app"));
  root.render(<App />);
}

render();
