/* eslint-disable */
import React from 'react';
import { StyleSheet, View , Text, Pressable} from 'react-native';
import { formatCurrencyTL, isNumber, styledNumericRow } from './TabbleComponent2';

export const MemoizedItem = React.memo(({ item, index, handleRowPress, k, columns }) => {
  console.log(item)
    return (
      <View style={{ flexDirection: 'row'}}>
        <Pressable
          onPress={() => handleRowPress(index)}
          style={({ pressed }) => [
            styles.pressableRow,
            { backgroundColor: pressed ? '#F5F5F5' : (k? '#E3EEFA' : 'white') },
          ]}>
          {columns.map((col, index) => {
            // const value = item[col.name].value  
            // const isNumeric = item[col.name].isNumeric
            const isNumeric = isNumber(item[col.name])  
            
              return (
                <View style={styles.rowCell} key={col.key}>
                  <Text style={[styles.rowText, styledNumericRow(isNumeric)]}>
                       {isNumeric ?  formatCurrencyTL(item[col.name]) : item[col.name] }
                  </Text>
              </View>)
          })}
          </Pressable>
      </View>
    );
  });

  const styles = StyleSheet.create({
    columnHeader: { 
        width: 200,
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
    },

    rowCell: { 
        width: 200,
        backgroundColor: 'transparent',
        
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',     
    },
    rowText: {
      fontSize: 14,
      fontWeight: '400',
      textAlign: 'center',
      color: '#212121',
      padding: 10,
    },
    selectedRowText: {
      fontSize: 14,
      fontWeight: '400',
      textAlign: 'center',
      color: '#212121',
      padding: 10,
      borderColor: 'blue',
      borderWidth: 1,
    },
    pressableRow: {   
      flexDirection: 'row',
    },
    selectedRowStyle: {
      backgroundColor: '#E3EEFA'
    },
});