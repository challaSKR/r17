import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Drawer, Spin, Switch, Tooltip,
} from 'antd';
import { FileExcelOutlined, SearchOutlined } from '@ant-design/icons';
// import {
//   Button, Drawer, Switch, Tooltip,
// } from 'antd';
// import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import ColumnSelector from './HeaderComponents/ColumnSelector';
import SaveWorklist from './HeaderComponents/SaveWorklist';
import UserViews from './HeaderComponents/UserViews';
import { modes } from './MaterialListFunctions';
import AdvancedSearchContainer from './HeaderComponents/AdvancedSearch/AdvancedSearchContainer';
import CSVDownload from './HeaderComponents/CSVDownload';
import BomDownload from './HeaderComponents/BomDownload';
import ReviewData from './HeaderComponents/ReviewData';
import AcceptRecForAllMaterials from './HeaderComponents/AcceptRecForAllMaterials';
import DestockRecForSelectedMaterials from './HeaderComponents/DestockRecForSelectedMaterials';
import FODDownload from './HeaderComponents/FODDownload';

import allActions from '../../../actions';
import InfoModal from '../../Common/InfoModal';

const MaterialTableHeader = ({
  setDisplayHeaderCells,
  worklistID,
  worklistDetails,
  userName,
  updateFilters,
  displayHeaderCells,
  allHeaderCells,
  selectedItems,
  selectedMaterials,
  mode,
  worklistHasView,
  displayData,
  materialViewState,
  setRequireFetch,
  setAllowRowClick,
}) => {
  const viewRef = useRef();
  const [advSearchDrawer, setAdvSearchDrawer] = useState(false);
  const [colSelector, setColSelector] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState('');
  const [infoModalTitle, setInfoModalTitle] = useState('');
  const useDefaultPlants = useSelector((state) => state.materialState.useDefaultPlants);

  const jobID = useSelector((state) => state.materialState.CSVID);
  const dispatch = useDispatch();

  const onPlantToggle = (checked) => {
    dispatch(allActions.MaterialListActions.setUseDefaultPlants(checked));
  };

  const getInfoModalContent = (allowed) => (allowed
    ? (
      <>
        Generating CSV file, please do not leave IOTA or close browser.
      </>
    )
    : (
      <>
        To generate a CSV file, please limit your search by
        providing at least one filter in a column header or in Advanced Search
      </>
    ));

  const generateCSV = () => {
    setInfoModalVisible(true);
    if (_.isEmpty(materialViewState.searchFilters)) {
      setInfoModalContent(getInfoModalContent(false));
      setInfoModalTitle('Please set at least one filter');
    } else {
      setInfoModalContent(getInfoModalContent(true));
      setInfoModalTitle('Generating CSV file...');
      dispatch(allActions.MaterialListActions.clearCSV());
      dispatch(allActions.MaterialListActions.generateCSV(materialViewState.searchFilters));
    }
  };

  const closeAdvSearch = () => {
    setAdvSearchDrawer(false);
  };

  const toggleAdvSearchDrawer = () => {
    if (colSelector && !advSearchDrawer) setColSelector(false);
    setAdvSearchDrawer((e) => !e);
  };

  const toggleColSelector = (val) => {
    setColSelector(val);
  };

  useEffect(() => {
    setAllowRowClick(!(colSelector || advSearchDrawer));
  }, [colSelector, advSearchDrawer]);

  return (
    <div>
      <div className="tableTitle">
        {worklistID ? `Worklist: ${worklistDetails ? worklistDetails.WorklistName : ''}` : 'Material List'}
        <span className='spanFloatRight'><CSVDownload
                headerCells={displayHeaderCells}
                materialViewState={materialViewState}
              />
              <BomDownload
                headerCells={displayHeaderCells}
                materialViewState={materialViewState}
              /></span>
        
        <div className="divDisplayColFilter" ref={viewRef}>
          <div className="divFloatRight">
            {!worklistID && (
              <span className="togglePlants">
                <Tooltip title="Apply your default plants as filter">
                  <Switch defaultChecked={!!useDefaultPlants} onChange={onPlantToggle} />
                  <span> Default plants</span>
                </Tooltip>
              </span>
            )}
            {mode !== modes.STATIC
              && (
              <Button
                type="primary"
                className="matlist-button"
                onClick={() => toggleAdvSearchDrawer()}
              >
                <SearchOutlined />
                Advanced Search
              </Button>
              )}
              {/* {selectedItems && selectedItems.length >0 && mode !== modes.STATIC
              && (
              // <Button
              //   type="primary"
              //   className="matlist-button"
              //   onClick={() => toggleAdvSearchDrawer()}
              // >
              //   Mass Review
              // </Button>
              <ReviewData 
              selectedItems={selectedItems}
              materialViewState={materialViewState}
              />
              )} */}

              {selectedItems && selectedItems.length > 0 && (
                <ReviewData selectedItems={selectedItems}></ReviewData>
              )}

              {selectedMaterials && selectedMaterials.length > 0 && (
                <AcceptRecForAllMaterials selectedMaterials={selectedMaterials}></AcceptRecForAllMaterials>
              )}
              
              {selectedMaterials && selectedMaterials.length > 0 && (
                <DestockRecForSelectedMaterials selectedMaterials={selectedMaterials}></DestockRecForSelectedMaterials>
              )}
              
            {userName ? (
              <SaveWorklist
                worklistID={worklistID}
                worklistDetails={worklistDetails}
                userName={userName}
                selectedItems={selectedItems}
                displayHeaderCells={displayHeaderCells}
                mode={mode}
                setRequireFetch={setRequireFetch}
              />
            ) : null}
            <ColumnSelector
              setDisplayHeaderCells={setDisplayHeaderCells}
              displayHeaderCells={displayHeaderCells}
              allHeaderCells={allHeaderCells}
              colSelVisible={colSelector}
              setColSelVisible={toggleColSelector}
            />
            <UserViews
              displayHeaderCells={displayHeaderCells}
              worklistID={worklistID}
              mode={mode}
              worklistHasView={worklistHasView}
            />
            {' '}
            {displayData && displayHeaderCells && mode !== modes.STATIC
              && (
                <>
                  <InfoModal
                    content={infoModalContent}
                    title={infoModalTitle}
                    visible={infoModalVisible}
                    onCancel={() => setInfoModalVisible(false)}
                  />
                  {/* <Button type="primary" visible={false} className="matlist-button" onClick={generateCSV}> */}
                  <Button type="primary" style={{display:'none'}}  onClick={generateCSV}>

                    {!jobID ? <FileExcelOutlined /> : <Spin style={{ marginRight: '6px' }} />}
                    {!jobID ? 'Generate ' : 'Generating CSV'}
                  </Button>
              <FODDownload
                headerCells={displayHeaderCells}
                materialViewState={materialViewState}
              />
            
                </>

              )}
          </div>
        </div>
      </div>

      <Drawer
        title="Advanced search"
        placement="top"
        height="50%"
        visible={advSearchDrawer}
        closable
        onClose={closeAdvSearch}
      >
        <AdvancedSearchContainer
          onClose={closeAdvSearch}
          updateFilters={updateFilters}
        />
      </Drawer>
    </div>

  );
};
export default MaterialTableHeader;

MaterialTableHeader.defaultProps = {
  worklistID: undefined,
  worklistDetails: undefined,
  userName: undefined,
  selectedItems: [],
  worklistHasView: false,
  displayData: undefined,
  selectedMaterials: []
};

MaterialTableHeader.propTypes = {
  setDisplayHeaderCells: PropTypes.func.isRequired,
  worklistID: PropTypes.string,
  worklistDetails: PropTypes.objectOf(PropTypes.any),
  userName: PropTypes.string,
  updateFilters: PropTypes.func.isRequired,
  displayHeaderCells: PropTypes.arrayOf(PropTypes.any).isRequired,
  allHeaderCells: PropTypes.arrayOf(PropTypes.any).isRequired,
  selectedItems: PropTypes.arrayOf(PropTypes.object),
  mode: PropTypes.oneOf(Object.values(modes)).isRequired,
  worklistHasView: PropTypes.bool,
  displayData: PropTypes.arrayOf(PropTypes.any),
  materialViewState: PropTypes.objectOf(PropTypes.any).isRequired,
  setRequireFetch: PropTypes.func.isRequired,
  setAllowRowClick: PropTypes.func.isRequired,
  selectedMaterials: PropTypes.arrayOf(PropTypes.any).isRequired
};
