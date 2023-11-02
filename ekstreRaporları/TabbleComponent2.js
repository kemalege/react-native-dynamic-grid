/* eslint-disable */

import { FlatList, StyleSheet, View , Text, ScrollView, ActivityIndicator, Pressable} from 'react-native';
import {useState, useRef, useEffect, useMemo, useCallback, useReducer} from 'react';
import { fetchData } from './fetchDataQuery';
import PaginationPanel from './ui/PaginationPanel';

const ACTION = {
    SELECT_ROW: 'selectRow',
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.SELECT_ROW:
      return { ...state, selectedRow: action.payload };
    default:
      throw new Error();
  }
}

function formatCurrencyTL(value) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
}

function styledNumericRow(isNumeric) {
  return isNumeric ? {textAlign: 'right'} : {textAlign: 'center'}
}

const TableOne = () => {

    const token = process.env.TOKEN;
    const userToken = process.env.USER_TOKEN;
    const url = process.env.API_URL;
  
    const [state, dispatch] = useReducer(reducer, { selectedRow: null})
    
    const refFlatList1 = useRef(null);
    const refFlatList2 = useRef(null);
    const [scrollingRightSideAmount, setScrollingRightSideAmount] = useState(0);
    const [selectedRow, setSelectedRow] = useState(0);
    const [loading, setLoading] = useState(false)

    const [pageCount, setPageCount] = useState(0);
    const [recordCount, setRecordCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState('20');
    const [rowsPerPages, setRowsPerPages] = useState([
      {label: '10', value: '10'},
      {label: '20', value: '20'},
      {label: '30', value: '30'},
      {label: '40', value: '40'},
    ]); 

    const onPageChange = (direction) => {
      setCurrentPage(currPage => {
        if ((currPage > 1 && direction < 0) || (currPage < pageCount && direction > 0)) {
          return currPage + direction;
        }
        return currPage;
      });
     }

     const handleRowPress = useCallback((index) => {
      dispatch({ type: ACTION.SELECT_ROW, payload: index })
    }, []);
     
    const onPageEnd = (direction) => {
      setCurrentPage(pageCount)
    }
    const onPageStart = (direction) => {
      setCurrentPage(1)
    }

    // const onPageSizeChange = (rowsPerPage) => {
    //   setPageSize(rowsPerPage)
    // }
    
    // const paginationProps = {
    //   pageSize,
    //   setPageSize,
    //   rowsPerPages,
    //   setRowsPerPages
    // };

    const [rowData, setRowData] = useState(null)

    const [columns, setColumns] = useState([]);
    const [pinnedColumns, setPinnedColumns] = useState([
    {
      key: 1,
      name: "CariKod",
      isNumeric: false,
    },
    ]);

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

      const createPostFormData = useCallback(( currentPage, PageSize) => {
        const formData = new FormData();
        formData.append('PageNumber', currentPage);
        formData.append('PageSize', PageSize);
        formData.append('Token', token);
        formData.append('user_token', userToken);
        return formData;
      }, []);
    
      const fetchExtractOfCustomer = async (currentPage, PageSize) => {
        try {
          setLoading(true)
          const params = createPostFormData(currentPage, PageSize)
          const data = await fetchData(url, params);
          // setRowData(data[0])
          setRecordCount(data[1][0].RecordCount)
          setPageCount(data[1][0].PageCount)
          const columns = createHeadersFromObject(data[0][0]);
          const rows = createRowsFromObject(data[0]);
          setColumns(columns)
          setRowData(rows)
    
        } catch (error) {
          console.error('Hata:', error);
        }
        setLoading(false)
      };

      function isNumber(value) {
        if (typeof value === 'number' && !isNaN(value)) {
          return true;
        } 
        // else if (typeof value === 'string' && !isNaN(parseFloat(value))) {
        //   return true;
        // }
        return false;
      }

    useEffect(() => {
        fetchExtractOfCustomer(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const renderItem = ({ item, index }) => {
        // console.log(item)
        return (
            <View style={{ flexDirection: 'row'}}>
              <Pressable
                onPress={() => handleRowPress(index)}
                style={({ pressed }) => [
                  styles.pressableRow,
                  { backgroundColor: pressed ? '#F5F5F5' : (index === state.selectedRow ? '#E3EEFA' : 'white') },
                ]}>
                {columns.map((col, index) => {
                  const value = item[col.name].value  
                  const isNumeric = item[col.name].isNumeric  
                    return (
                      <View style={styles.rowCell} key={col.key}>
                        <Text style={[styles.rowText, styledNumericRow(isNumeric)]}>
                            {isNumeric ?  formatCurrencyTL(value) : value }
                        </Text>
                    </View>)
                })}
                </Pressable>
            </View>
        );
      };
      
      const renderPinnedItem = ({ item, rowIndex }) => {
        return (
            <View style={{ flexDirection: 'col' }}>
              <Pressable
              onPress={()=> setSelectedRow(rowIndex)}
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? '#f2f0f5' : 'white',
                },
                styles.pressableRow,
              ]}>
                {pinnedColumns.map((col, index) => {      
                    return <View style={[styles.rowCell, rowIndex==selectedRow ? styles.selectedRow : '']} key={col.key}>
                        <Text style={[styles.rowText, isNumber(item[col.name]) ? {textAlign: 'right'} : {textAlign: 'center'}]}>
                            {item[col.name]}
                        </Text>
                    </View>
                })}
                </Pressable>
            </View>
        );
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
                    // onScroll={e => {
                    //   // console.log(e.nativeEvent.contentOffset.y)                  
                    //     refFlatList2.current.scrollToOffset({offset:e.nativeEvent.contentOffset.y,animated:false});                 
                    // }}
                    />
                </View>
            </ScrollView> */}
              <View style={{ flexDirection: 'row' }}>
                    <View style={styles.paginationContainer} >
                        <PaginationPanel 
                        pageSize={pageSize} setPageSize={setPageSize} rowsPerPages={rowsPerPages} setRowsPerPage={setRowsPerPages} onPageChange={onPageChange}
                        pageCount={pageCount} recordCount={recordCount} currentPage={currentPage} setCurrentPage={setCurrentPage} loading={loading} />
                    </View>
              </View>
              {loading ? <ActivityIndicator style={styles.loadingOverlay} size="large" color="gray"/> : 
              <ScrollView  horizontal={true} > 
                <View style={{ flexDirection: 'col' }} >
                    <View style={{ flexDirection: 'row' }}>
                    {columns.map((col,index) => (
                        index == 0 ? 
                          <View style={styles.columnHeader} key={col.key}>
                            <Text style={styles.columnText}>{col.name}</Text>
                          </View> :
                          <View horizontal={true} style={styles.columnHeader} key={col.key}>
                              <Text style={styles.columnText}>{col.name}</Text>
                          </View>
                          ))}
                    </View>
                    <FlatList ref={refFlatList2} data={rowData} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} 
                    // onScroll={e => {
                    //   // console.log(e.nativeEvent.contentOffset.y)
                    //     refFlatList1.current.scrollToOffset({offset:e.nativeEvent.contentOffset.y,animated:false});
                    // }}
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
  
