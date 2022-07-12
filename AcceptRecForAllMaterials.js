import { Button } from 'antd';
import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmModal from '../../../Common/ConfirmModal';
import allActions from '../../../../actions';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {createNewDataSourceForBulkApproval} from '../../MultiPlant/util';
import { createIOTAPayload } from '../../MaterialDetails/components/SummaryComponents/Recommendations/Generators';

const AcceptRecForAllMaterials = (props) => {

    const selectedItems = _.get(props, 'selectedMaterials', []);
    const [confirmationData, setConfirmationData] = useState({});
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [reviewComplete, setReviewComplete]=useState(false);
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.authState?.userDetails);

    const acceptRec = () => {
        let selectedMaterials = _.cloneDeep(selectedItems);
        let changeLogPayload = [];
        setConfirmationVisible(false);
        setReviewComplete(true);
        selectedMaterials = _.map(selectedMaterials, eachMaterial => _.extend({reviewdBy: authState?.uid}, eachMaterial));
        _.forEach(selectedMaterials, (eachPlantMaterial)=>{
            const newDataSource = createNewDataSourceForBulkApproval(eachPlantMaterial);
            const iotaPayload = createIOTAPayloadForBulkApproval(eachPlantMaterial?.PLANT_FACILITY_SAP_ID, eachPlantMaterial?.MATERIAL_TYPE_SAP_ID, newDataSource, eachPlantMaterial);
            changeLogPayload.push(iotaPayload);
        })
        const bulkApprovePayload = {changes: changeLogPayload, changed}
        dispatch(allActions.MaterialDetailsActions.bulkApprove(changeLogPayload));
      };

    const confirmData = {
        acceptRec: {
            message: 'Are you sure you want to accept rec. for all selected materials?',
            title: 'Accept Recommendations',
            onOK: acceptRec,
        }
    };

    const openReviewConfirmationModal = () => {
        setConfirmationData(confirmData?.acceptRec);
        setConfirmationVisible(true)
    }

    return (
        <>
            <Button
                loading={reviewComplete}
                type="primary"
                className="matlist-button"
                onClick={() => openReviewConfirmationModal()}
            >
                Accept Recommendations
            </Button>

            {
                confirmationVisible
                    ? (
                        <ConfirmModal
                            message={confirmationData?.message}
                            title={confirmationData?.title}
                            onOK={confirmationData?.onOK}
                            visible={confirmationVisible}
                            onCancel={() => setConfirmationVisible(false)}
                        />
                    )
                    : <></>
            }
        </>

    )
}

export default memo(AcceptRecForAllMaterials);

AcceptRecForAllMaterials.defaultProps = {
    selectedMaterials: []
};

AcceptRecForAllMaterials.propTypes = {
    selectedMaterials: PropTypes.arrayOf(PropTypes.object),
};
