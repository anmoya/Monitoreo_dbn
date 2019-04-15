const Sequelize = require('sequelize');
const sequelize = new Sequelize('esuite2', 'esuite', 'esuite', {
    host: '192.168.0.15',
    dialect: 'mssql',
    port: null
});

class PdfHandler {
    static async getPdf(req, res) {
        const certificados = await sequelize.query('select aut.nomb_pers,cer.fete_cert,cer.arch_cert from dte_cert_pers cer JOIN personas aut ON cer.codi_pers = aut.codi_pers and cer.codi_emex = aut.codi_emex ', []);
        const dtos = await sequelize.query(`select esta_docu,COUNT(*) as cantidad from dto_enca_docu_p group by esta_docu`, []);
        const dtes = await sequelize.query(`select esta_docu,COUNT(*) as cantidad from dte_enca_docu group by esta_docu;`, []);
        const provs = await MayoresProveedores();
        const sinRespSii = await SinRespuestaSII();
        return res.render('index', {
            certs: certificados[0],
            dtes: dtes[0],
            dtos: dtos[0],
            provs: provs[0],
            sinRespSIi: sinRespSii[0]
        });
    }

    static async Chart(req, res){
        const chart = await sequelize.query(`select top 7 convert(date,fech_carg,23) as fecha, 
                                              esta_docu as estado, 
                                              COUNT(*) as total 
                                              from dte_enca_docu group by convert(date,fech_carg,23), esta_docu order by convert(date,fech_carg,23) desc;`, []);
        return res.json(chart);
    }
}

async function MayoresProveedores() {
    const provs = await sequelize.query(`select rutt_emis , MAX(nomb_emis) as razon_social,COUNT(*) as cantidad from dte_enca_docu group by rutt_emis;`, []);
    return provs;
}

async function SinRespuestaSII(){
    const docs = await sequelize.query(`
        select codi_empr as empresa, tipo_docu as tipo, foli_docu as folio, DATEDIFF(day, fech_carg, GETDATE()) as total_dias 
        from dte_enca_docu where esta_docu = 'FIR'`, []);
    return docs;
}



module.exports = PdfHandler;
