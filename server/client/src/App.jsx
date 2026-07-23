import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Comunicados from "./pages/Comunicados";
import Calendario from "./pages/Calendario";
import Fotos from "./pages/Fotos";
import MiHijo from "./pages/MiHijo";
import Tesoreria from "./pages/Tesoreria";
import Comunidad from "./pages/Comunidad";
import Mas from "./pages/Mas";
import Documentos from "./pages/Documentos";
import Votaciones from "./pages/Votaciones";
import Marketplace from "./pages/Marketplace";
import Perfil from "./pages/Perfil";
import Notificaciones from "./pages/Notificaciones";

import Admin from "./pages/Admin";
import Familias from "./pages/Familias";
import FamiliaDetalle from "./pages/FamiliaDetalle";
import NinoDetalle from "./pages/NinoDetalle";
import CrearComunicado from "./pages/CrearComunicado";
import SubirFoto from "./pages/SubirFoto";
import CrearEvento from "./pages/CrearEvento";
import AsignarDirectiva from "./pages/AsignarDirectiva";
import CrearVotacion from "./pages/CrearVotacion";
import RegistrarMovimiento from "./pages/RegistrarMovimiento";

function PrivatePage({ children, requiredRole }) {
  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<PrivatePage><Home /></PrivatePage>} />
        <Route path="/comunicados" element={<PrivatePage><Comunicados /></PrivatePage>} />
        <Route path="/calendario" element={<PrivatePage><Calendario /></PrivatePage>} />
        <Route path="/fotos" element={<PrivatePage><Fotos /></PrivatePage>} />
        <Route path="/mi-hijo" element={<PrivatePage><MiHijo /></PrivatePage>} />
        <Route path="/tesoreria" element={<PrivatePage><Tesoreria /></PrivatePage>} />
        <Route path="/comunidad" element={<PrivatePage><Comunidad /></PrivatePage>} />
        <Route path="/mas" element={<PrivatePage><Mas /></PrivatePage>} />
        <Route path="/documentos" element={<PrivatePage><Documentos /></PrivatePage>} />
        <Route path="/votaciones" element={<PrivatePage><Votaciones /></PrivatePage>} />
        <Route path="/marketplace" element={<PrivatePage><Marketplace /></PrivatePage>} />
        <Route path="/perfil" element={<PrivatePage><Perfil /></PrivatePage>} />
        <Route path="/notificaciones" element={<PrivatePage><Notificaciones /></PrivatePage>} />

        <Route path="/admin" element={<PrivatePage requiredRole="educadora"><Admin /></PrivatePage>} />
        <Route path="/familias" element={<PrivatePage requiredRole="educadora"><Familias /></PrivatePage>} />
        <Route path="/familia/:id" element={<PrivatePage requiredRole="educadora"><FamiliaDetalle /></PrivatePage>} />
        <Route path="/nino/:id" element={<PrivatePage requiredRole="educadora"><NinoDetalle /></PrivatePage>} />
        <Route path="/admin/comunicado" element={<PrivatePage requiredRole="educadora"><CrearComunicado /></PrivatePage>} />
        <Route path="/admin/foto" element={<PrivatePage requiredRole="educadora"><SubirFoto /></PrivatePage>} />
        <Route path="/admin/evento" element={<PrivatePage requiredRole="educadora"><CrearEvento /></PrivatePage>} />
        <Route path="/admin/directiva" element={<PrivatePage requiredRole="educadora"><AsignarDirectiva /></PrivatePage>} />
        <Route path="/admin/votacion" element={<PrivatePage requiredRole="educadora"><CrearVotacion /></PrivatePage>} />
        <Route path="/tesoreria/nuevo" element={<PrivatePage><RegistrarMovimiento /></PrivatePage>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;