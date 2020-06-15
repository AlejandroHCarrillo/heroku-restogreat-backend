var menuPrincipal =  [
  { titulo: "Dashboard", url: "/dashboard" },
  { titulo: "ProgressBar", url: "/progress" },
  { titulo: "Concepto descuento", url: "/conceptosdescuento" },
  { titulo: "Abrir Cuenta", url: "/cuentas" },
  // { titulo: "Areas de venta", url: "/areasventa" },
    // { titulo: "Gráficas", url: "/graficas1" },
    // { titulo: "Promesas", url: "/promesas" },
    // { titulo: "RxJs", url: "/rxjs" }
  ];

// Menu
module.exports.MENU_USER = [
    {
      titulo: "Principal",
      icono: "mdi mdi-gauge",
      submenu: menuPrincipal
    },
    {
      titulo: "Mantenimiento",
      icono: "mdi mdi-folder-lock-open",
      submenu: []
    },
    {
      titulo: "Catalogos",
      icono: "mdi mdi-folder-lock-open",
      submenu: []
    }
  ];
  
  module.exports.MENU_ADMIN = [
    {
      titulo: "Principal",
      icono: "mdi mdi-gauge",
      submenu:  menuPrincipal
    },
    {
        titulo: "Mantenimiento",
        icono: "mdi mdi-folder-lock-open",
        submenu: [
          { titulo: "Cuenta", url: "/cuenta" },
          { titulo: "Secciones", url: "/secciones" },
          { titulo: "Grupos", url: "/grupos" },
          { titulo: "Pila de Comandas", url: "/colascomanda" },
          { titulo: "Productos Platillos", url: "/producto" },
          { titulo: "Clientes", url: "/clientes" },
          { titulo: "Corte de caja", url: "/cortecaja" },
          { titulo: "Facturacion", url: "/facturas" },
        ]
    },
    {
      titulo: "Catalogos",
      icono: "mdi mdi-folder-lock-open",
      submenu: [
          { titulo: "Usuarios", url: "/usuarios" },
          { titulo: "Hospitales", url: "/hospitales" },
          { titulo: "Medicos", url: "/medicos" } ,

          { titulo: "Bancos", url: "/bancos" },
          { titulo: "Areas de Venta", url: "/areasventa" },
          { titulo: "Causas de Cancelacion", url: "/causascancelacion" },
          { titulo: "Conceptos de descuentos", url: "/conceptosdescuento" },
          { titulo: "Desembolso de Caja", url: "/desembolsoscaja" },
          { titulo: "Meseros", url: "/meseros" },
          { titulo: "Formas de Pago", url: "/formaspago" },
          { titulo: "Abrir Cuenta", url: "/cuentas" },
          
          { titulo: "Rubros", url: "/rubros" },
          { titulo: "Modificadores", url: "/modificadores" },
          { titulo: "Pagos", url: "/pagos" },
          { titulo: "Configuracion", url: "/configuracion" },
          { titulo: "Turnos", url: "/turnos" },
          { titulo: "Abrir Turno", url: "/turno/nuevo" }
      ]
    }
  ];
