CREATE PROCEDURE [dbo].[Bulk_Approval_Create_Changelog]
(
  	@bulk_approval_create_changelog bulkApprovalChangeLogType READONLY
)
  AS
  BEGIN
  	DECLARE bulk_approval_changelog_cursor CURSOR
    FOR SELECT PLANT_ID,MATERIAL_ID,ERP,MRPArea,CHANGED_BY_ID,CHANGED_BY_EMAIL,
    ROP_OLD,ROP_NEW,MAX_OLD,MAX_NEW,MLS_OLD,MLS_NEW,ROUNDING_VALUE_OLD,ROUNDING_VALUE_NEW,SERVICE_LEVEL_NEW
    BASE_UNIT_OF_MEASURE, COMMENT, MI, MI_IND, CURRENCY_CD, UNIT_COST, UNRISTRICRTED_STOCK_QUANTITY FROM @bulk_approval_changelog;
    
    OPEN bulk_approval_changelog_cursor;
    
    FETCH NEXT FROM bulk_approval_changelog_cursor INTO @PLANT_ID, @MATERIAL_ID, @ERP, @MRPArea, @CHANGED_BY_ID, 
    @CHANGED_BY_EMAIL, @ROP_OLD, @ROP_NEW, @MAX_OLD, @MAX_NEW, @MLS_OLD, @MLS_NEW,
    @ROUNDING_VALUE_OLD, @ROUNDING_VALUE_NEW, @SERVICE_LEVEL_NEW, @BASE_UNIT_OF_MEASURE, 
    @COMMENT, @MI, @MI_IND, @CURRENCY_CD, @UNIT_COST, @UNRISTRICRTED_STOCK_QUANTITY;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        EXEC [dbo].[Create_Changelog] @PLANT_ID, @MATERIAL_ID, @ERP, @MRPArea, @CHANGED_BY_ID, 
    	@CHANGED_BY_EMAIL, @ROP_OLD, @ROP_NEW, @MAX_OLD, @MAX_NEW, @MLS_OLD, @MLS_NEW,
    	@ROUNDING_VALUE_OLD, @ROUNDING_VALUE_NEW, @SERVICE_LEVEL_NEW, @BASE_UNIT_OF_MEASURE, 
    	@COMMENT, @MI, @MI_IND, @CURRENCY_CD, @UNIT_COST, @UNRISTRICRTED_STOCK_QUANTITY
        
        FETCH NEXT FROM bulk_approval_changelog_cursor INTO @PLANT_ID, @MATERIAL_ID, @ERP, @MRPArea, @CHANGED_BY_ID, 
        @CHANGED_BY_EMAIL, @ROP_OLD, @ROP_NEW, @MAX_OLD, @MAX_NEW, @MLS_OLD, @MLS_NEW,
        @ROUNDING_VALUE_OLD, @ROUNDING_VALUE_NEW, @SERVICE_LEVEL_NEW, @BASE_UNIT_OF_MEASURE, 
        @COMMENT, @MI, @MI_IND, @CURRENCY_CD, @UNIT_COST, @UNRISTRICRTED_STOCK_QUANTITY;
    END;
    CLOSE bulk_approval_changelog_cursor;

	DEALLOCATE bulk_approval_changelog_cursor;
  END
