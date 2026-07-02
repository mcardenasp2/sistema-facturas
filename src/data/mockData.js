export const proveedores = [
  { id: 1, nombre: 'PROVEEDOR AGRICOLA S.A.', ruc: '0991234567001', direccion: 'VIA A LA COSTA KM 14' },
  { id: 2, nombre: 'MAQUINARIAS PESADAS CIA LTDA', ruc: '0997654321001', direccion: 'AV. JUAN TANCA MARENGO' },
];

export const fincas = [
  { id: 1, nombre: 'FINCA A - SECTOR NORTE', codigo: 'F001' },
  { id: 2, nombre: 'FINCA B - SECTOR SUR', codigo: 'F002' },
];

export const cuentasContables = {
  "MAQ": {
    cuenta: "5.01.04.08.006",
    descripcion: "Alquiler de Equipos y Maquinarias"
  },
  "MOC": {
    cuenta: "5.01.01.02.004",
    descripcion: "Servicios Contratistas"
  },
  "SER": {
    cuenta: "5.01.01.02.005",
    descripcion: "Servicios Varios"
  }
};

/**
 * Maestro de Rubros y Labores estructurado de forma jerárquica.
 * Esta estructura facilita la lógica de cascada: Rubro -> Labor -> Detalle.
 */
export const maestroRubros = [
  {
    codigo: "MAQ",
    nombre: "Maquinaria",
    labores: [
      {
        id: "104",
        nombre: "OPA",
        detalles: [
          { nombre: "ALQUILER MINIEXCAVADORA LABOR TRINCHADO", metrica: "Hora" }
        ]
      },
      {
        id: "109",
        nombre: "CANALES",
        detalles: [
          { nombre: "ALQUILER MINIEXCAVADORA LABOR REGANDO TIERRA", metrica: "Hora" },
          { nombre: "ALQUILER EXCAVADORA BRAZO LARGO LABOR LIMPIEZA CANALES", metrica: "Hora" },
          { nombre: "ALQUILER EXCAVADORA LABOR LIMPIEZA CANALES PRIMARIOS", metrica: "Hora" },
          { nombre: "ALQUILER EXCAVADORA LABOR CANALES SECUNDARIOS", metrica: "Hora" },
          { nombre: "ALQUILER MINIEXCAVADORA LABOR CANALES TERCIARIOS", metrica: "Hora" }
        ]
      },
      {
        id: "401MG",
        nombre: "ADM FINCA MANT GENERAL",
        detalles: [
          { nombre: "ALQUILER DE EXCAVADORA LABOR ARREGLO DE VIAS", metrica: "Hora" },
          { nombre: "ALQUILER DE EXCAVADORA LABOR ARREGLO DE MUROS", metrica: "Hora" }
        ]
      },
      {
        id: "150",
        nombre: "SIEMBRA",
        detalles: [
          { nombre: "ALQUILER DE EXCAVADORA LABOR TUMBADA ARBOLES", metrica: "Hora" },
          { nombre: "ALQUILER DE EXCAVADORA LABOR PREPARACION DE AREA PARA SIEMBRA", metrica: "Hora" }
        ]
      }
    ]
  },
  {
    codigo: "MOC",
    nombre: "Mano de Obra Contratada",
    labores: [
      {
        id: "101",
        nombre: "FERTILIZACION",
        detalles: [
          { nombre: "APLICACION DE FERTILIZANTE", metrica: "Jornal" },
          { nombre: "APLICACION DE ENRAIZADOR", metrica: "Jornal" },
          { nombre: "APLICACION DE FOLIARES", metrica: "Jornal" },
          { nombre: "MUESTREO DE RAÍCES", metrica: "Jornal" },
          { nombre: "APLICACION DE ENMIENDA", metrica: "Jornal" },
          { nombre: "ANÁLISIS DE RAÍCES", metrica: "Jornal" }
        ]
      },
      {
        id: "104",
        nombre: "OPA",
        detalles: [
          { nombre: "TRINCHADO DE PLANTAS", metrica: "Jornal" },
          { nombre: "PARADA Y REPICADA DE MATAS", metrica: "Jornal" }
        ]
      },
      {
        id: "105",
        nombre: "LIMPIEZA DE MATAS",
        detalles: [
          { nombre: "DESCHANTE", metrica: "Jornal" }
        ]
      },
      {
        id: "109",
        nombre: "CANALES",
        detalles: [
          { nombre: "DESEMBANQUE DE TIERRA DE CANAL PRIMARIO", metrica: "Jornal" },
          { nombre: "DESEMBANQUE DE TIERRA DE CANAL SECUNDARIO", metrica: "Jornal" },
          { nombre: "DESEMBANQUE DE TIERRA DE CANAL TERCIARIO", metrica: "Jornal" },
          { nombre: "DESEMBANQUE DE TIERRA DE CANAL CUATERNARIO", metrica: "Jornal" },
          { nombre: "COLOCAR  SACOS EN CANAL PRIMARIO", metrica: "Jornal" },
          { nombre: "COLOCAR SACOS EN CANAL SECUNDARIO", metrica: "Jornal" },
          { nombre: "COLOCAR SACOS EN CANAL TERCIARIO", metrica: "Jornal" },
          { nombre: "LAMPEROS EN AREAS DE ENCHARCAMIENTO", metrica: "Jornal" },
          { nombre: "REGANDO TIERRA", metrica: "Jornal" }
        ]
      },
      {
        id: "110",
        nombre: "CONTROL DE MALEZA",
        detalles: [
          { nombre: "CHAPIA", metrica: "Jornal" },
          { nombre: "APLICACION DE HERBICIDA", metrica: "Jornal" },
          { nombre: "SACAR VETILLA", metrica: "Jornal" },
          { nombre: "LIMPIEZA DE CORONA", metrica: "Jornal" },
          { nombre: "MOTOGUADAÑA", metrica: "Jornal" }
        ]
      },
      {
        id: "111",
        nombre: "CONTROL DE SIGATOKA",
        detalles: [
          { nombre: "APLICACION DE FUNGICIDA CON MOTOBOMBA", metrica: "Jornal" }
        ]
      },
      {
        id: "112",
        nombre: "CONTROL DE PLAGAS",
        detalles: [
          { nombre: "APLICACION PARA CONTROL DE PLAGAS", metrica: "Jornal" },
          { nombre: "APLICACION DE NEMATICIDA", metrica: "Jornal" }
        ]
      },
      {
        id: "150",
        nombre: "SIEMBRA",
        detalles: [
          { nombre: "SIEMBRA DE PLANTAS", metrica: "Jornal" },
          { nombre: "BALIZADA", metrica: "Jornal" },
          { nombre: "SIEMBRA DE PLANTAS + BALIZADA", metrica: "Jornal" },
          { nombre: "RESIEMBRA DE PLANTAS", metrica: "Jornal" },
          { nombre: "ARADA DE TIERRA", metrica: "Jornal" }
        ]
      },
      {
        id: "201",
        nombre: "COSECHA",
        detalles: [
          { nombre: "COSECHA", metrica: "Jornal" },
          { nombre: "CAPITANIA", metrica: "Jornal" }
        ]
      },
      {
        id: "201MG",
        nombre: "MANTENIMIENTO CABLE VÍA Y PUENTES",
        detalles: [
          { nombre: "LIMPIEZA DE CABLE VIA/MANTENIMIENTO", metrica: "Jornal" },
          { nombre: "MANTENIMIENTO DE VINCHAS Y ARCOS", metrica: "Jornal" }
        ]
      },
      {
        id: "401MG",
        nombre: "MANTENIMIENTO GENERAL",
        detalles: [
          { nombre: "TUMBADA Y REPICADA DE ARBOLES", metrica: "Jornal" },
          { nombre: "TUMBADA DE ARBOLES", metrica: "Jornal" },
          { nombre: "REPICADA DE ARBOLES", metrica: "Jornal" },
          { nombre: "COLOCAR SACOS DE MEZCLA POBRE EN MUROS", metrica: "Jornal" }
        ]
      },
      {
        id: "301",
        nombre: "EMPAQUE",
        detalles: [
          { nombre: "ANOTAR CINTAS", metrica: "Jornal" },
          { nombre: "ARMAR CONVOY / SACAR TALLOS", metrica: "Jornal" },
          { nombre: "ARREGLO DE PIOLAS", metrica: "Jornal" },
          { nombre: "ASPIRADOR/LIGADOR", metrica: "Jornal" },
          { nombre: "AYUDANTE DE ANOTA CINTAS", metrica: "Jornal" },
          { nombre: "AYUDANTE DESMANADOR", metrica: "Jornal" },
          { nombre: "AYUDANTE ESTIBADOR", metrica: "Jornal" },
          { nombre: "BOTAR CARTÓN", metrica: "Jornal" },
          { nombre: "CALIFICADOR", metrica: "Jornal" },
          { nombre: "DESFLORADOR", metrica: "Jornal" },
          { nombre: "DESMANADOR", metrica: "Jornal" },
          { nombre: "EMBALADOR", metrica: "Jornal" },
          { nombre: "EMPUJAR CAJA", metrica: "Jornal" },
          { nombre: "EMPUJAR PLATO", metrica: "Jornal" },
          { nombre: "ENFUNDADOR DE CAJAS", metrica: "Jornal" },
          { nombre: "ENFUNDADOR DE CLUSTER", metrica: "Jornal" },
          { nombre: "ESTIBADOR", metrica: "Jornal" },
          { nombre: "ETIQUETADOR", metrica: "Jornal" },
          { nombre: "FUMIGADOR", metrica: "Jornal" },
          { nombre: "FUMIGADOR COCHINILLAS", metrica: "Jornal" },
          { nombre: "FUMIGADOR DE RACIMOS", metrica: "Jornal" },
          { nombre: "JEFE DE PLANTA", metrica: "Jornal" },
          { nombre: "LAVA PROTECTORES", metrica: "Jornal" },
          { nombre: "LAVA RACIMOS", metrica: "Jornal" },
          { nombre: "LLENADOR", metrica: "Jornal" },
          { nombre: "MANTENIMIENTO DE RACIMOS", metrica: "Jornal" },
          { nombre: "MIDE DEDO", metrica: "Jornal" },
          { nombre: "MONITOR DE CALIDAD", metrica: "Jornal" },
          { nombre: "PEGADOR", metrica: "Jornal" },
          { nombre: "PESADOR", metrica: "Jornal" },
          { nombre: "REPESADOR", metrica: "Jornal" },
          { nombre: "SACAR PROTECTORES", metrica: "Jornal" },
          { nombre: "SANEADOR", metrica: "Jornal" },
          { nombre: "SANEADOR MINI ALDI", metrica: "Jornal" },
          { nombre: "SELECTOR DE CAJAS", metrica: "Jornal" },
          { nombre: "TAPADOR", metrica: "Jornal" }
        ]
      },
      {
        id: "301MG",
        nombre: "EMPAQUE MANT GENERAL",
        detalles: [
          { nombre: "CONSERJE", metrica: "Jornal" },
          { nombre: "LIMPIEZA EMPACADORA", metrica: "Jornal" }
        ]
      }
    ]
  },
  {
    codigo: "SER",
    nombre: "Servicios",
    labores: [
      {
        id: "402",
        nombre: "SEGURIDAD DE FINCA",
        detalles: [
          { nombre: "SERVICIO SEGURIDAD PRIVADA", metrica: "Día" }
        ]
      },
      {
        id: "401",
        nombre: "ALIMENTACIÓN FINCA",
        detalles: [
          { nombre: "COMEDOR DESAYUNOS", metrica: "Día" },
          { nombre: "COMEDOR ALMUERZOS", metrica: "Día" }
        ]
      },
      {
        id: "201",
        nombre: "TRANSPORTE",
        detalles: [
          { nombre: "TRANSPORTE PERSONAL CAMPO", metrica: "Viaje" }
        ]
      },
      {
        id: "301",
        nombre: "TRANSPORTE",
        detalles: [
          { nombre: "TRANSPORTE PERSONAL EMPAQUE", metrica: "Viaje" },
          { nombre: "TRANSPORTE MATERIAL DE EMPAQUE", metrica: "Viaje" }
        ]
      },
      {
        id: "150",
        nombre: "SIEMBRA",
        detalles: [
          { nombre: "SERVICIO DE TRANSPORTE DE PLANTAS", metrica: "Viaje" }
        ]
      },
      {
        id: "107MG",
        nombre: "MANTENIM RIEGO Y DRENAJE",
        detalles: [
          { nombre: "SERVICIO DE TRASLADO DE COMPONENTES DE EQUIPOS MECANICOS", metrica: "Viaje" }
        ]
      },
      {
        id: "401MG",
        nombre: "ADM FINCA MANT GENERAL",
        detalles: [
          { nombre: "VIAJES DE TIERRA LABOR DESALOJO DE TIERRA", metrica: "Viaje" },
          { nombre: "VIAJES LASTRE O PIEDRAS LABOR ARREGLO DE VIAS", metrica: "Viaje" },
          { nombre: "VIAJES PIEDRA ESCOLLERA", metrica: "Viaje" }
        ]
      }
    ]
  }
];
