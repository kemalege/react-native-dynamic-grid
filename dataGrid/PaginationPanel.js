/* eslint-disable */

import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import IconButton from './ui/IconButton';
import {MaterialIcon} from './ui/Icon';
import {Text} from './ui/Text';
// import {Picker} from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import { ACTION } from './Actions';

const PaginationPanel = ({state, onPageChange, setRowsPerPage, dispatch}) => {
  
  const {loading, currentPage, pageSize, recordCount, pageCount, rowsPerPage} = state;

  const moveToFirstPage = () => dispatch({ type: ACTION.MOVE_TO_FIRST_PAGE });
  const moveToLastPage = () => dispatch({ type: ACTION.MOVE_TO_LAST_PAGE, payload: pageCount});

  const [value, setValue] = useState('20');
    const [isFocus, setIsFocus] = useState(false);

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
      <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'black' }]}
          placeholderStyle={styles.placeholderStyle}
          iconStyle={styles.iconStyle}
          itemContainerStyle={styles.containerStyle}
          containerStyle={styles.containerStyle}
          mode="auto"
          itemTextStyle={{color: '#1C2025'}}
          selectedTextStyle={{color: '#1C2025'}}
          data={rowsPerPage}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Sayfa Seç' : '...'}
          searchPlaceholder="Filtrele..."
          value={pageSize}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            dispatch({type: ACTION.SET_PAGE_SIZE, payload: item.value});
            setIsFocus(false);
          }}
        />
      </View>
      
      <View>
        <Text style={styles.pageCounterContainer}>{`${from} - ${to} of ${recordCount}`}</Text>  
      </View>
      <View style={styles.arrowButtonContainer}>
        <IconButton onPress={moveToFirstPage} icon="page-first" color="black" size="large" disabled={disabled.first} />
        <IconButton onPress={()=>onPageChange(-1)} icon="chevron-left" color="black" size="large" disabled={disabled.previous}/>
        <IconButton onPress={()=>onPageChange(1)} icon="chevron-right" color="black" size="large" disabled={disabled.next}/>
        <IconButton onPress={()=>moveToLastPage(pageCount)} icon="page-last" color="black" size="large" disabled={disabled.last}/>
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
    width: 65,
  },
  containerStyle: {
    color: 'red',
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'black'
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20, 
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default PaginationPanel;
