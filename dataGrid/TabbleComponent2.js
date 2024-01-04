/* eslint-disable */
import React from 'react';
import { FlatList, StyleSheet, View , Text, ScrollView, ActivityIndicator, Pressable} from 'react-native';
import {useState, useRef, useEffect, useMemo, useCallback, useReducer} from 'react';
import { fetchData } from './fetchDataQuery';
import PaginationPanel from './PaginationPanel';
import { ACTION } from './Actions';
import { reducer } from './Reducer';
import { MemoizedItem } from './RenderRowData';
import IconButton from './ui/IconButton';
import { useQuery, useMutation, useQueryClient } from "react-query"

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
  sortBy: "",
  sortDirection: "",
  rowsPerPage: [
    {label: '10', value: '10'},
    {label: '20', value: '20'},
    {label: '30', value: '30'},
    {label: '40', value: '40'},
  ]
}

const TableOne = () => {
    
  const queryClient = useQueryClient()
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
    const paginationQuery = {
      isLoading,
      isError,
      error,
      data: customers,
      isFetching,
      isStale,
      isPreviousData
      } = useQuery(['customers', state.currentPage],
      () => fetchData({currentPage: state.currentPage, pageSize: state.pageSize, sortBy: state.sortBy, sortDirection: state.sortDirection},{
        // keepPreviousData: true,
        // cacheTime: 0.1 * 60 * 1000,
        staleTime: 5 * 60 * 1000,

    }),
    {
      onSuccess: (customers) => {
        dispatch({ type: ACTION.SET_RECORD_COUNT, payload: customers[1][0].RecordCount });
        dispatch({ type: ACTION.SET_PAGE_COUNT, payload: customers[1][0].PageCount });
        const columns = createHeadersFromObject(customers[0][0]);
        const rows = customers[0]
        dispatch({ type: ACTION.FETCH_SUCCESS_ROW_DATA, payload: {rows, columns} });
        
      }
    }
    )
    const [rowsPerPage, setRowsPerPage] = useState();
    
    const refFlatList1 = useRef(null);
    const refFlatList2 = useRef(null);
    
    useEffect(() => {
        console.log(paginationQuery.isStale)
  
    }, [paginationQuery.isStale])
    
    
    const onPageChange = (direction) => {
      dispatch({ type: ACTION.UPDATE_CURRENT_PAGE, payload: direction });
    };

    const onSortByColumn = (sortByCol) => {
      const { sortDirection, currentPage, pageSize, sortBy } = state;
      let newSortDirection = '';

      if(sortByCol !== sortBy) newSortDirection = 'ASC';
      else if (sortDirection === 'ASC') newSortDirection = 'DESC';
      else if (sortDirection === 'DESC') {newSortDirection = ''; sortByCol = '';}
      else newSortDirection = 'ASC';
    
      dispatch({ type: ACTION.SET_SORT_DIRECTION, payload: newSortDirection });
      dispatch({ type: ACTION.SORT_BY, payload: sortByCol });
    
      fetchData({currentPage: currentPage, pageSize: pageSize, sortBy: sortByCol, sortDirection: newSortDirection})
    };

     const handleRowPress = useCallback((index) => {
      // dispatch({ type: ACTION.SELECT_ROW, payload: index })
      setSelectedRow(index)
      // styleDispatch({ type: 'selectRow', payload: index })
    }, [selectedRow]);


    const [selectedRow, setSelectedRow] = useState(null);

    // useEffect(() => {
    //     fetchExtractOfCustomer(state.currentPage, state.pageSize, state.sortBy, state.sortDirection);
    // }, [state.currentPage, state.pageSize]);
    
    const renderItem = ({ item, index }) => {
      let rowSelection = false
      if(index == selectedRow) {rowSelection = true}
      return <MemoizedItem item={item} index={index} handleRowPress={handleRowPress} rowSelection={rowSelection} columns={state.columns}/>;
    };

    return (
        <View >
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
                        onPageChange={onPageChange} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} isLoading={isLoading} isPreviousData={isPreviousData}
                        dispatch={dispatch} state={state}/>
                    </View>
              </View>
              {isLoading ? <ActivityIndicator style={styles.loadingOverlay} size="large" color="gray"/> : 
              <ScrollView  horizontal={true}> 
                <View >
                    <View style={{ flexDirection: 'row'}}>
                      {state.columns.map((col,index) => (
                        <Pressable onPress={() => onSortByColumn(col.name)} key={col.key}>
                          <View horizontal={true} style={styles.columnHeader} >
                            <View >
                                <Text style={styles.columnText}>{col.name}</Text>                             
                            </View>
                            <View style={styles.sortingButton}>
                            {state.sortBy === col.name && (
                              <IconButton onPress={() => onSortByColumn(col.name)} icon={state.sortDirection == 'ASC' ? 'arrow-up' : state.sortDirection == 'DESC' ? 'arrow-down' : 'cup-off'} color="#707070" size="medium"/>
                              )}
                            </View>
                          </View>
                          </Pressable>
                       ))}
                        
                    </View>
                    <FlatList ref={refFlatList2} data={customers[0]} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} 
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
    columnContainer: {
      flexDirection: 'row',
      minHeight: 40,
    },
    columnHeader: { 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: 200,
        backgroundColor: '#FFFFFF',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        minHeight: 44,
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
    sortingButton: {
        backgroundColor: 'transparent',
        paddingHorizontal: 1
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
  
