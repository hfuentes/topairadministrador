'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    //uri: 'mongodb://localhost/pcmadministrador-dev'
    uri: 'mongodb://topairadministrador-2851:Sc2*6J)d$3Ht}*5Fd$3Zt}Fd{9)@db-topairadministrador-2851.nodechef.com:5403/topairadministrador'
  },
  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'dev.sqlite',
      define: {
        timestamps: false
      }
    }
  },
  seedDB: true
};
