/****** Object:  StoredProcedure [dbo].[Bulk_Approval_Create_Changelog]    Script Date: 7/21/2022 7:54:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:      <Author, , Name>
-- Create Date: <Create Date, , >
-- Description: <Description, , >
-- =============================================
ALTER PROCEDURE [dbo].[Bulk_Approval_Create_Changelog](
	@bulk_approval_create_changelog bulkApprovalChangeLogType READONLY
)
  AS
  BEGIN
    DECLARE 
    	    @PLANT_ID VARCHAR(40),
            @MATERIAL_ID VARCHAR(40),
            @ERP VARCHAR(40),
            @MRPArea VARCHAR(40),
            @CHANGED_BY_ID VARCHAR(40),
            @CHANGED_BY_EMAIL VARCHAR(40),
            @ROP_OLD VARCHAR(40),
            @ROP_NEW VARCHAR(40),
            @MAX_OLD VARCHAR(40),
            @MAX_NEW VARCHAR(40),
            @MLS_OLD VARCHAR(40),
            @MLS_NEW VARCHAR(40),
            @ROUNDING_VALUE_OLD INT,
            @ROUNDING_VALUE_NEW INT,
            @SERVICE_LEVEL_NEW VARCHAR(40),
            @BASE_UNIT_OF_MEASURE VARCHAR(40),
            @COMMENT VARCHAR(MAX),
            @MI DECIMAL(30,3),
            @MI_IND VARCHAR(40),
            @CURRENCY_CD VARCHAR(40),
            @UNIT_COST DECIMAL(30,3),
            @UNRISTRICRTED_STOCK_QUANTITY BIGINT;
            
    DECLARE bulk_approval_changelog_cursor CURSOR
    FOR SELECT PLANT_ID,MATERIAL_ID,ERP,MRPArea,CHANGED_BY_ID,CHANGED_BY_EMAIL,
    ROP_OLD,ROP_NEW,MAX_OLD,MAX_NEW,MLS_OLD,MLS_NEW,ROUNDING_VALUE_OLD,ROUNDING_VALUE_NEW,SERVICE_LEVEL_NEW,
    BASE_UNIT_OF_MEASURE, COMMENT, MI, MI_IND, CURRENCY_CD, UNIT_COST, UNRISTRICRTED_STOCK_QUANTITY FROM @bulk_approval_create_changelog;
    
    OPEN bulk_approval_changelog_cursor;
    
    FETCH NEXT FROM bulk_approval_changelog_cursor INTO @PLANT_ID, @MATERIAL_ID, @ERP, @MRPArea, @CHANGED_BY_ID, 
    @CHANGED_BY_EMAIL, @ROP_OLD, @ROP_NEW, @MAX_OLD, @MAX_NEW, @MLS_OLD, @MLS_NEW,
    @ROUNDING_VALUE_OLD, @ROUNDING_VALUE_NEW, @SERVICE_LEVEL_NEW, @BASE_UNIT_OF_MEASURE, 
    @COMMENT, @MI, @MI_IND, @CURRENCY_CD, @UNIT_COST, @UNRISTRICRTED_STOCK_QUANTITY;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
	
        EXEC [dbo].[Create_Changelog] @CHANGED_BY_ID, @CHANGED_BY_EMAIL, @PLANT_ID, @ERP, @MRPArea,
		@MATERIAL_ID, @SERVICE_LEVEL_NEW, @ROP_OLD, @ROP_NEW, @MAX_OLD,
		@MAX_NEW, @MLS_OLD, @MLS_NEW, @ROUNDING_VALUE_NEW, @ROUNDING_VALUE_OLD,
		@BASE_UNIT_OF_MEASURE, @MI, @MI_IND, @CURRENCY_CD,
		@UNRISTRICRTED_STOCK_QUANTITY, @UNIT_COST, @COMMENT

		FETCH NEXT FROM bulk_approval_changelog_cursor INTO @PLANT_ID, @MATERIAL_ID, @ERP, @MRPArea, @CHANGED_BY_ID, 
        @CHANGED_BY_EMAIL, @ROP_OLD, @ROP_NEW, @MAX_OLD, @MAX_NEW, @MLS_OLD, @MLS_NEW,
        @ROUNDING_VALUE_OLD, @ROUNDING_VALUE_NEW, @SERVICE_LEVEL_NEW, @BASE_UNIT_OF_MEASURE, 
        @COMMENT, @MI, @MI_IND, @CURRENCY_CD, @UNIT_COST, @UNRISTRICRTED_STOCK_QUANTITY;
    END;
    CLOSE bulk_approval_changelog_cursor;

    DEALLOCATE bulk_approval_changelog_cursor;
  END
