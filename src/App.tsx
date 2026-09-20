import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Layout } from "./components/Layout"
import { AiPage } from "./pages/AiPage"
import { BibliotecaPage } from "./pages/BibliotecaPage"
import { ChallengePage } from "./pages/ChallengePage"
import { ChallengesPage } from "./pages/ChallengesPage"
import { HomePage } from "./pages/HomePage"
import { MindMapPage } from "./pages/MindMapPage"
import { PlatformPage } from "./pages/PlatformPage"
import { RoadmapPage } from "./pages/RoadmapPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "plataforma", element: <PlatformPage /> },
      { path: "mental", element: <MindMapPage /> },
      { path: "roadmap", element: <RoadmapPage /> },
      { path: "desafios", element: <ChallengesPage /> },
      { path: "desafios/:id", element: <ChallengePage /> },
      { path: "ia", element: <AiPage /> },
      { path: "biblioteca", element: <BibliotecaPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
