const axios = require('axios');
const requestHandler = require('../utils/requestHandler');
const commonMethods = require('../utils/commonMethods');
const TYPES = require('tedious').TYPES;
const spLists = require('../config/spLists');
const { csvToken } = process.env;

function materialListSearchBuilder (req) {
  const queryArgs = req.body;
  const searchFilters = queryArgs.SearchFilters;
  const searchFilterTable=commonMethods.generateSearchFilterTable(searchFilters);
  console.log('Testing Git Repo Deployment');
  const args = [
    { name: "SearchFilters", type: TYPES.TVP, value: searchFilterTable },
    { name: "OffsetPageNo", type: TYPES.Int, value: queryArgs.OffsetPageNo },
    { name: "NoOfRecords", type: TYPES.Int, value: queryArgs.NoOfRecords },
    { name: "userID", type: TYPES.VarChar, value: queryArgs.UserID },
  ];
  if (queryArgs.SortColumn) args.push({ name: "SortColumn", type: TYPES.NVarChar, value: queryArgs.SortColumn });
  if (queryArgs.SortDirection) args.push({
      name: "SortDirection",
      type: TYPES.NVarChar,
      value: queryArgs.SortDirection,
  });
  return args;
}

module.exports = {
  getMaterialColumns: function (req, res) {
    const requestString = spLists.getMaterialColumns
    requestHandler(req, res, requestString)
  },

  getMaterialList: function (req, res) {
    const requestString = '[dbo].[Get_MaterialList]';
    const args = materialListSearchBuilder(req);
    requestHandler(req, res, requestString, args);
  },
  materialListAdvSearch: function (req, res) {
    const requestString = "[dbo].[Get_MaterialList_ASearch]";
    const args = materialListSearchBuilder(req);
    requestHandler(req, res, requestString, args);
  },
  getMaterialListDownload: function (req, res) {
    const requestString = '[dbo].[Get_MaterialList_Download]';
    const queryArgs = req.body;
    const searchFilters = queryArgs.SearchFilters;
    const searchFilterTable=commonMethods.generateSearchFilterTable(searchFilters);
    const args = [
      { name: "SearchFilters", type: TYPES.TVP, value: searchFilterTable },
      { name: "userID", type: TYPES.VarChar, value: queryArgs.UserID },

    ];
  if (queryArgs.SortColumn) args.push({ name: "SortColumn", type: TYPES.NVarChar, value: queryArgs.SortColumn });
  if (queryArgs.SortDirection) args.push({
      name: "SortDirection",
      type: TYPES.NVarChar,
      value: queryArgs.SortDirection,
  });
    requestHandler(req, res, requestString, args);
  },
  getFodDownload: function (req, res) {
    const requestString = spLists.getFodData;
    const queryArgs = req.query;
    const args = [
      { name: 'UserID', type: TYPES.NVarChar, value: queryArgs.user },
    ];
    requestHandler(req, res, requestString, args);
  },

  getDistinctCurrency: function (req, res) {
    const requestString = '[dbo].[Get_DistinctCurrency]';
    requestHandler(req, res, requestString);
  },

  materialListSearchCount: function (req, res) {
    const requestString = "[dbo].[Get_MaterialListSearchCount]";
    const args = materialListSearchBuilder(req);
    requestHandler(req, res, requestString, args);
  },

  setUserView: function (req, res) {
    const requestString = spLists.setUserView;
    const queryArgs = req.body;
    const args = [
      { name: 'User_ID', type: TYPES.NVarChar, value: queryArgs.User_ID },
      { name: 'User_Email', type: TYPES.NVarChar, value: queryArgs.User_Email },
      { name: 'View_Name', type: TYPES.NVarChar, value: queryArgs.View_Name },
      { name: 'View_Setup', type: TYPES.NVarChar, value: queryArgs.View_Setup },
    ];
    requestHandler(req, res, requestString, args);
  },
  bulkReview: function (req, res) {
    const requestString = spLists.setAsBulkReviewed;
    console.log(req.body);
    const queryArgs = req.body;
    var Rows = [];
    queryArgs.forEach(function (obj) {
      var tempRow = [obj.plantID, obj.materialID,obj.reviewedBy,obj.mrpArea, obj.erp];
      Rows.push(tempRow);
    });
    var table = {
      columns: [
        { name: "plantID", type: TYPES.NVarChar, length: 40 },
        { name: "materialID", type: TYPES.NVarChar, length: 40 },
        { name: "reviewedBy", type: TYPES.NVarChar, length: 40 },
        { name: "mrpArea", type: TYPES.NVarChar, length:40},
        { name: "erp", type: TYPES.NVarChar, length:40},
      ],
      rows: Rows
    }
    const args = [
      { name: "material_bulk_review", type: TYPES.TVP, value: table },
    ];
    requestHandler(req, res, requestString, args);
  },
  getUserViews: function (req, res) {
    const requestString = spLists.getUserViews;
    const queryArgs = req.query;
    const args = [
      { name: 'User_ID', type: TYPES.NVarChar, value: queryArgs.user },
    ];
    requestHandler(req, res, requestString, args);
  },

  deleteUserView: function (req, res) {
    const requestString = spLists.deleteUserView;
    const queryArgs = req.query;
    const args = [
      { name: 'User_ID', type: TYPES.NVarChar, value: queryArgs.User_ID },
      { name: 'View_Name', type: TYPES.NVarChar, value: queryArgs.View_Name },
    ];
    requestHandler(req, res, requestString, args);
  },
  
  getDropdownValues: function (req, res) {
    const requestString = spLists.getDropdownValues;
    requestHandler(req, res, requestString);
  },
  getFacilitiesValues: function (req, res) {
    const requestString = spLists.getFacilitiesValues;
    requestHandler(req, res, requestString);
  },

  generateCSV: function (req, res) {
    const queryArgs = req.body;
    const searchFilterTable=commonMethods.generateSearchFilterTable(queryArgs);
    const csv_param = JSON.stringify(searchFilterTable);
    const data = {
      job_id: 876,
      notebook_params: {
        csv_param: csv_param,
      },
    };
    const Authorization = `Bearer ${csvToken}`;
    const headers = {
      Authorization,
    };
    axios.request({
      url: 'https://adb-193993614349082.2.azuredatabricks.net/api/2.0/jobs/run-now',
      method: 'POST',
      headers,
      data: data,
    }).then(({ data: reply }) => {
      res.send({ success: true, responseData: reply, error: null });
    }).catch((error) => {
      console.log(error)
      res.send({ success: false, responseData: undefined, error: error });
    });
  },

  getCSV: function (req, res) {
    const Authorization = `Bearer ${csvToken}`;
    const headers = {
      Authorization,
    };
    const queryArgs = req.params;
    const jobId = queryArgs.run_id;
    axios.request({
      url: 'https://adb-193993614349082.2.azuredatabricks.net/api/2.0/jobs/runs/get-output?run_id=' + jobId,
      method: 'GET',
      headers,
    }).then(({ data: reply }) => {
      res.send({ success: true, responseData: reply, error: null });
    }).catch((error) => {
      res.send({ success: false, responseData: undefined, error: error });
    });
  },
}
