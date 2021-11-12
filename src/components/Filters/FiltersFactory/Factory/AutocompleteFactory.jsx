import { FormControl } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Autocomplete from 'components/Filters/Element/Autocomplete'

const useStyles = makeStyles(() => ({
  root: {
    fontFamily: 'Poppins',
    width: '100%',

    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },
}))

class AutocompleteFactory {
  getType() {
    return 'autocomplete'
  }

  create({ filter, onChange, value, defaultValue }) {
    const classes = useStyles()

    return (
      <FormControl size="small" classes={{ root: classes.root }}>
        <Autocomplete
          placeholder={filter.label}
          uri={filter.options.url}
          value={value}
          onChange={onChange}
          queryParam={filter.options.query_param}
          valueParam={filter.options.value_param}
          labelParam={filter.options.label_param}
          required={filter.options.required || false}
          multiple={filter.options.multiple}
          getOptionLabel={option => option[filter.options.label_param]}
          defaultValue={defaultValue}
        />
      </FormControl>
    )
  }
}

export default AutocompleteFactory
