import React from 'react';
import TextField from './TextField';

export default function SearchBar({ value, onChangeText, placeholder = 'Search…', style }) {
  return <TextField icon="search-outline" value={value} onChangeText={onChangeText} placeholder={placeholder} style={style} autoCorrect={false} />;
}
