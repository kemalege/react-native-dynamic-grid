/* eslint-disable */

import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import IconButton from './IconButton';
import {MaterialIcon} from './Icon';
import {Text} from './Text';
import DropDownPicker from 'react-native-dropdown-picker';
import { ACTION } from '../TabbleComponent2';

const PaginationPanel = ({state, rowsPerPages, setRowsPerPages, onPageChange, dispatch}) => {

  // const { pageSize, rowsPerPages, setPageSize, setRowsPerPages } = paginationProps;
    const {loading, currentPage, pageSize, recordCount, pageCount} = state;
    const [open, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(
      {
        first: false,
        next: false,
        previous: false,
        last: false 
      }
    );
    const from = (currentPage-1) * pageSize + 1;
    const to = Math.min((currentPage) * pageSize, recordCount);

    useEffect(() => {
      if (loading) {
        setDisabled({ first: true, previous: true, next: true, last: true });
      } else {
        if (currentPage === 1) {
          setDisabled({ first: true, previous: true, next: false, last: false });
        } else if (currentPage === pageCount) {
          setDisabled({ first: false, previous: false, next: true, last: true });
        } else {
          setDisabled({ first: false, previous: false, next: false, last: false });
        }
      }
     }, [currentPage, loading, pageCount]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.pageCounterContainer}>Sayfa başına satır</Text>  
      </View>
      <View style={styles.dropdownBox}>
        <DropDownPicker
            style={{
                backgroundColor: "white",
            }}
            textStyle={{
                fontSize: 15
            }}
            selectedItemContainerStyle={{
                backgroundColor: "#dfdfdf"
              }}
            showTickIcon={false}
            open={open}
            value={pageSize}
            items={rowsPerPages}
            setOpen={setOpen}
            setValue={()=> dispatch({type: ACTION.SET_PAGE_SIZE, payload: pageSize})}
            setItems={setRowsPerPages}
            />
      </View>
      
      <View>
        <Text style={styles.pageCounterContainer}>{`${from} - ${to} of ${recordCount}`}</Text>  
      </View>
      <View style={styles.arrowButtonContainer}>
        <IconButton onPress={()=>setCurrentPage(1)} icon="page-first" color="black" size="large" disabled={disabled.first} />
        <IconButton onPress={()=>onPageChange(-1)} icon="chevron-left" color="black" size="large" disabled={disabled.previous}/>
        <IconButton onPress={()=>onPageChange(1)} icon="chevron-right" color="black" size="large" disabled={disabled.next}/>
        <IconButton onPress={()=>setCurrentPage(pageCount)} icon="page-last" color="black" size="large" disabled={disabled.last}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  arrowButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    width: 180,
  },
  buttonText: {
    color: '#78747a',
    fontSize: 16,
  },
  asd: { 
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginRight: 20,
  },
  pageCounterContainer: {
    marginHorizontal: 20,
    color: '#78747a',
  },
  rowsPerPageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dropdownBox: {
    width: 80,
  }
});

export default PaginationPanel;
