/* eslint-disable */
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {DataTable, Text} from 'react-native-paper';
import {useState, useEffect, useMemo} from 'react';
import { fetchData, options } from './fetchDataQuery';
import { FlatList, StyleSheet, View } from 'react-native';

const TableComponent = () => {

    
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([20, 30, 40, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
  const [rowData, setRowData] = useState([])

  const [items] = React.useState([
    {
      key: 1,
      name: 'Cupcake',
      calories: 356,
      fat: 16,
    },
    {
      key: 2,
      name: 'Eclair',
      calories: 262,
      fat: 16,
    },
    {
      key: 3,
      name: 'Frozen yogurt',
      calories: 159,
      fat: 6,
    },
    {
      key: 4,
      name: 'Gingerbread',
      calories: 305,
      fat: 3.7,
    },
  ]);

  const DATA = [
    {
      title: "CariKod",
      data: "120 34 359"
    },
    {
      title: "CariIsim",
      data: "MUSTERI 3817",
    },
    {
      title: "CariIl",
      data: "ÝSTANBUL",
    },
    {
      title: "PlasiyerKodu",
      data: "2022-01-01T00:00:00",
    },
    {
      title: "Tarih",
      data: "null",
    },
    {
      title: "CariIsim",
      data: "MUSTERI 3817",
    },
    {
      title: "CariIsim",
      data: "MUSTERI 3817",
    },
    {
      title: "CariIsim",
      data: "MUSTERI 3817",
    },
    {
      title: "CariIsim",
      data: "MUSTERI 3817",
    },
    {
      title: "CariIsim",
      data: "MUSTERI 3817",
    },
    {
      title: "CariIsim",
      data: "MUSTERI 3817",
    },
    {
      title: "CariIsim",
      data: "MUSTERI 3817",
    },
  ];

  const [columns] = useState([
    {
      key: 1,
      name: "CariKod"
    },
    {
      key: 2,
      name: 'CariIsim',
    },
    {
      key: 3,
      name: 'CariIl',
    },
    {
      key: 4,
      name: 'PlasiyerKodu',
    },
    {
      key: 5,
      name: 'Tarih',
    },
    {
      key: 6,
      name: 'FisNo',
    },
    {
      key: 7,
      name: 'Aciklama',
    },
    {
      key: 8,
      name: 'VadeTarihi',
    },
    {
      key: 9,
      name: 'BorcTutar',
    },
    {
      key: 10,
      name: 'AlacakTutar',
    },
    {
      key: 11,
      name: 'BorcBakiye',
    },
    {
      key: 12,
      name: 'AlacakBakiye',
    },
  ]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, rowData.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const postFormData = useMemo(() => {
    const formData = new FormData();
    formData.append('PageNumber', 1);
    formData.append('PageSize', itemsPerPage);
    formData.append('Token', 'RasyoIoToken2021');
    formData.append('user_token', '$2y$10$WV6qperzhHUCnRkXc5OZMeE9Mj7wKJMG.j05mKQfwBacnyX7q9Ce');
    return formData;
  }, []);

  const fetchExtractOfCustomer = async () => {
    try {
      const url = 'http://duyu.alter.net.tr/api/extractOfCustomersPaging';
      const data = await fetchData(url, postFormData);
      setRowData(data[0])
      // console.log('Veri alındı:', data[0]);

    } catch (error) {
      console.error('Hata:', error);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <DataTable.Row key={index}>
        <DataTable.Cell style={styles.rowCell}><Text numberOfLines={1} style={styles.rowText} >{item.CariKod}</Text></DataTable.Cell>
        <DataTable.Cell style={styles.rowCell}>{item.CariIsim}</DataTable.Cell>
        <DataTable.Cell style={styles.rowCell}>{item.CariIl}</DataTable.Cell>
        <DataTable.Cell style={styles.rowCell}>{item.PlasiyerKodu}</DataTable.Cell>
        <DataTable.Cell style={styles.rowCell}>{item.Tarih}</DataTable.Cell>
        <DataTable.Cell style={styles.rowCell}>{item.FisNo}</DataTable.Cell>
        <DataTable.Cell style={styles.rowCell}>{item.Aciklama}</DataTable.Cell>
        <DataTable.Cell style={styles.rowCell} numeric>{item.VadeTarihi}</DataTable.Cell>
        <DataTable.Cell style={styles.rowCell} numeric>{item.BorcTutar}</DataTable.Cell>
        <DataTable.Cell style={styles.rowCell} numeric>{item.AlacakTutar}</DataTable.Cell>
        <DataTable.Cell style={styles.rowCell} numeric>{item.BorcBakiye}</DataTable.Cell>
        <DataTable.Cell style={styles.rowCell} numeric>{item.AlacakBakiye}</DataTable.Cell>
      </DataTable.Row>
    );
  };

  useEffect(() => {
    fetchExtractOfCustomer();
  }, []);

  return (
    <DataTable>

    <View style={styles.pagination}>
      <DataTable.Pagination
        
        page={page}
        numberOfPages={Math.ceil(items.length / itemsPerPage)}
        onPageChange={page => setPage(page)}
        label={`${from + 1}-${to} of ${items.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        showFastPaginationControls
        selectPageDropdownLabel={'Rows per page'}
      />
      </View>
      <DataTable.Header style={styles.tableHeader} >
      {columns.map(col => (
        <DataTable.Title key={col.key} style={styles.columnHeader}><Text>{col.name}</Text></DataTable.Title>
        ))}
      </DataTable.Header>

   

      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={rowData}
        renderItem={renderItem}
      />  
    </DataTable>
  );
};

const styles = StyleSheet.create({
  tableHeader: {
    display: 'flex',
    backgroundColor: '#F5FCFF',
  },
  columnHeader: {
    display: 'flex',
    flex: 1,
    flexWrap: 'noWrap',
  },
  pagination: {
    display: 'flex',
    backgroundColor: '#F5FCFF',
  },
  rowCell: {
    display: 'flex',
  },
  rowText: {
    backgroundColor: '#00fffb',
  },
});

export default TableComponent;
