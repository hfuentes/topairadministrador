'use strict';

angular.module('PCMAdministradorApp').service('apiServices', function($resource) {
  // AngularJS will instantiate a singleton by calling "new" on this function
  return {
    proyectos: $resource('/api/proyecto/:id', {}, {
      getAll: {
        method: 'post',
        url: '/api/proyecto/getAll',
        isArray: true
      },
      update: {
        method: 'put'
      }
    }),
    actividades: $resource('/api/actividad/:id', {}, {
      byProyecto: {
        method: 'get',
        url: '/api/actividad/proyecto/:id_proyecto',
        isArray: true
      },
      getMotivoEnum: {
        method: 'post',
        url: '/api/actividad/motivo_enum',
        isArray: true
      },
      update: {
        method: 'put'
      }
    }),
    clientes: $resource('/api/cliente/:id', {}, {
      activos: {
        method: 'post',
        url: '/api/cliente/activos',
        isArray: true
      },
      update: {
        method: 'put'
      }
    }),
    equipos: $resource('/api/equipo/:id', {}, {
      activos: {
        method: 'post',
        url: '/api/equipo/activos',
        isArray: true
      },
      update: {
        method: 'put'
      },
      buscarByProyecto: {
        method: 'post',
        url: '/api/equipo/proyecto_buscar',
        isArray: true
      }
    }),
    tiposEquipos: $resource('/api/tipoequipo/:id', {}, {
      update: {
        method: 'put'
      },
      getTipos: {
        method: 'get',
        url: '/api/tipoequipo/getTipos',
        isArray: true
      }
    }),
    resumenes: $resource('/api/resumen/:id', {}, {
      byProyecto: {
        method: 'get',
        url: '/api/resumen/proyecto/:id',
        isArray: true
      },
      vistaCliente: {
        method: 'get',
        url: '/api/resumen/vista_cliente/:id',
        isArray: false
      }
    }),
    parametros: $resource('/api/parametro/:id', {}, {
      editar: {
        method: 'post',
        url: '/api/parametro/editar',
        isArray: false
      },
      obtener: {
        method: 'get',
        url: '/api/parametro/obtener',
        isArray: false
      }
    }),
  };
});
