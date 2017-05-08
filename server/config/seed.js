/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
//var Proyecto = require('../api/proyecto/proyecto.model');
// var Cliente = require('../api/cliente/cliente.model');
var TipoEquipo = require('../api/tipoequipo/tipoequipo.model');
var TipoTrabajo = require('../api/tipotrabajo/tipotrabajo.model');
var Resumen = require('../api/resumen/resumen.model');
var Equipo = require('../api/equipo/equipo.model');

// Equipo.createAsync(
//   { nombre: 'SPLIT_EXT_001', serie: 'SPLIT_EXT_001', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_002', serie: 'SPLIT_EXT_002', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_003', serie: 'SPLIT_EXT_003', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_004', serie: 'SPLIT_EXT_004', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_005', serie: 'SPLIT_EXT_005', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_006', serie: 'SPLIT_EXT_006', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_007', serie: 'SPLIT_EXT_007', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_008', serie: 'SPLIT_EXT_008', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_009', serie: 'SPLIT_EXT_009', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_010', serie: 'SPLIT_EXT_010', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_011', serie: 'SPLIT_EXT_011', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_012', serie: 'SPLIT_EXT_012', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_013', serie: 'SPLIT_EXT_013', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_014', serie: 'SPLIT_EXT_014', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_015', serie: 'SPLIT_EXT_015', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_016', serie: 'SPLIT_EXT_016', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_017', serie: 'SPLIT_EXT_017', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_018', serie: 'SPLIT_EXT_018', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_019', serie: 'SPLIT_EXT_019', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_020', serie: 'SPLIT_EXT_020', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_021', serie: 'SPLIT_EXT_021', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_022', serie: 'SPLIT_EXT_022', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_023', serie: 'SPLIT_EXT_023', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_024', serie: 'SPLIT_EXT_024', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_025', serie: 'SPLIT_EXT_025', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_026', serie: 'SPLIT_EXT_026', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_027', serie: 'SPLIT_EXT_027', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_028', serie: 'SPLIT_EXT_028', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_029', serie: 'SPLIT_EXT_029', tipo: '573e4cda50d1689c2263b60e' },
//   { nombre: 'SPLIT_EXT_030', serie: 'SPLIT_EXT_030', tipo: '573e4cda50d1689c2263b60e' },

//   { nombre: 'SPLIT_INT_001_01', serie: 'SPLIT_INT_001_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_002_01', serie: 'SPLIT_INT_002_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_003_01', serie: 'SPLIT_INT_003_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_004_01', serie: 'SPLIT_INT_004_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_005_01', serie: 'SPLIT_INT_005_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_006_01', serie: 'SPLIT_INT_006_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_007_01', serie: 'SPLIT_INT_007_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_008_01', serie: 'SPLIT_INT_008_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_009_01', serie: 'SPLIT_INT_009_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_010_01', serie: 'SPLIT_INT_010_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_011_01', serie: 'SPLIT_INT_011_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_012_01', serie: 'SPLIT_INT_012_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_013_01', serie: 'SPLIT_INT_013_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_014_01', serie: 'SPLIT_INT_014_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_015_01', serie: 'SPLIT_INT_015_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_016_01', serie: 'SPLIT_INT_016_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_017_01', serie: 'SPLIT_INT_017_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_018_01', serie: 'SPLIT_INT_018_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_019_01', serie: 'SPLIT_INT_019_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_020_01', serie: 'SPLIT_INT_020_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_021_01', serie: 'SPLIT_INT_021_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_022_01', serie: 'SPLIT_INT_022_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_023_01', serie: 'SPLIT_INT_023_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_024_01', serie: 'SPLIT_INT_024_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_025_01', serie: 'SPLIT_INT_025_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_026_01', serie: 'SPLIT_INT_026_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_027_01', serie: 'SPLIT_INT_027_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_028_01', serie: 'SPLIT_INT_028_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_029_01', serie: 'SPLIT_INT_029_01', tipo: '573e4cdb50d1689c2263b61c' },
//   { nombre: 'SPLIT_INT_030_01', serie: 'SPLIT_INT_030_01', tipo: '573e4cdb50d1689c2263b61c' }
// ).then(() => {
//   console.log('-------------------------');
//   console.log('equipos creados');
//   console.log('-------------------------');
// });

// Equipo.createAsync(
//   //////////////////////////////////////// x1
//   { nombre: 'EVAP_SM_9000_001', serie: 'CSM-09HREI-001', marca: 'CLARK', capacidad: '9.000 BTU/H', modelo: 'CSM-09HREI', antiguedad: '14 Jun 2016' },
//   { nombre: 'COND_SM_9000_001', serie: 'CSM-09HREO-001', marca: 'CLARK', capacidad: '9.000 BTU/H', modelo: 'CSM-09HREO', antiguedad: '14 Jun 2016' },

//   //////////////////////////////////////// x4
//   { nombre: 'EVAP_SM_18000_001', serie: 'CSM-18HREI-001', marca: 'CLARK', capacidad: '18.000 BTU/H', modelo: 'CSM-18HREI', antiguedad: '14 Jun 2016' },
//   { nombre: 'COND_SM_18000_001', serie: 'CSM-18HREO-001', marca: 'CLARK', capacidad: '18.000 BTU/H', modelo: 'CSM-18HREO', antiguedad: '14 Jun 2016' },

//   { nombre: 'EVAP_SM_18000_002', serie: 'CSM-18HREI-002', marca: 'CLARK', capacidad: '18.000 BTU/H', modelo: 'CSM-18HREI', antiguedad: '14 Jun 2016' },
//   { nombre: 'COND_SM_18000_002', serie: 'CSM-18HREO-002', marca: 'CLARK', capacidad: '18.000 BTU/H', modelo: 'CSM-18HREO', antiguedad: '14 Jun 2016' },

//   { nombre: 'EVAP_SM_18000_003', serie: 'CSM-18HREI-003', marca: 'CLARK', capacidad: '18.000 BTU/H', modelo: 'CSM-18HREI', antiguedad: '14 Jun 2016' },
//   { nombre: 'COND_SM_18000_003', serie: 'CSM-18HREO-003', marca: 'CLARK', capacidad: '18.000 BTU/H', modelo: 'CSM-18HREO', antiguedad: '14 Jun 2016' },

//   { nombre: 'EVAP_SM_18000_004', serie: 'CSM-18HREI-004', marca: 'CLARK', capacidad: '18.000 BTU/H', modelo: 'CSM-18HREI', antiguedad: '14 Jun 2016' },
//   { nombre: 'COND_SM_18000_004', serie: 'CSM-18HREO-004', marca: 'CLARK', capacidad: '18.000 BTU/H', modelo: 'CSM-18HREO', antiguedad: '14 Jun 2016' },

//   //////////////////////////////////////// x5
//   { nombre: 'EVAP_SM_24000_001', serie: 'CST-24HREI-001', marca: 'CLARK', capacidad: '24.000 BTU/H', modelo: 'CST-24HREI', antiguedad: '14 Jun 2016' },
//   { nombre: 'COND_SM_24000_001', serie: 'CST-24HREO-001', marca: 'CLARK', capacidad: '24.000 BTU/H', modelo: 'CST-24HREO', antiguedad: '14 Jun 2016' },

//   { nombre: 'EVAP_SM_24000_002', serie: 'CST-24HREI-002', marca: 'CLARK', capacidad: '24.000 BTU/H', modelo: 'CST-24HREI', antiguedad: '14 Jun 2016' },
//   { nombre: 'COND_SM_24000_002', serie: 'CST-24HREO-002', marca: 'CLARK', capacidad: '24.000 BTU/H', modelo: 'CST-24HREO', antiguedad: '14 Jun 2016' },

//   { nombre: 'EVAP_SM_24000_003', serie: 'CST-24HREI-003', marca: 'CLARK', capacidad: '24.000 BTU/H', modelo: 'CST-24HREI', antiguedad: '14 Jun 2016' },
//   { nombre: 'COND_SM_24000_003', serie: 'CST-24HREO-003', marca: 'CLARK', capacidad: '24.000 BTU/H', modelo: 'CST-24HREO', antiguedad: '14 Jun 2016' },

//   { nombre: 'EVAP_SM_24000_004', serie: 'CST-24HREI-004', marca: 'CLARK', capacidad: '24.000 BTU/H', modelo: 'CST-24HREI', antiguedad: '14 Jun 2016' },
//   { nombre: 'COND_SM_24000_004', serie: 'CST-24HREO-004', marca: 'CLARK', capacidad: '24.000 BTU/H', modelo: 'CST-24HREO', antiguedad: '14 Jun 2016' },

//   { nombre: 'EVAP_SM_24000_005', serie: 'CST-24HREI-005', marca: 'CLARK', capacidad: '24.000 BTU/H', modelo: 'CST-24HREI', antiguedad: '14 Jun 2016' },
//   { nombre: 'COND_SM_24000_005', serie: 'CST-24HREO-005', marca: 'CLARK', capacidad: '24.000 BTU/H', modelo: 'CST-24HREO', antiguedad: '14 Jun 2016' },

//   //////////////////////////////////////// x5
//   { nombre: 'EVAP_SM_ECO_36000_001', serie: '0305014-EVAP-001', marca: 'CLARK', capacidad: '36.000 BTU/H', modelo: '0305014-EVAP', antiguedad: '14 Jun 2016' },
//   { nombre: 'COND_SM_ECO_36000_001', serie: '0305014-COND-001', marca: 'CLARK', capacidad: '36.000 BTU/H', modelo: '0305014-COND', antiguedad: '14 Jun 2016' },

//   { nombre: 'EVAP_SM_ECO_36000_002', serie: '0305014-EVAP-002', marca: 'CLARK', capacidad: '36.000 BTU/H', modelo: '0305014-EVAP', antiguedad: '14 Jun 2016' },
//   { nombre: 'COND_SM_ECO_36000_002', serie: '0305014-COND-002', marca: 'CLARK', capacidad: '36.000 BTU/H', modelo: '0305014-COND', antiguedad: '14 Jun 2016' },

//   { nombre: 'EVAP_SM_ECO_36000_003', serie: '0305014-EVAP-003', marca: 'CLARK', capacidad: '36.000 BTU/H', modelo: '0305014-EVAP', antiguedad: '14 Jun 2016' },
//   { nombre: 'COND_SM_ECO_36000_003', serie: '0305014-COND-003', marca: 'CLARK', capacidad: '36.000 BTU/H', modelo: '0305014-COND', antiguedad: '14 Jun 2016' },

//   { nombre: 'EVAP_SM_ECO_36000_004', serie: '0305014-EVAP-004', marca: 'CLARK', capacidad: '36.000 BTU/H', modelo: '0305014-EVAP', antiguedad: '14 Jun 2016' },
//   { nombre: 'COND_SM_ECO_36000_004', serie: '0305014-COND-004', marca: 'CLARK', capacidad: '36.000 BTU/H', modelo: '0305014-COND', antiguedad: '14 Jun 2016' },

//   { nombre: 'EVAP_SM_ECO_36000_005', serie: '0305014-EVAP-005', marca: 'CLARK', capacidad: '36.000 BTU/H', modelo: '0305014-EVAP', antiguedad: '14 Jun 2016' },
//   { nombre: 'COND_SM_ECO_36000_005', serie: '0305014-COND-005', marca: 'CLARK', capacidad: '36.000 BTU/H', modelo: '0305014-COND', antiguedad: '14 Jun 2016' },

//   //////////////////////////////////////// x2
//   { nombre: 'COMP_BCMIDEA_R410A_36000_001', serie: 'MRC-36HWN1-R-001', marca: 'MIDEA', capacidad: '36.000 BTU/H', modelo: 'MRC-36HWN1-R', antiguedad: '13 Jun 2016' },

//   { nombre: 'COMP_BCMIDEA_R410A_36000_002', serie: 'MRC-36HWN1-R-002', marca: 'MIDEA', capacidad: '36.000 BTU/H', modelo: 'MRC-36HWN1-R', antiguedad: '13 Jun 2016' },

//   //////////////////////////////////////// x1
//   { nombre: 'SILENT_200CZ_001', serie: '0521-700-SILENT-200CZ-001', marca: 'S&P', capacidad: '180 M3/H', modelo: 'SILENT-200CZ', antiguedad: '20 Jul 2016' },

//   //////////////////////////////////////// x1
//   { nombre: 'VDF_CF500_IOS3T_2HP_1.5KW_001', serie: '1732-317-001', marca: 'S&P', capacidad: '2HP 1.5KW', modelo: 'VDF CF500 2HP 1.5KW', antiguedad: '28 Jun 2016' },

//   //////////////////////////////////////// x4
//   { nombre: 'VDF_CFW500_1HP_NB20_001', serie: '1732-320-001', marca: 'S&P', capacidad: '1HP', modelo: 'VDF CFW500 1HP NB20', antiguedad: '28 Jun 2016' },
//   { nombre: 'VDF_CFW500_1HP_NB20_002', serie: '1732-320-002', marca: 'S&P', capacidad: '1HP', modelo: 'VDF CFW500 1HP NB20', antiguedad: '28 Jun 2016' },
//   { nombre: 'VDF_CFW500_1HP_NB20_003', serie: '1732-320-003', marca: 'S&P', capacidad: '1HP', modelo: 'VDF CFW500 1HP NB20', antiguedad: '28 Jun 2016' },
//   { nombre: 'VDF_CFW500_1HP_NB20_004', serie: '1732-320-004', marca: 'S&P', capacidad: '1HP', modelo: 'VDF CFW500 1HP NB20', antiguedad: '28 Jun 2016' },

//   //////////////////////////////////////// x1
//   { nombre: 'HXM_200_001', serie: '0511-400-001', marca: 'S&P', capacidad: '-', modelo: 'HXM 200', antiguedad: '17 Jun 2016' },

//   //////////////////////////////////////// x2
//   { nombre: 'CVB_180/180_1/10CV_74W_001', serie: '0513-500-001', marca: 'S&P', capacidad: '180/180 1/10 CV 74W', modelo: 'CVB 180/180 1/10 CV 74W', antiguedad: '28 Jun 2016' },
//   { nombre: 'CVB_180/180_1/10CV_74W_002', serie: '0513-500-002', marca: 'S&P', capacidad: '180/180 1/10 CV 74W', modelo: 'CVB 180/180 1/10 CV 74W', antiguedad: '28 Jun 2016' },

//   //////////////////////////////////////// x1
//   { nombre: 'CVB_240/240_1/3CV_250W_001', serie: '0513b-500-001', marca: 'S&P', capacidad: '240/240 1/3 CV 250W', modelo: 'CVB 240/240 1/3 CV 250W', antiguedad: '28 Jun 2016' },

//   //////////////////////////////////////// x1
//   { nombre: 'CVB_320/240_3/4CV_550W_001', serie: '0513-700-001', marca: 'S&P', capacidad: '320/240 3/4 CV 550W', modelo: 'CVB_320/240_3/4CV_550W_001', antiguedad: '28 Jun 2016' },

//   //////////////////////////////////////// x2
//   { nombre: 'SILENT_100CZ_001', serie: '0521-700-SILENT-100CZ-001', marca: 'S&P', capacidad: '180 M3/H', modelo: 'SILENT-100CZ', antiguedad: '20 Jul 2016' },
//   { nombre: 'SILENT_100CZ_002', serie: '0521-700-SILENT-100CZ-002', marca: 'S&P', capacidad: '85 M3/H', modelo: 'SILENT-100CZ', antiguedad: '20 Jul 2016' },

//   //////////////////////////////////////// x5
//   { nombre: 'TDP_D_001', serie: '0541-400-TDP-D-001', marca: 'S&P', capacidad: '-', modelo: 'TDP D', antiguedad: '20 Jul 2016' },
//   { nombre: 'TDP_D_002', serie: '0541-400-TDP-D-002', marca: 'S&P', capacidad: '-', modelo: 'TDP D', antiguedad: '20 Jul 2016' },
//   { nombre: 'TDP_D_003', serie: '0541-400-TDP-D-003', marca: 'S&P', capacidad: '-', modelo: 'TDP D', antiguedad: '20 Jul 2016' },
//   { nombre: 'TDP_D_004', serie: '0541-400-TDP-D-004', marca: 'S&P', capacidad: '-', modelo: 'TDP D', antiguedad: '20 Jul 2016' },
//   { nombre: 'TDP_D_005', serie: '0541-400-TDP-D-005', marca: 'S&P', capacidad: '-', modelo: 'TDP D', antiguedad: '20 Jul 2016' },

//   //////////////////////////////////////// x2
//   { nombre: 'CBP_9/9_0.75HP_1550RPM_001', serie: 'OT53-000-001', marca: 'S&P', capacidad: '9/9 0.75HP 1550RPM', modelo: 'CBP 9/9 0.75HP 1550RPM', antiguedad: '06 Jul 2016' },
//   { nombre: 'CBP_9/9_0.75HP_1550RPM_002', serie: 'OT53-000-002', marca: 'S&P', capacidad: '9/9 0.75HP 1550RPM', modelo: 'CBP 9/9 0.75HP 1550RPM', antiguedad: '06 Jul 2016' },

//   //////////////////////////////////////// x1
//   { nombre: 'CBP_9/7_0.25HP_700RPM_001', serie: 'OT53-XM2-001', marca: 'S&P', capacidad: '9/7 0.25HP 700RPM', modelo: 'CBP 9/7 0.25HP 700RPM', antiguedad: '06 Jul 2016' },

//   { nombre: 'CBP_10/10_0.75HP_1350RPM_001', serie: 'OT53-NM1-001', marca: 'S&P', capacidad: '10/10 0.75HP 1350RPM', modelo: 'CBP 10/10 0.75HP 1350RPM', antiguedad: '06 Jul 2016' },

//   { nombre: 'CBP_9/7_0.75HP_1500RPM_001', serie: 'OT53-NM2-001', marca: 'S&P', capacidad: '9/7 0.75HP 1500RPM', modelo: 'CBP 9/7 0.75HP 1500RPM', antiguedad: '06 Jul 2016' },

//   { nombre: 'CBP_15/15_1.5HP_950RPM_001', serie: 'OT53-NM2-001', marca: 'S&P', capacidad: '15/15 1.5HP 950RPM', modelo: 'CBP 15/15 1.5HP 950RPM', antiguedad: '06 Jul 2016' }


//   ).then(function() {
//   console.log('equipos creados');
// });




/*Resumen.update({}, {creador:'573e4629b0ca07d822cecb6e'} , {multi: true}, function(err, docs) {
  console.dir(err || docs);
});*/

/*TipoEquipo.find({}).removeAsync().then(function() {
  TipoEquipo.createAsync({ nombre: 'CAJAS RECUPERADORAS' })
    .then(function(entity) {
      return TipoTrabajo.createAsync([
        { nombre: 'Chequeo Funcionamiento' },
        { nombre: 'Verificar conexión Eléctrica' },
        { nombre: 'Reapreté conexión Eléctrica' },
        { nombre: 'Verificar aislaciones cañerías' },
        { nombre: 'Confección informe completo unidad' }
      ]).then(function(data) {
        entity.trabajos = data;
        return entity.saveAsync().spread(function(saved) {
          return saved;
        });
      });
    })
    .then(function(entity) {
      return TipoEquipo.createAsync({ nombre: 'AEROTERMOS' })
        .then(function(entity) {
          return TipoTrabajo.createAsync([
            { nombre: 'Verificar estado de resistencias calefactoras' },
            { nombre: 'Verificar estado de ventiladores' },
            { nombre: 'Limpieza de serpentín' },
            { nombre: 'Verificar estado de circuito de fuerza y control' },
            { nombre: 'Verificar termostato de temperatura' },
            { nombre: 'Medición de parámetros, consumo, temperatura, caudal de aire' },
            { nombre: 'Entrega de informe técnico' }
          ]).then(function(data) {
            entity.trabajos = data;
            return entity.saveAsync().spread(function(saved) {
              return saved;
            });
          });
        })
    })
    .then(function(entity) {
      return TipoEquipo.createAsync({ nombre: 'COMPACTOS' })
        .then(function(entity) {
          return TipoTrabajo.createAsync([
            { nombre: 'Desmontaje parcial de Pizas y Gabinete' },
            { nombre: 'Lavado de serpentines unidad condensadora y evaporadora' },
            { nombre: 'Peinado de aletas unidad condensadora' },
            { nombre: 'Verificación estado del desagüe' },
            { nombre: 'Lavado de filtro de retorno' },
            { nombre: 'Limpieza de contactores ' },
            { nombre: 'Reapriete de terminales de control y fuerza' },
            { nombre: 'Verificación de estado de rodamientos de ventiladores unidad' },
            { nombre: 'Verificar estado de los descansos del ventilador de inyección' },
            { nombre: 'Medición de parámetros tales como temperatura, presión, consumo, caudal' },
            { nombre: 'Confección Informe Completo de la unidad.' }
          ]).then(function(data) {
            entity.trabajos = data;
            return entity.saveAsync().spread(function(saved) {
              return saved;
            });
          });
        })
    })
    .then(function(entity) {
      return TipoEquipo.createAsync({ nombre: 'DAMPERS' })
        .then(function(entity) {
          return TipoTrabajo.createAsync([
            { nombre: 'Verificar actuador de compuerta' },
            { nombre: 'Verificar estado de láminas de la compuerta (alabes)' },
            { nombre: 'Verificar sistema de   Fuerza y control' },
            { nombre: 'Verificar operación de termostato' },
            { nombre: 'Reapretar terminales de fuerza y control' },
            { nombre: 'Entrega de informe técnico' }
          ]).then(function(data) {
            entity.trabajos = data;
            return entity.saveAsync().spread(function(saved) {
              return saved;
            });
          });
        });
    })
    .then(function(entity) {
      return TipoEquipo.createAsync({ nombre: 'REFRIGERACION' })
        .then(function(entity) {
          return TipoTrabajo.createAsync([
            { nombre: 'Lavado de serpentín unidad condensadora' },
            { nombre: 'Verificar estado de ventiladores unidad evaporadora' },
            { nombre: 'Verificar desagüe unidad evaporadora' },
            { nombre: 'Verificar sistema de control (termostato)' },
            { nombre: 'Reapretar terminales de fuerza y control' },
            { nombre: 'Verificar estado de resistencia calefactora de la línea de desagüe' },
            { nombre: 'Medición de parámetros, presión, temperatura, caudal, consumo' },
            { nombre: 'Entrega de informe técnico' }
          ]).then(function(data) {
            entity.trabajos = data;
            return entity.saveAsync().spread(function(saved) {
              return saved;
            });
          });
        });
    })
    .then(function(entity) {
      return TipoEquipo.createAsync({ nombre: 'SPLIT - EVAPORADORA' })
        .then(function(entity) {
          return TipoTrabajo.createAsync([
            { nombre: 'Desmontaje parcial de piezas y gabinete' },
            { nombre: 'Lavado de serpentín tubo y aletas por convección forzada' },
            { nombre: 'Lubricación de motor ventilador y limpieza de alavés' },
            { nombre: 'Chequeo drenaje líneas de desagües' },
            { nombre: 'Revisión de funcionamiento de termostato o control remoto, secuencia de accionamiento' },
            { nombre: 'Lubricación de rodamientos, bujes de motor eléctrico, y en general partes móviles del equipo' },
            { nombre: 'Chequeo de ruidos anormales en el sistema' },
            { nombre: 'Revisión de flujos de aire de inyección para el ciclo de calefacción y enfriamiento' },
            { nombre: 'Medición y registro de corrientes y voltajes ' },
            { nombre: 'Medición de temperaturas de inyección y ambiente' },
            { nombre: 'Reapriete de terminales eléctricos de fuerza y control' },
            { nombre: 'Chequeo de aislación de tuberías de refrigeración ' },
            { nombre: 'Confección Informe Completo Unidad' }
          ]).then(function(data) {
            entity.trabajos = data;
            return entity.saveAsync().spread(function(saved) {
              return saved;
            });
          });
        });
    })
    .then(function(entity) {
      return TipoEquipo.createAsync({ nombre: 'SPLIT - CONDENSADORAS ' })
        .then(function(entity) {
          return TipoTrabajo.createAsync([
            { nombre: 'Desarme parcial de piezas y gabinetes' },
            { nombre: 'Chequeo general unidad condensadora' },
            { nombre: 'Lavado a alta presión de condensador tipo espiral, con detergente Industrial' },
            { nombre: 'Lubricación eje motor axial de ventilación y limpieza de aletas' },
            { nombre: 'Regulación de presiones y chequeo de carga refrigerante circuito alta y baja presión' },
            { nombre: 'Verificación aislación de red tuberías de refrigeración' },
            { nombre: 'Chequeo de estado circuito eléctrico de fuerza y control' },
            { nombre: 'Medición y registro de corrientes y voltajes ' },
            { nombre: 'Medición de temperaturas de condensación' },
            { nombre: 'Regulación de dispositivos de seguridad' },
            { nombre: 'Confección Informe Completo Unidad' }
          ]).then(function(data) {
            entity.trabajos = data;
            return entity.saveAsync().spread(function(saved) {
              return saved;
            });
          });
        });
    })
    .then(function(entity) {
      return TipoEquipo.createAsync({ nombre: 'VENTANA' })
        .then(function(entity) {
          return TipoTrabajo.createAsync([
            { nombre: 'Desmontar unidad' },
            { nombre: 'Lavado de serpentín' },
            { nombre: 'Reapriete de contactos de fuerza y control' },
            { nombre: 'Montaje de unidad' },
            { nombre: 'Mediciones de parámetros, temperatura, consumo y caudal' },
            { nombre: 'Entrega de informe técnico' }
          ]).then(function(data) {
            entity.trabajos = data;
            return entity.saveAsync().spread(function(saved) {
              return saved;
            });
          });
        });
    })
    .then(function(entity) {
      return TipoEquipo.createAsync({ nombre: 'EXTRACTORAS E INYECTORAS' })
        .then(function(entity) {
          return TipoTrabajo.createAsync([
            { nombre: 'Limpieza de Motor' },
            { nombre: 'Revisión de Bujes o Rodamientos de Motor' },
            { nombre: 'Verificar correcto  sentido de giro' },
            { nombre: 'Verificar estado de alabes o aspas' },
            { nombre: 'Verificar fijación de Extractor' },
            { nombre: 'Lavado de filtro de Aire' },
            { nombre: 'Cambio de filtro si es necesario' },
            { nombre: 'Limpieza de turbinas' },
            { nombre: 'Limpieza de estructura' },
            { nombre: 'Verificar estado de soportes' },
            { nombre: 'Chequeo visual de ductos en cubierta' },
            { nombre: 'Verificar parámetros de tensión y corriente' },
            { nombre: 'Confección informe completo unidad' }
          ]).then(function(data) {
            entity.trabajos = data;
            return entity.saveAsync().spread(function(saved) {
              return saved;
            });
          });
        });
    })
    .then(function(entity) {
      return TipoEquipo.createAsync({ nombre: 'CONDENSADORAS VRV' })
        .then(function(entity) {
          return TipoTrabajo.createAsync([
            { nombre: 'Desarme Unidad Condensadora' },
            { nombre: 'Lavado de serpentín' },
            { nombre: 'Lavado de piezas Móviles' },
            { nombre: 'Peinado serpentines' },
            { nombre: 'Limpieza de motores Ventiladores' },
            { nombre: 'Limpieza de aspas' },
            { nombre: 'Chequeo fijación de Motores' },
            { nombre: 'Revisión de bujes o rodamientos de motores' },
            { nombre: 'Verificación funcionamiento de circuito de fuerza y control ' },
            { nombre: 'Verificación conexión de refrigeración' },
            { nombre: 'Verificar posibles fugas de  refrigerante' },
            { nombre: 'Verificar presión de trabajo ' },
            { nombre: 'Verificar estado de soportes' },
            { nombre: 'Verificar correcta secuencia de  fases' },
            { nombre: 'Verificar parámetros de tensión y energía' },
            { nombre: 'Verificar Funcionamiento compresor' },
            { nombre: 'Verificar Funcionamiento ventiladores' },
            { nombre: 'Eliminar posibles ruidos producto de vibraciones' },
            { nombre: 'Confección Informe completo por unidad' }
          ]).then(function(data) {
            entity.trabajos = data;
            return entity.saveAsync().spread(function(saved) {
              return saved;
            });
          });
        });
    })
    .then(function(entity) {
      return TipoEquipo.createAsync({ nombre: 'EVAPORADORAS VRV' })
        .then(function(entity) {
          return TipoTrabajo.createAsync([
            { nombre: 'Limpieza de unidad evaporadora' },
            { nombre: 'Lavado filtro de aire' },
            { nombre: 'Lavado serpentín' },
            { nombre: 'Limpieza de bandeja de condensado' },
            { nombre: 'Chequeo fijación de motor' },
            { nombre: 'Revisión de bujes o rodamientos de motores' },
            { nombre: 'Verificación conexión de refrigeración' },
            { nombre: 'Verificar posibles fugas de  refrigerante' },
            { nombre: 'Verificar Funcionamiento ventilador' },
            { nombre: 'Eliminar posibles ruidos producto de vibraciones' },
            { nombre: 'Verificar Lógica de control' },
            { nombre: 'Verificar parámetros de tensión y corriente' },
            { nombre: 'Confección Informe completo por unidad' }
          ]).then(function(data) {
            entity.trabajos = data;
            return entity.saveAsync().spread(function(saved) {
              return saved;
            });
          });
        });
    });
});*/


/*Cliente.createAsync({
  nombre: 'Enjoy'
}, {
  nombre: 'Fresenius'
},{
  nombre: 'Trussup'
},{
  nombre: 'Banco Falabella'
},{
  nombre: 'FerroGroup'
},{
  nombre: 'CVV'
},{
  nombre: 'Carpas Triciklo'
},{
  nombre: 'Besalco'
},{
  nombre: 'Eventos WSA'
},{
  nombre: 'Producciones Banana'
},{
  nombre: 'Open Hotel'
},{
  nombre: 'DFV'
},{
  nombre: 'UDLA'
},{
  nombre: 'Baby Infanti Store'
},{
  nombre: 'Ate Producciones'
},{
  nombre: 'Almagro'
},{
  nombre: 'Teletón'
},{
  nombre: 'Ripley'
},{
  nombre: 'Tango Uno'
},{
  nombre: 'Esencia Staff'
}).then(function(){
  console.log('clientes creados');
});*/



/*User.find({}).removeAsync().then(function() {
  User.createAsync({
    provider: 'local',
    name: 'Nicolas Gonzalez',
    email: 'admin',
    password: '123456a',
    role: 'admin'
  }).then(function() {
    console.log('usuarios creados OK! ---------');
  });
});*/
