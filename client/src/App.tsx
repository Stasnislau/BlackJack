import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import HighOrderComponent from "./components/hoc"
import { useContext, } from "react"
import { GamePage, ErrorPage } from "./pages"
import { Context } from "./main"

const availableRoutes = [
  {
    path: '/',
    component: GamePage,
  },
]

function App() {
  const store = useContext(Context);

  return (
    <BrowserRouter>
      <div className="App">
        <HighOrderComponent>
          <Routes>
            {availableRoutes.map(({ path, component: Component }) =>

              <Route key={path} path={path} element={<Component />} />
            )
            }
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </HighOrderComponent>
      </div>
    </BrowserRouter>
  );

}

export default App