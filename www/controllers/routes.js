const local_server = "https://localhost:44389/api/"
const public_server = "https://vaelsaki.bsite.net/api/"

const env = local_server

//Reportes API
const InsertarReporte_route = env + "reportes/insertareporte"
const ActualizarReporte_route = env + "reportes/actualizareporte/"
const ObtenerReportes_route = env + "Reportes"
const ObtenerReporte = env + "Reportes/"
const EliminarReporte_route = env + "Reportes/"


//Marcas API
const InsertarMarca_route = env + "Marcas/InsertarMarca"
const ObtenerMarcas_route = env + "Marcas"
const ObtenerMarca_route = env + "Marcas/"
const ModificarMarca_route = env + "Marcas/"
const EliminarMarca_route = env + "Marcas/"


//Materiales API
const ObtenerDicaB_route = env + "Materiales/DicaB"
const ObtenerDicaA_route = env + "Materiales/DicaA"
const EditarMaterial_route = env + "Materiales/EditarMaterial/"
const InsertarMaterial_route = env + "Materiales/InsertarMaterial"
const Delete_Material_route = env + "Materiales/"
const ObtenerMateriales_route = env + "Materiales"


//Usuarios API
const allUsuarios_route = env + "Usuarios"
const buscarUsuario_route = env + "Usuarios/"
const agregarUsuario_route = env + "usuarios/InsertarUsuario"
const agregarUsuarioEG_route = env + "usuarios/InsertarUsuarioEG"
const agregarUsuarioMI_route = env + "usuarios/InsertarUsuarioMI"
const agregarUsuarioMC_route = env + "usuarios/InsertarUsuarioMC"
const eliminarUsuario_route = env + "Usuarios/"
const enviarUsuario_route = env + "Usuarios"
const EditarUsuario_route = env + "usuarios/EditarUsuario/"

//Avisos API
const ObtenerAvisos_route = env + "getavisos"
const EnviarAviso_route = env + "postaviso"
const EditarAviso_route = env + "avisos/Editaraviso/"
const EliminarAviso_route = env + "avisos/Eliminaraviso/"
const ObtenerAviso_route = env + "getavisos/"


//Departamentos API
const EditarDepartamento_route = env + "departamentoes/Editardepartamento/"
const InsertarDpto_route = env + "departamentoes/InsertarDpto"
const ObtenerDptos_route = env + "Departamentoes"
const ObtenerDpto_route = env + "Departamentoes/"
const EliminarDpto_route = env + "Departamentoes/"


//Actualizaciones API
const EditarActualizaciones_route = env + "Actualizaciones/"
const InsertarActualizacion_route = env + "actualizaciones/InsertarActualizacion"
const ObtenerActualizaciones_route = env + "Actualizaciones"
const ObtenerActualizacion_route = env + "Actualizaciones/"
const EliminarActualizacion_route = env + "Actualizaciones/"


//Estados API
const InsertarEstado_route = env + "estadoes/InsertarEstado"
const ObtenerEstados_route = env + "Estadoes"
const ObtenerEstado_route = env + "Estadoes/"
const ActualizarEstado_route = env + "Estadoes/"
const EliminarEstado_route = env + "Estadoes/"


//Areas API
const EditarArea_route = env + "Areas/EditarArea/"
const InsertarArea_route = env + "areas/InsertarArea"
const ObtenerAreas = env + "Areas"
const ObtenerArea_route = env + "Areas/"
const EliminarArea_route = env + "Areas/"


//Sol_materiales API
const VerSolicitud_route = env + "Sol_materiales/SeleccionarSolMateriales"
const MarcarComoEntregado_route = env + "Sol_materiales/MarcarComoEntregado/"
const InsertarSolicitud_route = env + "Sol_materiales/InsertarSolicitud"
const EliminarSolicitud_route = env + "Sol_materiales/"


//Grupos API
const InsertarGrupo_route = env + "grupos/InsertarGrupo"
const ObtenerGrupos_route = env + "Grupos"
const ObtenerGrupo_route = env + "Grupos/"
const EditarGrupo_route = env + "Grupos/"
const Eliminargrupo_route = env + "Grupos/"


//Tipos API
const ObtenerTipos_route = env + "Tipos"
const ObtenerTipo_route = env + "Tipos/"
const EditarTipos_route = env + "Tipos/"
const EnviarTipos_route = env + "Tipos"
const EliminarTipo_route = env + "Tipos/"


//Imagenes API
const ObtenerImagenes_route = env + "imagenes"
const ObtenerImagen_route = env + "imagenes/"
const EditarImagen_route = env + "imagenes/"
const EnviarImagen_route = env + "imagenes"
const EliminarImagen_route = env + "imagenes/"