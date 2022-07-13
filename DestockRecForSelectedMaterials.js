import { Button } from 'antd';
import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmModal from '../../../Common/ConfirmModal';
import allActions from '../../../../actions';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {createNewDataSourceForBulkApproval} from '../../MultiPlant/util';
import { createIOTAPayloadForBulkApproval } from '../../MaterialDetails/components/SummaryComponents/Recommendations/Generators';

const DestockRecForSelectedMaterils = (props) => {

    const selectedItems = _.get(props, 'selectedMaterials', []);
    const [confirmationData, setConfirmationData] = useState({});
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.authState?.userDetails);

    const desctockRec = () => {
        let selectedMaterials = _.cloneDeep(selectedItems);
        let changeLogPayload = [];
        setConfirmationVisible(false);
        selectedMaterials = _.map(selectedMaterials, eachMaterial => _.extend({reviewdBy: authState?.uid}, eachMaterial));
        _.forEach(selectedMaterials, (eachPlantMaterial)=>{
            const newDataSource = createNewDataSourceForBulkApproval(eachPlantMaterial);
            const iotaPayload = createIOTAPayloadForBulkApproval(eachPlantMaterial?.PLANT_FACILITY_SAP_ID, eachPlantMaterial?.MATERIAL_TYPE_SAP_ID, newDataSource, eachPlantMaterial);
            changeLogPayload.push(iotaPayload);
        })
        const destockPayaload = {changes: changeLogPayload, changedBy: authState?.uid, changedByEmail: authState?.mail}
        console.log(allActions);
        //dispatch(allActions.MaterialDetailsActions.bulkApprove(destockPayaload));
      };

    const confirmData = {
        desctockRec: {
            message: 'Are you sure you want to destock rec. for all selected materials?',
            title: 'Destock Recommendations',
            onOK: desctockRec,
        }
    };

    const openReviewConfirmationModal = () => {
        setConfirmationData(confirmData?.desctockRec);
        setConfirmationVisible(true)
    }

    return (
        <>
            <Button
                type="primary"
                className="matlist-button"
                onClick={() => openReviewConfirmationModal()}
            >
                Destock Rec
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

export default memo(DestockRecForSelectedMaterils);

DestockRecForSelectedMaterils.defaultProps = {
    selectedMaterials: []
};

DestockRecForSelectedMaterils.propTypes = {
    selectedMaterials: PropTypes.arrayOf(PropTypes.object),
};
