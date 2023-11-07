/* eslint-disable */
import React from 'react';
import { FlatList, StyleSheet, View , Text, ScrollView, ActivityIndicator, Pressable} from 'react-native';
import {useState, useRef, useEffect, useMemo, useCallback, useReducer} from 'react';
import { fetchData } from './fetchDataQuery';
import PaginationPanel from './PaginationPanel';
import { combineReducers } from '@reduxjs/toolkit';
import { ACTION } from './Actions';
import { reducer } from './Reducer';
import { MemoizedItem } from './RenderRowData';


// const styleReducer = (state, action) => {
//   switch (action.type) {
//     case 'selectRow':
//       return {selectedRow: action.payload };
//     default:
//       throw new Error();
//   }
// }

// function formatCurrencyTL(value) {
//   return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
// }
export function formatCurrencyTL(value) {
  return (new Intl.NumberFormat().format(value));
}
export function styledNumericRow(isNumeric) {
  return isNumeric ? {textAlign: 'right'} : {textAlign: 'center'}
}

export function isNumber(value) {
  if (typeof value === 'number' && !isNaN(value)) {
    return true;
  } 
  // else if (typeof value === 'string' && !isNaN(parseFloat(value))) {
  //   return true;
  // }
  return false;
}

function createHeadersFromObject(obj) {
  const columns = Object.keys(obj).map((name, index) => ({
    key: index + 1,
    name: name,
    isNumeric: false
  }));
  return columns;
}

function createRowsFromObject(objArray) {
  return objArray.map((obj, index) => {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
      newObj[key] = {
        key: index + 1,
        value: obj[key],
        isNumeric: isNumber(obj[key])
      };
    });
    return newObj;
  });
}

const INITIAL_STATE = {
  pageCount: 0, 
  recordCount: 0, 
  currentPage: 1, 
  pageSize: '20', 
  selectedRow: null, 
  loading: false,
  rowData: "",
  columns: [],
  error: "",
  rowsPerPage: [
    {label: '10', value: '10'},
    {label: '20', value: '20'},
    {label: '30', value: '30'},
    {label: '40', value: '40'},
  ]
}

const TableOne = () => {

  console.log('rendered')

    const token = process.env.TOKEN;
    const userToken = process.env.USER_TOKEN;
    const url = process.env.API_URL;
    
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
    // const [styleState, styleDispatch] = useReducer(styleReducer, {selectedRow: 0 })
    const [rowsPerPage, setRowsPerPage] = useState();
    
    const refFlatList1 = useRef(null);
    const refFlatList2 = useRef(null);
    // const [loading, setLoading] = useState(false)
    // const [pageCount, setPageCount] = useState(0);
    // const [recordCount, setRecordCount] = useState(0);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [pageSize, setPageSize] = useState('20');
    // const [rowsPerPages, setRowsPerPages] = useState([
    //   {label: '10', value: '10'},
    //   {label: '20', value: '20'},
    //   {label: '30', value: '30'},
    //   {label: '40', value: '40'},
    // ]); 

    const onPageChange = (direction) => {
      dispatch({ type: ACTION.UPDATE_CURRENT_PAGE, payload: direction });
    };

     const handleRowPress = useCallback((index) => {
      // dispatch({ type: ACTION.SELECT_ROW, payload: index })
      setSelectedRow(index)
      // styleDispatch({ type: 'selectRow', payload: index })
    }, []);

    // const [rowData, setRowData] = useState(null)
    // const [columns, setColumns] = useState([]);

    const [selectedRow, setSelectedRow] = useState(null);
     
      const createPostFormData = useCallback(( currentPage, PageSize) => {
        const formData = new FormData();
        formData.append('PageNumber', currentPage);
        formData.append('PageSize', PageSize);
        formData.append('Token', token);
        formData.append('user_token', userToken);
        return formData;
      }, [token, userToken]);
    
      const fetchExtractOfCustomer = async (currentPage, PageSize) => {
        try {
          dispatch({ type: ACTION.FETCH_START });
          const params = createPostFormData(currentPage, PageSize)
          const data = await fetchData(url, params);
          // setRowData(data[0])
          dispatch({ type: ACTION.SET_RECORD_COUNT, payload: data[1][0].RecordCount });
          dispatch({ type: ACTION.SET_PAGE_COUNT, payload: data[1][0].PageCount });  

          const columns = createHeadersFromObject(data[0][0]);
          // const rows = createRowsFromObject(data[0]);
          const rows = data[0]
          dispatch({ type: ACTION.FETCH_SUCCESS_ROW_DATA, payload: {rows, columns} });
          // dispatch({ type: ACTION.FETCH_SUCCESS_COLUMNS, payload: columns });
          // setColumns(columns)
          // setRowData(rows)
    
        } catch (error) {
          dispatch({ type: ACTION.FETCH_ERROR, payload: error.message });
        }       
      };

    useEffect(() => {
        fetchExtractOfCustomer(state.currentPage, state.pageSize);
    }, [state.currentPage, state.pageSize]);
    
    const renderItem = ({ item, index }) => {
      return <MemoizedItem item={item} index={index} handleRowPress={handleRowPress} selectedRow={selectedRow} columns={state.columns} />;
    };

    return (
        <View style={{ flexDirection: 'col' }}>
           {/* <ScrollView  horizontal={true} >
                <View style={{ flexDirection: 'col' }} >
                    <View style={{ flexDirection: 'row' }}>
                    {pinnedColumns.map((col,index) => (
                        index == 0 ? 
                          <View style={styles.columnHeader} key={col.key}>
                            <Text style={styles.columnText}>{col.name}</Text>
                          </View> :
                          <View horizontal={true} style={styles.columnHeader} key={col.key}>
                              <Text style={styles.columnText}>{col.name}</Text>
                          </View>
                          ))}
                    </View>
                    <FlatList ref={refFlatList1} data={rowData} renderItem={renderPinnedItem} keyExtractor={(item, index) => index.toString()} 
                    />
                </View>
            </ScrollView> */}
              <View style={{ flexDirection: 'row' }}>
                    <View style={styles.paginationContainer} >
                        <PaginationPanel 
                        onPageChange={onPageChange} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage}
                        dispatch={dispatch} state={state}/>
                    </View>
              </View>
              {state.loading ? <ActivityIndicator style={styles.loadingOverlay} size="large" color="gray"/> : 
              <ScrollView  horizontal={true} > 
                <View style={{ flexDirection: 'col' }} >
                    <View style={{ flexDirection: 'row' }}>
                    {state.columns.map((col,index) => (
                        index == 0 ? 
                          <View style={styles.columnHeader} key={col.key}>
                            <Text style={styles.columnText}>{col.name}</Text>
                          </View> :
                          <View horizontal={true} style={styles.columnHeader} key={col.key}>
                              <Text style={styles.columnText}>{col.name}</Text>
                          </View>
                          ))}
                    </View>
                    <FlatList ref={refFlatList2} data={state.rowData} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} 
                    />
                </View>
            </ScrollView>}
        </View>
    )
}
export default TableOne



const styles = StyleSheet.create({
    rows: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    columnHeader: { 
        width: 200,
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
    },
    stickyColumnHeader: {
        width: 200,
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',

    },
    columnText: { 
        fontSize: 14,
        fontWeight: 'bold' , 
        textAlign: 'center',
        color: '#212121',
        
    },
    rowCell: { 
        width: 200,
        backgroundColor: 'transparent',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        
    },
    rowText: {
      fontSize: 14,
      fontWeight: '400',
      textAlign: 'center',
      color: '#212121',
    },
    paginationContainer: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: '#E0E0E0',
      zIndex: 2,
    },
    loadingOverlay: {   
      height: 280,
      backgroundColor: 'white',
    },
    pressableRow: {   
      flexDirection: 'row',
    },
    selectedRowStyle: {
      backgroundColor: '#E3EEFA'
    },
});
  
