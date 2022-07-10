const express = require('express');
const common = require('./routes/common');
const materialDetails = require('./routes/materialDetails');
const dashboard = require('./routes/dashboard');
const materialList = require('./routes/materialList');
const worklist = require('./routes/workList');
const simulation = require('./routes/simulation');
const userAuth = require('./routes/userAuth');
const router = express.Router();


router.route('/get-user-details').post(
  userAuth.getUserDetails);
router.route('/get-user-ou-plants').post(
  userAuth.getUserOUDetails);
router.route('/audit-user-login-info').post(
  userAuth.auditUserLoginInfo);
  
// common endpoints
router.route('/column-mapper').get(
  common.getColumnMapper);
router.route('/plants').post(
  common.getPlants);
router.route('/company-codes').get(
  common.getCompanyCodes);
router.route('/plants/:plant/relationships').get(
  common.getPlantRelationships);
router.route('/set-user-setting').post(
  common.setUserSetting);
router.route('/all-user-settings').get(
  common.getAllUserSettings);
router.route('/notifications').post(
  common.getNotifications);
router.route('/notifications/accept').post(
  common.acceptNotification);
router.route('/notifications/accept-all').post(
  common.acceptAllNotifications);
router.route('/notifications/check').post(
  common.checkUnreadNotifications);

// dashboard endpoints
router.route('/plants/:plant/mrp-recommendation-stats').get(
  dashboard.getMrpRec);
router.route('/widget/optimal-inventory-status').get(
  dashboard.getOptimalInventoryByStatus);
router.route('/widget/optimal-inventory-group').get(
  dashboard.getOptimalInventoryByGroup);
router.route('/widget/inventory-value').get(
  dashboard.getInventoryValue);
router.route('/widget/optimal-inventory-total').get(
  dashboard.getOptimalInvTot);

// material list endpoints
router.route('/material-columns').get(
  materialList.getMaterialColumns);
  router.route('/material-list-asearch').post(
    materialList.materialListAdvSearch);
router.route('/material-list').post(
  materialList.getMaterialList);
router.route('/distinct-currency').get(
  materialList.getDistinctCurrency);
router.route('/material-list-download').post(
  materialList.getMaterialListDownload);
  router.route('/fod-download').get(
    materialList.getFodDownload);
router.route('/material-list-search-count').post(
  materialList.materialListSearchCount);
router.route('/user-views').post(
  materialList.setUserView);
router.route('/user-views').get(
  materialList.getUserViews);
router.route('/user-views').delete(
  materialList.deleteUserView);
router.route('/dropdown-values').get(
  materialList.getDropdownValues);
  router.route('/facilities-values').get(
    materialList.getFacilitiesValues);
router.route('/generate-CSV').post(
  materialList.generateCSV);
router.route('/generate-CSV/:run_id').get(
  materialList.getCSV);
router.route('/bulk-approve').post(
  materialList.createChangeLogForBulkApproval
);

// material details endpoints
router.route(
  '/plants/:plant/materials/:material/mrparea/:mrparea/erp/:erp'
).get(
  materialDetails.getMaterial);
  router.route(
    '/plants/:plant/materials/:material'
  ).get(
    materialDetails.getMaterialOld);
router.route(
  '/multiple-materials/mrparea/:mrparea/erp/:erp'
).post(
  materialDetails.getMaterials);
router.route(
  '/plants/:plant/materials/:material/mrparea/:mrparea/erp/:erp/consumption-history'
).get(
  materialDetails.getConsumptionHistory);
router.route(
  '/plants/:plant/materials/:material/mrparea/:mrparea/erp/:erp/reservations'
).get(
  materialDetails.getReservations);
router.route(
  '/plants/:plant/materials/:material/bill-of-materials'
).get(
  materialDetails.getBOM);
router.route(
  '/plants/:plant/materials/:material/mrparea/:mrparea/erp/:erp/material-movement'
).get(
  materialDetails.getMaterialMovement);
router.route(
  '/plants/:plant/materials/:material/mrparea/:mrparea/erp/:erp/functional-location'
).get(
  materialDetails.getFunctionalLocation);
router.route(
  '/plants/:plant/materials/:material/warehouse'
).get(
  materialDetails.getWarehouse);
router.route(
  '/plants/:plant/materials/:material/mrparea/:mrparea/erp/:erp/changelogs'
).get(
  materialDetails.getChangelogs);
router.route(
  '/plants/:plant/materials/:material/mrparea/:mrparea/erp/:erp/changelogs'
).post(
  materialDetails.postChangelog);
router.route(
  '/plants/:plant/materials/:material/mrparea/:mrparea/erp/:erp/material-changelogs'
).get(
  materialDetails.getMaterialChangelogs);
router.route(
  '/plants/:plant/materials/:material/mrparea/:mrparea/erp/:erp/purchasing'
).get(
  materialDetails.getPurchasing);
router.route(
  '/plants/:plant/materials/:material/long-text'
).get(
  materialDetails.getLongText);
router.route(
  '/materials/:material/classification'
).get(
  materialDetails.getClassification);
router.route(
  '/plants/:plant/materials/:material/postpone'
).post(
  materialDetails.postpone);
router.route(
  '/plants/:plant/materials/:material/postpone'
).delete(
  materialDetails.clearPostponement);
router.route(
  '/plants/:plant/materials/:material/review'
).post(
  materialDetails.setAsReviewed);
router.route(
  '/bulk-review'
).post(
  materialList.bulkReview);
router.route(
  '/plants/:plant/materials/:material/IOTA-comments'
).get(
  materialDetails.getIOTAComments);
router.route(
  '/plants/:plant/materials/:material/IOTA-comments'
).post(
  materialDetails.addIOTAComment);
router.route(
  '/IOTA-comments'
).delete(
  materialDetails.deleteIOTAComment);
router.route(
  '/IOTA-comments/admin'
).delete(
  materialDetails.adminDeleteIOTAComment);


// workList endpoints
router.route('/get-worklists').post(
  worklist.getWorklists);
router.route('/worklist-details').post(
  worklist.getWorkListDetails);
router.route('/create-worklist').post(
  worklist.createWorkList);
router.route('/update-worklist').post(
  worklist.updateWorkList);
router.route('/delete-worklist').post(
  worklist.deleteWorkList);
router.route('/worklists-count').post(
  worklist.getWorklistsCount);
router.route('/static-worklist').post(
  worklist.createStaticWorklist);
router.route('/static-worklist/add-items').patch(
  worklist.addToStaticWorklist);
router.route('/static-worklists').get(
  worklist.getStaticWorklists);
router.route('/static-worklist').get(
  worklist.getStaticWorklist);
router.route('/static-worklist').delete(
  worklist.removeFromStaticWL);
router.route('/static-worklists').delete(
  worklist.deleteStaticWLs);
router.route('/static-worklist').patch(
  worklist.updateStaticWL);


router.route('/simulate/search').post(
  simulation.search);
router.route('/simulate').post(
  simulation.simulate);
router.route('/simulate/:run_id').get(
  simulation.getDatabricksJobData);
router.route('/simulate/save').post(
  simulation.save);
router.route('/simulate').get(
  simulation.getAllSimJobs);
router.route('/simulate').delete(
  simulation.removeSim);

module.exports = router;
