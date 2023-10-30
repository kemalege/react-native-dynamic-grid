/* eslint-disable */

import { FlatList, StyleSheet, View , Text, ScrollView} from 'react-native';
import {useState, useRef, useEffect, useMemo} from 'react';
import { fetchData } from './fetchDataQuery';

const TableOne = () => {

    const refFlatList1 = useRef(null);
    const refFlatList2 = useRef(null);
    const [scrollingRightSideAmount, setScrollingRightSideAmount] = useState(0);

    const [rowData, setRowData] = useState([])
    const [pinnedRowData, setPinnedRowData] = useState([{
      "CariKod": "120 34 359",
      "CariIsim": "MUSTERI 3817",
      "CariIl": "ISTANBUL",
      "PlasiyerKodu": "28",
      "Tarih": "2022-01-01T00:00:00",
      "FisNo": null,
      "Aciklama": "ACIKLAMA SATIRI",
      "VadeTarihi": "2022-01-01T00:00:00",
      "BorcTutar": 369.60000000,
      "AlacakTutar": 0.00000000,
      "BorcBakiye": 369.60000000,
      "AlacakBakiye": 0.00000000
  }])

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
          isNumeric: isNumber(name)
        }));
        return columns;
      }

      function createRowsFromObject(obj) {
        const columns = Object.keys(obj).map((field, index) => ({
          key: index + 1,
          field: field,
          isNumeric: isNumber(name)
        }));
        return columns;
      }

    const postFormData = useMemo(() => {
        const formData = new FormData();
        formData.append('PageNumber', 1);
        formData.append('PageSize', 30);
        formData.append('Token', process.env.TOKEN);
        formData.append('user_token', process.env.USER_TOKEN);
        return formData;
      }, []);
    
      const fetchExtractOfCustomer = async () => {
        try {
          const url = process.env.API_URL;
          const data = await fetchData(url, postFormData);
          setRowData(data[0])
          const columns = createHeadersFromObject(data[0][0]);
        //   console.log(columns)
          setColumns(columns)
          // console.log('Veri alındı:', data[0]);
    
        } catch (error) {
          console.error('Hata:', error);
        }
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
        fetchExtractOfCustomer();
    }, []);

    const renderItem = ({ item, index }) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {columns.map((col, index) => {      
                    return <View style={styles.rowCell} key={col.key}>
                        <Text style={[styles.rowText, isNumber(item[col.name]) ? {textAlign: 'right'} : {textAlign: 'center'}]}>
                            {item[col.name]}
                        </Text>
                    </View>
                })}
            </View>
        );
      };

      const renderPinnedItem = ({ item, index }) => {
        return (
            <View style={{ flexDirection: 'col' }}>
                {pinnedColumns.map((col, index) => {      
                    return <View style={styles.rowCell} key={col.key}>
                        <Text style={[styles.rowText, isNumber(item[col.name]) ? {textAlign: 'right'} : {textAlign: 'center'}]}>
                            {item[col.name]}
                        </Text>
                    </View>
                })}
            </View>
        );
      };

    const item = ({ item }) => (
        <View style={{ flexDirection: 'row' }}>
           
            <View style={{ width: 400, backgroundColor: 'lightpink'}}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' , textAlign: 'center'}}>{item.name}</Text>
            </View>
            <View style={{ width: 400, backgroundColor: 'lavender'}}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' , textAlign: 'center'}}>{item.email}</Text>
            </View>
        </View>
    )
    return (
        <View style={{ flexDirection: 'row' }}>
           <ScrollView  horizontal={true} >
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
            </ScrollView>
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
            </ScrollView>
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
        fontSize: 16,
        fontWeight: 'bold' , 
        textAlign: 'center',
        color: '#212121',
        
    },
    pagination: {
      display: 'flex',
      backgroundColor: '#F5FCFF',
    },
    rowCell: { 
        width: 200,
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        
    },
    rowText: {
      fontWeight: '400',
      fontSize: 16,
      textAlign: 'center',
      color: '#212121',
    },
});
  
