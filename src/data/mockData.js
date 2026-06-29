export const proveedores = [
  { id: 1, nombre: 'PROVEEDOR AGRICOLA S.A.', ruc: '0991234567001', direccion: 'VIA A LA COSTA KM 14' },
  { id: 2, nombre: 'MAQUINARIAS PESADAS CIA LTDA', ruc: '0997654321001', direccion: 'AV. JUAN TANCA MARENGO' },
]

export const labores = [
  { rubroId: 'MAQ', rubroNombre: 'Maquinaria', laborId: '104', laborNombre: 'ALQUILER MINIEXCAVADORA LABOR TRINCHADO', metrica: 'Hora' },
  { rubroId: 'MAQ', rubroNombre: 'Maquinaria', laborId: '109', laborNombre: 'ALQUILER EXCAVADORA BRAZO LARGO LABOR LIMPIEZA CANALES', metrica: 'Hora' },
  { rubroId: 'MOC', rubroNombre: 'Mano de Obra Contratada', laborId: '101', laborNombre: 'APLICACION DE FERTILIZANTE', metrica: 'Jornal' },
  { rubroId: 'MOC', rubroNombre: 'Mano de Obra Contratada', laborId: '201', laborNombre: 'COSECHA', metrica: 'Jornal' },
  { rubroId: 'MOC', rubroNombre: 'Mano de Obra Contratada', laborId: '111', laborNombre: 'APLICACION DE FUNGICIDA CON MOTOBOMBA', metrica: 'Jornal' },
  { rubroId: 'SER', rubroNombre: 'Servicios', laborId: '402', laborNombre: 'SERVICIO SEGURIDAD PRIVADA', metrica: 'Día' },
  { rubroId: 'SER', rubroNombre: 'Servicios', laborId: '201', laborNombre: 'TRANSPORTE PERSONAL CAMPO', metrica: 'Viaje' },
]

export const rubros = [
  { id: 'MOC', nombre: 'MANO DE OBRA CONTRATADA' },
  { id: 'SER', nombre: 'SERVICIO' },
  { id: 'MAQ', nombre: 'MAQUINARIAS' },
  { id: 'MAT', nombre: 'MATERIALES' },
]
