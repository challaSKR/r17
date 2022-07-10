const TYPES = require('tedious').TYPES;
const jwt_decode = require('jwt-decode');
const spLists = require('../config/spLists');
const requestHandler = require('../utils/requestHandler');

module.exports = {
  getMaterial: function (req, res) {

    const requestString = '[dbo].[Get_Material_List_Entry_new]';
    const queryArgs = req.params;
    const args = [
      { name: "Plant", type: TYPES.NVarChar, value: queryArgs.plant },
      { name: "Material", type: TYPES.NVarChar, value: queryArgs.material },
      { name: "MRPArea", type: TYPES.NVarChar, value: queryArgs.mrparea },
      { name: "ERP", type: TYPES.NVarChar, value: queryArgs.erp }

    ];
    requestHandler(req, res, requestString, args);
    
  },
  getMaterialERP: function (req, res) {

    const requestString = '[dbo].[Get_Material_List_Entry_ERP]';
    const queryArgs = req.params;
    const args = [
      { name: "Plant", type: TYPES.NVarChar, value: queryArgs.plant },
      { name: "Material", type: TYPES.NVarChar, value: queryArgs.material },
      { name: "ERP", type: TYPES.NVarChar, value: queryArgs.erp }

    ];
    requestHandler(req, res, requestString, args);
    
  },
  getMaterialOld: function (req, res) {

    const requestString = '[dbo].[Get_Material_List_Entry]';
    const queryArgs = req.params;
    const args = [
      { name: "Plant", type: TYPES.NVarChar, value: queryArgs.plant },
      { name: "Material", type: TYPES.NVarChar, value: queryArgs.material },
    ];
    requestHandler(req, res, requestString, args);
    
  },
  

  getMaterials: function (req, res) {
    console.log('getMaterial', req.body.material)

    const requestString = '[dbo].[Get_Material_List_Entries]';
    const queryArgs = req.body.materials;
    var Rows = [];
    queryArgs.forEach(function (obj) {
      var tempRow = [obj.plantID, obj.materialID];
      Rows.push(tempRow);
    });
    var table = {
      columns: [
        { name: "plantID", type: TYPES.NVarChar, length: 40 },
        { name: "materialID", type: TYPES.NVarChar, length: 40 },
        { name: "mrpArea", type: TYPES.NVarChar, length:40},
        { name: "erp", type: TYPES.NVarChar, length:40},


      ],
      rows: Rows
    }
    console.log('table', table)
    const args = [
      { name: "materials", type: TYPES.TVP, value: table },
    ];
    requestHandler(req, res, requestString, args);
  },

  getConsumptionHistory: function (req, res) {
    const requestString = '[dbo].[Get_Consumption_History]';
    const queryArgs = req.params;
    const args = [
      { name: "Plant", type: TYPES.NVarChar, value: queryArgs.plant },
      { name: "Material", type: TYPES.NVarChar, value: queryArgs.material },
      { name: "ERP", type: TYPES.NVarChar, value: queryArgs.erp },

      
    ];
    requestHandler(req, res, requestString, args);
  },

  getReservations: function (req, res) {
    const requestString = '[dbo].[Get_Reservations]';
    const queryArgs = req.params;
    const args = [
      { name: "Plant", type: TYPES.NVarChar, value: queryArgs.plant },
      { name: "Material", type: TYPES.NVarChar, value: queryArgs.material },
      { name: "ERP", type: TYPES.NVarChar, value: queryArgs.erp }
    ];
    requestHandler(req, res, requestString, args);
  },

  getBOM: function (req, res) {
    const requestString = '[dbo].[Get_BOM_Explosion]';
    const queryArgs = req.params;
    const args = [
      { name: "Plant", type: TYPES.NVarChar, value: queryArgs.plant },
      { name: "Material", type: TYPES.NVarChar, value: queryArgs.material },
    ];
    requestHandler(req, res, requestString, args);
  },

  getMaterialMovement: function (req, res) {
    const requestString = '[dbo].[Get_Material_Movement]';
    const queryArgs = req.params;
    const args = [
      { name: "Plant", type: TYPES.NVarChar, value: queryArgs.plant },
      { name: "Material", type: TYPES.NVarChar, value: queryArgs.material },
      { name: "ERP", type: TYPES.NVarChar, value: queryArgs.erp },
    ];
    requestHandler(req, res, requestString, args);
  },

  getFunctionalLocation: function (req, res) {
    const requestString = '[dbo].[Get_Functional_Location]';
    const queryArgs = req.params;
    const args = [
      { name: "Plant", type: TYPES.NVarChar, value: queryArgs.plant },
      { name: "Material", type: TYPES.NVarChar, value: queryArgs.material },
      { name: "MRPArea", type: TYPES.NVarChar, value: queryArgs.mrparea },
      { name: "ERP", type: TYPES.NVarChar, value: queryArgs.erp }
    ];
    requestHandler(req, res, requestString, args);
  },

  getWarehouse: function (req, res) {
    const requestString = '[dbo].[Get_Warehouse]';
    const queryArgs = req.params;
    const args = [
      { name: "Plant", type: TYPES.NVarChar, value: queryArgs.plant },
      { name: "Material", type: TYPES.NVarChar, value: queryArgs.material },
    ];
    requestHandler(req, res, requestString, args);
  },

  getChangelogs: function (req, res) {
    const requestString = '[dbo].[Get_Changelogs]';
    const queryArgs = req.params;
    const args = [
      { name: "PlantID", type: TYPES.NVarChar, value: queryArgs.plant },
      { name: "MaterialID", type: TYPES.NVarChar, value: queryArgs.material },
      { name: "ERP", type: TYPES.NVarChar, value: queryArgs.erp },
      { name: "MRPArea", type: TYPES.NVarChar, value: queryArgs.mrparea }
    ];
    requestHandler(req, res, requestString, args);
  },

  postChangelog: function (req, res) {
    const requestString = '[dbo].[Create_Changelog]';
    const changeObject = req.body;
    const queryArgs = req.params;
    const changes = changeObject.changes[0];
    const args = [
      { name: "PLANT_ID", type: TYPES.NVarChar, value: changeObject.plant },
      { name: "MATERIAL_ID", type: TYPES.NVarChar, value: changeObject.material },
      { name: "ERP", type: TYPES.NVarChar, value: queryArgs.erp },
      { name: "MRPArea", type: TYPES.NVarChar, value: queryArgs.mrparea },
      { name: "CHANGED_BY_ID", type: TYPES.VarChar, value: changeObject.changedBy },
      { name: "CHANGED_BY_EMAIL", type: TYPES.VarChar, value: changeObject.changedByEmail },
      { name: "ROP_OLD", type: TYPES.VarChar, value: changes.ReorderPoint_OLD },
      { name: "ROP_NEW", type: TYPES.VarChar, value: changes.ReorderPoint_NEW },
      { name: "MAX_OLD", type: TYPES.VarChar, value: changes.MaximumStockLevel_OLD },
      { name: "MAX_NEW", type: TYPES.VarChar, value: changes.MaximumStockLevel_NEW },
      { name: "MLS_OLD", type: TYPES.VarChar, value: changes.MinimumLotSize_OLD },
      { name: "MLS_NEW", type: TYPES.VarChar, value: changes.MinimumLotSize_NEW },
      { name: "ROUNDING_VALUE_OLD", type: TYPES.Int, value: changes.RoundingValue_OLD },
      { name: "ROUNDING_VALUE_NEW", type: TYPES.Int, value: changes.RoundingValue_NEW },
      { name: "SERVICE_LEVEL_NEW", type: TYPES.VarChar, value: changes.RecommenedSL_NEW },
      { name: "BASE_UNIT_OF_MEASURE", type: TYPES.VarChar, value: changes.BASE_UNIT_OF_MEASURE_SAP_ID },
      { name: "COMMENT", type: TYPES.VarChar, value: changes.COMMENTS },
      { name: "MI", type: TYPES.Decimal, value: changes.MONITORY_IMPACT },
      { name: "MI_IND", type: TYPES.VarChar, value: changes.MONITORY_IMPACT_INDICATOR },
      { name: "CURRENCY_CD", type: TYPES.VarChar, value: changes.CURRENCY },
      { name: "UNIT_COST", type: TYPES.Decimal, value: changes.UNIT_COST },
      { name: "UNRISTRICRTED_STOCK_QUANTITY", type: TYPES.BigInt, value: changes.TOTAL_STOCK },

      // { name: "CHANGE_LOG_TABLE", type: TYPES.TVP, value: changeLogTable }
    ];
    console.log('args', args);
    requestHandler(req, res, requestString, args);
  },

  getMaterialChangelogs: function (req, res) {
    const requestString = spLists.getMaterialChangelogs;
    const queryArgs = req.params;
    const args = [
      { name: "Material", type: TYPES.NVarChar, value: queryArgs.material },
      { name: "ERP", type: TYPES.NVarChar, value: queryArgs.erp },
      { name: "Plant", type: TYPES.NVarChar, value: queryArgs.plant }
    ];
    requestHandler(req, res, requestString, args);
  },

  getPurchasing: function (req, res) {
    const requestString = spLists.getPurchasing;
    const queryArgs = req.params;
    const args = [
      { name: "Plant", type: TYPES.NVarChar, value: queryArgs.plant },
      { name: "Material", type: TYPES.NVarChar, value: queryArgs.material },     
      { name: "MRPArea", type: TYPES.NVarChar, value: queryArgs.mrparea },
      { name: "ERP", type: TYPES.NVarChar, value: queryArgs.erp },
    ];
    requestHandler(req, res, requestString, args);
  },

  getLongText: function (req, res) {
    const requestString = spLists.getLongText;
    const queryArgs = req.params;
    const args = [
      { name: "plant", type: TYPES.NVarChar, value: queryArgs.plant },
      { name: "material", type: TYPES.NVarChar, value: queryArgs.material },
    ];
    requestHandler(req, res, requestString, args);
  },

  getClassification: function (req, res) {
    const requestString = spLists.getClassification;
    const queryArgs = req.params;
    const args = [
      { name: "material", type: TYPES.NVarChar, value: queryArgs.material }
    ];
    requestHandler(req, res, requestString, args);
  },

  postpone: function (req, res) {
    const requestString = spLists.postpone;
    const queryArgs = req.body;
    const args = [
      { name: 'PlantID', type: TYPES.NVarChar, value: queryArgs.PlantID },
      { name: 'MaterialID', type: TYPES.NVarChar, value: queryArgs.MaterialID },
      { name: 'PostponeToDate', type: TYPES.Date, value: queryArgs.PostponeToDate },
      //{ name: 'PostponedBy', type: TYPES.NVarChar, value: queryArgs.PostponedBy },
      { name: 'UserID', type: TYPES.NVarChar, value: queryArgs.UserID },
      { name: 'MRPArea', type: TYPES.NVarChar, value: queryArgs.MRPArea },
      { name: 'ERP', type: TYPES.NVarChar, value: queryArgs.ERP }
    ];
    requestHandler(req, res, requestString, args);
  },

  clearPostponement: function (req, res) {
    const requestString = spLists.clearPostponement;
    const queryArgs = req.body;
    const args = [
      { name: 'PlantID', type: TYPES.NVarChar, value: queryArgs.PlantID },
      { name: 'MaterialID', type: TYPES.NVarChar, value: queryArgs.MaterialID },
      { name: 'MRPArea', type: TYPES.NVarChar, value: queryArgs.MRPArea },
      { name: 'ERP', type: TYPES.NVarChar, value: queryArgs.ERP }
    ];
    requestHandler(req, res, requestString, args);
  },

  setAsReviewed: function (req, res) {
    const requestString = spLists.setAsReviewed;
    const queryArgs = req.body;
    const args = [  
      { name: 'PlantID', type: TYPES.NVarChar, value: queryArgs.PlantID },
      { name: 'MaterialID', type: TYPES.BigInt, value: queryArgs.MaterialID },
      { name: 'ReviewedBy', type: TYPES.NVarChar, value: queryArgs.ReviewedBy },
      { name: 'MRPArea', type: TYPES.NVarChar, value: queryArgs.MRPArea },
      { name: 'ERP', type: TYPES.NVarChar, value: queryArgs.ERP },
    ];
    requestHandler(req, res, requestString, args);
  },

  getIOTAComments: function (req, res) {
    const requestString = spLists.getIOTAComments;
    const queryArgs = req.params;
    const args = [
      { name: "Plant", type: TYPES.NVarChar, value: queryArgs.plant },
      { name: "Material", type: TYPES.NVarChar, value: queryArgs.material },
    ];
    requestHandler(req, res, requestString, args);
  },

  addIOTAComment: function (req, res) {
    const requestString = spLists.addIOTAComment;
    const params = req.params;
    const body = req.body;
    const args = [
      { name: "UserID", type: TYPES.UniqueIdentifier, value: body.UserID },
      { name: "UserEmail", type: TYPES.NVarChar, value: body.UserEmail },
      { name: "UserName", type: TYPES.NVarChar, value: body.UserName },
      { name: "Plant", type: TYPES.NVarChar, value: params.plant },
      { name: "Material", type: TYPES.NVarChar, value: params.material },
      { name: "Content", type: TYPES.NVarChar, value: body.Content },
    ];
    requestHandler(req, res, requestString, args);
  },

  deleteIOTAComment: function (req, res) {
    const requestString = spLists.deleteIOTAComment;
    const UserID = jwt_decode(req.headers.authorization.split(' ')[1])?.oid
    const body = req.body;
    const args = [
      { name: "ID", type: TYPES.UniqueIdentifier, value: body.ID },
      { name: "UserID", type: TYPES.UniqueIdentifier, value: UserID },
    ];
    requestHandler(req, res, requestString, args);
  },

  adminDeleteIOTAComment: function (req, res) {
    const requestString = spLists.deleteIOTAComment;
    const body = req.body;
    const args = [
      { name: "ID", type: TYPES.UniqueIdentifier, value: body.ID },
      { name: "UserID", type: TYPES.UniqueIdentifier, value: body.UserID },
    ];
    requestHandler(req, res, requestString, args);
  },
}
